import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ResidentGuardService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      console.log('ResidentGuard: Checking if user is authenticated');
      // Check if user is authenticated
      const account = await this.authService.getAccount();
      
      if (!account) {
        console.log('ResidentGuard: No account found, redirecting to sign-in');
        this.router.navigate(['/sign-in']);
        return false;
      }
      
      console.log('ResidentGuard: Account found, checking role');
      // Check if user has resident role
      const userDoc = await this.userService.getUserInformation(account.$id);
      
      if (userDoc && userDoc.role === 'resident') {
        // Additional check: block only deceased and archived accounts
        if (userDoc.otherDetails && (userDoc.otherDetails.status === 'Deceased' || userDoc.otherDetails.status === 'Archived')) {
          console.log('ResidentGuard: Resident account is deceased or archived, logging out and redirecting to sign-in');
          await this.authService.logout();
          this.router.navigate(['/sign-in']);
          return false;
        }
        
        console.log('ResidentGuard: User is a resident (Active or Inactive), allowing access');
        return true;
      } else {
        console.log('ResidentGuard: User is not a resident');
        // If admin tries to access resident route, redirect to admin dashboard
        if (userDoc && userDoc.role === 'admin') {
          console.log('ResidentGuard: User is an admin, redirecting to admin dashboard');
          this.router.navigate(['/admin/dashboard']);
        } else {
          console.log('ResidentGuard: Unknown role, redirecting to sign-in');
          this.router.navigate(['/sign-in']);
        }
        return false;
      }
    } catch (error) {
      console.error('ResidentGuard: Error checking authentication', error);
      // Not authenticated or error
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}

// Factory function for CanActivate
export const ResidentGuard: CanActivateFn = (route, state) => {
  return inject(ResidentGuardService).canActivate(route, state);
};