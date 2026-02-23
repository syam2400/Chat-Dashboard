"use client";
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
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";

const drawerWidth = 260;

const Sidebar = () => {
    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    background:
                        "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
                    color: "#fff",
                },
            }}
        >
            {/* Logo */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: 3,
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

                <ListItemButton component={Link} href="/">
                    <ListItemIcon sx={{ color: "#fff" }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton component={Link} href="/chats">
                    <ListItemIcon sx={{ color: "#fff" }}>
                        <ChatIcon />
                    </ListItemIcon>
                    <ListItemText primary="Chats" />
                </ListItemButton>

                <ListItemButton component={Link} href="/users">
                    <ListItemIcon sx={{ color: "#fff" }}>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItemButton>

            </List>
        </Drawer>
    )
}

export default Sidebar;