import React, { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";
import { Box, CircularProgress } from "@mui/material";
import useIsAuthenticated from "hooks/useIsAuthenticated";

interface RouteGuardProps {
    /**
     * The roles that are allowed to access this route
     */
    roles: UserRole[];

    /**
     * The component to render if the user has permission
     */
    children: ReactNode;

    /**
     * The path to redirect to if the user doesn't have permission
     * Defaults to /unauthorized
     */
    redirectTo?: string;
}

/**
 * Component that protects routes based on user role
 * If the user doesn't have the required role, they will be redirected
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ roles, children, redirectTo = "/admin/unauthorized-access" }) => {
    const applicationCtx = useContext(ApplicationContext);
    const { isLoading } = useIsAuthenticated();

    if (!applicationCtx) {
        console.error("RouteGuard must be used within an ApplicationContextProvider");
        return <Navigate to={redirectTo} />;
    }

    // Show loading indicator while checking authentication
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // Check if user is authenticated
    if (!applicationCtx.isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    // Check if the user has one of the allowed roles
    const userRole = applicationCtx.userRole;
    const hasPermission = userRole ? roles.includes(userRole) : false;

    // Navigate to redirect path if user doesn't have permission
    if (!hasPermission) {
        return <Navigate to={redirectTo} />;
    }

    // User has permission, render the children
    return <>{children}</>;
};

export default RouteGuard;
