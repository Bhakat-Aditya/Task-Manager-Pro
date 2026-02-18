import { createContext, useState, useEffect, useContext } from 'react';
import { axiosPrivate, setAccessToken } from '../api/axios';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True while we check if they are logged in on mount

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // On first load, see if we can get an access token using our cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(response.data.accessToken);
        
        // We ideally need a /me endpoint on the backend, but for now we'll decode the JWT or 
        // you can just consider them authenticated. Let's assume we fetch user profile here.
        // For now, we will just set a placeholder true if the token refresh worked.
        setUser({ isAuthenticated: true }); 
      } catch (error) {
        console.log("No valid session found. User must log in.");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [BASE_URL]);

  const login = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  };

  const register = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, { email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  };

  const logout = async () => {
    await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};