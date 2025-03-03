export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    isDeleted?: boolean; // Optional field for soft delete
  }
  