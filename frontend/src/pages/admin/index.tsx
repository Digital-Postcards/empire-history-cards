import { Routes, Route } from "react-router-dom";
import { AdminLoginPortal, Dashboard, Users, UploadCards, AllCards } from "./admin-pages";
import AdminMain from "./main";

function AdminPortal() {
    return (
        <Routes>
            <Route path="login" element={<AdminLoginPortal />} />
            <Route path="" element={<AdminMain />}>
                <Route index path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="upload-cards" element={<UploadCards />} />
                <Route path="all-cards" element={<AllCards />} />
            </Route>
        </Routes>
    );
}

export default AdminPortal;
