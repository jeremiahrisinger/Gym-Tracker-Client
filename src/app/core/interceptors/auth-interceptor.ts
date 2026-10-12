import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../../features/auth/services/login-service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService);
  const user = authService.currentUser();

  if (user && user.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
        'X-Tunnel-Skip-AntiPhishing-Page': 'true'
      }
    });
  }
  
  return next(req);
};
