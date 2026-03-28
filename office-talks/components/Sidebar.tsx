"use client";

import React, { useState } from "react";
import {
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";

import Link from "next/link";

const drawerWidth = 260;

const Sidebar = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <Box>

      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 3,
        }}
      >
        <Avatar sx={{ bgcolor: "#3b82f6", fontWeight: "bold" }}>
          OT
        </Avatar>

        <Typography variant="h6" fontWeight="bold">
          OfficeTalks
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      {/* Menu */}
      <List>

        <ListItemButton
          component={Link}
          href="/"
          onClick={() => isMobile && toggleDrawer()}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/chat"
          onClick={() => isMobile && toggleDrawer()}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chats" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/users"
          onClick={() => isMobile && toggleDrawer()}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>

      </List>

    </Box>
  );

  return (
    <>

      {/* Mobile Hamburger Button */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
            background: "#fff",
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              background:
                "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop Drawer */
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background:
                "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

    </>
  );
};

export default Sidebar;