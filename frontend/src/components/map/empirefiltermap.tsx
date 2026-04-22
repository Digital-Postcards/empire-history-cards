import { useState, useEffect, useMemo } from "react";
import { MapContainer, ZoomControl, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { ContentContainer } from "components/common";
import "leaflet/dist/leaflet.css";
import HistoricMap from "./historicmap";
import EmpireFilter from "./EmpireFilter";
import { Error } from "components/error";
import "./map.css";

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

const EMPIRE_COLORS: Record<string, string> = {
    American: "#808000",
    British: "#ebaf8f",
    French: "#457b9d",
    Ottoman: "#1a1717",
    Dutch: "#8B4513",
    Belgian: "#FFD700",
    German: "#FFA500",
    Japanese: "#4a4a4a",
    Mexican: "#800080",
    Cuban: "#9d9982",
    Russian: "#d3d3d3",
    Portuguese: "#90EE90",
};

const EmpireFilterMap = () => {
    const [filterEmpire, setFilterEmpire] = useState<string | null>(null);
    const [mapData, setMapData] = useState([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    // Fetch countries once on load
    useEffect(() => {
        const getCountries = async () => {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/map/countries`);
            const data = await res.json();
            setCountries(data);
        };
        getCountries();
    }, []);

    useEffect(() => {
        if (!filterEmpire) {
            setMapData([]);
            setSidebarVisible(false);
            return;
        }

        const getCards = async () => {
            setIsLoadingCards(true);
            const res = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/map/allcardswithlocation?empire=${filterEmpire}`,
            );
            const data = await res.json();
            setMapData(data);
            setIsLoadingCards(false);
            setTimeout(() => setSidebarVisible(true), 10);
        };

        getCards();
    }, [filterEmpire]);

    console.log(mapData);
    const handleClose = () => {
        setSidebarVisible(false);
        setTimeout(() => setFilterEmpire(null), 400);
    };

    const availableEmpires = countries
        .map((c: any) => c.empire)
        .filter((empire, index, self: any[]) => empire && self.indexOf(empire) === index)
        .sort();

    const visiblePins = useMemo(() => {
        if (!filterEmpire) return [];
        return countries
            .filter((c) => c.empire === filterEmpire)
            .map((country) => ({
                ...country,
                latLng: pixelToLatLng(country.coordinates[0], country.coordinates[1]),
            }));
    }, [countries, filterEmpire]);

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
                data-testid="empire-selector-container"
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
                </div>
            </div>

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
                        {isLoadingCards ? "Loading..." : `${mapData.length} cards`}
                    </div>

                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {isLoadingCards ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    padding: "40px 0",
                                    color: "#6b7280",
                                }}>
                                Loading cards...
                            </div>
                        ) : (
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
                                                loading="lazy"
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
                        )}
                    </div>
                </div>
            </div>

            <MapContainer
                className="overflow-hidden z-0"
                center={[20, 32]}
                zoomControl={false}
                zoom={1}
                minZoom={2}
                maxZoom={4}
                scrollWheelZoom={true}
                crs={L.CRS.EPSG3857}>
                <ZoomControl position="topleft" />
                <HistoricMap />

                {visiblePins.map((country) => {
                    const color = EMPIRE_COLORS[filterEmpire!] || "#666";
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
                    });

                    return (
                        <Marker key={country._id} position={country.latLng} icon={pinIcon}>
                            <Tooltip direction="top">
                                <strong>{country.name}</strong> - {country.empire} Empire
                            </Tooltip>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default EmpireFilterMap;
