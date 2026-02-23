"use client";

import React, { useState } from "react";

import {

  Box,
  CssBaseline,

} from "@mui/material";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";


export default function RootLayout({children,}: { children: React.ReactNode;}) {

  const authCheck = () => {
    // Check for auth token in cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    // If no token, redirect to login
    if (!token) {
      window.location.href = "/login";
    }
  }

  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar */}
         <Sidebar />
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Header />
            <Box
              sx={{
                flexGrow: 1,
                p: 4,
                background: "#f1f5f9",
              }}
            >
              {children}
            </Box>
          <Footer />
          </Box>
        </Box>
      </body>
    </html>
  );
}