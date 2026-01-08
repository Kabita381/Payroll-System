import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const sessionData = localStorage.getItem("user_session");
    
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
<<<<<<< HEAD
        // FIX: Wrapped Bearer token in backticks (``) to solve Vite pre-transform error
        if (session && session.token && session.token !== "undefined" && session.token !== "null") {
          config.headers.Authorization = `Bearer ${session.token}`;
        } else {
=======
        // Ensure token exists, isn't null, and isn't the string "undefined"
        if (session && session.token && session.token !== "undefined" && session.token !== "null") {
          config.headers.Authorization = `Bearer ${session.token}`;
        } else {
          // If data is corrupted, don't send a broken header
>>>>>>> fc55ff3ba7b6ff9a8ac64d4f52d01c775e678fcc
          delete config.headers.Authorization;
        }
      } catch (error) {
        console.error("JSON parsing error for user_session", error);
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;