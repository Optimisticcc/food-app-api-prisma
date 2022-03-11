export interface OrderInput {
  code?: string;
  total: number | string;
  note?: string | null;
  orderStatus: boolean;
  address: string;
  phoneNumber: string;
  email: string;
  customerId: number;
  userId?: number;
}
