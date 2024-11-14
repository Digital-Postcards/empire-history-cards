
import { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { LeafletMouseEventHandlerFn, popup } from "leaflet";
import { useApi } from "hooks";
import { FilterSection, Loader } from "components/common";
import logo from "./location.png";
import 'leaflet/dist/leaflet.css';
import ModernMap from './modernmap';
import HistoricMap from './historicmap';
import TagFilter from 'components/tagfilter';
import MapTypeFilter from 'components/maptypefilter';
import { Button } from 'shadcn/components/ui/button';

const customIcon = new L.Icon({
    iconUrl: logo,
    iconSize: new L.Point(30, 30),
})

const LeafletMap = () => {
    const [mapType, setMapType] = useState<string | undefined>("historic");
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const mapConfig = { historic: { defaultZoom: 3, minZoom: 3, maxZoom: 5 }, modern: { defaultZoom: 4, minZoom: 3, maxZoom: 8 } };
    const [mapData, setMapData] = useState([]);

    const {
        error,
        isLoading,
        fetchData
    } = useApi("/map/allcardswithlocation", { method: "GET" });

    const filterCards = async () => {
        if (filterTags.length > 0) {
            const filteredMapData = mapData.filter((data: any) => {
                return (data.themes.filter((x: any) => { return filterTags.includes(x) })).length > 0
            });
            setMapData(filteredMapData)
        } else {
            await getData()
        }
    }

    useEffect(() => {
        filterCards();
    }, [filterTags]);

    const getData = async () => {
        setMapData(await fetchData());
    }

    useEffect(() => {
        getData()
    }, [mapType]);

    if (isLoading)
        return <Loader isFullSize={true} />

    if (!mapData)
        return <p>Failed to fetch map data</p>;

    if (error)
        return <p>Server error</p>

    const getNumberOfCols = (numberOfImages: number) => {
        if (numberOfImages <= 5)    return 2;
        else if (numberOfImages > 5 && numberOfImages <= 15)  return 4;
        else return 5;
    }

    const getWidthOfPopup = (numberOfImages: number) => {
        if (numberOfImages <= 5)    return 36;
        else if (numberOfImages <= 15)  return 64;
        else return 72;
    }

    const buildClusterPopup = (data: any) => {
        const numberOfImages: number = data.length;
        let popupDiv = document.createElement('div');
        popupDiv.classList.add("grid");
        popupDiv.classList.add("grid-cols-" + getNumberOfCols(numberOfImages));
        popupDiv.classList.add("gap-2");
        popupDiv.classList.add("w-" + getWidthOfPopup(numberOfImages));
        data.forEach((element: any) => {
            let imageDiv = document.createElement('div');
            let image = document.createElement('img') as HTMLImageElement;
            image.width = 50;
            image.height = 100;
            image.src = process.env.REACT_APP_SERVER_URL + "/static" + element.imageLinks[0].link;
            let imageLink = document.createElement('a');
            imageLink.href = "/cards/" + element.item + "s/" + element._id;
            imageLink.innerHTML = "View " + element.item + " #" + element.number;
            imageLink.classList.add("!text-neutral-800");
            imageLink.classList.add("hover:underline");
            imageLink.classList.add("underline-offset-4");
            imageDiv.appendChild(image);
            imageDiv.appendChild(imageLink);
            popupDiv.appendChild(imageDiv);
        });
        return popupDiv;
    }

    const handleClusterClick: LeafletMouseEventHandlerFn = (event: any) => {
        let zoom = event.target._zoom;
        if (zoom !== (mapType === "historic" ? mapConfig.historic.maxZoom : mapConfig.modern.maxZoom)) return;
        const childMarkers = event.layer.getAllChildMarkers();
        const childMarkerLatLongs: any = [];
        childMarkers.map((childMarker: any) => {
            childMarkerLatLongs.push({
                latitude: childMarker._latlng.lat,
                longitude: childMarker._latlng.lng
            });
        });
        let childrenData: any = [];
        childMarkerLatLongs.forEach((child: any) => {
            (mapData as any).map((item: any) => {
                if (
                    !childrenData.some((c: any) => c._id === item._id)
                    && child.latitude === item.originalLocation.latitude
                    && child.longitude === item.originalLocation.longitude
                ) {
                    childrenData.push(item)
                }
            })
        });
        let cluster = event.layer;
        cluster.bindPopup(buildClusterPopup(childrenData));
    }

    return (
        <div>
            <div className="fixed right-0 w-1/5 z-10">
                <FilterSection>
                    <MapTypeFilter setMapType={setMapType} />
                    <TagFilter filterOptions={{ withVerticalMargin: true }} setFilterTags={setFilterTags} />
                </FilterSection>
            </div>
            <MapContainer
                className="overflow-hidden col-span-8 z-0"
                center={[0, 0]}
                zoom={mapType === "historic" ? mapConfig.historic.defaultZoom : mapConfig.modern.defaultZoom}
                minZoom={mapType === "historic" ? mapConfig.historic.minZoom : mapConfig.modern.minZoom}
                maxZoom={mapType === "historic" ? mapConfig.historic.maxZoom : mapConfig.modern.maxZoom}
                scrollWheelZoom={true}
                crs={mapType === "historic" ? L.CRS.EPSG3857 : L.CRS.EPSG3857}
            >
                {mapType === "historic" ? (
                    <HistoricMap />
                ) : (
                    <ModernMap />
                )}
                <MarkerClusterGroup
                    chunkedLoading
                    spiderfyOnMaxZoom={false}
                    showCoverageOnHover={true}
                    onClick={handleClusterClick}
                >
                    {
                        (mapData as any).map((item: any) => {
                            return <Marker key={item._id} position={[item?.originalLocation.latitude, item?.originalLocation.longitude]} icon={customIcon}>
                                <Popup
                                    keepInView
                                    autoClose
                                >
                                    <img src={process.env.REACT_APP_SERVER_URL + "/static" + item.imageLinks[0].link} />
                                    <a href={"/cards/postcards/" + item._id}>
                                        <Button variant={"link"}>
                                            View {item.item === "postcard" ? "postcard" : "tradecard"} #{item.number}
                                        </Button>
                                    </a>
                                </Popup>
                            </Marker>
                        })
                    }
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    )
}

export default LeafletMap;