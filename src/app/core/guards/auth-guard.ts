import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../features/auth/services/login-service';
import { inject } from '@angular/core/primitives/di';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(LoginService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }
    
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
