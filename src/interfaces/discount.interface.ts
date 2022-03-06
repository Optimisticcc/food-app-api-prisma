export interface DiscountInput {
  code: string;
  discountPercent: number;
  isActive?: boolean;
  startDate: Date;
  expirationDate: Date;
}

export interface DiscountUpdate {
  code?: string;
  discountPercent?: number;
  isActive?: boolean;
  startDate?: Date;
  expirationDate?: Date;
}
