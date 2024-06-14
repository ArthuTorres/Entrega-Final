import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const HasAuthGuard: CanActivateFn = (route, state) => {
  return !inject(AuthService).isAuthenticated()
    ? true
    : inject(Router).createUrlTree(['/']);
};