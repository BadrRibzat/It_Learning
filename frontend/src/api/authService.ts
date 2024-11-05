import api from "./index";

interface Credentials {
  email: string;
  password: string;
}

export const login = async (credentials: Credentials) => {
  const response = await api.post("/login/", credentials);
  return response.data; // Return the response data
};

export const logout = async () => {
  await api.post("/logout/");
  localStorage.removeItem("access_token"); // Clear the access token
  localStorage.removeItem("refresh_token"); // Clear the refresh token
};
