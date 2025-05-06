import { useState, useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { LeafletMouseEventHandlerFn } from "leaflet";
import { useApi } from "hooks";
import { ContentContainer, Loader } from "components/common";
import logo from "./location.png";
import "leaflet/dist/leaflet.css";
import HistoricMap from "./historicmap";
import TagFilter from "components/tagfilter";
import { Button } from "shadcn/components/ui/button";
import { Error } from "components/error";
import "./map.css";

// Create custom icons for different card types
const postcardIcon = new L.Icon({
    iconUrl: logo,
    iconSize: new L.Point(30, 30),
    className: "postcard-marker",
});

const tradecardIcon = new L.Icon({
    iconUrl: logo,
    iconSize: new L.Point(30, 30),
    className: "tradecard-marker",
    iconAnchor: [15, 30],
});

const MapLegend = () => {
    return (
        <div className="map-legend">
            <h4>Map Legend</h4>
            <div className="legend-item">
                <img src={logo} alt="Marker" className="legend-icon" />
                <span>Card Location</span>
            </div>
            <div className="legend-item">
                <div
                    style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderRadius: "50%",
                        marginRight: "8px",
                    }}></div>
                <span>Card Cluster</span>
            </div>
        </div>
    );
};

const LeafletMap = () => {
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [originalMapData, setOriginalMapData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);

    const mapConfig = {
        defaultZoom: 2,
        minZoom: 2,
        maxZoom: 5,
    };

    const { error, isLoading, fetchData } = useApi("/map/allcardswithlocation", { method: "GET" });

    const filterCards = async () => {
        setIsFiltering(true);
        if (filterTags.length > 0) {
            const filteredMapData = originalMapData.filter((data: any) => {
                return (
                    data.themes.filter((x: any) => {
                        return filterTags.includes(x);
                    }).length > 0
                );
            });
            setMapData(filteredMapData);
        } else {
            setMapData(originalMapData);
        }
        setIsFiltering(false);
    };

    useEffect(() => {
        filterCards();
    }, [filterTags]);

    const getData = async () => {
        const data = await fetchData();
        setOriginalMapData(data);
        setMapData(data);
    };

    useEffect(() => {
        getData();
    }, []);

    // Use useMemo to optimize rendering by location type
    const groupedByType = useMemo(() => {
        const postcards: any[] = [];
        const tradecards: any[] = [];

        if (!mapData) return { postcards, tradecards };

        (mapData as any[]).forEach((item) => {
            if (item.item === "postcard") {
                postcards.push(item);
            } else {
                tradecards.push(item);
            }
        });

        return { postcards, tradecards };
    }, [mapData]);

    if (isLoading) return <Loader isFullSize={true} />;

    if (!mapData)
        return (
            <ContentContainer>
                <Error errorType="data-not-found" />
            </ContentContainer>
        );

    if (error)
        return (
            <ContentContainer>
                <Error errorType="server-error" />
            </ContentContainer>
        );

    const getNumberOfCols = (numberOfImages: number) => {
        if (numberOfImages <= 5) return 2;
        else if (numberOfImages > 5 && numberOfImages <= 15) return 4;
        else return 5;
    };

    const getWidthOfPopup = (numberOfImages: number) => {
        if (numberOfImages <= 5) return 36;
        else if (numberOfImages <= 15) return 64;
        else return 72;
    };

    const buildClusterPopup = (data: any) => {
        const numberOfImages: number = data.length;
        const popupDiv = document.createElement("div");
        popupDiv.classList.add("grid");
        popupDiv.classList.add("grid-cols-" + getNumberOfCols(numberOfImages));
        popupDiv.classList.add("gap-2");
        popupDiv.classList.add("w-" + getWidthOfPopup(numberOfImages));

        // Create a wrapper div with max-height and overflow settings
        const scrollableWrapper = document.createElement("div");
        scrollableWrapper.classList.add("cluster-popup-wrapper");

        data.forEach((element: any) => {
            const imageDiv = document.createElement("div");
            imageDiv.classList.add("flex", "flex-col", "items-center");

            const image = document.createElement("img") as HTMLImageElement;
            image.width = 50;
            image.height = 100;
            image.style.objectFit = "cover";
            image.src = process.env.REACT_APP_SERVER_URL + "/public" + element.imageLinks[0].link;

            const imageLink = document.createElement("a");
            imageLink.href = "/cards/" + element.item + "s/" + element._id;
            imageLink.innerHTML = "#" + element.number;
            imageLink.title = "View " + element.item + " #" + element.number;
            imageLink.classList.add("!text-neutral-foreground");
            imageLink.classList.add("hover:underline");
            imageLink.classList.add("underline-offset-4");
            imageLink.classList.add("text-sm");
            imageLink.classList.add("mt-1");

            imageDiv.appendChild(image);
            imageDiv.appendChild(imageLink);
            popupDiv.appendChild(imageDiv);
        });

        // Add the grid to the scrollable wrapper
        scrollableWrapper.appendChild(popupDiv);
        return scrollableWrapper;
    };

    const handleClusterClick: LeafletMouseEventHandlerFn = (event: any) => {
        const zoom = event.target._zoom;
        if (zoom !== mapConfig.maxZoom) return;
        const childMarkers = event.layer.getAllChildMarkers();
        const childMarkerLatLongs: any = [];
        childMarkers.map((childMarker: any) => {
            childMarkerLatLongs.push({
                latitude: childMarker._latlng.lat,
                longitude: childMarker._latlng.lng,
            });
        });
        const childrenData: any = [];
        childMarkerLatLongs.forEach((child: any) => {
            (mapData as any).map((item: any) => {
                if (
                    !childrenData.some((c: any) => c._id === item._id) &&
                    child.latitude === item.originalLocation.latitude &&
                    child.longitude === item.originalLocation.longitude
                ) {
                    childrenData.push(item);
                }
            });
        });
        const cluster = event.layer;
        cluster.bindPopup(buildClusterPopup(childrenData));
    };

    const renderMarkers = (items: any[], icon: L.Icon) => {
        return items.map((item: any) => (
            <Marker
                key={item._id}
                position={[item?.originalLocation.latitude, item?.originalLocation.longitude]}
                icon={icon}>
                <Popup keepInView autoClose maxWidth={300}>
                    <div className="flex flex-col items-center">
                        <img
                            src={process.env.REACT_APP_SERVER_URL + "/public" + item.imageLinks[0].link}
                            alt={`${item.item} #${item.number}`}
                            className="max-w-full mb-2"
                            style={{ maxHeight: "200px" }}
                        />
                        <a href={`/cards/${item.item}s/${item._id}`}>
                            <Button variant={"link"}>
                                View {item.item} #{item.number}
                            </Button>
                        </a>
                    </div>
                </Popup>
            </Marker>
        ));
    };

    return (
        <div className="relative">
            <div className="fixed right-0 top-20 w-1/5 z-10">
                <div className="map-filter-container">
                    <h3 className="text-lg font-semibold mb-2">Filter Cards</h3>
                    {isFiltering ? (
                        <div className="flex items-center justify-center py-2">
                            <Loader isFullSize={false} />
                        </div>
                    ) : (
                        <TagFilter filterOptions={{ withVerticalMargin: true }} setFilterTags={setFilterTags} />
                    )}
                    <div className="mt-4 text-sm text-gray-500">
                        {mapData.length} cards displayed
                        {filterTags.length > 0 ? ` (filtered from ${originalMapData.length})` : ""}
                    </div>
                </div>
            </div>

            <MapContainer
                className="overflow-hidden z-0"
                center={[20, 0]}
                zoomControl={false}
                zoom={mapConfig.defaultZoom}
                minZoom={mapConfig.minZoom}
                maxZoom={mapConfig.maxZoom}
                scrollWheelZoom={true}
                crs={L.CRS.EPSG3857}>
                <ZoomControl position="topright" />
                <HistoricMap />
                <MapLegend />

                <MarkerClusterGroup
                    chunkedLoading
                    spiderfyOnMaxZoom={false}
                    showCoverageOnHover={true}
                    maxClusterRadius={50}
                    onClick={handleClusterClick}>
                    {renderMarkers(groupedByType.postcards, postcardIcon)}
                    {renderMarkers(groupedByType.tradecards, tradecardIcon)}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
