"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Avatar,
    Paper,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    FormHelperText,
} from "@mui/material";
import { Upload, X, Camera } from "lucide-react";
import { User, Permission, Role } from "../../pages/admin/users-management";
import { API_URL } from "../../utils/constants";

interface UserFormProps {
    user: User | null;
    onSave: (userData: Omit<User, "_id" | "createdAt">) => void;
    onCancel: () => void;
    availablePermissions: Permission[];
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState<string | undefined | null>(null);
    const [role, setRole] = useState<Role>("manager");
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [newFileUploaded, setNewFileUploaded] = useState(false);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form validation
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        role?: string;
    }>({});

    // Function to format profile picture URL
    const getProfilePictureUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;

        // If it's already a data URL (from new file upload) or an absolute URL, return as is
        if (url.startsWith("data:") || url.startsWith("http")) {
            return url;
        }

        // Otherwise, prepend the API URL
        return `${API_URL}${url}`;
    };

    // Reset form when user changes
    useEffect(() => {
        if (user) {
            console.log("User data for form:", user);
            // Handle both camelCase and lowercase field names for backward compatibility
            setFirstName(user.firstname || user.firstName || "");
            setLastName(user.lastname || user.lastName || "");
            setEmail(user.email || "");
            setPassword("");
            setProfilePicture(user.profilePictureUrl);
            setRole(user.role || "manager");
            setPermissions(user.permissions || []);
            setNewFileUploaded(false);
        } else {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setProfilePicture(undefined);
            setRole("manager"); // Default to Manager role
            setPermissions([]);
            setNewFileUploaded(false);
        }
        setErrors({});
    }, [user]);

    // Handle profile picture upload
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result as string);
                setNewFileUploaded(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle removing profile picture
    const handleRemoveProfilePicture = () => {
        setProfilePicture(undefined);
        setNewFileUploaded(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            role?: string;
        } = {};

        if (!firstName?.trim()) {
            newErrors.firstName = "First name is required.";
        }

        if (!lastName?.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email || "")) {
            newErrors.email = "Email is invalid";
        }

        if (!user && !password?.trim()) {
            newErrors.password = "Password is required for new users";
        } else if (password?.trim() && password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const userData: Omit<User, "_id" | "createdAt"> = {
                firstname: firstName, // Match backend field name
                lastname: lastName, // Match backend field name
                email,
                role: role,
                permissions: permissions,
                lastLogin: user?.lastLogin,
            };

            // Only include profilePictureUrl if it's provided or newly uploaded
            if (profilePicture !== null || newFileUploaded) {
                userData.profilePictureUrl = profilePicture;
            }

            // Only include password if it's provided
            if (password) {
                userData.password = password;
            }

            onSave(userData);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={3}>
                {/* Left Column - User Details */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                        User Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                required
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                required
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                required={!user}
                                error={!!errors.password}
                                helperText={user ? "Leave blank to keep current password" : errors.password}
                            />
                        </Grid>

                        {/* User Role Selection */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={!!errors.role}>
                                <FormLabel component="legend">User Role</FormLabel>
                                <RadioGroup row value={role} onChange={(e) => setRole(e.target.value as Role)}>
                                    <FormControlLabel
                                        value="super_admin"
                                        control={<Radio />}
                                        label="Super Admin (Full Access)"
                                    />
                                    <FormControlLabel
                                        value="manager"
                                        control={<Radio />}
                                        label="Manager (Limited Access)"
                                    />
                                </RadioGroup>
                                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Column - Profile Picture */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h6" gutterBottom>
                        Profile Picture
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                            }}>
                            {profilePicture ? (
                                <>
                                    <Avatar
                                        src={getProfilePictureUrl(profilePicture)}
                                        alt={`${firstName} ${lastName}`}
                                        sx={{ width: 100, height: 100 }}
                                    />
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Camera />}
                                            onClick={() => fileInputRef.current?.click()}>
                                            Change
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<X />}
                                            onClick={handleRemoveProfilePicture}>
                                            Remove
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Avatar sx={{ width: 100, height: 100 }}>
                                        <Camera size={40} />
                                    </Avatar>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Upload />}
                                        onClick={() => fileInputRef.current?.click()}>
                                        Upload Picture
                                    </Button>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleProfilePictureChange}
                                style={{ display: "none" }}
                            />
                        </Paper>
                    </Box>

                    {/* Role descriptions */}
                    <Typography variant="h6" gutterBottom>
                        Role Information
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        {role === "super_admin" ? (
                            <>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Super Admin Capabilities:
                                </Typography>
                                <ul>
                                    <li>Access to Users Management</li>
                                    <li>Create, edit, and delete users</li>
                                    <li>Assign or change user roles</li>
                                    <li>Full access to all system features</li>
                                    <li>Configure application settings</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Manager Capabilities:
                                </Typography>
                                <ul>
                                    <li>Access to all content management</li>
                                    <li>Upload and edit cards</li>
                                    <li>Manage themes and categories</li>
                                    <li>Access dashboard and analytics</li>
                                    <li>No access to user management</li>
                                </ul>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained">
                    {user ? "Update User" : "Add User"}
                </Button>
            </Box>
        </Box>
    );
}
