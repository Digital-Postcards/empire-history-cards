import { createTheme } from "@mui/material/styles";

const adminTheme = createTheme({
    palette: {
        primary: {
            // A rich deep blue that conveys professionalism
            main: "#1e40af",
            light: "#3b82f6",
            dark: "#1e3a8a",
            contrastText: "#ffffff",
        },
        secondary: {
            // A complementary purple shade
            main: "#7e22ce",
            light: "#a855f7",
            dark: "#6b21a8",
            contrastText: "#ffffff",
        },
        error: {
            // A slightly muted red that's less harsh
            main: "#dc2626",
            light: "#ef4444",
            dark: "#b91c1c",
        },
        warning: {
            // Warm amber color
            main: "#d97706",
            light: "#f59e0b",
            dark: "#b45309",
        },
        info: {
            // Balanced teal blue
            main: "#0891b2",
            light: "#06b6d4",
            dark: "#0e7490",
        },
        success: {
            // Deep emerald green
            main: "#059669",
            light: "#10b981",
            dark: "#047857",
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b",
            disabled: "#94a3b8",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            letterSpacing: "-0.015em",
        },
        h5: {
            fontWeight: 600,
            letterSpacing: "-0.015em",
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 500,
            textTransform: "none",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    },
                },
                contained: {
                    "&:hover": {
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    color: "#1e293b",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#1e40af",
                    color: "#ffffff",
                    backgroundImage: "linear-gradient(rgba(30, 64, 175, 0.95), rgba(30, 58, 138, 0.97))",
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: "#93c5fd", // Light blue
                    minWidth: "36px",
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: "#ffffff",
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.25)",
                        },
                    },
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
                    borderRadius: "0.5rem",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: "0.8125rem",
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f1f5f9",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: "#1e293b",
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: "#f8fafc",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                outlined: {
                    borderColor: "#e2e8f0",
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: "#e2e8f0",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#cbd5e1",
                        },
                        "&:hover fieldset": {
                            borderColor: "#94a3b8",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#3b82f6",
                        },
                    },
                },
            },
        },
    },
});

export default adminTheme;
