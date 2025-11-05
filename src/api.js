import axios from "axios";
import { io } from "socket.io-client";

const BASE_URL = "https://polling-realtime-appv2.onrender.com";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  validateStatus: status => status < 500,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    return Promise.reject(error);
  }
);

export const socket = io(BASE_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

// Attach Authorization header from localStorage when available
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth');
    if (raw) {
      const auth = JSON.parse(raw);
      if (auth && auth.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default api;
