import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import adminTheme from "./adminTheme";

interface AdminThemeProviderProps {
    children: React.ReactNode;
}

const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
    return (
        <ThemeProvider theme={adminTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default AdminThemeProvider;
