export interface User {
  id: string;
  email: string;
  full_name: string;
  current_language: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  date_of_birth?: string;
  current_language: string;
}

export interface AuthResponse {
  access_token: string;
  message: string;
  user?: User;
}
