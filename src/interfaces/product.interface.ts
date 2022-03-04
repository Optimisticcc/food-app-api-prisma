export interface ProductInput {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  quantitySold?: number;
  slug: string;
}

export interface ProductUpdate {
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
  quantitySold?: number;
  slug?: string;
}
