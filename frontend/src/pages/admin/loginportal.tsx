"use client";

import type React from "react";

import { useState, useContext } from "react";
import {
    TextField,
    Checkbox,
    Button,
    FormControlLabel,
    Paper,
    Typography,
    Box,
    InputAdornment,
    IconButton,
    Alert,
} from "@mui/material";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AxiosResponse } from "axios";
import instance from "utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";
import actions from "utils/actions";

export default function AdminLoginPortal() {
    const navigate = useNavigate();
    const applicationCtx = useContext(ApplicationContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState("");

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const authenticateCredentials = async (email: string, password: string) => {
        const response: AxiosResponse = await instance("/authentication/authenticateCredentials", {
            method: "POST",
            data: { email: email, password: password },
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");

        const newErrors = { email: "", password: "" };

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        if (!newErrors.email && !newErrors.password) {
            try {
                const response = await authenticateCredentials(email, password);
                if (response.status === 200) {
                    // Save user information in the application context
                    const userRole = response.data.user.role || UserRole.MANAGER;

                    // Set all authentication information at once to prevent double auth
                    applicationCtx?.dispatch({
                        type: actions.SET_AUTH_STATE,
                        payload: {
                            isAuthenticated: true,
                            userRole: userRole,
                            userData: {
                                id: response.data.user.id,
                                firstName: response.data.user.firstname,
                                lastName: response.data.user.lastname,
                                email: response.data.user.email,
                                role: userRole,
                                profilePictureUrl: response.data.user.profilePictureUrl || null,
                            },
                        },
                    });

                    // Navigate to dashboard
                    navigate("/admin/dashboard");
                }
            } catch (error: any) {
                setLoginError(error.response?.data?.message || "Login failed. Please check your credentials.");
            }
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="min-h-screen flex bg-cover bg-center"
            style={{
                backgroundImage:
                    'linear-gradient(to right, rgba(30, 64, 175, 0.85), rgba(126, 34, 206, 0.85)), url("/images/about/history-team.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            {/* Content overlay */}
            <div className="relative z-10 hidden md:flex md:w-1/2 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Race, Gender, and the Visual Culture of Domestic Labor</h1>
                    <p className="text-xl opacity-90 mb-6">Administration Portal</p>
                    <div className="h-1 w-16 bg-white"></div>
                </div>
            </div>

            {/* Login form */}
            <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center md:justify-start p-8">
                <Paper
                    elevation={4}
                    className="w-full max-w-md p-8 pt-10 pb-10"
                    sx={{
                        borderRadius: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                    }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            textAlign: "center",
                            mb: 4,
                            fontWeight: 700,
                            color: (theme) => theme.palette.primary.main,
                            letterSpacing: "-0.01em",
                        }}>
                        Admin Login
                    </Typography>

                    {loginError && (
                        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                            {loginError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock size={20} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={toggleShowPassword}
                                                edge="end">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            sx={{
                                py: 1.5,
                                fontWeight: 600,
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(30, 64, 175, 0.15)",
                            }}>
                            Sign In
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
    );
}
