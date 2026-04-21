"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { disconnectSocket } from "@/lib/socket";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { connectSocket } from "@/lib/socket";
import { Box, CircularProgress } from "@mui/material";

export const isTokenExpired = (token: string) => {
    try {
        const decoded: any = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true); // 👈 important

    useEffect(() => {
        const stored =  sessionStorage.getItem("User-Details") 

        if (!stored) {
            // router.replace("/login");
            setLoading(false);
            return;
        }

        const parsed = JSON.parse(stored);

        if (!parsed?.token || isTokenExpired(parsed.token)) {
            alert("Session expired. Please login again.");
            sessionStorage.removeItem("User-Details");

            // router.replace("/login");
            setLoading(false);
            return;
        }

        setUser(parsed);
        setLoading(false);
    }, []);


    useEffect(() => {
        if (!user?.token) return;

        const socket = connectSocket(user.token);

        return () => {
            socket?.disconnect(); // cleanup
        };
    }, [user]);

    const login = (userData: any) => {
        sessionStorage.setItem("User-Details", JSON.stringify(userData));

        document.cookie = `auth-token=${userData.token}; path=/; max-age=${60 * 60}`;

        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem("User-Details");

        document.cookie = "auth-token=; path=/; max-age=0";

        disconnectSocket();
        setUser(null);

        router.replace("/login");
        window.location.reload();
    };

    // ⛔ Prevent UI flicker before auth check
    if (loading) {
        return (
            <Box
                height="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);