"use client";

import React, { useEffect } from "react";

import {
  Box,
  CssBaseline,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();  
  const router = useRouter();

  // ✅ Auth check
  useEffect(() => {
    if (!user) {
      router.replace("/login");        // ✅ replace not href (no flash)
    }
  }, [user]);

  // ✅ Don't render layout at all until user is confirmed
  if (!user) return null;

  return (
    <>
      <CssBaseline />

      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
          backgroundColor: "#f1f5f9",
        }}
      >

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >

          {/* Header */}
          <Header />

          {/* Page Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,

              // ✅ Responsive padding
              p: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              width: "100%",
              maxWidth: "100%",
              overflowX: "hidden",
            }}
          >
            {children}
          </Box>

          {/* Footer */}
          <Footer />

        </Box>

      </Box>
    </>
  );
}