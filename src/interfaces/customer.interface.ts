export interface RegisterCustomerInput {
  email: string;
  name: string;
  address?: string;
  password: string;
  phoneNumber: string;
  dateOfBirth?: string;
}

export interface EditCustomerProfileInput {
  email?: string;
  name?: string;
  address?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  password?: string;
}

// by admin
export interface UpdateCustomerInput {
  phoneNumber?: string;
  email?: string;
  name?: string;
  dateOfBirth?: string;
  address?: string;
  password?: string;
  status?: boolean;
}

export interface AddCustomerInput {
  phoneNumber: string;
  email: string;
  name: string;
  dateOfBirth?: string;
  address?: string;
  status?: boolean;
}
