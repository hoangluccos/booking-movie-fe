import axios from "axios";
// Lấy token từ localStorage (hoặc từ nơi lưu trữ bảo mật khác)
// const token = JSON.parse(localStorage.getItem("token"));
const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    // Authorization: token ? `Bearer ${token.token}` : "",
  },
});
// Interceptor để thêm token vào mỗi request
instance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default instance;
