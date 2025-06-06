import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      // Check if user is authenticated
      const account = await this.authService.getAccount();
      
      if (!account) {
        this.router.navigate(['/sign-in']);
        return false;
      }
      
      return true;
    } catch (error) {
      // Not authenticated
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}

// Factory function for CanActivate
export const AuthGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuardService).canActivate(route, state);
};