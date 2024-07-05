import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  if (authService.isLoggedIn()) {
    return true;
  }
  const router = inject(Router);
  router.navigate(['login'])
  return true;
};
