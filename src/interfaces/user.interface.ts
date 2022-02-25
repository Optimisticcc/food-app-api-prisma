export interface RegisterInput {
  code: string;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  orgID?: string;
}


export interface EditUserProfileInput {
  phoneNumber?: string;
  name?: string;
  address?: string;
  description?: string;
  orgID?: number;
}

// by admin
export interface UpdateUserInput {
  phoneNumber?: string;
  name?: string;
  address?: string;
  description?: string;
  isDeleted?: boolean;
  orgID?: number;
  isVerified?: boolean;
}

export interface AddUserInput {
  code: string;
  email: string;
  phoneNumber: string;
  name: string;
  orgID?: number;
}
