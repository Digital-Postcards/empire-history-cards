import { useState, useEffect } from "react";
import { MapContainer, ZoomControl, Tooltip, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HistoricMap from "../../components/map/historicmap";
import L from "leaflet";
import { Box, Typography, FormControl, Select, MenuItem, InputLabel, Chip } from "@mui/material";
const IMAGE_WIDTH = 1500;
const IMAGE_HEIGHT = 780;

const BOUNDS = {
    minLat: -70.912,
    maxLat: 82.774,
    minLng: -184.227,
    maxLng: 184.125,
};

const pixelToLatLng = (x: number, y: number): [number, number] => {
    const lat = BOUNDS.maxLat - (y / IMAGE_HEIGHT) * (BOUNDS.maxLat - BOUNDS.minLat);
    const lng = BOUNDS.minLng + (x / IMAGE_WIDTH) * (BOUNDS.maxLng - BOUNDS.minLng);
    return [lat, lng];
};

const latLngToPixel = (lat: number, lng: number): [number, number] => {
    const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * IMAGE_WIDTH;
    const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * IMAGE_HEIGHT;
    return [Math.round(x), Math.round(y)];
};

const EMPIRE_COLORS: Record<string, string> = {
    American: "#808000",
    British: "#ebaf8f",
    French: "#457b9d",
    Ottoman: "#ffffff",
    Dutch: "#8B4513",
    Belgian: "#FFD700",
    German: "#FFA500",
    Japanese: "#4a4a4a",
    Mexican: "#800080",
    Cuban: "#9d9982",
    Russian: "#d3d3d3",
    Portuguese: "#90EE90",
};

const AdminMap = () => {
    const [countries, setCountries] = useState<any[]>([]);
    const [filterEmpire, setFilterEmpire] = useState<string>("all");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    // Fetch all countries on load
    useEffect(() => {
        const getCountries = async () => {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/map/countries`);
            const data = await res.json();
            setCountries(data);
        };
        getCountries();
    }, []);

    // Save new coordinates to DB after drag
    const handleDragEnd = async (countryId: string, lat: number, lng: number) => {
        const [x, y] = latLngToPixel(lat, lng);
        setSaveStatus("saving");
        try {
            await fetch(`${process.env.REACT_APP_SERVER_URL}/api/map/countries/${countryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coordinates: [x, y] }),
            });
            setCountries((prev) => prev.map((c) => (c._id === countryId ? { ...c, coordinates: [x, y] } : c)));
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (error) {
            console.error("Failed to update coordinates:", error);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 2000);
        }
    };

    // Get unique empires from countries
    const availableEmpires = countries
        .map((c) => c.empire)
        .filter((empire, index, self) => empire && self.indexOf(empire) === index)
        .sort();

    // Filter countries based on selected empire
    const visibleCountries = filterEmpire === "all" ? [] : countries.filter((c) => c.empire === filterEmpire);
    console.log(visibleCountries);
    return (
        <Box sx={{ position: "relative", height: "calc(100vh - 64px)" }}>
            <Box
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    backgroundColor: "white",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}>
                <Typography variant="subtitle1" fontWeight={600}>
                    Map Pin Editor
                </Typography>

                {/* Empire filter */}
                <FormControl size="small" sx={{ minWidth: 250 }}>
                    <InputLabel>Filter by Empire</InputLabel>
                    <Select
                        value={filterEmpire}
                        label="Filter by Empire"
                        onChange={(e) => setFilterEmpire(e.target.value)}>
                        <MenuItem value="all">All Empires</MenuItem>
                        {availableEmpires.map((empire) => (
                            <MenuItem key={empire} value={empire}>
                                {empire}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {saveStatus === "saving" && <Chip label="Saving" size="small" color="warning" />}
                {saveStatus === "saved" && <Chip label=" Saved" size="small" color="success" />}
                {saveStatus === "error" && <Chip label="Error" size="small" color="error" />}
                <Typography variant="body2" color="text.secondary">
                    Drag any pin to update its position
                </Typography>
            </Box>

            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={[22, 0]}
                zoomControl={false}
                zoom={1}
                minZoom={2}
                maxZoom={4}
                scrollWheelZoom={true}
                crs={L.CRS.EPSG3857}>
                <ZoomControl position="topleft" />
                <HistoricMap />
                {visibleCountries.map((country) => {
                    const [lat, lng] = pixelToLatLng(country.coordinates[0], country.coordinates[1]);
                    const color = EMPIRE_COLORS[country.empire] || "#666";

                    const pinIcon = L.divIcon({
                        className: "",
                        html: `<div style="
                                width: 14px;
                                height: 14px;
                                background-color: ${color};
                                border: 2px solid white;
                                border-radius: 50% 50% 50% 0;
                                transform: rotate(-45deg);
                                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                "></div>`,
                        iconSize: [14, 14],
                        iconAnchor: [7, 14],
                    });

                    return (
                        <Marker
                            key={country._id}
                            position={[lat, lng]}
                            icon={pinIcon}
                            draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    const { lat: newLat, lng: newLng } = e.target.getLatLng();
                                    handleDragEnd(country._id, newLat, newLng);
                                },
                            }}>
                            <Tooltip direction="top">
                                <strong>{country.name}</strong> - {country.empire} Empire
                            </Tooltip>
                        </Marker>
                    );
                })}
            </MapContainer>
        </Box>
    );
};

export default AdminMap;
