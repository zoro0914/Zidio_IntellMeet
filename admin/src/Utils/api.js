import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // Redirect to login page or handle login session expiry
    }
    return Promise.reject(error);
  }
);

export default api;
