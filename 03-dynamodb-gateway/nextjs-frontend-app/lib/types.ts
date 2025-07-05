export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
