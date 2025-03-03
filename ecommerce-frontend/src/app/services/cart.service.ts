// // import { Injectable } from '@angular/core';

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class CartService {
// //   private cart: any[] = [];

// //   addToCart(product: any) {
// //     this.cart.push(product);
// //   }

// //   getCartItems() {
// //     return this.cart;
// //   }

// //   clearCart() {
// //     this.cart = [];
// //   }
// // }
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private cart: any[] = [];

//   constructor() {}

//   addToCart(product: any) {
//     this.cart.push(product);
//     console.log('Cart:', this.cart);
//   }

//   getCartItems() {
//     return this.cart;
//   }

//   removeFromCart(productId: number) {
//     this.cart = this.cart.filter((item) => item.id !== productId);
//   }

//   clearCart() {
//     this.cart = [];
//   }
// }
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];

  constructor() {
    this.loadCartFromStorage(); // Load cart from LocalStorage on initialization
  }

  addToCart(product: any) {
    this.cart.push(product);
    this.saveCartToStorage();
    console.log('Cart:', this.cart);
  }

  getCartItems() {
    return this.cart;
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem('cart'); // Remove from LocalStorage
  }

  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }
}

