export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}
