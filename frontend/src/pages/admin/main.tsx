import { useContext, useState } from "react";
import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu } from "lucide-react";
import NavigationDrawer from "./navigation-drawer";
import { Outlet, useNavigate } from "react-router-dom";
import useIsAuthenticated from "hooks/useIsAuthenticated";
import { ApplicationContext } from "contexts/ApplicationContext";

const drawerWidth = 240;

export default function AdminMain() {
    useIsAuthenticated();

    const applicationCtx = useContext(ApplicationContext);
    const navigate = useNavigate();

    if (!applicationCtx?.isAuthenticated) {
        navigate("/unauthorized");
    }

    const [mobileOpen, setMobileOpen] = useState(false);
    const [open, setOpen] = useState(true);

    const [user] = useState({
        firstName: "Akshay",
        lastName: "Chavan",
        email: "akshaychavan@gmail.com",
        avatar: "/images/about/akshay.jpg",
    });

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

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
                        <Typography variant="body1" sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "50%",
                                overflow: "hidden",
                                width: 40,
                                height: 40,
                                bgcolor: "primary.light",
                            }}>
                            <img
                                src={user.avatar || "/avatar-placeholder.png"}
                                alt={`${user.firstName} ${user.lastName}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
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
