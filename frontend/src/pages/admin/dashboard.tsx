import { useState, useEffect, useContext } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Paper,
    CircularProgress,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AlertTriangle, CreditCard, Users } from "lucide-react";
import instance from "../../utils/axiosConfig";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";

interface LogEntry {
    id: string;
    timestamp: string;
    userId: string | null;
    username: string | null;
    action: string;
    method: string;
    path: string;
    statusCode: number;
    ipAddress: string;
    userAgent?: string;
}

interface CardStats {
    totalCards: number;
    postcards: number;
    tradecards: number;
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const context = useContext(ApplicationContext);
    const userRole = context?.userRole || UserRole.MANAGER; // Default to MANAGER if context is undefined
    const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [cardStats, setCardStats] = useState<CardStats>({ totalCards: 0, postcards: 0, tradecards: 0 });
    const [userStats, setUserStats] = useState({ totalUsers: 0, managers: 0, superAdmins: 0 });

    // Fetch recent logs for super admins only
    useEffect(() => {
        if (userRole === UserRole.SUPER_ADMIN) {
            const fetchRecentLogs = async () => {
                try {
                    const response = await instance.get("/logs");
                    if (response.status === 200 && Array.isArray(response.data)) {
                        // Get the 5 most recent logs
                        const sortedLogs = [...response.data]
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .slice(0, 5);
                        setRecentLogs(sortedLogs);
                    }
                } catch (error) {
                    console.error("Error fetching logs:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRecentLogs();
        } else {
            setLoading(false);
        }
    }, [userRole]);

    // Fetch card statistics for all users
    useEffect(() => {
        const fetchCardStats = async () => {
            try {
                // In a real app, this would be a dedicated endpoint. For now, simulating it.
                const response = await instance.get("/cards", { params: { limit: 1 } });
                if (response.status === 200) {
                    // This is a simulation - in real app would use real data from a /stats endpoint
                    setCardStats({
                        totalCards: response.data.totalCount || 0,
                        postcards: Math.floor((response.data.totalCount || 0) * 0.7), // Simulated 70% are postcards
                        tradecards: Math.floor((response.data.totalCount || 0) * 0.3), // Simulated 30% are trade cards
                    });
                }
            } catch (error) {
                console.error("Error fetching card stats:", error);
            }
        };
        fetchCardStats();
    }, []);

    // Fetch user statistics (for super admins only)
    useEffect(() => {
        if (userRole === UserRole.SUPER_ADMIN) {
            const fetchUserStats = async () => {
                try {
                    const response = await instance.get("/users");
                    if (response.status === 200 && Array.isArray(response.data)) {
                        const users = response.data;
                        setUserStats({
                            totalUsers: users.length,
                            superAdmins: users.filter((user) => user.role === UserRole.SUPER_ADMIN).length,
                            managers: users.filter((user) => user.role === UserRole.MANAGER).length,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user stats:", error);
                }
            };
            fetchUserStats();
        }
    }, [userRole]);

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const getMethodColor = (method: string): string => {
        switch (method.toUpperCase()) {
            case "GET":
                return "info";
            case "POST":
                return "success";
            case "PUT":
            case "PATCH":
                return "warning";
            case "DELETE":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {userRole === UserRole.SUPER_ADMIN ? "Admin Dashboard" : "Manager Dashboard"}
            </Typography>

            <Grid container spacing={3}>
                {/* Card Statistics - shown to all roles */}
                <Grid item xs={12} md={userRole === UserRole.SUPER_ADMIN ? 6 : 12}>
                    <Card>
                        <CardHeader
                            title="Card Statistics"
                            action={
                                <Button
                                    color="primary"
                                    endIcon={<ArrowRight />}
                                    onClick={() => navigate("/admin/all-cards")}>
                                    View All Cards
                                </Button>
                            }
                        />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={4}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <CreditCard size={32} color="#1976d2" />
                                        <Typography variant="h4">{cardStats.totalCards}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Cards
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <CreditCard size={32} color="#2e7d32" />
                                        <Typography variant="h4">{cardStats.postcards}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Postcards
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <CreditCard size={32} color="#ed6c02" />
                                        <Typography variant="h4">{cardStats.tradecards}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Trade Cards
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Manager-specific content */}
                {userRole === UserRole.MANAGER && (
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Recent Uploads" />
                            <CardContent>
                                <Typography variant="body1" paragraph>
                                    Welcome to your manager dashboard. Here you can monitor your card uploads and manage
                                    content.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate("/admin/upload-cards")}>
                                        Upload New Card
                                    </Button>
                                </Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 4, mb: 1 }}>
                                    Card Management Tips:
                                </Typography>
                                <Typography variant="body2" component="ul" sx={{ ml: 2 }}>
                                    <li>Ensure all card information is accurate before uploading</li>
                                    <li>Add appropriate themes to make cards more discoverable</li>
                                    <li>Consider adding location data for map integration</li>
                                    <li>Use clear, high-quality images for best presentation</li>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* User Statistics - only for super admins */}
                {userRole === UserRole.SUPER_ADMIN && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader
                                title="User Statistics"
                                action={
                                    <Button
                                        color="primary"
                                        endIcon={<ArrowRight />}
                                        onClick={() => navigate("/admin/users")}>
                                        Manage Users
                                    </Button>
                                }
                            />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: "center" }}>
                                            <Users size={32} color="#1976d2" />
                                            <Typography variant="h4">{userStats.totalUsers}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Users
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: "center" }}>
                                            <Users size={32} color="#2e7d32" />
                                            <Typography variant="h4">{userStats.managers}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Managers
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ textAlign: "center" }}>
                                            <Users size={32} color="#d32f2f" />
                                            <Typography variant="h4">{userStats.superAdmins}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Admins
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Recent Logs Card - only for super admins */}
                {userRole === UserRole.SUPER_ADMIN && (
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                title="Recent System Activity"
                                action={
                                    <Button
                                        color="primary"
                                        endIcon={<ArrowRight />}
                                        onClick={() => navigate("/admin/logs")}>
                                        View All Logs
                                    </Button>
                                }
                            />
                            <CardContent>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Time</TableCell>
                                                <TableCell>User</TableCell>
                                                <TableCell>Action</TableCell>
                                                <TableCell>Method</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                                        <Typography variant="body2" component="span">
                                                            Loading activity logs...
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : recentLogs.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: 1,
                                                            }}>
                                                            <AlertTriangle size={20} color="#888" />
                                                            <Typography>No recent activity found</Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                recentLogs.map((log) => (
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
                                                        <TableCell>{log.statusCode}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};
