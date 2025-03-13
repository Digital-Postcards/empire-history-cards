import React, { FC } from "react";
import { Container, Typography, Button, Box, Grid, Stack } from "@mui/material";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedAccess: FC = () => {
    const navigate = useNavigate();
    const boxStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    };

    return (
        <Container maxWidth="sm">
            <Box sx={boxStyle}>
                <Box sx={{ textAlign: "center" }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
                        <Lock size={32} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Unauthorized Access
                        </Typography>
                    </Stack>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                        You are not authorized to view this page. Please log in or contact the administrator for
                        assistance.
                    </Typography>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Button
                                id="login-btn"
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/admin/login")}>
                                Log In
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default UnauthorizedAccess;
