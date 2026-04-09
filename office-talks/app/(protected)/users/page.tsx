"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/api";

import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.users) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        All Users
      </Typography>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid
            key={user._id}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                p: 2,
                boxShadow: 4,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              <Box textAlign="center">
                <Avatar
                  src={user.profileImage || ""}
                  sx={{
                    width: 80,
                    height: 100,
                    margin: "auto",
                    mb: 1,
                    bgcolor: "#1976d2",
                    fontSize: 28,
                  }}
                >
                  {!user.profileImage &&
                    (user.name || "U").charAt(0).toUpperCase()}
                </Avatar>

                <Typography fontWeight="bold">
                  {user.name || "No Name"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>

              <Paper
                sx={{
                  mt: 2,
                  p: 1,
                  textAlign: "center",
                  bgcolor: "#f9fafb",
                }}
              >
                <Typography variant="caption">User ID</Typography>
                <Typography fontSize={12}>
                  {user._id}
                </Typography>
              </Paper>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}