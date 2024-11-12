import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { LeafletMouseEventHandlerFn } from "leaflet";
import { useApi } from "hooks";
import { useEffect } from "react";
import { Loader } from "components/common";
import logo from "./location.png";
import { MAX_ZOOM_FOR_MAP } from "utils";

const customIcon = new L.Icon({
    iconUrl: logo,
    iconSize: new L.Point(30, 30),
})

const LeafletMap = () => {
    const {
        data,
        error,
        isLoading,
        fetchData
    } = useApi("/map/allcardswithlocation", { method: "GET" });

    const getData = async () => {
        await fetchData();
    }

    useEffect(() => {
        getData()
    }, []);

    if (isLoading)
        return <Loader isFullSize={true} />
    
    if (!data)
        return <p>Failed to fetch map data</p>;

    if (error)
        return <p>Server error</p>

    const buildClusterPopup = (data: any) => {
        let popupDiv = document.createElement('div');
        let ulDiv = document.createElement('ul');
        popupDiv.appendChild(ulDiv);
        data.forEach((element: any) => {
            let liEl = document.createElement('li');
            liEl.innerHTML = element.number;
            ulDiv.appendChild(liEl);
        });
        return popupDiv;
    }

    const handleClusterClick: LeafletMouseEventHandlerFn = (event: any) => {
        let zoom = event.target._zoom;
        if (zoom !== MAX_ZOOM_FOR_MAP) return;
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
            (data as any).map((item: any) => {
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
        <MapContainer
            className="overflow-hidden col-span-8"
            center={[45.4, -75.7]}
            zoom={8}
            minZoom={4}
            maxZoom={MAX_ZOOM_FOR_MAP}
            scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup
                chunkedLoading
                spiderfyOnMaxZoom={false}
                showCoverageOnHover={true}
                onClick={handleClusterClick}
            >
                {
                    (data as any).map((item: any) => {
                        return <Marker key={item._id} position={[item?.originalLocation.latitude, item?.originalLocation.longitude]} icon={customIcon}>
                            <Popup>
                                {item.number}
                            </Popup>
                        </Marker> 
                    })
                }
            </MarkerClusterGroup>
        </MapContainer>
    )
}

export default LeafletMap;