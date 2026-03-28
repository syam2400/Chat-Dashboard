"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";

interface User {
  id: string;
  name: string;
  [key: string]: any;
}

const Header = () => {
  const router = useRouter();
  const { notifications } = useNotifications();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);

  const [chatAnchor, setChatAnchor] = useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userDetails =
      sessionStorage.getItem("User-Details") ||
      localStorage.getItem("User-Details");
    if (userDetails) setCurrentUser(JSON.parse(userDetails));
  }, []);

  const openChatMenu = (event: React.MouseEvent<HTMLElement>) => {
    setChatAnchor(event.currentTarget);
  };

  const closeChatMenu = () => {
    setChatAnchor(null);
  };

  const chatNotifications = notifications.filter(
    (n: any) =>
      n.type === "USER_LOGIN" &&
      currentUser?.name !== n.user?.name
  );

  const chatCount = chatNotifications.length;

  const uniqueUsersMap = new Map();

  chatNotifications.forEach((n: any) => {
    uniqueUsersMap.set(n.user.id, n.user);
  });

  const onlineUsers = Array.from(uniqueUsersMap.values());


  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const openNotificationMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setNotificationAnchor(event.currentTarget);
  };

  const closeMenus = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  // ✅ Proper logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");

    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/login");
  };
  console.log("Header notifications:", notifications);
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 1, sm: 2 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* LEFT SECTION */}
        <Box display="flex" alignItems="center" gap={1}
        >

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton>
              <MenuIcon />
            </IconButton>
          )}

          {/* Title (clickable, hoverable) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "color 0.2s",
              '&:hover .home-icon': { opacity: 1, ml: 0.5 },
              '&:hover': { color: '#3b82f6' },
            }}
            onClick={() => router.push("/")}
            title="Go to Home"
          >
            <Typography
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.4rem",
                },
                userSelect: "none",
              }}
            >
              OfficeTalks
            </Typography>
            <Box className="home-icon" sx={{ opacity: 0, transition: 'opacity 0.2s, margin-left 0.2s', ml: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L2 8.5V18H7V13H13V18H18V8.5L10 2Z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </Box>
          </Box>
        </Box>

        {/* RIGHT SECTION */}
        <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>

          {/* Search (hidden on small mobile) */}
          {!isMobile && (
            <TextField
              size="small"
              placeholder="Search..."
              sx={{
                width: {
                  sm: 180,
                  md: 220,
                  lg: 260,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Mobile search icon */}
          {isMobile && (
            <IconButton>
              <SearchIcon />
            </IconButton>
          )}

          {/* Chat */}
          <IconButton size="small" onClick={openChatMenu}>
            <Badge badgeContent={chatCount} color="success">
              <ChatIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={chatAnchor}
            open={Boolean(chatAnchor)}
            onClose={closeChatMenu}
            PaperProps={{
              sx: { width: 280, maxHeight: 350 }
            }}
          >
            {onlineUsers.length === 0 ? (
              <MenuItem>No users online</MenuItem>
            ) : (
              onlineUsers.map((user: any) => (
                <MenuItem
                  key={user.id}
                  onClick={() => {
                    router.push('/chat');
                    closeChatMenu();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1,
                  }}
                >
                  {/* Avatar with online dot */}
                  <Box sx={{ position: "relative" }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        bgcolor: "#22c55e",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                    />
                  </Box>

                  {/* User info */}
                  <Box>
                    <Typography fontSize="14px" fontWeight={500}>
                      {user.name}
                    </Typography>
                    <Typography fontSize="11px" color="gray">
                      Online
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          {/* Notifications */}
          <IconButton
            size="small"
            onClick={openNotificationMenu}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={closeMenus}
          >
            {notifications.length === 0 ? (
              <MenuItem>No notifications</MenuItem>
            ) : (
              notifications.slice(0, 5).map((notif: any, index: any) => (
                <MenuItem key={index}>
                  <Box>
                    <Typography fontSize="14px">
                      {notif.message}
                    </Typography>
                    <Typography fontSize="11px" color="gray">
                      {notif.time || "Just now"}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          {/* Settings (hide on very small screens) */}
          {!isMobile && (
            <IconButton size="small">
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}

          {/* Profile */}
          <Avatar
            sx={{
              bgcolor: "#3b82f6",
              cursor: "pointer",
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              fontSize: 14,
            }}
            onClick={openProfileMenu}
          >
            N
          </Avatar>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenus}
          >
            <MenuItem onClick={() => router.push("/profile")}>
              <PersonIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>

            <MenuItem>
              <SettingsIcon sx={{ mr: 1 }} />
              Settings
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;