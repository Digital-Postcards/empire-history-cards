
import { TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const ModernMap = () => {
    return (
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
    )
}

export default ModernMap;