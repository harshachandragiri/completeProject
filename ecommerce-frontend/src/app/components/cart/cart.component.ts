// import { Component, OnInit } from '@angular/core';
// import { CartService } from '../../services/cart.service';

// @Component({
//   selector: 'app-cart',
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.css'],
// })
// export class CartComponent implements OnInit {
//   cartItems: any[] = [];
//   totalPrice = 0;

//   constructor(private cartService: CartService) {}

//   ngOnInit() {
//     this.cartItems = this.cartService.getCartItems();
//     this.calculateTotal();
//   }

//   calculateTotal() {
//     this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price, 0);
//   }

//   clearCart() {
//     this.cartService.clearCart();
//     this.cartItems = [];
//     this.totalPrice = 0;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalPrice = 0;
    this.loadCart();
  }
}

