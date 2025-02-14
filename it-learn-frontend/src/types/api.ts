export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, any>;
}

export interface ApiConfig extends RequestInit {
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  _retry?: boolean;
}

export interface ApiRequestConfig {
  method: string;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  _retry?: boolean;
}
