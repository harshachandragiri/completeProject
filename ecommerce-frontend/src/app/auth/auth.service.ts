// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import axios, { AxiosError } from 'axios'; // ✅ Import AxiosError
// import { jwtDecode } from 'jwt-decode';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:8000/auth'; // Backend API URL

//   constructor(private router: Router) {}

//   async login(credentials: { email: string; password: string }) {
//     try {
//       const response = await axios.post(`${this.apiUrl}/login`, credentials);
//       localStorage.setItem('token', response.data.access_token);
//       return true;
//     } catch (error: unknown) {  // ✅ Use unknown type first
//       const axiosError = error as AxiosError;  // ✅ Cast error to AxiosError
//       console.error('Login failed:', axiosError.response?.data || axiosError.message);
//       return false;
//     }
//   }

//   async register(userData: { name: string; email: string; password: string }) {
//     try {
//       await axios.post(`${this.apiUrl}/register`, userData);
//       return true;
//     } catch (error: unknown) {  // ✅ Use unknown type first
//       const axiosError = error as AxiosError;  // ✅ Cast error to AxiosError
//       console.error('Registration failed:', axiosError.response?.data || axiosError.message);
//       return false;
//     }
//   }

//   logout() {
//     localStorage.removeItem('token');
//     this.router.navigate(['/login']);
//   }

//   isAuthenticated(): boolean {
//     const token = localStorage.getItem('token');
//     if (!token) return false;

//     try {
//       const decodedToken: any = jwtDecode(token);
//       return decodedToken.exp * 1000 > Date.now(); // ✅ Check if token is expired
//     } catch (error) {
//       console.error('Invalid token:', error);
//       this.logout(); // 🚨 Auto logout if token is invalid
//       return false;
//     }
//   }

//   getUserRole(): string | null {
//     const token = localStorage.getItem('token');
//     if (!token) return null;

//     try {
//       const decodedToken: any = jwtDecode(token);
//       return decodedToken.role;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   }
// }
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosError } from 'axios'; // ✅ Import AxiosError
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';  // ✅ Import BehaviorSubject for auth state tracking

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth'; // Backend API URL
  private authStatusSource = new BehaviorSubject<boolean>(this.hasToken());
  authStatus = this.authStatusSource.asObservable(); // ✅ Observable for authentication status

  constructor(private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token'); // ✅ Check if token exists
  }

  async login(credentials: { email: string; password: string }) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, credentials);
      localStorage.setItem('token', response.data.access_token);

      // ✅ Decode token and store userId
      const decodedToken: any = jwtDecode(response.data.access_token);
      localStorage.setItem('userId', decodedToken.id); // Store userId

      this.authStatusSource.next(true); // ✅ Update authentication state
      return response.data.role;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('Login failed:', axiosError.response?.data || axiosError.message);
      return false;
    }
  }

  async register(userData: { name: string; email: string; password: string }) {
    try {
      await axios.post(`${this.apiUrl}/register`, userData);
      return true;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error('Registration failed:', axiosError.response?.data || axiosError.message);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('profileImage');  // ✅ Remove stored profile image
    localStorage.removeItem('userDetails');   // ✅ Remove stored user detailsF
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    this.authStatusSource.next(false); // ✅ Notify subscribers that user logged out
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const isValid = decodedToken.exp * 1000 > Date.now();
      if (!isValid) this.logout(); // 🚨 Auto logout if token is expired
      return isValid;
    } catch (error) {
      console.error('Invalid token:', error);
      this.logout();
      return false;
    }
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  getUserId(): string | null {
    return localStorage.getItem('userId'); // ✅ Retrieve userId from localStorage
  }
  getUserDateFormat(): string {
    return localStorage.getItem('selectedDateFormat') || 'medium'; // ✅ Fetch stored format
  }
  
}

