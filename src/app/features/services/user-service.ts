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
  private loginService = inject(AuthService);
  
  private apiUrl = BASE_URL + '/users';

  getUser(): Observable<ApiResponse<User>> {
    const params = this.loginService.getUserIdAsParam();

    return this.http.get<ApiResponse<User>>(this.apiUrl, { params });
  }

  updateUser(updatedUser: User, confirmPassword: string): Observable<ApiResponse<User>> {
    const userId = this.loginService.getUserId();
    const payload = {
      ...updatedUser,
      confirmPassword: confirmPassword
    }
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${userId}`, payload);
  }
}
