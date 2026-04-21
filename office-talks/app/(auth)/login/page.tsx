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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {

      const res = await apiClient.post("/api/auth/login",
        {
          email,
          password,
        },
        { timeout: 30000 });
      const data = res.data;
      if (data?.token) {

        login({
          userId: data.user?.id,
          name: data.user?.name,
          email: data.user?.email,
          token: data.token,
        });

        setToastMsg("Login successful!");
        setToastOpen(true);
        setTimeout(() => {
          router.replace("/");
        }, 800);
      } else {
        setError("Login failed: No token returned");
      }
    } catch (err: any) {
      if (err.code === "ECONNABORTED") {
        setToastMsg("Request timed out");
        setToastOpen(true);
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    }finally {
    setLoading(false);
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
              InputLabelProps={{ shrink: true }}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
              disabled={loading}
              sx={{
                background: "#3b82f6",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>

            <Typography variant="body2">
              Don't have an account? <Link href="/signup">Sign up</Link>
            </Typography>

            <Toast
              open={toastOpen}
              message={toastMsg}
              severity={toastMsg.includes("successful") ? "success" : "error"}
              onClose={() => setToastOpen(false)}
            />


          </Stack>

        </CardContent>

      </Card>

    </Box>
  );
}