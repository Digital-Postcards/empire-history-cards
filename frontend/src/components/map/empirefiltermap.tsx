import { useState, useEffect } from "react";
import { MapContainer, ZoomControl, Tooltip, Marker } from "react-leaflet";
import { useApi } from "hooks";
import { ContentContainer } from "components/common";
import "leaflet/dist/leaflet.css";
import HistoricMap from "./historicmap";
import EmpireFilter from "./EmpireFilter";
import { Error } from "components/error";
import "./map.css";
import L from "leaflet";

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
    British: "#e63946",
    American: "#2a9d8f",
    French: "#457b9d",
    Ottoman: "#e9c46a",
    Dutch: "#f4a261",
    Other: "#adb5bd",
};

const EmpireFilterMap = () => {
    const [filterEmpire, setFilterEmpire] = useState<string | null>(null);
    const [originalMapData, setOriginalMapData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { fetchData } = useApi("/map/allcardswithlocation", { method: "GET" });

    // Fetch cards
    useEffect(() => {
        const getData = async () => {
            const data = await fetchData();
            setOriginalMapData(data);
            setMapData(data);
        };
        getData();
    }, []);

    // Fetch countries for pins
    useEffect(() => {
        const getCountries = async () => {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/map/countries`);
            const data = await (await res).json();
            console.log("-----------------------", data);
            setCountries(data);
        };
        getCountries();
    }, []);

    // Filter cards by empire
    const filterCards = () => {
        let filtered: any = originalMapData;
        if (filterEmpire) {
            filtered = (filtered as any[]).filter((data: any) => data.empire === filterEmpire);
        }
        setMapData(filtered);
    };

    useEffect(() => {
        filterCards();
    }, [filterEmpire]);

    useEffect(() => {
        if (filterEmpire) {
            const t = setTimeout(() => setSidebarVisible(true), 10);
            return () => clearTimeout(t);
        }
    }, [filterEmpire]);

    const handleClose = () => {
        setSidebarVisible(false);
        setTimeout(() => setFilterEmpire(null), 400);
    };

    const availableEmpires = originalMapData
        .map((card: any) => card.empire)
        .filter((empire, index, self: any[]) => empire && self.indexOf(empire) === index);

    const handleDragEnd = async (countryId: string, lat: number, lng: number) => {
        const [x, y] = latLngToPixel(lat, lng);
        try {
            await fetch(`${process.env.REACT_APP_SERVER_URL}/api/map/countries/${countryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coordinates: [x, y] }),
            });
            setCountries((prev) => prev.map((c) => (c._id === countryId ? { ...c, coordinates: [x, y] } : c)));
        } catch (error) {
            console.error("Failed to update:", error);
        }
    };
    if (!mapData)
        return (
            <ContentContainer>
                <Error errorType="data-not-found" />
            </ContentContainer>
        );

    return (
        <div style={{ position: "relative" }}>
            {/* Empire Selector */}
            <div
                style={{
                    position: "fixed",
                    right: "20px",
                    top: "70px",
                    width: "280px",
                    zIndex: 10,
                    opacity: sidebarVisible ? 0 : 1,
                    pointerEvents: sidebarVisible ? "none" : "auto",
                    transition: "opacity 0.3s ease",
                }}>
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        border: "1px solid #d1d5db",
                    }}>
                    <h3
                        data-testid="empire-selector-title"
                        style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "#1f2937" }}>
                        Select an Empire
                    </h3>
                    <EmpireFilter
                        selectedEmpire={filterEmpire}
                        onEmpireChange={setFilterEmpire}
                        empires={availableEmpires}
                    />
                    <div style={{ marginTop: "16px", fontSize: "13px", color: "#6b7280" }}>
                        {originalMapData.length} cards total
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div
                style={{
                    position: "fixed",
                    right: 0,
                    top: "60px",
                    width: "20%",
                    height: "calc(100vh - 80px)",
                    zIndex: 10,
                    transform: sidebarVisible ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.4s ease-out",
                }}>
                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        padding: "20px",
                        overflowY: "hidden",
                    }}>
                    <button
                        onClick={handleClose}
                        style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "16px",
                            padding: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}>
                        <span style={{ marginRight: "6px" }}>←</span> Back to Empires
                    </button>
                    <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "#1f2937" }}>
                        {filterEmpire} Empire
                    </h3>
                    <div
                        style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            paddingBottom: "12px",
                            borderBottom: "1px solid #e5e7eb",
                            marginBottom: "16px",
                        }}>
                        {mapData.length} cards
                    </div>
                    <div style={{ flex: 1, overflowY: "auto" }}>
                        <div style={{ display: "grid", gap: "12px" }}>
                            {mapData.map((card: any) => (
                                <a
                                    key={card._id}
                                    href={`/cards/${card.item}s/${card._id}`}
                                    style={{ display: "block", textDecoration: "none" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                                    <div
                                        style={{
                                            border: "1px solid #d1d5db",
                                            borderRadius: "4px",
                                            overflow: "hidden",
                                            backgroundColor: "white",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                        }}>
                                        <img
                                            src={`${process.env.REACT_APP_SERVER_URL}/public${card.imageLinks?.[0]?.link || ""}`}
                                            alt={`${card.item} #${card.number}`}
                                            style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                        />
                                        <div style={{ padding: "8px" }}>
                                            <div style={{ fontSize: "12px", fontWeight: 500, color: "#374151" }}>
                                                {card.item} #{card.number}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={() => setEditMode((prev) => !prev)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 10,
                    padding: "10px 16px",
                    backgroundColor: editMode ? "#e63946" : "#1f2937",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}>
                {editMode ? "Exit Edit Mode" : "Edit Pin Positions"}
            </button>

            <MapContainer
                className="overflow-hidden z-0"
                center={[22, 0]}
                zoomControl={false}
                zoom={1}
                minZoom={2}
                maxZoom={4}
                scrollWheelZoom={true}
                crs={L.CRS.EPSG3857}>
                <ZoomControl position="topleft" />
                <HistoricMap />
                {filterEmpire &&
                    countries
                        .filter((c) => c.empire === filterEmpire)
                        .map((country) => {
                            const [lat, lng] = pixelToLatLng(country.coordinates[0], country.coordinates[1]);
                            const color = EMPIRE_COLORS[filterEmpire] || "#666";

                            const pinIcon = L.divIcon({
                                className: "",
                                html: `<div style="
                            width: ${country.size}px;
                            height: ${country.size}px;
                            background-color: ${color};
                            border: 2px solid white;
                            border-radius: 50% 50% 50% 0;
                            transform: rotate(-45deg);
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            "></div>`,
                                iconSize: [country.size, country.size],
                                iconAnchor: [country.size / 2, country.size],
                            });

                            return (
                                <Marker
                                    key={country._id}
                                    position={[lat, lng]}
                                    icon={pinIcon}
                                    draggable={editMode}
                                    eventHandlers={{
                                        dragend: (e) => {
                                            const { lat: newLat, lng: newLng } = e.target.getLatLng();
                                            handleDragEnd(country._id, newLat, newLng);
                                        },
                                    }}>
                                    <Tooltip>
                                        {country.empire}
                                        {editMode ? " (drag to move)" : ""}
                                    </Tooltip>
                                </Marker>
                            );
                        })}
            </MapContainer>
        </div>
    );
};

export default EmpireFilterMap;
