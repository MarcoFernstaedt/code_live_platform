import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "/api",
  withCredentials: true,
});

export default axiosInstance;