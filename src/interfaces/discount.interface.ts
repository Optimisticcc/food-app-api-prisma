export interface DiscountInput {
  code: string;
  discountPercent: number;
  isActive?: boolean;
  startDate: string;
  expirationDate: string;
}

export interface DiscountUpdate {
  code?: string;
  discountPercent?: number;
  isActive?: boolean;
  startDate?: string;
  expirationDate?: string;
}
