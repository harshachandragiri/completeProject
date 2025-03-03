
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../auth/auth.service'; // Ensure this path is correct
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  isAdmin: boolean = false;
  currentPage: number = 1; // Default page number
  itemsPerPage: number = 6; // Items per page

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAdminStatus();
    this.loadProducts();
  }
  onPageChange(page: number) {
    this.currentPage = page;
  }
  
  // ✅ Check if the logged-in user is an admin
  checkAdminStatus(): void {
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  // ✅ Fetch Products from FakeStore API
  // loadProducts(): void {
  //   this.productService.getProducts().subscribe({
  //     next: (data) => {
  //       this.products = data;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching products:', err);
  //     }
  //   });
  // }
  loadProducts() {
    this.productService.getProducts().subscribe({
        next: (apiProducts) => {
            const storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

            console.log("Stored Products (Before Filtering) on User Side:", storedProducts); // ✅ Debugging

            // Normalize stored products
            const formattedStoredProducts = storedProducts.map((product: any) => ({
                ...product,
                image: product.imageUrl || product.image
            }));

            // 🛑 Filter out soft-deleted products for the user side
            this.products = [...apiProducts, ...formattedStoredProducts].filter((p) => !p.deleted);

            console.log("Products Displayed on User Side:", this.products); // ✅ Debugging
        },
        error: (err) => {
            console.error('Error fetching products:', err);
            alert('Failed to load products. Please try again later.');
        }
    });
}

  


  // ✅ Delete Product (Admin Only)
  deleteProduct(productId: number): void {
    if (!this.isAdmin) {
      alert("You don't have permission to delete products.");
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) {
      return; // User canceled deletion
    }

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Product deleted successfully.');
        this.loadProducts(); // Reload product list
      },
      error: (err) => {
        console.error('Error deleting product:', err);
      }
    });
  }

  // ✅ Add Product to Cart (User Feature)
  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`Added ${product.title} to cart.`);
  }

  // ✅ Redirect to Admin Dashboard if Admin
  goToAdminDashboard(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    }
  }
}

