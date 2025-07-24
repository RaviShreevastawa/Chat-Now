import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// ✅ Add token to request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle expired or invalid tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear stored user data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;