import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Typography,
    Card,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Grid,
} from "@mui/material";
import { AlertTriangle, Download, Trash2, Info, Copy, Check, Code } from "lucide-react";
import instance from "../../utils/axiosConfig";
import { ApplicationContext } from "../../contexts/ApplicationContext";

interface LogEntry {
    id: string;
    timestamp: string;
    userId: string | null;
    username: string | null;
    action: string;
    information: string; // Added detailed information
    method: string;
    path: string;
    statusCode: number;
    ipAddress: string;
    userAgent: string | undefined;
    requestDetails?: {
        headers: Record<string, string | string[] | undefined>;
        body?: any;
        queryParams?: Record<string, string>;
    };
}

// Utility functions - moved to the top so they can be used by all components
// Format timestamp
const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
};

// Get color for HTTP method
const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
        case "GET":
            return "primary";
        case "POST":
            return "success";
        case "PUT":
            return "info";
        case "DELETE":
            return "error";
        default:
            return "default";
    }
};

// Get color for HTTP status
const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
        return "success";
    } else if (status >= 300 && status < 400) {
        return "info";
    } else if (status >= 400 && status < 500) {
        return "warning";
    } else if (status >= 500) {
        return "error";
    }
    return "default";
};

const LogDetailsDialog = ({ open, log, onClose }: { open: boolean; log: LogEntry | null; onClose: () => void }) => {
    const [tabValue, setTabValue] = useState(0);
    const [copied, setCopied] = useState(false);
    const [curlCommand, setCurlCommand] = useState("");
    const appContext = useContext(ApplicationContext);

    // Check if user is super admin
    const isSuperAdmin = appContext?.userData?.role === "super_admin";

    useEffect(() => {
        // Reset state when dialog opens/closes
        if (open && log) {
            setCopied(false);
            fetchCurlCommand();
        }
    }, [open, log]);

    // Fetch curl command from API
    const fetchCurlCommand = async () => {
        if (!log?.id) return;

        try {
            const response = await instance.get(`/logs/${log.id}/curl`);
            if (response.status === 200) {
                setCurlCommand(response.data.curlCommand);
            }
        } catch (error) {
            console.error("Failed to fetch curl command:", error);
            setCurlCommand("Error fetching curl command");
        }
    };

    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Copy curl command to clipboard
    const handleCopyCurl = () => {
        navigator.clipboard.writeText(curlCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!log) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Log Details</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        {log.information || log.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatTimestamp(log.timestamp)} by {log.username || log.userId || "Anonymous"}
                    </Typography>
                </Box>

                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="Basic Information" />
                    <Tab label="Request Details" />
                    {isSuperAdmin && <Tab label="Curl Command" icon={<Code size={16} />} iconPosition="start" />}
                </Tabs>

                {tabValue === 0 && (
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Method
                                </Typography>
                                <Typography variant="body1">
                                    <Chip
                                        label={log.method}
                                        size="small"
                                        color={
                                            getMethodColor(log.method) as
                                                | "success"
                                                | "error"
                                                | "primary"
                                                | "info"
                                                | "warning"
                                                | "default"
                                        }
                                    />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Status Code
                                </Typography>
                                <Typography variant="body1">
                                    <Chip
                                        label={log.statusCode}
                                        size="small"
                                        color={
                                            getStatusColor(log.statusCode) as
                                                | "success"
                                                | "error"
                                                | "warning"
                                                | "info"
                                                | "default"
                                        }
                                    />
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    Path
                                </Typography>
                                <Typography variant="body1">{log.path}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    IP Address
                                </Typography>
                                <Typography variant="body1">{log.ipAddress}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    User Agent
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: "0.85rem", wordBreak: "break-word" }}>
                                    {log.userAgent || "N/A"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Headers:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: 200, overflow: "auto" }}>
                            <pre
                                style={{
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    fontSize: "0.8rem",
                                }}>
                                {JSON.stringify(log.requestDetails?.headers || {}, null, 2)}
                            </pre>
                        </Paper>

                        <Typography variant="subtitle2" gutterBottom>
                            Body:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: 200, overflow: "auto" }}>
                            <pre
                                style={{
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    fontSize: "0.8rem",
                                }}>
                                {JSON.stringify(log.requestDetails?.body || {}, null, 2)}
                            </pre>
                        </Paper>

                        <Typography variant="subtitle2" gutterBottom>
                            Query Parameters:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: "auto" }}>
                            <pre
                                style={{
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    fontSize: "0.8rem",
                                }}>
                                {JSON.stringify(log.requestDetails?.queryParams || {}, null, 2)}
                            </pre>
                        </Paper>
                    </Box>
                )}

                {tabValue === 2 && isSuperAdmin && (
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="subtitle1">Copy this command to reproduce the request:</Typography>
                            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                                <IconButton onClick={handleCopyCurl} color={copied ? "success" : "primary"}>
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                backgroundColor: "#282c34",
                                maxHeight: 300,
                                overflow: "auto",
                            }}>
                            <pre
                                style={{
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    color: "#e6e6e6",
                                    fontSize: "0.85rem",
                                }}>
                                {curlCommand || "Loading curl command..."}
                            </pre>
                        </Paper>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Note: Sensitive information like passwords and tokens have been redacted from this command.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default function LogsDashboard() {
    // State for logs data
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State for dialog
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const [logDetailsDialogOpen, setLogDetailsDialogOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

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

    // Fetch logs from API
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await instance.get("/logs");
            if (response.status === 200) {
                setLogs(response.data);
            } else {
                showNotification("Failed to load logs", "error");
            }
        } catch (error: any) {
            showNotification(error.message || "Failed to load logs", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Handle pagination changes
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle clearing logs
    const handleClearLogs = async () => {
        setLoading(true);
        try {
            const response = await instance.delete("/logs");
            if (response.status === 200) {
                setLogs([]);
                setClearDialogOpen(false);
                showNotification("All logs have been cleared successfully", "success");
            } else {
                showNotification("Failed to clear logs", "error");
            }
        } catch (error: any) {
            showNotification(error.message || "Failed to clear logs", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle exporting logs as CSV
    const handleExportLogs = async () => {
        try {
            const response = await instance.get("/logs/export", {
                responseType: "blob",
            });

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;

            // Get current date for filename
            const date = new Date().toISOString().split("T")[0];
            link.setAttribute("download", `logs-export-${date}.csv`);

            document.body.appendChild(link);
            link.click();

            // Clean up and show notification
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            showNotification("Logs exported successfully", "success");
        } catch (error: any) {
            showNotification(error.message || "Failed to export logs", "error");
        }
    };

    // Show notification helper
    const showNotification = (message: string, severity: "success" | "error" | "info" | "warning") => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    // Handle closing notification
    const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setNotification({ ...notification, open: false });
    };

    // Handle opening log details dialog
    const handleOpenLogDetails = (log: LogEntry) => {
        setSelectedLog(log);
        setLogDetailsDialogOpen(true);
    };

    // Handle closing log details dialog
    const handleCloseLogDetails = () => {
        setLogDetailsDialogOpen(false);
        setSelectedLog(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    System Logs
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Download />}
                        onClick={handleExportLogs}
                        disabled={logs.length === 0 || loading}>
                        Export as CSV
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 />}
                        onClick={() => setClearDialogOpen(true)}
                        disabled={logs.length === 0 || loading}>
                        Clear All Logs
                    </Button>
                </Box>
            </Box>

            <Card>
                <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 250px)" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Method</TableCell>
                                <TableCell>Path</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>IP Address</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <CircularProgress size={40} />
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Loading logs...
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 1,
                                            }}>
                                            <AlertTriangle size={32} color="#888" />
                                            <Typography>No logs found</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                                        <TableCell>
                                            {log.username || log.userId || (
                                                <Typography variant="caption" color="text.secondary">
                                                    Anonymous
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.method}
                                                size="small"
                                                color={
                                                    getMethodColor(log.method) as
                                                        | "success"
                                                        | "error"
                                                        | "primary"
                                                        | "info"
                                                        | "warning"
                                                        | "default"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 200,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                {log.path}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.statusCode}
                                                size="small"
                                                color={
                                                    getStatusColor(log.statusCode) as
                                                        | "success"
                                                        | "error"
                                                        | "warning"
                                                        | "info"
                                                        | "default"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{log.ipAddress}</TableCell>
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() => handleOpenLogDetails(log)}>
                                                    <Info />
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
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={logs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>

            {/* Clear Logs Confirmation Dialog */}
            <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
                <DialogTitle>Confirm Clear Logs</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to clear all logs? This action cannot be undone and all log history will
                        be permanently deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleClearLogs} color="error" variant="contained">
                        Clear All Logs
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Log Details Dialog */}
            <LogDetailsDialog open={logDetailsDialogOpen} log={selectedLog} onClose={handleCloseLogDetails} />

            {/* Notification */}
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
