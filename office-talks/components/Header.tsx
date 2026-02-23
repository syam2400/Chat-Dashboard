"use client";
import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    Box,
    Avatar,
    Divider,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const Header = () => {

      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      const [notificationAnchor, setNotificationAnchor] =
        useState<null | HTMLElement>(null);
    
      const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
      const openNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget);
      };
    
      const closeMenus = () => {
        setAnchorEl(null);
        setNotificationAnchor(null);
      };
    return (

        <AppBar
            position="static"
            elevation={0}
            sx={{
                background: "#ffffff",
                color: "#0f172a",
                borderBottom: "1px solid #e5e7eb",
                px: 2,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>

                {/* Title */}
                <Typography variant="h6" fontWeight="bold">
                    OfficeTalks Platform
                </Typography>

                {/* Right section */}
                <Box display="flex" alignItems="center" gap={2}>

                    {/* Search */}
                    <TextField
                        size="small"
                        placeholder="Search..."
                        sx={{ width: 250 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Chat */}
                    <IconButton>
                        <Badge badgeContent={4} color="primary">
                            <ChatIcon />
                        </Badge>
                    </IconButton>

                    {/* Notifications */}
                    <IconButton onClick={openNotificationMenu}>
                        <Badge badgeContent={7} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Notification dropdown */}
                    <Menu
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={closeMenus}
                    >
                        <MenuItem>New message from Alex</MenuItem>
                        <MenuItem>Server updated</MenuItem>
                        <MenuItem>New user registered</MenuItem>
                    </Menu>

                    {/* Settings */}
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>

                    {/* Profile */}
                    <Avatar
                        sx={{
                            bgcolor: "#3b82f6",
                            cursor: "pointer",
                        }}
                        onClick={openProfileMenu}
                    >
                        N
                    </Avatar>

                    {/* Profile dropdown */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={closeMenus}
                    >
                        <MenuItem>
                            <PersonIcon sx={{ mr: 1 }} />
                            Profile
                        </MenuItem>

                        <MenuItem>
                            <SettingsIcon sx={{ mr: 1 }} />
                            Settings
                        </MenuItem>

                        <Divider />

                        <MenuItem>
                            <LogoutIcon sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>

                </Box>

            </Toolbar>
        </AppBar>
    )
}

export default Header;