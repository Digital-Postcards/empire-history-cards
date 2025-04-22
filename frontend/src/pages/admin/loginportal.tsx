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
                    applicationCtx?.dispatch({
                        type: actions.SET_IS_AUTHENTICATED,
                        payload: true,
                    });

                    // Store user role
                    const userRole = response.data.user.role || UserRole.MANAGER;
                    applicationCtx?.dispatch({
                        type: actions.SET_USER_ROLE,
                        payload: userRole,
                    });

                    // Store user data
                    applicationCtx?.dispatch({
                        type: actions.SET_USER_DATA,
                        payload: {
                            id: response.data.user.id,
                            firstName: response.data.user.firstname,
                            lastName: response.data.user.lastname,
                            email: response.data.user.email,
                            role: userRole,
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
                backgroundImage: 'url("/placeholder.svg?height=1080&width=1920")',
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            {/* Left side: Background image with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/80"></div>

            {/* Left side content overlay */}
            <div className="relative z-10 hidden md:flex md:w-1/2 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Race, Gender, and the Visual Culture of Domestic Labor</h1>
                    <p className="text-xl opacity-90">Trade-cards and postcards from the 1870s to 1940s</p>
                </div>
            </div>

            {/* Right side with login form */}
            <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center md:justify-start p-8">
                <Paper elevation={4} className="w-full max-w-md p-8 pt-10 pb-10 bg-white/95 backdrop-blur-sm">
                    <Typography variant="h4" component="h1" className="text-center !mb-6 font-bold text-gray-800">
                        Admin Login
                    </Typography>

                    {loginError && (
                        <Alert severity="error" className="mb-4">
                            {loginError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box className="mb-4">
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
                                            <Mail size={20} className="text-gray-500" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box className="mb-6">
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
                                            <Lock size={20} className="text-gray-500" />
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

                        <Box className="mb-6">
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
                            className="py-3">
                            Sign In
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
    );
}
