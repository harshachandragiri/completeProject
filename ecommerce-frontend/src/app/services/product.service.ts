// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private apiUrl = 'https://fakestoreapi.com/products';

//   constructor(private http: HttpClient) {}

//   // Fetch all products
//   getProducts(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl);
//   }
//    // ✅ Get Product by ID
//    getProductById(productId: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${productId}`);
//   }
//   addProduct(product: any): Observable<any> {
//     return this.http.post<any>(this.apiUrl, product);
//   }
  
//   deleteProduct(productId: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${productId}`);
//   }
//   updateProduct(productId: number, updatedProduct: any): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/${productId}`, updatedProduct);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  // ✅ Fetch all products (API + LocalStorage updates)
  getProducts(forAdmin: boolean = false): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((apiProducts) => {
        const storedProducts = JSON.parse(localStorage.getItem('modifiedProducts') || '[]');
  
        // Merge API products with stored updates
        let products = apiProducts.map((product) => {
          const localUpdate = storedProducts.find((p: any) => p.id === product.id);
          return localUpdate ? localUpdate : product;
        });
  
        // Include newly added LocalStorage products
        const newProducts = storedProducts.filter((p: any) => p.id >= 1000);
  
        // Combine all products
        products = [...products, ...newProducts];
  
        // ✅ If for user, remove soft-deleted products
        if (!forAdmin) {
          products = products.filter((product) => !product.deleted);
        }
  
        return products;
      })
    );
  }
  

  // ✅ Fetch a product by ID (API or LocalStorage)
  getProductById(productId: number): Observable<any> {
    const storedProducts = JSON.parse(localStorage.getItem('modifiedProducts') || '[]');
    const localProduct = storedProducts.find((p: any) => p.id === productId);
    if (localProduct) {
      return of(localProduct);
    }
    return this.http.get<any>(`${this.apiUrl}/${productId}`);
  }

  // ✅ Add a new product (LocalStorage only)
  addProduct(product: any): Observable<void> {
    let storedProducts = JSON.parse(localStorage.getItem('modifiedProducts') || '[]');
    const newId = storedProducts.length ? storedProducts[storedProducts.length - 1].id + 1 : 1000;
    const newProduct = { ...product, id: newId };

    storedProducts.push(newProduct);
    localStorage.setItem('modifiedProducts', JSON.stringify(storedProducts));

    return of();
  }

  // ✅ Update a product (LocalStorage only)
  updateProduct(productId: number, updatedProduct: any): Observable<void> {
    let storedProducts = JSON.parse(localStorage.getItem('modifiedProducts') || '[]');
    const index = storedProducts.findIndex((p: any) => p.id === productId);

    if (index !== -1) {
      storedProducts[index] = updatedProduct;
    } else {
      storedProducts.push(updatedProduct);
    }

    localStorage.setItem('modifiedProducts', JSON.stringify(storedProducts));
    return of();
  }

  // ✅ Soft delete a product (marks as deleted instead of API deletion)
  deleteProduct(productId: number): Observable<void> {
    let storedProducts = JSON.parse(localStorage.getItem('modifiedProducts') || '[]');
    storedProducts = storedProducts.map((p: any) => 
      p.id === productId ? { ...p, deleted: true } : p
    );

    localStorage.setItem('modifiedProducts', JSON.stringify(storedProducts));
    return of();
  }
}


