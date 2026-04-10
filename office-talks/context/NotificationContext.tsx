"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "@/lib/socket";

type NotificationType = {
  message: string;
  type?: string;
  time?: string;
};

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    const getToken = () => {
    const userDetails =
      sessionStorage.getItem("User-Details") ||
      localStorage.getItem("User-Details");

    return userDetails ? JSON.parse(userDetails).token : null;
  };
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

      // ✅ ADD THIS HERE
    socket.onAny((event, data) => {
        console.log("📡 EVENT:", event, data);
    });

    socket.on("online_users", (users: any[]) => {
      setOnlineUsers(users);
    });

    // ✅ IMPORTANT: prevent duplicate listeners
    socket.off("notification");

    socket.on("notification", (data: NotificationType) => {
      console.log("🔔 Notification:", data);

      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
      socket.off("online_users");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications , onlineUsers }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);