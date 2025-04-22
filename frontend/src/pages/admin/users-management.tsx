/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { userService } from "../../services/userService";

export type Role = "super_admin" | "manager";
// Define user and permission types
export interface User {
    _id: string;
    id?: string; // Keep for backward compatibility
    firstname: string; // Changed to lowercase 'n' to match backend
    lastName?: string; // Keep for backward compatibility
    firstName?: string; // Keep for backward compatibility
    lastname: string; // Changed to lowercase 'n' to match backend
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
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
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

    // Fetch users from API
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            if (response.success && response.data) {
                const userData = Array.isArray(response.data) ? response.data : [response.data];
                setUsers(userData);
                applyFilters(userData);
            } else {
                setNotification({
                    open: true,
                    message: response.message || "Failed to load users",
                    severity: "error",
                });
            }
        } catch (error: any) {
            setNotification({
                open: true,
                message: error.message || "Failed to load users",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Apply filters to the users list
    const applyFilters = (userList: User[] = users) => {
        let filtered = userList;

        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Apply permission filter
        if (permissionFilter) {
            filtered = filtered.filter((user) =>
                user.permissions.some((permission) => permission.id === permissionFilter),
            );
        }

        setFilteredUsers(filtered);
    };

    // Effect to fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Effect to apply filters when search term or permission filter changes
    useEffect(() => {
        applyFilters();
    }, [searchTerm, permissionFilter]);

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
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const response = await userService.deleteUser(userToDelete._id);
            if (response.success) {
                setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userToDelete._id));
                setFilteredUsers((prevUsers) => prevUsers.filter((u) => u._id !== userToDelete._id));

                setNotification({
                    open: true,
                    message: `User ${userToDelete.firstname} ${userToDelete.lastname} has been deleted`,
                    severity: "success",
                });
            } else {
                setNotification({
                    open: true,
                    message: response.message || "Failed to delete user",
                    severity: "error",
                });
            }
        } catch (error: any) {
            setNotification({
                open: true,
                message: error.message || "Failed to delete user",
                severity: "error",
            });
        }

        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    // Handle saving user (add or edit)
    const handleSaveUser = async (userData: Omit<User, "_id" | "id" | "createdAt">) => {
        try {
            if (formMode === "add") {
                const response = await userService.createUser(userData);
                if (response.success && response.data) {
                    const newUser = response.data as User;
                    setUsers((prevUsers) => [...prevUsers, newUser]);
                    applyFilters([...users, newUser]);

                    setNotification({
                        open: true,
                        message: `User ${newUser.firstname} ${newUser.lastname} has been added`,
                        severity: "success",
                    });
                } else {
                    setNotification({
                        open: true,
                        message: response.message || "Failed to create user",
                        severity: "error",
                    });
                }
            } else if (currentUser) {
                const response = await userService.updateUser(currentUser._id, userData);
                if (response.success && response.data) {
                    const updatedUser = response.data as User;
                    const updatedUsers = users.map((user) => (user._id === currentUser._id ? updatedUser : user));
                    setUsers(updatedUsers);
                    applyFilters(updatedUsers);

                    setNotification({
                        open: true,
                        message: `User ${userData.firstname} ${userData.lastname} has been updated`,
                        severity: "success",
                    });
                } else {
                    setNotification({
                        open: true,
                        message: response.message || "Failed to update user",
                        severity: "error",
                    });
                }
            }
        } catch (error: any) {
            setNotification({
                open: true,
                message: error.message || "Failed to save user",
                severity: "error",
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
                            {userToDelete?.firstname} {userToDelete?.lastname}
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
