import React, { useState, useContext, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    Grid,
    Snackbar,
    Alert,
    IconButton,
    InputAdornment,
    Card,
    CardContent,
    Divider,
} from "@mui/material";
import { Camera, Eye, EyeOff, Save, X } from "lucide-react";
import { ApplicationContext } from "../../contexts/ApplicationContext";
import { API_URL } from "../../utils/constants";
import { userService } from "../../services/userService";
import actions from "../../utils/actions";

export default function SettingsPage() {
    const applicationCtx = useContext(ApplicationContext);
    const userData = applicationCtx?.userData;

    // Form state
    const [firstName, setFirstName] = useState(userData?.firstName || "");
    const [lastName, setLastName] = useState(userData?.lastName || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState<string | null | undefined>(userData?.profilePictureUrl);
    const [newFileUploaded, setNewFileUploaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form validation
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    // Notification state
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info" | "warning";
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    // File input ref
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Update form when userData changes
    useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setEmail(userData.email || "");
            setProfilePicture(userData.profilePictureUrl);
            setNewFileUploaded(false);
        }
    }, [userData]);

    // Format profile picture URL
    const getProfilePictureUrl = (url: string | null | undefined): string | undefined => {
        if (!url) return undefined;

        // If it's already a data URL (from new file upload) or an absolute URL, return as is
        if (url.startsWith("data:") || url.startsWith("http")) {
            return url;
        }

        // Otherwise, prepend the API URL
        return `${API_URL}${url}`;
    };

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
        setProfilePicture(null);
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
            confirmPassword?: string;
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

        // Only validate password if user is trying to change it
        if (password || confirmPassword) {
            if (password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            }

            if (password !== confirmPassword) {
                newErrors.confirmPassword = "Passwords don't match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle closing the notification
    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !userData?.id) return;

        try {
            const updateData: any = {
                firstname: firstName,
                lastname: lastName,
                email: email,
            };

            // Only include profilePictureUrl if it's provided or newly uploaded
            if (profilePicture !== undefined || newFileUploaded) {
                updateData.profilePictureUrl = profilePicture;
            }

            // Only include password if it's provided
            if (password) {
                updateData.password = password;
            }

            const response = await userService.updateUser(userData.id, updateData);

            if (response.success) {
                // Update user data in application context
                applicationCtx?.dispatch({
                    type: actions.SET_USER_DATA,
                    payload: {
                        ...userData,
                        firstName,
                        lastName,
                        email,
                        profilePictureUrl: Array.isArray(response.data)
                            ? profilePicture
                            : response.data?.profilePictureUrl || profilePicture,
                    },
                });

                setNotification({
                    open: true,
                    message: "Your profile has been updated successfully!",
                    severity: "success",
                });

                // Reset password fields
                setPassword("");
                setConfirmPassword("");
            } else {
                setNotification({
                    open: true,
                    message: response.message || "Failed to update profile",
                    severity: "error",
                });
            }
        } catch (error: any) {
            setNotification({
                open: true,
                message: error.message || "Failed to update profile",
                severity: "error",
            });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Account Settings
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Typography variant="h6" sx={{ mb: 3 }}>
                                    Personal Information
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
                                            disabled={true}
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
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" sx={{ mb: 3 }}>
                                    Change Password
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Leave these fields empty if you don&apos;t want to change your password
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="New Password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            fullWidth
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end">
                                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Confirm New Password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            fullWidth
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle confirm password visibility"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end">
                                                            {showConfirmPassword ? (
                                                                <EyeOff size={20} />
                                                            ) : (
                                                                <Eye size={20} />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                                    <Button type="submit" variant="contained" startIcon={<Save size={18} />}>
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Profile Picture
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                {profilePicture ? (
                                    <>
                                        <Avatar
                                            src={getProfilePictureUrl(profilePicture)}
                                            alt={`${firstName} ${lastName}`}
                                            sx={{ width: 150, height: 150, mb: 2 }}
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
                                        <Avatar sx={{ width: 150, height: 150, mb: 2 }}>
                                            <Typography sx={{ fontSize: "3rem" }}>
                                                {firstName.charAt(0)}
                                                {lastName.charAt(0)}
                                            </Typography>
                                        </Avatar>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Camera />}
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
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Account Information
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body1">
                                        {userData?.role === "super_admin" ? "Super Admin" : "Manager"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Account ID
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                                        {userData?.id}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
