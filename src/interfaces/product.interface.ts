export interface ProductInput {
  name: string;
  price: number;
  description?: string;
  quantity: number;
  quantitySold: number;
  code: string;
  productCategoryId: number;
  images: any[];
  userId?: number;
  isActive?: boolean;
}

export interface ProductUpdate {
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
  quantitySold?: number;
  code?: string;
  productCategoryId?: number;
  images?: any[];
  isActive?: boolean;
}

export interface OrderItemITF {
  orderId: number;
  productId: number;
  quantity: number;
}

export interface OrderItems {
  product: {
    id: number;
  };
  quantity: number;
  code: string;
}
