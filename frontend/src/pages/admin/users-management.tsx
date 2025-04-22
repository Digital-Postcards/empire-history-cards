/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { Search, UserPlus, X } from "lucide-react";
import UserTable from "../../components/admin/user-table";
import UserForm from "../../components/admin/user-form";

const mockUsers: User[] = [
    {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        profilePictureUrl: "/placeholder.svg?height=200&width=200",
        permissions: [
            { id: "super_admin", name: "Super Admin", description: "Has all permissions" },
            { id: "manage_users", name: "Manage Users", description: "Can add, edit, and delete users" },
            { id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" },
            { id: "view_analytics", name: "View Analytics", description: "Can view analytics and reports" },
            { id: "manage_themes", name: "Manage Themes", description: "Can add, edit, and delete themes" },
            { id: "manage_settings", name: "Manage Settings", description: "Can change system settings" },
        ],
        createdAt: new Date("2023-01-15"),
        lastLogin: new Date("2023-06-20T14:30:00"),
        role: "super_admin",
    },
    {
        id: "user-2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: "password123",
        profilePictureUrl: "/placeholder.svg?height=200&width=200",
        permissions: [
            { id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" },
            { id: "view_analytics", name: "View Analytics", description: "Can view analytics and reports" },
        ],
        createdAt: new Date("2023-02-10"),
        lastLogin: new Date("2023-06-18T09:15:00"),
        role: "super_admin",
    },
    {
        id: "user-3",
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@example.com",
        password: "password123",
        permissions: [
            { id: "manage_users", name: "Manage Users", description: "Can add, edit, and delete users" },
            { id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" },
            { id: "manage_themes", name: "Manage Themes", description: "Can add, edit, and delete themes" },
        ],
        createdAt: new Date("2023-03-05"),
        lastLogin: new Date("2023-06-15T16:45:00"),
        role: "super_admin",
    },
    {
        id: "user-4",
        firstName: "Emily",
        lastName: "Williams",
        email: "emily.williams@example.com",
        password: "password123",
        profilePictureUrl: "/placeholder.svg?height=200&width=200",
        permissions: [{ id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" }],
        createdAt: new Date("2023-03-20"),
        lastLogin: new Date("2023-06-10T11:20:00"),
        role: "super_admin",
    },
    {
        id: "user-5",
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@example.com",
        password: "password123",
        permissions: [
            { id: "view_analytics", name: "View Analytics", description: "Can view analytics and reports" },
            { id: "manage_themes", name: "Manage Themes", description: "Can add, edit, and delete themes" },
        ],
        createdAt: new Date("2023-04-12"),
        role: "super_admin",
    },
    {
        id: "user-6",
        firstName: "Sarah",
        lastName: "Miller",
        email: "sarah.miller@example.com",
        password: "password123",
        profilePictureUrl: "/placeholder.svg?height=200&width=200",
        permissions: [
            { id: "manage_users", name: "Manage Users", description: "Can add, edit, and delete users" },
            { id: "manage_settings", name: "Manage Settings", description: "Can change system settings" },
        ],
        createdAt: new Date("2023-04-25"),
        lastLogin: new Date("2023-06-05T13:10:00"),
        role: "super_admin",
    },
    {
        id: "user-7",
        firstName: "James",
        lastName: "Wilson",
        email: "james.wilson@example.com",
        password: "password123",
        permissions: [
            { id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" },
            { id: "view_analytics", name: "View Analytics", description: "Can view analytics and reports" },
            { id: "manage_themes", name: "Manage Themes", description: "Can add, edit, and delete themes" },
        ],
        createdAt: new Date("2023-05-08"),
        lastLogin: new Date("2023-06-01T10:30:00"),
        role: "super_admin",
    },
    {
        id: "user-8",
        firstName: "Jessica",
        lastName: "Taylor",
        email: "jessica.taylor@example.com",
        password: "password123",
        profilePictureUrl: "/placeholder.svg?height=200&width=200",
        permissions: [{ id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" }],
        createdAt: new Date("2023-05-15"),
        lastLogin: new Date("2023-05-28T15:45:00"),
        role: "super_admin",
    },
];

export type Role = "super_admin" | "manager";
// Define user and permission types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: Role;
    profilePictureUrl?: string | null;
    permissions: Permission[];
    createdAt: Date;
    lastLogin?: Date;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
}

// Available permissions in the system
export const availablePermissions: Permission[] = [
    { id: "manage_users", name: "Manage Users", description: "Can add, edit, and delete users" },
    { id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" },
    { id: "view_analytics", name: "View Analytics", description: "Can view analytics and reports" },
    { id: "manage_themes", name: "Manage Themes", description: "Can add, edit, and delete themes" },
    { id: "manage_settings", name: "Manage Settings", description: "Can change system settings" },
    { id: "super_admin", name: "Super Admin", description: "Has all permissions" },
];

export default function UsersManagementPage() {
    // State for users data
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
    const [loading, setLoading] = useState(false);

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [permissionFilter, setPermissionFilter] = useState<string>("");

    // State for user form
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");

    // State for delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // State for notifications
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info" | "warning";
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    // Handle opening the add user form
    const handleAddUser = () => {
        setCurrentUser(null);
        setFormMode("add");
        setIsFormOpen(true);
    };

    // Handle opening the edit user form
    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    // Handle opening the delete confirmation dialog
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    // Handle confirming user deletion
    const handleConfirmDelete = () => {
        if (!userToDelete) return;

        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
        setFilteredUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));

        setNotification({
            open: true,
            message: `User ${userToDelete.firstName} ${userToDelete.lastName} has been deleted`,
            severity: "success",
        });

        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    // Handle saving user (add or edit)
    const handleSaveUser = (userData: Omit<User, "id" | "createdAt">) => {
        if (formMode === "add") {
            // Create new user
            const newUser: User = {
                ...userData,
                id: `user-${Date.now()}`,
                createdAt: new Date(),
            };

            setUsers((prevUsers) => [...prevUsers, newUser]);
            setFilteredUsers((prevUsers) => [...prevUsers, newUser]);
            setNotification({
                open: true,
                message: `User ${newUser.firstName} ${newUser.lastName} has been added`,
                severity: "success",
            });
        } else if (currentUser) {
            // Update existing user
            const updatedUser: User = {
                ...currentUser,
                ...userData,
            };

            setUsers((prevUsers) => prevUsers.map((user) => (user.id === currentUser.id ? updatedUser : user)));
            setFilteredUsers((prevUsers) => prevUsers.map((user) => (user.id === currentUser.id ? updatedUser : user)));
            setNotification({
                open: true,
                message: `User ${userData.firstName} ${userData.lastName} has been updated`,
                severity: "success",
            });
        }

        setIsFormOpen(false);
        setCurrentUser(null);
    };

    // Handle closing the notification
    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    // Handle changing page
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Handle changing rows per page
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Users Management
            </Typography>

            {/* Search and Filter Bar */}
            <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
                <TextField
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: "200px" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm ? (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm("")}>
                                    <X size={16} />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />

                <FormControl sx={{ minWidth: "200px" }}>
                    <InputLabel id="permission-filter-label">Filter by Permission</InputLabel>
                    <Select
                        labelId="permission-filter-label"
                        value={permissionFilter}
                        label="Filter by Permission"
                        onChange={(e) => setPermissionFilter(e.target.value)}
                        displayEmpty>
                        <MenuItem value="">All Permissions</MenuItem>
                        {availablePermissions.map((permission) => (
                            <MenuItem key={permission.id} value={permission.id}>
                                {permission.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    startIcon={<UserPlus size={20} />}
                    onClick={handleAddUser}
                    sx={{ whiteSpace: "nowrap" }}>
                    Add User
                </Button>
            </Box>

            {/* Users Table */}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <UserTable
                    users={filteredUsers}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteClick}
                    loading={loading}
                    availablePermissions={availablePermissions}
                />
            </Paper>

            {/* Add/Edit User Form Dialog */}
            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{formMode === "add" ? "Add New Admin User" : "Edit Admin User"}</DialogTitle>
                <DialogContent>
                    <UserForm
                        user={currentUser}
                        onSave={handleSaveUser}
                        onCancel={() => setIsFormOpen(false)}
                        availablePermissions={availablePermissions}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the user{" "}
                        <strong>
                            {userToDelete?.firstName} {userToDelete?.lastName}
                        </strong>
                        ? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
