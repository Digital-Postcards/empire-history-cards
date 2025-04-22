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
} from "@mui/material";
import { Edit, Trash2, Search, UserPlus } from "lucide-react";
import UserForm from "../../components/admin/user-form";
import { ApplicationContext } from "../../contexts/ApplicationContext";
import instance from "../../utils/axiosConfig";
import { User, Permission, Role, availablePermissions } from "./users-management";

// Sample data - this would be replaced with API calls in production
const mockUsers: User[] = [
    {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "super_admin" as Role,
        profilePictureUrl: null,
        permissions: [
            { id: "super_admin", name: "Super Admin", description: "Has all permissions" },
            { id: "manage_users", name: "Manage Users", description: "Can add, edit, and delete users" },
        ],
        createdAt: new Date(),
        lastLogin: new Date(),
    },
    {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        role: "manager" as Role,
        profilePictureUrl: null,
        permissions: [{ id: "manage_cards", name: "Manage Cards", description: "Can add, edit, and delete cards" }],
        createdAt: new Date(),
        lastLogin: new Date(),
    },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
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

    // In a real application, we would fetch users from API here
    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await instance.get('/api/users');
    //             setUsers(response.data);
    //         } catch (error) {
    //             setNotification({
    //                 open: true,
    //                 message: "Failed to load users",
    //                 severity: "error",
    //             });
    //         }
    //     };
    //     fetchUsers();
    // }, []);

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
            // In a real application, this would be an API call
            // await instance.delete(`/api/users/${userToDelete.id}`);

            // For now, just update the local state
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));

            setNotification({
                open: true,
                message: `User ${userToDelete.firstName} ${userToDelete.lastName} has been deleted`,
                severity: "success",
            });
        } catch (error) {
            setNotification({
                open: true,
                message: "Failed to delete user",
                severity: "error",
            });
        }

        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    // Handle saving user (add or edit)
    const handleSaveUser = async (userData: Omit<User, "id" | "createdAt">) => {
        try {
            if (formMode === "add") {
                // In a real application, this would be an API call
                // const response = await instance.post('/api/users', userData);
                // const newUser = response.data;

                // For now, just simulate creating a new user
                const newUser: User = {
                    ...userData,
                    id: `user-${Date.now()}`,
                    createdAt: new Date(),
                };

                setUsers((prevUsers) => [...prevUsers, newUser]);
                setNotification({
                    open: true,
                    message: `User ${newUser.firstName} ${newUser.lastName} has been added`,
                    severity: "success",
                });
            } else if (currentUser) {
                // In a real application, this would be an API call
                // await instance.put(`/api/users/${currentUser.id}`, userData);

                // For now, just update the local state
                const updatedUser: User = {
                    ...currentUser,
                    ...userData,
                };

                setUsers((prevUsers) => prevUsers.map((user) => (user.id === currentUser.id ? updatedUser : user)));

                setNotification({
                    open: true,
                    message: `User ${userData.firstName} ${userData.lastName} has been updated`,
                    severity: "success",
                });
            }
        } catch (error) {
            setNotification({
                open: true,
                message: "Failed to save user",
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
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
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
                                {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                {user.firstName} {user.lastName}
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
                                    ))}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No users found
                                        </TableCell>
                                    </TableRow>
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
