import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  newProduct = { title: '', description: '', price: 0, imageUrl: '' };
  editingProduct: any = null;
  selectedDateFormat: string = localStorage.getItem('selectedDateFormat') || 'medium';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }
  updateDateFormat() {
    localStorage.setItem('selectedDateFormat', this.selectedDateFormat);
  }

  // ✅ Fetch Products (API + LocalStorage Merge)
//   loadProducts() {
//     this.productService.getProducts().subscribe({
//         next: (apiProducts) => {
//             const storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

//             // Normalize stored products: Ensure imageUrl is mapped to image
//             const formattedStoredProducts = storedProducts.map((product: any) => ({
//                 ...product,
//                 image: product.imageUrl || product.image // ✅ Ensure consistency
//             }));

//             // Merge API & local products, filter out soft-deleted ones
//             this.products = [...apiProducts, ...formattedStoredProducts].filter((p) => !p.deleted);

//             console.log('Products loaded successfully:', this.products);
//         },
//         error: (err) => {
//             console.error('Error fetching products:', err);
//             alert('Failed to load products. Please try again later.');
//         }
//     });
// }
// loadProducts() {
//   this.productService.getProducts().subscribe({
//     next: (apiProducts) => {
//       const storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

//       console.log("Stored Products (Admin Side) Before Merging:", storedProducts); // ✅ Debugging

//       // Normalize stored products (ensure image consistency & set default date)
//       const formattedStoredProducts = storedProducts.map((product: any) => ({
//         ...product,
//         image: product.imageUrl || product.image,
//         createdAt: product.createdAt ? product.createdAt : this.getDefaultDate(), // ✅ Set default date if missing
//         formattedDate: new Date(product.createdAt || this.getDefaultDate()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) // ✅ Format date
//       }));

//       // 🛑 Admin Side: DO NOT filter out soft-deleted products
//       this.products = [...apiProducts, ...formattedStoredProducts];

//       console.log("Products Loaded in Admin Dashboard:", this.products); // ✅ Debugging
//     },
//     error: (err) => {
//       console.error('Error fetching products:', err);
//       alert('Failed to load products. Please try again later.');
//     }
//   });
// }
loadProducts() {
  this.productService.getProducts().subscribe({
    next: (apiProducts) => {
      const storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

      console.log("Stored Products (Admin Side) Before Merging:", storedProducts);

      // Normalize stored products (Ensure image consistency & set default date)
      const formattedStoredProducts = storedProducts.map((product: any) => ({
        ...product,
        image: product.imageUrl || product.image,  // ✅ Ensure correct image mapping
        createdAt: product.createdAt || this.getDefaultDate(), // ✅ Assign default date
        formattedDate: new Date(product.createdAt || this.getDefaultDate()).toLocaleDateString()
      }));

      // 🛑 Ensure API Products Also Have a Default Date
      const formattedApiProducts = apiProducts.map((product: any) => ({
        ...product,
        createdAt: product.createdAt || this.getDefaultDate() // ✅ Assign default date if missing
      }));

      // Merge API & local products
      this.products = [...formattedApiProducts, ...formattedStoredProducts];

      console.log("Products Loaded in Admin Dashboard:", this.products);
    },
    error: (err) => {
      console.error('Error fetching products:', err);
      alert('Failed to load products. Please try again later.');
    }
  });
}


// Function to get default date (Yesterday at 10:00 AM IST)
getDefaultDate(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1); // Set to yesterday
  now.setHours(10, 0, 0, 0); // Set time to 10:00 AM IST
  return now.toISOString(); // Convert to ISO format
}


  // ✅ Add Product (LocalStorage)
  addProduct() {
    console.log("Product Before Adding:", this.newProduct); // ✅ Debugging

    // Validate required fields
    if (!this.newProduct.title || !this.newProduct.description || !this.newProduct.price || !this.newProduct.imageUrl) {
        alert('Please fill in all product details, including an image.');
        return;
    }

    let storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    const newId = storedProducts.length ? Math.max(...storedProducts.map((p: any) => p.id)) + 1 : 1000;

    // Ensure price is stored as a number
    const newProduct = {
      id: newId,
      title: this.newProduct.title.trim(),
      description: this.newProduct.description.trim(),
      price: parseFloat(this.newProduct.price.toString()),
      image: this.newProduct.imageUrl.trim(),  // Ensure imageUrl is stored as 'image'
      createdAt: new Date().toISOString() // ✅ Store timestamp
    };
    
    console.log("Adding Product:", newProduct); // ✅ Debugging

    storedProducts.push(newProduct);
    localStorage.setItem('customProducts', JSON.stringify(storedProducts));

    alert('Product added successfully!');
    this.newProduct = { title: '', description: '', price: 0, imageUrl: '' };
    this.loadProducts();
}


  // ✅ Soft Delete Product (Mark as deleted)
  // deleteProduct(productId: number) {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     let storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

  //     storedProducts = storedProducts.map((p: any) => 
  //       p.id === productId ? { ...p, deleted: true } : p
  //     );

  //     localStorage.setItem('customProducts', JSON.stringify(storedProducts));
  //     alert('Product deleted successfully!');
  //     this.loadProducts();
  //   }
  // }
  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
        let storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

        // Soft delete by setting deleted: true
        storedProducts = storedProducts.map((p: any) => 
            p.id === productId ? { ...p, deleted: true } : p
        );

        localStorage.setItem('customProducts', JSON.stringify(storedProducts));
        console.log("Updated LocalStorage after delete:", storedProducts); // ✅ Debugging

        alert('Product deleted successfully!');
        this.loadProducts(); // ✅ Refresh product list
    }
}



//   isProductDeleted(productId: number): boolean {
//     const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
//     return deletedProducts.includes(productId);
// }
isProductDeleted(productId: number): boolean {
  let storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
  const product = storedProducts.find((p: any) => p.id === productId);
  return product ? product.deleted : false;  // ✅ Correctly check the deleted flag
}




  // ✅ Edit Product
  // editProduct(product: any) {
  //   console.log('Editing Product:', product);
  //   this.editingProduct = { ...product };
  // }
  editProduct(product: any) {
    console.log('Editing Product:', product);
  
    this.editingProduct = {
      ...product,
      imageUrl: product.image || product.imageUrl // ✅ Ensure correct mapping
    };
  }
  
  
  // ✅ Update Product
  updateProduct() {
    let storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

    storedProducts = storedProducts.map((p: any) => 
      p.id === this.editingProduct.id ? { ...this.editingProduct } : p
    );

    localStorage.setItem('customProducts', JSON.stringify(storedProducts));
    alert('Product updated successfully!');
    this.editingProduct = null;
    this.loadProducts();
  }

  // ✅ File Upload
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (!file) {
        console.error("No file selected!");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        this.newProduct.imageUrl = reader.result as string; // ✅ Auto-update imageUrl
    };
    reader.readAsDataURL(file);
}





  cancelEdit() {
    this.editingProduct = null;
  }
}
