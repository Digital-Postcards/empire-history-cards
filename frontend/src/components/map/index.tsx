import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { LeafletMouseEventHandlerFn } from "leaflet";
import { useApi } from "hooks";
import { ContentContainer, FilterSection, Loader } from "components/common";
import logo from "./location.png";
import "leaflet/dist/leaflet.css";
import HistoricMap from "./historicmap";
import TagFilter from "components/tagfilter";
import { Button } from "shadcn/components/ui/button";
import { Error } from "components/error";

const customIcon = new L.Icon({
    iconUrl: logo,
    iconSize: new L.Point(30, 30),
});

const LeafletMap = () => {
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const mapConfig = {
        defaultZoom: 1,
        minZoom: 2,
        maxZoom: 4,
    };
    const [mapData, setMapData] = useState([]);

    const { error, isLoading, fetchData } = useApi("/map/allcardswithlocation", { method: "GET" });

    const filterCards = async () => {
        if (filterTags.length > 0) {
            const filteredMapData = mapData.filter((data: any) => {
                return (
                    data.themes.filter((x: any) => {
                        return filterTags.includes(x);
                    }).length > 0
                );
            });
            setMapData(filteredMapData);
        } else {
            await getData();
        }
    };

    useEffect(() => {
        filterCards();
    }, [filterTags]);

    const getData = async () => {
        setMapData(await fetchData());
    };

    useEffect(() => {
        getData();
    }, []);

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
        scrollableWrapper.style.maxHeight = "60vh"; // Limit height to 60% of the viewport height
        scrollableWrapper.style.overflowY = "auto"; // Enable vertical scrolling
        scrollableWrapper.style.overflowX = "hidden"; // Hide horizontal scrollbar
        scrollableWrapper.style.padding = "4px";

        data.forEach((element: any) => {
            const imageDiv = document.createElement("div");
            const image = document.createElement("img") as HTMLImageElement;
            image.width = 50;
            image.height = 100;
            image.src = process.env.REACT_APP_SERVER_URL + "/public" + element.imageLinks[0].link;
            const imageLink = document.createElement("a");
            imageLink.href = "/cards/" + element.item + "s/" + element._id;
            imageLink.innerHTML = "View " + element.item + " #" + element.number;
            imageLink.classList.add("!text-neutral-foreground");
            imageLink.classList.add("hover:underline");
            imageLink.classList.add("underline-offset-4");
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

    return (
        <div>
            <div className="fixed right-0 w-1/5 z-10">
                <FilterSection>
                    <TagFilter filterOptions={{ withVerticalMargin: true }} setFilterTags={setFilterTags} />
                </FilterSection>
            </div>
            <MapContainer
                className="overflow-hidden col-span-8 z-0"
                center={[0, 0]}
                zoomControl={false}
                zoom={mapConfig.defaultZoom}
                minZoom={mapConfig.minZoom}
                maxZoom={mapConfig.maxZoom}
                scrollWheelZoom={true}
                crs={L.CRS.EPSG3857}>
                <HistoricMap />
                <MarkerClusterGroup
                    chunkedLoading
                    spiderfyOnMaxZoom={false}
                    showCoverageOnHover={true}
                    onClick={handleClusterClick}>
                    {(mapData as any).map((item: any) => {
                        return (
                            <Marker
                                key={item._id}
                                position={[item?.originalLocation.latitude, item?.originalLocation.longitude]}
                                icon={customIcon}>
                                <Popup keepInView autoClose>
                                    <img src={process.env.REACT_APP_SERVER_URL + "/public" + item.imageLinks[0].link} />
                                    <a href={"/cards/postcards/" + item._id}>
                                        <Button variant={"link"}>
                                            View {item.item === "postcard" ? "postcard" : "tradecard"} #{item.number}
                                        </Button>
                                    </a>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
