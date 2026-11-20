import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../common/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../core/models/api-response';
import { Observable } from 'rxjs';
import { User } from '../auth/models/user';
import { AuthService } from '../auth/services/auth-service';

@Service()
export class UserService {
  private http = inject(HttpClient);  
  private apiUrl = BASE_URL + '/users';

  getUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(this.apiUrl);
  }

  updateUser(updatedUser: User, confirmPassword: string): Observable<ApiResponse<User>> {
    const payload = {
      ...updatedUser,
      confirmPassword: confirmPassword
    }
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/${updatedUser._id}`, payload);
  }

  deleteUser(deletedUser: User): Observable<ApiResponse<User>> {
    return this.http.delete<ApiResponse<User>>(`${this.apiUrl}/${deletedUser._id}`);
  }
}
