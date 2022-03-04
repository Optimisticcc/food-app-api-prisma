export interface DiscountInput {
  discountPercent: number;
  isActive?: boolean;
}

export interface DiscountUpdate {
  discountPercent?: number;
  isActive?: boolean;
}
