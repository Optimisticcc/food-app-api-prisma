export interface DiscountInput {
  code: string;
  discountPercent: number;
  isActive?: boolean;
  expirationDate: string;
  startDate: string;
}

export interface DiscountUpdate {
  code?: string;
  discountPercent?: number;
  isActive?: boolean;
  expirationDate?: string;
  startDate?: string;
}
