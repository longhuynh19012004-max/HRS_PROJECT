import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000', // Sửa thành 3001 nếu backend của bạn đang chạy port 3001
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động nhét Token vào Header trước khi gửi API
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;