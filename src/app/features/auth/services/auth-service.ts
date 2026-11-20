import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { BASE_URL, CURRENT_USER_LABEL } from '../../../common/constants';
import { HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/api-response';

@Service()
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/auth';
  private menuAccessSubject = new BehaviorSubject<boolean | null>(null);

  currentUser = signal<User | null>(null);

  menuAccess$ = this.menuAccessSubject.asObservable();

  /**
   * Constructor. Checks if user is still logged in and saves it to the 
   * currentUser signal.
   */
  constructor() {
    const savedUser = localStorage.getItem(CURRENT_USER_LABEL);

    if (savedUser) {
      this.menuAccessSubject.next(true);
      this.currentUser.set(JSON.parse(savedUser));
    } else {
      this.menuAccessSubject.next(false);
    }
  }

  /**
   * Creates POST for a new user and logs in, and saves user session. 
   * @param newUser 
   * @returns 
   */
  signup(newUser: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/signup`, newUser).pipe(
      tap((response: ApiResponse<User>) => {
        if (response.data) {
          this.saveUserSession(response.data);
        }
      })
    );
  }

  /**
   * Creates POST for user login and saves user session.
   * @param credentials 
   * @returns 
   */
  login(credentials: any): Observable<ApiResponse<User>> {
    this.menuAccessSubject.next(true);
    const headers = new HttpHeaders({
      'X-Tunnel-Skip-Anti-Phishing': 'true',
      'Access-Control-Allow-Origin': 'true'
    });

    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: ApiResponse<User>) => {
        if (response.data) {
          this.saveUserSession(response.data);
        }
      })
    );
  }

  

  /**
   * Removes all user session information and menu items
   */
  logout(): void {
    this.menuAccessSubject.next(false);
    this.currentUser.set(null);
    localStorage.removeItem(CURRENT_USER_LABEL);
  }

  /**
   * Saves the user to variable and localStorage 
   * @param user 
   */
  private saveUserSession(user: User): void {
    this.currentUser.set(user);

    localStorage.setItem(CURRENT_USER_LABEL, JSON.stringify(user));
  }

  public isLoggedIn(): boolean{
    return computed(() => this.currentUser) != null;
  }

  public getUserId(): string {
    const activeUser = this.currentUser();
    const userId = activeUser?._id || '';
    return userId;
  }
}
