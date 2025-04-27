import React, { useContext } from "react";
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
    Avatar,
} from "@mui/material";
import { ChevronLeft, LogOut, Upload, CreditCard, Users, Home, Settings, ClipboardList } from "lucide-react";
import { useApi } from "hooks";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";
import { API_URL } from "utils/constants";

const drawerWidth = 280;

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
    roles: UserRole[]; // Define which roles can see this item
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: <Home size={20} />,
        roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
    },
    {
        title: "Users",
        path: "/admin/users",
        icon: <Users size={20} />,
        roles: [UserRole.SUPER_ADMIN], // Only Super Admin can access
    },
    {
        title: "Upload Cards",
        path: "/admin/upload-cards",
        icon: <Upload size={20} />,
        roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
    },
    {
        title: "All Cards",
        path: "/admin/all-cards",
        icon: <CreditCard size={20} />,
        roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
    },
    {
        title: "System Logs",
        path: "/admin/logs",
        icon: <ClipboardList size={20} />,
        roles: [UserRole.SUPER_ADMIN], // Only Super Admin can access
    },
    {
        title: "Settings",
        path: "/admin/settings",
        icon: <Settings size={20} />,
        roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
    },
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
    const applicationCtx = useContext(ApplicationContext);
    const userRole = applicationCtx?.userRole;
    const userData = applicationCtx?.userData;

    const handleLogout = async () => {
        await api.fetchData();
        // Reset application context
        applicationCtx?.dispatch({
            type: "SET_IS_AUTHENTICATED",
            payload: false,
        });
        applicationCtx?.dispatch({
            type: "SET_USER_ROLE",
            payload: null,
        });
        applicationCtx?.dispatch({
            type: "SET_USER_DATA",
            payload: null,
        });
        navigate("/admin/login"); // Redirect to login page
    };

    // Format profile picture URL
    const getProfilePictureUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;

        // If it's already a data URL or an absolute URL, return as is
        if (url.startsWith("data:") || url.startsWith("http")) {
            return url;
        }

        // Otherwise, prepend the API URL
        return `${API_URL}${url}`;
    };

    // Determine display name for role
    const getRoleDisplayName = (role: UserRole | null | undefined) => {
        if (role === UserRole.SUPER_ADMIN) return "Super Admin";
        if (role === UserRole.MANAGER) return "Manager";
        return "User";
    };

    const drawerContent = (
        <>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 2,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                    }}>
                    {/* User Avatar */}
                    <Avatar
                        src={userData?.profilePictureUrl ? getProfilePictureUrl(userData.profilePictureUrl) : undefined}
                        alt={userData ? `${userData.firstName} ${userData.lastName}` : "User"}
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: "rgba(255, 255, 255, 0.2)",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                        }}>
                        {userData && !userData.profilePictureUrl && (
                            <Typography sx={{ color: "#fff", fontSize: "1rem", fontWeight: 500 }}>
                                {userData.firstName?.[0]}
                                {userData.lastName?.[0]}
                            </Typography>
                        )}
                    </Avatar>

                    {/* User Info */}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: "#ffffff",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                lineHeight: 1.2,
                            }}>
                            {userData?.firstName} {userData?.lastName}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                lineHeight: 1.2,
                            }}>
                            {getRoleDisplayName(userRole)}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={handleDrawerClose} sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    <ChevronLeft />
                </IconButton>
            </Toolbar>

            {/* Navigation Title */}
            <Box sx={{ px: 3, py: 2 }}>
                <Typography
                    variant="overline"
                    sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                    }}>
                    NAVIGATION
                </Typography>
            </Box>

            {/* Navigation Items */}
            <List sx={{ px: 1 }}>
                {navItems.map((item) => {
                    // Only render menu items that the user's role can access
                    if (!userRole || !item.roles.includes(userRole)) {
                        return null;
                    }

                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    minHeight: 48,
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: "8px",
                                    "&.Mui-selected": {
                                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.20)",
                                        },
                                    },
                                }}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: 3,
                                        justifyContent: "center",
                                        color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                                    }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: "0.95rem",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mx: 2, my: 2 }} />

            {/* Logout Button */}
            <List sx={{ px: 1, mb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            minHeight: 48,
                            px: 2,
                            py: 1.5,
                            borderRadius: "8px",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}>
                        <ListItemIcon
                            sx={{ minWidth: 0, mr: 3, justifyContent: "center", color: "rgba(255, 255, 255, 0.7)" }}>
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
