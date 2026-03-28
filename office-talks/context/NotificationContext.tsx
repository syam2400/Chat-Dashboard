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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    // ✅ IMPORTANT: prevent duplicate listeners
    socket.off("notification");

    socket.on("notification", (data: NotificationType) => {
      console.log("🔔 Notification:", data);

      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);