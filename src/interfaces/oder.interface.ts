export interface OrderInput {
  total: number;
  note?: string | null;
  orderStatus: boolean;
  address: string;
  phoneNumber: string;
  email: string;
  customerId: number;
  userId?: number;
  discountId?: number;
}

export interface OrderUpdateInput {
  total?: number;
  note?: string | null;
  orderStatus?: boolean;
  discountId?: number;
  userId?: number;
  customerId: number;
}


export interface PaymentUpSert {
  amount?: number;
  paymentType?: string;
  paymentStatus?: boolean;
}

export interface PaymentInput {
  amount: number;
  paymentType: string;
  paymentStatus: boolean;
}
