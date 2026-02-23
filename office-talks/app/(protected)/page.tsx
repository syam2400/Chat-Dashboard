"use client";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Avatar,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const cards = [
    {
      title: "Chats",
      description: "View and manage office chats",
      icon: <ChatIcon fontSize="large" />,
      path: "/chats",
    },
    {
      title: "Users",
      description: "Manage users and profiles",
      icon: <PersonIcon fontSize="large" />,
      path: "/users",
    },
    {
      title: "Dashboard",
      description: "View system overview",
      icon: <DashboardIcon fontSize="large" />,
      path: "/dashboard",
    },
    {
      title: "Settings",
      description: "Application settings",
      icon: <SettingsIcon fontSize="large" />,
      path: "/settings",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        OfficeTalks Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
          >
            <Card
              sx={{
                height: "100%",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea
                onClick={() => router.push(card.path)}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 56,
                      height: 56,
                      mb: 2,
                    }}
                  >
                    {card.icon}
                  </Avatar>

                  <Typography variant="h6">
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}