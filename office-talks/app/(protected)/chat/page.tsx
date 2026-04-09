"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/api";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

export default function ChatHomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getToken = () => {
    const userDetails =
      sessionStorage.getItem("User-Details") ||
      localStorage.getItem("User-Details");

    return userDetails ? JSON.parse(userDetails).token : null;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();

        const res = await apiClient.get("/api/user/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.users) {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        bgcolor: "#eef2f7",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", md: "75%", lg: "65%" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            background: "linear-gradient(135deg,#1e3c72,#2a5298)",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            letterSpacing: 1,
          }}
        >
          Chats
        </Box>

        {/* Search */}
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Users List */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>
          {filteredUsers.map((user) => (
            <Box
              key={user._id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 2,
                borderRadius: 3,
                background: "linear-gradient(145deg,#ffffff,#e6e9f0)",
                boxShadow: "5px 5px 15px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.7)",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.01)",
                  boxShadow: "8px 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Avatar
                src={user.profileImage || ""}
                sx={{
                  mr: 2,
                  width: 55,
                  height: 65,
                  bgcolor: "#2a5298",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                {!user.profileImage &&
                  (user.name || "U").charAt(0).toUpperCase()}
              </Avatar>

              <Box>
                <Typography fontWeight="bold" fontSize={16}>
                  {user.name || "No Name"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 13 }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
