export interface OrderInput {
  code?: string;
  total: number | string;
  note?: string | null;
  orderStatus: string;
  address: string;
  phoneNumber: string;
  email: string;
  customerId: number;
  userId?: number;
}
