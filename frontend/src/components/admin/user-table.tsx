"use client";

import type React from "react";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Avatar,
    Box,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import { Edit, Trash2, MoreVertical, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import type { User, Permission } from "../../pages/admin/users-management";

interface UserTableProps {
    users: User[];
    page: number;
    rowsPerPage: number;
    onChangePage: (event: unknown, newPage: number) => void;
    onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
    loading: boolean;
    availablePermissions: Permission[];
}

export default function UserTable({
    users,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    onEditUser,
    onDeleteUser,
    loading,
}: UserTableProps) {
    const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedUser(user);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchor(null);
        setSelectedUser(null);
    };

    const handleEditClick = () => {
        if (selectedUser) {
            onEditUser(selectedUser);
            handleCloseActionMenu();
        }
    };

    const handleDeleteClick = () => {
        if (selectedUser) {
            onDeleteUser(selectedUser);
            handleCloseActionMenu();
        }
    };

    // Get permission icon based on permission type
    const getPermissionIcon = (permissionId: string) => {
        switch (permissionId) {
            case "super_admin":
                return <ShieldAlert size={14} />;
            case "manage_users":
                return <Shield size={14} />;
            default:
                return <ShieldCheck size={14} />;
        }
    };

    // Get permission color based on permission type
    const getPermissionColor = (
        permissionId: string,
    ): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (permissionId) {
            case "super_admin":
                return "error";
            case "manage_users":
                return "warning";
            case "manage_cards":
                return "info";
            case "view_analytics":
                return "success";
            case "manage_themes":
                return "secondary";
            case "manage_settings":
                return "primary";
            default:
                return "default";
        }
    };

    // Check if user has super admin permission
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    return (
        <>
            <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={40} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Loading users...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1">No users found</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your search or filters
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Avatar
                                                src={user?.profilePictureUrl || "/placeholder.svg"}
                                                alt={`${user?.firstName} ${user?.lastName}`}
                                                sx={{ mr: 2, width: 40, height: 40 }}
                                            />
                                            <Box>
                                                <Typography variant="body1">
                                                    {user?.firstName} {user?.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Added {new Date(user?.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user?.email}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                                            {user?.password ? "••••••••" : "Not set"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {user?.permissions.slice(0, 3).map((permission) => (
                                                <Tooltip key={permission.id} title={permission.description}>
                                                    <Chip
                                                        icon={getPermissionIcon(permission.id)}
                                                        label={permission.name}
                                                        size="small"
                                                        color={getPermissionColor(permission.id)}
                                                        variant={
                                                            permission.id === "super_admin" ? "filled" : "outlined"
                                                        }
                                                    />
                                                </Tooltip>
                                            ))}
                                            {user?.permissions.length > 3 && (
                                                <Chip
                                                    label={`+${user?.permissions.length - 3} more`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {user?.lastLogin
                                            ? new Date(user?.lastLogin).toLocaleDateString() +
                                              " " +
                                              new Date(user?.lastLogin).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "Never"}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => onEditUser(user)}
                                                size="small"
                                                aria-label="edit user">
                                                <Edit size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => onDeleteUser(user)}
                                                size="small"
                                                color="error"
                                                aria-label="delete user">
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="More Actions">
                                            <IconButton
                                                onClick={(e) => handleOpenActionMenu(e, user)}
                                                size="small"
                                                aria-label="more actions">
                                                <MoreVertical size={18} />
                                            </IconButton>
                                        </Tooltip>
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
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor)}
                onClose={handleCloseActionMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}>
                <MenuItem onClick={handleEditClick}>
                    <ListItemIcon>
                        <Edit size={18} />
                    </ListItemIcon>
                    <ListItemText>Edit User</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
                    <ListItemIcon sx={{ color: "error.main" }}>
                        <Trash2 size={18} />
                    </ListItemIcon>
                    <ListItemText>Delete User</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}
