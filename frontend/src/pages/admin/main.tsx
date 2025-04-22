import { useContext, useState, useEffect } from "react";
import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography, Chip, CircularProgress } from "@mui/material";
import { Menu } from "lucide-react";
import NavigationDrawer from "./navigation-drawer";
import { Outlet, useNavigate } from "react-router-dom";
import useIsAuthenticated from "hooks/useIsAuthenticated";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";

const drawerWidth = 240;

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
                sx={{
                    width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
                    ml: { sm: `${open ? drawerWidth : 0}px` },
                    transition: (theme) =>
                        theme.transitions.create(["margin", "width"], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {/* Role badge */}
                        <Chip
                            label={getRoleDisplayName(applicationCtx.userRole)}
                            color={getRoleColor(applicationCtx.userRole) as "error" | "primary" | "default"}
                            size="small"
                            sx={{
                                mr: 2,
                                fontWeight: 500,
                                display: { xs: "none", sm: "flex" },
                            }}
                        />

                        {/* User name */}
                        <Typography variant="body1" sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
                            {userData.firstName} {userData.lastName}
                        </Typography>

                        {/* User avatar */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%",
                                overflow: "hidden",
                                width: 40,
                                height: 40,
                                bgcolor: "primary.light",
                            }}>
                            {userData.firstName && (
                                <Typography
                                    sx={{
                                        color: "#fff",
                                        fontSize: "1.2rem",
                                        fontWeight: 500,
                                    }}>
                                    {userData.firstName.charAt(0)}
                                    {userData.lastName?.charAt(0)}
                                </Typography>
                            )}
                        </Box>
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
                }}>
                <Toolbar />
                {/* All children component will be displayed here */}
                <Outlet />
            </Box>
        </Box>
    );
}
