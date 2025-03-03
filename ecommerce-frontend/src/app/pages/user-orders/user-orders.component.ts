// import { Component, OnInit } from '@angular/core';
// import { OrderService } from './user.service';
// import { AuthService } from '../../auth/auth.service'; // Ensure you have this service
// import axios from 'axios';

// @Component({
//   selector: 'app-user-orders',
//   templateUrl: './user-orders.component.html',
//   styleUrls: ['./user-orders.component.css']
// })
// export class UserOrdersComponent implements OnInit {
//   orders: any[] = [];
//   userId: string = '';
//   selectedFormat: string = 'medium';

//   constructor(private orderService: OrderService, private authService: AuthService) {}

//   ngOnInit() {
//     this.userId = this.authService.getUserId() || '';
    

//     if (this.userId) {
//         this.loadUserOrders();
//     }
// }

  

//   // ✅ Load Orders for Logged-in User
//   // async loadUserOrders() {
//   //   try {
//   //     const response = await axios.get(`http://localhost:8000/orders/${this.userId}`);
//   //     console.log("Orders received:", response.data); // Debugging output
//   //     this.orders = response.data;
//   //   } catch (error) {
//   //     console.error('Error fetching orders:', error);
//   //   }
//   // }
//   async loadUserOrders() {
//     try {
//         if (!this.userId) {
//             return;
//         }

//         const response = await axios.get(`http://localhost:8000/orders/${this.userId}`);
//         this.orders = response.data;
//     } catch {
//         alert('Failed to load orders. Please try again later.');
//     }
// }

  
// }
import { Component, OnInit } from '@angular/core';
import { OrderService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import axios from 'axios';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders: any[] = [];
  userId: string = '';
  selectedFormat: string = 'medium'; // ✅ Default format

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId() || '';

    // ✅ Retrieve the selected date format from localStorage
    this.selectedFormat = localStorage.getItem('selectedDateFormat') || 'medium';

    if (this.userId) {
      this.loadUserOrders();
    }
  }

  async loadUserOrders() {
    try {
      if (!this.userId) {
        return;
      }

      const response = await axios.get(`http://localhost:8000/orders/${this.userId}`);
      this.orders = response.data;
    } catch {
      alert('Failed to load orders. Please try again later.');
    }
  }
}
