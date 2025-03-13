import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Toolbar,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
} from "@mui/material";
import { ChevronLeft, LogOut, Upload, CreditCard, Users, Home } from "lucide-react";
import { useApi } from "hooks";

const drawerWidth = 240;

interface NavigationDrawerProps {
    open: boolean;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    handleDrawerOpen: () => void;
    handleDrawerClose: () => void;
}

interface NavItem {
    title: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { title: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { title: "Upload Cards", path: "/admin/upload-cards", icon: <Upload size={20} /> },
    { title: "All Cards", path: "/admin/all-cards", icon: <CreditCard size={20} /> },
    // { title: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
];

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
    open,
    mobileOpen,
    handleDrawerToggle,
    // handleDrawerOpen,
    handleDrawerClose,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const api = useApi("/authentication/logout");

    const handleLogout = () => {
        api.fetchData();
        navigate("/admin/login"); // Redirect to login page
    };

    const drawerContent = (
        <>
            <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", px: [1] }}>
                <Box
                    sx={{
                        py: 2,
                        px: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: "0.05em",
                            color: "primary.main",
                            textAlign: "center",
                            textTransform: "uppercase",
                            fontSize: "1.1rem",
                            lineHeight: 1.2,
                        }}>
                        Visual
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                            color: "text.primary",
                            textAlign: "center",
                            fontSize: "0.9rem",
                            lineHeight: 1.2,
                        }}>
                        Domestic History
                    </Typography>
                </Box>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeft />
                </IconButton>
            </Toolbar>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                                },
                            }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: "center" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ minHeight: 48, px: 2.5 }}>
                        <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: "center" }}>
                            <LogOut size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}>
                {drawerContent}
            </Drawer>
            {/* Desktop drawer */}
            <Drawer
                variant="persistent"
                open={open}
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}>
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default NavigationDrawer;
