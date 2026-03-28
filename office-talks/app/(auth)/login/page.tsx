"use client";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Avatar,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Toast from "../../../components/Toast";

import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiClient } from "../../../lib/api";
import { useState } from "react";
import { useRouter} from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    try {
      const res = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      const data = res.data;
      if (data?.token) {
        // Store user info and token
        sessionStorage.setItem(
          "User-Details",
          JSON.stringify({
            name: data.user?.name,
            email: data.user?.email,
            token: data.token,
          })
        );
        document.cookie = `auth-token=${data.token}; path=/`;
        setToastMsg("Login successful!");
        setToastOpen(true);
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setError("Login failed: No token returned");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.response?.data || err.message;
      setError(message || "Login failed");
    }
  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #3b82f6, #1e293b)",
      }}
    >

      <Card
        sx={{
          width: 400,
          borderRadius: 3,
          boxShadow: 5,
        }}
      >

        <CardContent sx={{ p: 4 }}>

          <Stack spacing={3} alignItems="center">

            {/* Logo */}
            <Avatar
              sx={{
                bgcolor: "#3b82f6",
                width: 56,
                height: 56,
              }}
            >
              <LockIcon />
            </Avatar>

            {/* Title */}
            <Typography variant="h5" fontWeight="bold">
              OfficeTalks Login
            </Typography>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Login button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                background: "#3b82f6",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Login
            </Button>

            <Typography variant="body2">
              Don't have an account? <Link href="/signup">Sign up</Link>
            </Typography>

            <Toast
              open={toastOpen}
              message={toastMsg}
              severity="success"
              onClose={() => setToastOpen(false)}
            />

          </Stack>

        </CardContent>

      </Card>

    </Box>
  );
}