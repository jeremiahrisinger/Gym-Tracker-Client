import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { BASE_URL, CURRENT_USER_LABEL } from '../../../common/constants';
import { HttpHeaders } from '@angular/common/http';



@Service()
export class LoginService {

  private http = inject(HttpClient);
  private apiUrl = BASE_URL + '/users';
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
  signup(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, newUser).pipe(
      tap((user: User) => {
        this.saveUserSession(user);
      })
    );
  }

  /**
   * Creates POST for user login and saves user session.
   * @param credentials 
   * @returns 
   */
  login(credentials: any): Observable<User> {
    this.menuAccessSubject.next(true);
    const headers = new HttpHeaders({
      'X-Tunnel-Skip-Anti-Phishing': 'true',
      'Access-Control-Allow-Origin': 'true'
    });

    return this.http.post<User>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        this.saveUserSession(response.data);
      })
    );
  }

  getUser(): Observable<User> {
    const activeUser = this.currentUser();
    const userId = activeUser?._id || '';
    const params = new HttpParams().set('userId', userId)

    return this.http.get<User>(this.apiUrl, { params });
  }

  updateUser(updatedUser: User, confirmPassword: string): Observable<User> {
    const activeUser = this.currentUser();
    const userId = activeUser?._id || '';
    const payload = {
      ...updatedUser,
      confirmPassword: confirmPassword
    }
    return this.http.put<User>(`${this.apiUrl}/${userId}`, payload);
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

  public getUserIdAsParam(): HttpParams {
    const activeUser = this.currentUser();
    const userId = activeUser?._id || '';
    const params = new HttpParams().set('userId', userId)

    return params;
  }
}
