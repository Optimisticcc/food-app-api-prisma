// by admin
export interface UpdateUserInput {
  phoneNumber?: string;
  name?: string;
  address?: string;
  status?: boolean;
  email?: string;
  password?: string;
  avatar?: any;
  pers?: string;
}
export interface RegisterInput {
  phoneNumber: string;
  name: string;
  address: string;
  status?: boolean;
  email: string;
  password: string;
  avatar?: any;
  pers?: string;
}

export interface EditUserProfileInput {
  phoneNumber?: string;
  name?: string;
  address?: string;
  email?: string;
  avatar?: any;
  password?: string;
}

export interface AddUserInput {
  phoneNumber: string;
  name: string;
  address: string;
  status?: boolean;
  email: string;
  password: string;
  avatar?: any;
}
