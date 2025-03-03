import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  orderData = { name: '', address: '', phone: '' };
  cartItems: any[] = [];
  totalPrice = 0;
  userId: string | null = '';

  constructor(private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient) { }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    this.userId = this.authService.getUserId(); // ✅ Get userId from AuthService
  }

  placeOrder() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('User ID not found! Please login again.');
        return;
    }

    const orderDetails = {
        userId: userId,
        items: this.cartItems.map(item => ({
            id: item.id,  
            title: item.title || 'No Title',
            description: item.description || 'No Description',
            image: item.image || 'https://via.placeholder.com/150',
            price: item.price,
            quantity: item.quantity || 1, 
            category: item.category || 'Unknown'
        })),
        totalAmount: this.totalPrice,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    this.http.post('http://localhost:8000/orders', orderDetails).subscribe({
        next: () => {
            alert('Order placed successfully!');
            this.cartService.clearCart();
            this.cartItems = [];
            this.totalPrice = 0;
            this.orderData = { name: '', address: '', phone: '' };
        },
        error: () => {
            alert('Failed to place order. Please try again.');
        }
    });
}


  
  // placeOrder() {
  //   console.log('Placing order...'); // Debug: Check if function runs
  
  //   const userId = localStorage.getItem('userId'); // Get user ID from LocalStorage
  //   if (!userId) {
  //     alert('User ID not found! Please login again.');
  //     return;
  //   }
  
  //   const orderDetails = {
  //     userId: userId,
  //     items: this.cartItems,
  //     totalAmount: this.totalPrice,
  //   };
  
  //   console.log('Order Details:', orderDetails); // Debug: Check order details before sending
  
  //   this.http.post('http://localhost:8000/orders', orderDetails).subscribe({
  //     next: (response) => {
  //       console.log('Order Response:', response); // Debug: Log API response
  //       alert('Order placed successfully!');
  
  //       // ✅ Clear cart in service
  //       this.cartService.clearCart();
  
  //       // ✅ Update UI to reflect empty cart
  //       this.cartItems = [];
  //       this.totalPrice = 0;

  //       this.orderData = { name: '', address: '', phone: '' };


  //     },
  //     error: (error) => {
  //       console.error('Order Error:', error); // Debug: Log any error
  //       alert('Failed to place order. Check console for details.');
  //     }
  //   });
  // }
  
  
}

