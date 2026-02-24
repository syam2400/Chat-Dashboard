"use client";

import Grid from "@mui/material/Grid";
import { apiClient } from "../../../lib/api";

import {
  Box,
  Card,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Divider,
  Button,
  TextField,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import { useEffect, useState } from "react";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

export default function ProfilePage() {

  const [user, setUser] = useState<User>({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState<User>({});

  const getToken = () => {
    const userDetails =
      sessionStorage.getItem("User-Details") ||
      localStorage.getItem("User-Details");

    return userDetails ? JSON.parse(userDetails).token : null;
  };

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = getToken();

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await apiClient.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {

          setUser(res.data.user);
          setFormData(res.data.user);

        }

      } catch (error) {

        console.error(error);

      }

      setLoading(false);

    };

    fetchProfile();

  }, []);

  const handleEditToggle = () => {

    if (editMode) {
      handleUpdateProfile();
    } else {
      setEditMode(true);
    }

  };

  const handleUpdateProfile = async () => {

    try {

      const token = getToken();

      const res = await apiClient.put(
        "/api/user/profile",
        {
          name: formData.name,
          email: formData.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.user) {
        setUser(res.data.user);
        setFormData(res.data.user);
      }

      setEditMode(false);

    } catch (error) {

      console.error("Update failed", error);

    }

  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setImageUploading(true);

    try {

      const token = getToken();

      const form = new FormData();
      form.append("profileImage", file);

      const res = await apiClient.put(
        "/api/user/profile-image",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.user?.profileImage) {

        setUser(res.data.user);

      }

    } catch (error) {

      console.error(error);

    }

    setImageUploading(false);

  };

  if (loading) {

    return (
      <Box height="80vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={50} />
      </Box>
    );

  }

  return (

    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: 3 }}>

      <Grid container justifyContent="center">

        <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6 }}>

          <Card sx={{ borderRadius: 4, boxShadow: 5 }}>

            {/* Cover */}
            <Box
              sx={{
                height: 150,
                background: "linear-gradient(135deg,#1976d2,#42a5f5)",
              }}
            />

            {/* Avatar */}
            <Box textAlign="center" mt={-8}>

              <Avatar
                src={user.profileImage || ""}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "auto",
                  border: "4px solid white",
                  fontSize: 40,
                  bgcolor: "#1976d2",
                }}
              >
                {!user.profileImage &&
                  (user.name || "G").charAt(0).toUpperCase()}
              </Avatar>

              {/* Upload Button */}
              <Box mt={1}>

                <IconButton
                  component="label"
                  color="primary"
                >

                  <PhotoCamera />

                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageUpload}
                  />

                </IconButton>

              </Box>

              {imageUploading && (
                <CircularProgress size={20} />
              )}

            </Box>

            {/* Edit Button */}
            <Box textAlign="right" pr={3}>

              <Button
                startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                variant="contained"
              >
                {editMode ? "Save" : "Edit"}
              </Button>

            </Box>

            <Divider sx={{ mt: 2 }} />

            {/* Info */}
            <Box p={3}>

              <Grid container spacing={2}>

                <Grid size={{ xs: 12, sm: 6 }}>

                  <Paper sx={{ p: 2 }}>

                    <Typography variant="body2">
                      Name
                    </Typography>

                    {editMode ? (

                      <TextField
                        fullWidth
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                      />

                    ) : (

                      <Typography fontWeight="bold">
                        {user.name}
                      </Typography>

                    )}

                  </Paper>

                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>

                  <Paper sx={{ p: 2 }}>

                    <Typography variant="body2">
                      Email
                    </Typography>

                    {editMode ? (

                      <TextField
                        fullWidth
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />

                    ) : (

                      <Typography fontWeight="bold">
                        {user.email}
                      </Typography>

                    )}

                  </Paper>

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <Paper sx={{ p: 2 }}>

                    <Typography variant="body2">
                      User ID
                    </Typography>

                    <Typography fontWeight="bold">
                      {user._id}
                    </Typography>

                  </Paper>

                </Grid>

              </Grid>

            </Box>

          </Card>

        </Grid>

      </Grid>

    </Box>

  );

}