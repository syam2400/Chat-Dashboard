"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "@/lib/socket";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.token) return;

    const socket = connectSocket(user.token);

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.onAny((event: any, data: any) => {
      console.log("📡 EVENT:", event, data);
    });

    socket.on("online_users", (users: any[]) => {
      setOnlineUsers(users);
    });

    socket.on("notification", (data: any) => {
      if (data.user?.email === user?.email) return;

      setNotifications((prev) => {
        const exists = prev.some(
          (n) =>
            n.type === data.type &&
            n.user?.email === data.user?.email
        );

        if (exists) return prev;

        return [data, ...prev];
      });
    });

    return () => {
       socket.off("online_users");
       socket.off("notification");
    };
  }, [user]); // runs when user logs in

  return (
    <NotificationContext.Provider value={{ notifications, onlineUsers }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);