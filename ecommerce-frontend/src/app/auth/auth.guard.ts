// // import { inject } from '@angular/core';
// // import { CanActivateFn, Router } from '@angular/router';
// // import { AuthService } from './auth.service';

// // export const authGuard: CanActivateFn = (route, state) => {
// //   const authService = inject(AuthService);
// //   const router = inject(Router);

// //   if (!authService.isAuthenticated()) {
// //     router.navigate(['/login']);
// //     return false;
// //   }
// //   return true;
// // };
// import { inject } from '@angular/core';
// import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
// import { AuthService } from './auth.service';

// export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (!authService.isAuthenticated()) {
//     router.navigate(['/login']); // Redirect if not logged in
//     return false;
//   }

//   const userRole = authService.getUserRole(); // Get user role
//   const requiredRole = route.data['role']; // Get role required for route

//   if (requiredRole && userRole !== requiredRole) {
//     router.navigate(['/login']); // Redirect if role doesn't match
//     return false;
//   }

//   return true; // Allow access if everything is fine
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']); // Redirect if not logged in
    return false;
  }

  const userRole = authService.getUserRole(); // Get logged-in user role
  const requiredRole = route.data['role']; // Get role(s) required for route

  // ✅ Allow multiple roles using "includes"
  if (requiredRole && !requiredRole.includes(userRole)) {
    router.navigate(['/login']); // Redirect if role doesn't match
    return false;
  }

  return true; // Allow access if role matches
};

