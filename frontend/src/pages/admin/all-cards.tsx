import React, { useContext, useEffect, useState } from "react";
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    SelectChangeEvent,
    Tooltip,
    Autocomplete,
    Modal,
} from "@mui/material";
import { Search, Trash2, Edit, RefreshCw, X, Eye } from "lucide-react";
import { useApi } from "../../hooks";
import { useForm, Controller } from "react-hook-form";
import { API_URL } from "../../utils/constants";
import { ApplicationContext, UserRole } from "../../contexts/ApplicationContext";

// Interface definitions
interface ThemeOption {
    id: string;
    name: string;
    isNew?: boolean;
}

interface CardData {
    _id: string;
    number: number;
    item: string;
    date: string;
    postmarked: string;
    place: string | null;
    country: string | null;
    empire: string | null;
    company: string;
    companyInformation: string;
    description: string;
    analysis: string;
    message: string | null;
    isBlurByDefault: boolean;
    themes: ThemeOption[];
    imageLinks: {
        _id: string;
        link: string;
        size: {
            height: number;
            width: number;
        };
        name: string;
        cardNumber: number;
        orientation: number | null;
    }[];
}

// Empire options
const EMPIRE_OPTIONS = [
    { id: "british", name: "British" },
    { id: "french", name: "French" },
    { id: "ottoman", name: "Ottoman" },
    { id: "american", name: "American" },
    { id: "dutch", name: "Dutch" },
    { id: "other", name: "Other" },
];

