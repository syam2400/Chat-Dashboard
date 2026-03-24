"use client";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Avatar,
  Container,
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
      path: "/chat",
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
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Responsive Heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={{ xs: 2, md: 3 }}
        sx={{
          fontSize: {
            xs: "1.6rem",
            sm: "1.8rem",
            md: "2.2rem",
          },
        }}
      >
        OfficeTalks Dashboard
      </Typography>

      {/* Responsive Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {cards.map((card, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: {
                    xs: "none",
                    sm: "translateY(-6px)",
                  },
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea
                sx={{
                  p: { xs: 1.5, sm: 2 },
                }}
                onClick={() => router.push(card.path)}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      mb: 2,
                    }}
                  >
                    {card.icon}
                  </Avatar>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: {
                        xs: "1rem",
                        sm: "1.1rem",
                        md: "1.2rem",
                      },
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.85rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    {card.description}
                  </Typography>

                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Container>
  );
}