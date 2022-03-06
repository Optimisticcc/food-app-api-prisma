// by admin
export interface UpdateUserInput {
  phoneNumber?: string;
  name?: string;
  address?: string;
  status?: boolean;
  email?: string;
}

export interface RegisterInput {
  phoneNumber: string;
  name: string;
  address: string;
  status?: boolean;
  email: string;
  password: string;
  avatar?: string;
}

export interface EditUserProfileInput {
  phoneNumber?: string;
  name?: string;
  address?: string;
  email?: string;
  avatar?: string;
}

export interface AddUserInput {
  phoneNumber: string;
  name: string;
  address: string;
  status?: boolean;
  email: string;
  password: string;
  avatar?: string;
}
