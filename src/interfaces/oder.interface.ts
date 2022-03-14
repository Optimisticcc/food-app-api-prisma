export interface OrderInput {
  code?: string;
  total: number;
  note?: string | null;
  orderStatus: boolean;
  address: string;
  phoneNumber: string;
  email: string;
  customerId: number;
  userId?: number;
}

export interface PaymentUpSert {
  amount?: number;
  paymentType?: string;
  paymentStatus?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentInput {
  amount: number;
  paymentType: string;
  paymentStatus: boolean;
}
