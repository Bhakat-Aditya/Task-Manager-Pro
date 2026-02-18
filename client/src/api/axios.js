import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // CRITICAL: This allows the browser to send/receive the HttpOnly refresh cookie
});

// Variable to hold the access token in memory (never in localStorage!)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// Request Interceptor: Attach the access token to every outgoing request
axiosPrivate.interceptors.request.use(
  (config) => {
    if (accessToken && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 403 (Expired Token) and silently refresh
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    // If the error is 403 and we haven't retried yet
    if (error?.response?.status === 403 && !prevRequest?.sent) {
      prevRequest.sent = true;
      try {
        // Ask the backend for a new access token (it will read the cookie automatically)
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken); // Update memory
        
        // Update the failed request with the new token and retry it
        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosPrivate(prevRequest);
      } catch (refreshError) {
        // If refresh fails (cookie expired), the user is truly logged out
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);