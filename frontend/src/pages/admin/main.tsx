import { useContext, useState, useEffect } from "react";
import {
    AppBar,
    Box,
    CssBaseline,
    IconButton,
    Toolbar,
    Typography,
    Chip,
    CircularProgress,
    Avatar,
} from "@mui/material";
import { Menu, Settings } from "lucide-react";
import NavigationDrawer from "./navigation-drawer";
import { Outlet, useNavigate } from "react-router-dom";
import useIsAuthenticated from "hooks/useIsAuthenticated";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";
import { API_URL } from "utils/constants";

const drawerWidth = 280;

export default function AdminMain() {
    const { isLoading } = useIsAuthenticated();

    const applicationCtx = useContext(ApplicationContext);
    const navigate = useNavigate();

    // Move useState hooks before any conditional returns
    const [mobileOpen, setMobileOpen] = useState(false);
    const [open, setOpen] = useState(true);

    // Use useEffect for navigation instead of conditional rendering
    useEffect(() => {
        if (!isLoading && !applicationCtx?.isAuthenticated) {
            navigate("/admin/unauthorized-access");
        }
    }, [applicationCtx?.isAuthenticated, isLoading, navigate]);

    // Show loading indicator while checking authentication
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // If not authenticated, still render something minimal while the redirect happens
    if (!applicationCtx?.isAuthenticated) {
        return <Box sx={{ p: 4 }}>Redirecting...</Box>;
    }

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    // Get user data from context
    const userData = applicationCtx.userData || {
        firstName: "",
        lastName: "",
        email: "",
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
    const getRoleDisplayName = (role: UserRole | null) => {
        if (role === UserRole.SUPER_ADMIN) return "Super Admin";
        if (role === UserRole.MANAGER) return "Manager";
        return "User";
    };

    // Determine color for role badge
    const getRoleColor = (role: UserRole | null) => {
        if (role === UserRole.SUPER_ADMIN) return "error";
        if (role === UserRole.MANAGER) return "primary";
        return "default";
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
                    ml: { sm: `${open ? drawerWidth : 0}px` },
                    transition: (theme) =>
                        theme.transitions.create(["margin", "width"], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", height: "70px" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: "none" } }}>
                            <Menu />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: "none" }) }}>
                            <Menu />
                        </IconButton>

                        {/* Page Title can go here */}
                        <Typography
                            variant="h6"
                            sx={{
                                display: { xs: "none", sm: "block" },
                                fontWeight: 600,
                            }}>
                            Admin Dashboard
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* Settings Button */}
                        <IconButton
                            color="inherit"
                            onClick={() => navigate("/admin/settings")}
                            sx={{
                                ml: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                                },
                            }}>
                            <Settings size={20} />
                        </IconButton>

                        {/* Role badge */}
                        <Chip
                            label={getRoleDisplayName(applicationCtx.userRole)}
                            color={getRoleColor(applicationCtx.userRole) as "error" | "primary" | "default"}
                            size="small"
                            sx={{
                                ml: 2,
                                px: 1,
                                fontWeight: 500,
                                display: { xs: "none", sm: "flex" },
                            }}
                        />

                        {/* User Avatar */}
                        <Avatar
                            src={
                                applicationCtx.userData?.profilePictureUrl
                                    ? getProfilePictureUrl(applicationCtx.userData.profilePictureUrl)
                                    : undefined
                            }
                            alt={`${userData.firstName} ${userData.lastName}`}
                            sx={{
                                width: 40,
                                height: 40,
                                ml: 2,
                                border: "2px solid rgba(30, 64, 175, 0.2)",
                            }}>
                            {!applicationCtx.userData?.profilePictureUrl && userData.firstName && (
                                <Typography
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                    }}>
                                    {userData.firstName.charAt(0)}
                                    {userData.lastName?.charAt(0)}
                                </Typography>
                            )}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer Component */}
            <NavigationDrawer
                open={open}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                handleDrawerOpen={handleDrawerOpen}
                handleDrawerClose={handleDrawerClose}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
                    ml: { sm: `${open ? 0 : 0 - drawerWidth}px` },
                    transition: (theme) =>
                        theme.transitions.create(["margin", "width"], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    backgroundColor: (theme) => theme.palette.background.default,
                    minHeight: "100vh",
                }}>
                <Toolbar />
                {/* All children component will be displayed here */}
                <Outlet />
            </Box>
        </Box>
    );
}
