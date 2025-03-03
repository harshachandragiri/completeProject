// import { Component } from '@angular/core';
// import { AuthService } from '../../auth/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent {
//   constructor(public authService: AuthService, private router: Router) {}

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/login']); // Redirect to login after logout
//   }
// }
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.getUserRole() === 'admin';
    

    // Subscribe to authentication changes
    this.authService.authStatus.subscribe(status => {
      this.isAuthenticated = status;
      this.isAdmin = this.authService.getUserRole() === 'admin';
    });
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']); // Redirect to login after logout
    this.isAdmin = false;
    this.router.navigate(['/login']); 
  }
}
