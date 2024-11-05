import api from "./index";

export const login = async (credentials) => {
  const response = await api.post("/login/", credentials);
  return response.data; // Return the response data
};

export const logout = async () => {
  await api.post("/logout/");
  localStorage.removeItem("access_token"); // Clear the access token
  localStorage.removeItem("refresh_token"); // Clear the refresh token
};
