import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem("user_session");
    if (session) {
      const { token } = JSON.parse(session);
      if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem("user_session"); // remove invalid token
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
