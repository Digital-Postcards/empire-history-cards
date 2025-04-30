/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useEffect, useContext } from "react";
import {
    Box,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Edit, Trash2, Search, UserPlus } from "lucide-react";
import UserForm from "../../components/admin/user-form";
import { ApplicationContext } from "../../contexts/ApplicationContext";
import { User, Permission, Role, availablePermissions } from "./users-management";
import { userService } from "../../services/userService";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const applicationCtx = useContext(ApplicationContext);

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
        setIsLoading(true);
        try {
            const response = await userService.getAllUsers();
            if (response.success && response.data) {
                setUsers(Array.isArray(response.data) ? response.data : []);
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle opening the add user form
    const handleAddUser = () => {
        setCurrentUser(null);
        setFormMode("add");
        setIsFormOpen(true);
    };

    // Handle opening the edit user form
    const handleEditUser = (user: User) => {
        console.log("Edit user called with:", user);
        console.log("User ID:", user._id, "Type:", typeof user._id);

        // Create a complete copy to ensure all properties are preserved
        const userCopy = {
            ...user,
            _id: user._id || "", // Ensure ID is always a string, even if undefined
        };

        console.log("Setting currentUser to:", userCopy);
        setCurrentUser(userCopy);
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
    const handleSaveUser = async (userData: Omit<User, "_id" | "createdAt">) => {
        try {
            if (formMode === "add") {
                const response = await userService.createUser(userData);
                if (response.success && response.data) {
                    const newUser = response.data as User;
                    setUsers((prevUsers) => [...prevUsers, newUser]);

                    setNotification({
                        open: true,
                        message: `User ${newUser.firstname || newUser.firstName || ""} ${newUser.lastname || newUser.lastName || ""} has been added`,
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
                // Get the ID from the current user state
                const userId = currentUser._id;
                console.log("Before update - Current user ID:", userId);

                if (!userId) {
                    console.error("Missing user ID for update operation");
                    setNotification({
                        open: true,
                        message: "Unable to update user: Missing user ID",
                        severity: "error",
                    });
                    return;
                }

                console.log("Updating user with ID:", userId);
                const response = await userService.updateUser(userId, userData);
                if (response.success) {
                    const updatedData = response.data as User;
                    setUsers((prevUsers) =>
                        prevUsers.map((user) => (user._id === userId ? { ...updatedData, _id: userId } : user)),
                    );

                    setNotification({
                        open: true,
                        message: `User ${userData.firstname || userData.firstName || ""} ${userData.lastname || userData.lastName || ""} has been updated`,
                        severity: "success",
                    });
                } else {
                    setNotification({
                        open: true,
                        message: response.message || "Failed to update user",
                        severity: "error",
                    });
                }
            } else {
                // This should rarely happen since we check for currentUser above
                setNotification({
                    open: true,
                    message: "Unable to update user: No user selected",
                    severity: "error",
                });
            }
        } catch (error: any) {
            console.error("Error saving user:", error);
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

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            (user.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
    );

    // Function to get role display name
    const getRoleDisplayName = (role: Role) => {
        if (role === "super_admin") return "Super Admin";
        if (role === "manager") return "Manager";
        return role; // Fallback
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">Users</Typography>
                <Button variant="contained" startIcon={<UserPlus size={20} />} onClick={handleAddUser}>
                    Add User
                </Button>
            </Box>

            <Card>
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Last Login</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ p: 3 }}>
                                            <Box
                                                sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <CircularProgress size={40} />
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    Loading users...
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            {searchTerm ? "No matching users found" : "No users found"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell>
                                                    {user.firstname} {user.lastname}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getRoleDisplayName(user.role)}
                                                        color={user.role === "super_admin" ? "error" : "primary"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {user.lastLogin
                                                        ? new Date(user.lastLogin).toLocaleDateString()
                                                        : "Never"}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditUser(user)}
                                                        aria-label="edit user">
                                                        <Edit size={18} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteClick(user)}
                                                        aria-label="delete user">
                                                        <Trash2 size={18} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Card>

            {/* Add/Edit User Form Dialog */}
            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{formMode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
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
                            {userToDelete?.firstname || userToDelete?.firstName || ""}{" "}
                            {userToDelete?.lastname || userToDelete?.lastName || ""}
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
