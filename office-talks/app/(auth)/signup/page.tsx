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

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiClient } from "../../../lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    // simple front‑end validation
    if (!name || !email || password.length < 4) {
      setError("Please fill all fields and use a password of at least 4 characters");
      return;
    }

    try {
      const res = await apiClient.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      // axios throws for non-2xx status codes, so we arrive here only on success
      const data = res.data;
      // save token if the API returns one
      if (data?.token) {
        sessionStorage.setItem("auth-token", data.token);
      }

      // still set cookie for compatibility
      document.cookie = "auth-token=logged-in; path=/";
      router.push("/");
    } catch (err: any) {
      // axios stores message in err.response?.data or err.message
      const message =
        err.response?.data?.message || err.response?.data || err.message;
      setError(message || "Signup error");
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
            <Avatar
              sx={{
                bgcolor: "#3b82f6",
                width: 56,
                height: 56,
              }}
            >
              <PersonAddIcon />
            </Avatar>

            <Typography variant="h5" fontWeight="bold">
              OfficeTalks Signup
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

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

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSignup}
              sx={{
                background: "#3b82f6",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Sign up
            </Button>

            <Typography variant="body2">
              Already have an account? <Link href="/auth/login">Login</Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}