export const AllCards = () => {
    // State for cards data
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State for filtering
    const [filterType, setFilterType] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // State for edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentCard, setCurrentCard] = useState<CardData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    // State for notifications
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "info" | "warning",
    });

    // State for themes
    const [availableThemes, setAvailableThemes] = useState<ThemeOption[]>([]);

    // API hooks
    const cardsApi = useApi("/cards", { method: "GET" });
    const themesApi = useApi("/themes", { method: "GET" });
    const context = useContext(ApplicationContext);
    const userData = context ? context.userData : undefined;
    const userRole = userData?.role;

    // Form setup for editing
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CardData>();

    // Fetch cards data
    const fetchCards = async () => {
        setLoading(true);
        try {
            const data = await cardsApi.fetchData();
            setCards(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching cards:", err);
            setError("Failed to fetch cards data");
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch themes
    const fetchThemes = async () => {
        try {
            const themes = await themesApi.fetchData();
            setAvailableThemes(
                themes.map((theme: any) => ({
                    id: theme._id,
                    name: theme.name,
                })),
            );
        } catch (error) {
            console.error("Error fetching themes:", error);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchCards();
        fetchThemes();
    }, []);

    // Handle pagination changes
    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter handlers
    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilterType(event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // Modal handlers
    const handleOpenEditModal = (card: CardData) => {
        setCurrentCard(card);
        reset({
            ...card,
            themes: card.themes.map((theme) => (typeof theme === "string" ? { id: theme, name: theme } : theme)),
        });
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setCurrentCard(null);
    };

    // Delete handlers
    const handleOpenDeleteDialog = (cardId: string) => {
        setCardToDelete(cardId);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCardToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!cardToDelete) return;

        try {
            const response = await fetch(`${API_URL}/cards/${cardToDelete}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete card");
            }

            // Remove card from state
            setCards(cards.filter((card) => card._id !== cardToDelete));
            setNotification({
                open: true,
                message: "Card deleted successfully",
                severity: "success",
            });
        } catch (error) {
            console.error("Error deleting card:", error);
            setNotification({
                open: true,
                message: "Failed to delete card",
                severity: "error",
            });
        } finally {
            handleCloseDeleteDialog();
        }
    };

    // Card update handler
    const handleUpdateCard = async (data: CardData) => {
        if (!currentCard) return;

        setIsSubmitting(true);
        try {
            // Process themes to handle new ones
            const processedThemes = data.themes.map((theme) => {
                if (typeof theme === "string") {
                    return theme;
                }
                return theme.name;
            });

            const updateData = {
                ...data,
                themes: processedThemes,
            };

            const response = await fetch(`${API_URL}/cards/${currentCard._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to update card");
            }

            // Update card in state
            const updatedCard = await response.json();
            setCards(cards.map((card) => (card._id === currentCard._id ? { ...card, ...updatedCard.card } : card)));

            setNotification({
                open: true,
                message: "Card updated successfully",
                severity: "success",
            });

            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating card:", error);
            setNotification({
                open: true,
                message: "Failed to update card",
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Notification handler
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Apply filters to cards
    const filteredCards = cards.filter((card) => {
        // Filter by type
        if (filterType !== "all" && card.item !== filterType) {
            return false;
        }
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                card.number.toString().includes(query) ||
                (card.description && card.description.toLowerCase().includes(query)) ||
                (card.place && card.place.toLowerCase().includes(query)) ||
                (card.country && card.country.toLowerCase().includes(query)) ||
                (card.empire && card.empire.toLowerCase().includes(query)) ||
                (card.themes &&
                    card.themes.some((theme: any) => {
                        if (typeof theme === "string") {
                            return theme.toLowerCase().includes(query);
                        } else if (typeof theme === "object" && theme !== null && "name" in theme) {
                            return theme.name.toLowerCase().includes(query);
                        }
                        return false;
                    }))
            );
        }

        return true;
    });

    // Handle view card in new tab
    const handleViewCardDetails = (card: CardData) => {
        const cardType = card.item; // "postcard" or "tradecard"
        const cardId = card._id;
        window.open(`/cards/${cardType}/${cardId}`, "_blank");
    };

    // Get image URL
    const getImageUrl = (imageLink: string) => {
        if (!imageLink) {
            return "";
        }

        // If it's already a full URL
        if (imageLink.startsWith("http")) {
            return imageLink;
        }

        // Ensure we have the correct format: /public/images/...
        let path = imageLink;

        // If the path is just /images/... without /public prefix, add it
        if (path.startsWith("/images/")) {
            path = "/public" + path;
        }

        // If the path already has /public, keep it as is

        // Ensure the path starts with a slash
        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        return `${API_URL.replace("/api", "")}${path}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Typography variant="h4" component="h1" gutterBottom>
                All Cards
            </Typography>

            {/* Filters and Search */}
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="filter-type-label">Type</InputLabel>
                    <Select
                        labelId="filter-type-label"
                        value={filterType}
                        label="Type"
                        onChange={handleFilterChange}
                        size="small">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="postcard">Postcards</MenuItem>
                        <MenuItem value="tradecard">Trade Cards</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by number, description, place, etc."
                    InputProps={{
                        startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
                    }}
                    sx={{ flexGrow: 1, maxWidth: { xs: "100%", sm: 300 } }}
                />

                <Button variant="outlined" startIcon={<RefreshCw size={18} />} onClick={fetchCards} disabled={loading}>
                    Refresh
                </Button>
            </Box>

            {/* Cards Table */}
            <Paper sx={{ width: "100%", mb: 3, overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 3, textAlign: "center" }}>
                            <Typography color="error">{error}</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshCw size={18} />}
                                onClick={fetchCards}
                                sx={{ mt: 2 }}>
                                Retry
                            </Button>
                        </Box>
                    ) : filteredCards.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: "center" }}>
                            <Typography>No cards found matching your filters.</Typography>
                        </Box>
                    ) : (
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Number</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Themes</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCards
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((card) => (
                                        <TableRow key={card._id} hover>
                                            <TableCell width={100}>
                                                {card.imageLinks && card.imageLinks.length > 0 && (
                                                    <img
                                                        src={getImageUrl(card.imageLinks[0].link)}
                                                        alt={`Card ${card.number}`}
                                                        style={{ width: 60, height: 60, objectFit: "cover" }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>{card.number}</TableCell>
                                            <TableCell>
                                                {card.item === "postcard" ? "Postcard" : "Trade Card"}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={card.description || ""}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: 300,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}>
                                                        {card.description || ""}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                    {card.themes &&
                                                        card.themes
                                                            .slice(0, 3)
                                                            .map((theme, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={
                                                                        typeof theme === "string" ? theme : theme.name
                                                                    }
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                    {card.themes && card.themes.length > 3 && (
                                                        <Chip
                                                            label={`+${card.themes.length - 3}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenEditModal(card)}
                                                        color="primary"
                                                        title="Edit card">
                                                        <Edit size={18} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewCardDetails(card)}
                                                        color="info"
                                                        title="View card details">
                                                        <Eye size={18} />
                                                    </IconButton>
                                                    {userRole === UserRole.SUPER_ADMIN && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDeleteDialog(card._id)}
                                                            color="error"
                                                            title="Delete card">
                                                            <Trash2 size={18} />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredCards.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Paper>

            {/* Edit Card Modal */}
            <Modal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-card-modal"
                aria-describedby="edit-card-form">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: "80%", md: "90%" },
                        maxWidth: 1200,
                        maxHeight: "90vh",
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 24,
                        p: 4,
                        overflow: "auto",
                    }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            Edit Card #{currentCard?.number}
                        </Typography>
                        <IconButton onClick={handleCloseEditModal} size="small">
                            <X />
                        </IconButton>
                    </Box>

                    {currentCard && (
                        <form onSubmit={handleSubmit(handleUpdateCard)}>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                                {/* Left Column - Card Details */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <TextField
                                        label="Card Number"
                                        fullWidth
                                        {...register("number", { required: "Card number is required" })}
                                        error={!!errors.number}
                                        helperText={errors.number?.message}
                                        type="number"
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel id="item-type-label">Item Type</InputLabel>
                                        <Select
                                            labelId="item-type-label"
                                            label="Item Type"
                                            {...register("item", { required: "Item type is required" })}
                                            defaultValue={currentCard.item}>
                                            <MenuItem value="postcard">Postcard</MenuItem>
                                            <MenuItem value="tradecard">Trade Card</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Date"
                                        fullWidth
                                        {...register("date")}
                                        placeholder="e.g., 1920s or 'illegible'"
                                    />

                                    <TextField
                                        label="Postmarked"
                                        fullWidth
                                        {...register("postmarked")}
                                        placeholder="e.g., Yes; Date: 26 May, 1911, 6PM"
                                    />

                                    <TextField label="Place" fullWidth {...register("place")} />

                                    <TextField label="Country" fullWidth {...register("country")} />

                                    <Controller
                                        name="empire"
                                        control={control}
                                        defaultValue={currentCard.empire}
                                        render={({ field, fieldState: { error } }) => (
                                            <Autocomplete
                                                id="empire-select"
                                                options={EMPIRE_OPTIONS}
                                                value={
                                                    field.value
                                                        ? EMPIRE_OPTIONS.find(
                                                              (option) => option.name === field.value,
                                                          ) || null
                                                        : null
                                                }
                                                getOptionLabel={(option) => option.name}
                                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Empire"
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue ? newValue.name : null);
                                                }}
                                            />
                                        )}
                                    />

                                    <TextField label="Company" fullWidth {...register("company")} />

                                    <TextField
                                        label="Company Information"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        {...register("companyInformation")}
                                    />

                                    <Controller
                                        name="themes"
                                        control={control}
                                        defaultValue={currentCard.themes}
                                        render={({ field }) => (
                                            <Autocomplete
                                                multiple
                                                id="themes-select"
                                                options={availableThemes}
                                                value={field.value || []}
                                                getOptionLabel={(option: any) => {
                                                    return typeof option === "string" ? option : option.name;
                                                }}
                                                isOptionEqualToValue={(option, value) => {
                                                    const optionName =
                                                        typeof option === "string" ? option : option.name;
                                                    const valueName = typeof value === "string" ? value : value.name;
                                                    return optionName === valueName;
                                                }}
                                                filterSelectedOptions
                                                freeSolo
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => {
                                                        const { key, ...tagProps } = getTagProps({ index });
                                                        const label = typeof option === "string" ? option : option.name;
                                                        return (
                                                            <Chip
                                                                key={key || `theme-${index}`}
                                                                label={label}
                                                                {...tagProps}
                                                            />
                                                        );
                                                    })
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Themes"
                                                        placeholder="Select or add themes..."
                                                    />
                                                )}
                                                onChange={(_, newValue) => {
                                                    const processedValues = newValue.map((item) => {
                                                        if (typeof item === "string") {
                                                            // For new themes entered as strings
                                                            return {
                                                                id: `new-theme-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                                                                name: item,
                                                                isNew: true,
                                                            };
                                                        } else if (item.isNew) {
                                                            // For existing new themes
                                                            return item;
                                                        } else {
                                                            // For existing themes from the database
                                                            return {
                                                                id: item.id,
                                                                name: item.name,
                                                            };
                                                        }
                                                    });
                                                    field.onChange(processedValues);
                                                }}
                                            />
                                        )}
                                    />
                                </Box>

                                {/* Right Column - Images and Additional Info */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Card Images
                                    </Typography>

                                    {currentCard.imageLinks && currentCard.imageLinks.length > 0 ? (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {currentCard.imageLinks.map((image, index) => (
                                                <Box
                                                    key={image._id || index}
                                                    sx={{
                                                        border: "1px solid #e0e0e0",
                                                        borderRadius: 1,
                                                        overflow: "hidden",
                                                        width: 150,
                                                        height: 150,
                                                    }}>
                                                    <img
                                                        src={getImageUrl(image.link)}
                                                        alt={`Card image ${index}`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography>No images available</Typography>
                                    )}

                                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                                        <input
                                            type="checkbox"
                                            id="isBlurByDefault"
                                            {...register("isBlurByDefault")}
                                            style={{ marginRight: 8 }}
                                        />
                                        <InputLabel htmlFor="isBlurByDefault" sx={{ m: 0 }}>
                                            Blur by Default
                                        </InputLabel>
                                    </Box>

                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={5}
                                        {...register("description", { required: "Description is required" })}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        sx={{ mt: 2 }}
                                    />

                                    <TextField
                                        label="Analysis"
                                        fullWidth
                                        multiline
                                        rows={5}
                                        {...register("analysis")}
                                    />

                                    <TextField
                                        label="Message (if any)"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        {...register("message")}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                <Button variant="outlined" onClick={handleCloseEditModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </Box>
                        </form>
                    )}
                </Box>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this card? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
        </div>
    );
};
