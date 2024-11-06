import api from "./index";

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

export const login = async (
  credentials: Credentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/login/", credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/logout/");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const register = async (
  userData: Credentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/register/", userData);
  return response.data;
};

export const fetchUserProfile = async (): Promise<any> => {
  const response = await api.get("/profile/");
  return response.data;
};
