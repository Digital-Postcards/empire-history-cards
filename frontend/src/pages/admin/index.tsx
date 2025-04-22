import { Routes, Route } from "react-router-dom";
import { AdminLoginPortal, Dashboard, UsersPage, UploadCards, AllCards } from "./admin-pages";
import AdminMain from "./main";
import UnauthorizedAccess from "./unauthorized-access";
import { UserRole } from "contexts/ApplicationContext";
import RouteGuard from "components/admin/RouteGuard";

function AdminPortal() {
    return (
        <Routes>
            <Route path="login" element={<AdminLoginPortal />} />
            <Route path="unauthorized-access" element={<UnauthorizedAccess />} />
            <Route path="" element={<AdminMain />}>
                <Route
                    index
                    path="dashboard"
                    element={
                        <RouteGuard roles={[UserRole.SUPER_ADMIN, UserRole.MANAGER]}>
                            <Dashboard />
                        </RouteGuard>
                    }
                />

                {/* Only Super Admins can access the Users page */}
                <Route
                    path="users"
                    element={
                        <RouteGuard roles={[UserRole.SUPER_ADMIN]}>
                            <UsersPage />
                        </RouteGuard>
                    }
                />

                {/* Both roles can access the other pages */}
                <Route
                    path="upload-cards"
                    element={
                        <RouteGuard roles={[UserRole.SUPER_ADMIN, UserRole.MANAGER]}>
                            <UploadCards />
                        </RouteGuard>
                    }
                />

                <Route
                    path="all-cards"
                    element={
                        <RouteGuard roles={[UserRole.SUPER_ADMIN, UserRole.MANAGER]}>
                            <AllCards />
                        </RouteGuard>
                    }
                />
            </Route>
        </Routes>
    );
}

export default AdminPortal;
