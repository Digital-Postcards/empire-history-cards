import React, { useContext, ReactNode } from "react";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";

interface RoleGuardProps {
    /**
     * The roles that are allowed to see the children
     */
    roles: UserRole[];

    /**
     * The content to render if the user has the required role
     */
    children: ReactNode;

    /**
     * Optional fallback content to show if the user doesn't have the required role
     */
    fallback?: ReactNode;
}

/**
 * Component that conditionally renders its children based on the user's role
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children, fallback = null }) => {
    const applicationCtx = useContext(ApplicationContext);

    if (!applicationCtx) {
        console.error("RoleGuard must be used within an ApplicationContextProvider");
        return null;
    }

    // Check if the user has one of the allowed roles
    const userRole = applicationCtx.userRole;
    const hasPermission = userRole ? roles.includes(userRole) : false;

    // Render children if user has permission, otherwise render fallback
    return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default RoleGuard;
