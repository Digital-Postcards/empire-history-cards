import { ImageOverlay, AttributionControl } from "react-leaflet";
import { useState, useEffect } from "react";

const HistoricMap = () => {
    const [mapLoaded, setMapLoaded] = useState(false);

    // Better bounds for historical map projection
    const bounds: [[number, number], [number, number]] = [
        [-70.912, -184.227],
        [82.774, 184.125],
    ];

    useEffect(() => {
        // Simulate map loading
        const timer = setTimeout(() => {
            setMapLoaded(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {!mapLoaded && (
                <div className="map-loading-container">
                    <div>Loading historical map...</div>
                    <div className="map-loading-progress">
                        <div className="map-loading-bar" style={{ width: "80%" }}></div>
                    </div>
                </div>
            )}

            <ImageOverlay
                url="https://upload.wikimedia.org/wikipedia/commons/1/12/World_1910.jpg"
                bounds={bounds}
                opacity={1}
                zIndex={10}
                eventHandlers={{
                    load: () => setMapLoaded(true),
                }}
            />

            <AttributionControl position="bottomright" prefix="Historical map from Wikimedia Commons" />
        </>
    );
};

export default HistoricMap;
