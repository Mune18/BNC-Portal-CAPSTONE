import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {
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
      
      // Check if user has admin role
      const userDoc = await this.userService.getUserInformation(account.$id);
      
      if (userDoc && userDoc.role === 'admin') {
        return true;
      } else {
        // If resident tries to access admin route, redirect to resident home
        if (userDoc && userDoc.role === 'resident') {
          this.router.navigate(['/user/home']);
        } else {
          this.router.navigate(['/sign-in']);
        }
        return false;
      }
    } catch (error) {
      // Not authenticated or error
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}

// Factory function for CanActivate
export const AdminGuard: CanActivateFn = (route, state) => {
  return inject(AdminGuardService).canActivate(route, state);
};