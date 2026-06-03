export interface Product {
  id: number;
  name: string;
  price: number; // Storing as number for calculation
  formattedPrice: string;
  category: string;
  image: string;
  description: string;
  dimensions: string;
  material: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
