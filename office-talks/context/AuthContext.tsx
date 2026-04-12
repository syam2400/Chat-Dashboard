"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { disconnectSocket } from "@/lib/socket";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(() => {
    // ✅ Runs synchronously — BEFORE first render
    if (typeof window === "undefined") return null; // SSR guard

    const stored =
      localStorage.getItem("User-Details") ||
      sessionStorage.getItem("User-Details");

    return stored ? JSON.parse(stored) : null;
  });
 console.log("AuthProvider rendered, user:-------", user);
//   useEffect(() => {
//     const stored =
//       sessionStorage.getItem("User-Details") ||
//       localStorage.getItem("User-Details");

//     if (stored) setUser(JSON.parse(stored));
//   }, []);

  const login = (userData: any) => {
    sessionStorage.setItem("User-Details", JSON.stringify(userData));
      // ✅ 2. Save to cookie for middleware (server-side)
    document.cookie = `auth-token=${userData.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

    setUser(userData); // 🔥 THIS triggers socket automatically
  };

  const logout = () => {
    sessionStorage.removeItem("User-Details");
    document.cookie = "auth-token=; path=/; max-age=0";

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