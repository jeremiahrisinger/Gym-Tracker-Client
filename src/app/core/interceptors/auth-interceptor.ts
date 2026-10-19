import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../../features/auth/services/login-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user && user.token) {
    console.log(user)
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
        'X-Tunnel-Skip-AntiPhishing-Page': 'true'
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })

  );
};
