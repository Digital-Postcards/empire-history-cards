import { ImageOverlay } from "react-leaflet";

const HistoricMap = () => {
    return (
        <ImageOverlay
            url="https://upload.wikimedia.org/wikipedia/commons/1/12/World_1910.jpg"
            bounds={[[-70.912, -184.227], [82.774, 184.125]]}
        />
    )
}

export default HistoricMap;