import axios from "axios";
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: BASE });
api.interceptors.request.use(config => {
  const token = localStorage.getItem("nw_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem("nw_token");
    localStorage.removeItem("nw_user");
    window.location.href = "/login";
  }
  return Promise.reject(err);
});
export default api;
