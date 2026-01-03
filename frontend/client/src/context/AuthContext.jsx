import { createContext, useState, useEffect } from "react";
import API from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      API.get("/auth/profile")
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res.data;
  };

  const register = async (data) => {
    const res = await API.post("/auth/register", data);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
