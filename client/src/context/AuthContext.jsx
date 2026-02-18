import { createContext, useState, useEffect, useContext } from "react";
import { axiosPrivate, setAccessToken } from "../api/axios";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        setAccessToken(response.data.accessToken);
        // FIX: We now set the actual user object returned from the refresh API!
        setUser(response.data.user);
      } catch (error) {
        console.log("No valid session found. User must log in.");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [BASE_URL]);

  const login = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  };

  // FIX: Add 'name' as an argument
  const register = async (name, email, password) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name,
      email,
      password,
    });
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
