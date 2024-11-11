import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useApi } from "hooks";
import { useEffect } from "react";
import { Loader } from "components/common";
import logo from "./location.png";

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

    return (
        <MapContainer
            className="overflow-hidden col-span-8"
            center={[45.4, -75.7]}
            zoom={8}
            minZoom={4}
            scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup
                chunkedLoading
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={true}
            >
                {
                    (data as any).map((item: any) => {
                        return <Marker position={[item?.originalLocation.latitude, item?.originalLocation.longitude]} icon={customIcon}></Marker> 
                    })
                }
            </MarkerClusterGroup>
        </MapContainer>
    )
}

export default LeafletMap;