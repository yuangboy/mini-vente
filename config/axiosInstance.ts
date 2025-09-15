import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "", // ex: http://localhost:3000
  withCredentials: true, // Indispensable pour envoyer les cookies HttpOnly
});

let storeAccessToken = "";

export function setToken(token: string) {
  storeAccessToken = token;
}

api.interceptors.request.use((config) => {
  if (storeAccessToken) {
    config.headers.Authorization = `Bearer ${storeAccessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const res = await api.post("/api/auth/refresh-token");
        const newToken = res.data.accessToken;
        setToken(newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config); // Rejouer la requête
      } catch (refreshError) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
