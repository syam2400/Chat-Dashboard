"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { disconnectSocket } from "@/lib/socket";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored =
      sessionStorage.getItem("User-Details") ||
      localStorage.getItem("User-Details");

    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData: any) => {
    sessionStorage.setItem("User-Details", JSON.stringify(userData));
    setUser(userData); // 🔥 THIS triggers socket automatically
  };

  const logout = () => {
    sessionStorage.removeItem("User-Details");

    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    disconnectSocket();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);