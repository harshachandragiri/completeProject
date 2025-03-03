import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  @Output() productAdded = new EventEmitter<void>();

  newProduct = { title: '', description: '', price: 0, imageUrl: '' };

  addProduct() {
    const storedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
    const newId = storedProducts.length ? Math.max(...storedProducts.map((p: any) => p.id)) + 1 : 1000;
    const newProduct = { ...this.newProduct, id: newId };

    storedProducts.push(newProduct);
    localStorage.setItem('customProducts', JSON.stringify(storedProducts));

    alert('Product added successfully!');
    this.newProduct = { title: '', description: '', price: 0, imageUrl: '' };
    this.productAdded.emit();
  }
}
