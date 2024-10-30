import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Point from '@arcgis/core/geometry/Point';
import Graphic from "@arcgis/core/Graphic";
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster';
import TagFilter from "components/tagfilter";
import MapTypeFilter from "components/maptypefilter";
import { DUMMY_COORDINATES } from "utils";

const MapViewer = () => {

    const mapDiv = useRef(null);

    const createMapMarkers = (coordinates: any) => {
        let markers: any = [];
        coordinates.forEach((coordinate: any) => {
            const point = new Point({
                longitude: coordinate.longitude,
                latitude: coordinate.latitude,
            });
    
            // Add the point to the graphics layer
            markers.push(new Graphic({
                geometry: point,
                symbol: {
                    // @ts-ignore
                    type: 'simple-fill',
                }
            }));
        });
        return markers;
    }

    const createFeatureLayer = (markers: any) => {
        return new FeatureLayer({
            source: markers,
            objectIdField: "wun2r3423i4en",
            featureReduction: new FeatureReductionCluster({
                clusterRadius: "100px",
                clusterMinSize: "30px",
                clusterMaxSize: "80px",
                labelingInfo: [{
                    deconflictionStrategy: "none",
                    labelExpressionInfo: {
                        expression: "Text($feature.cluster_count, '#,###')"
                    },
                    symbol: {
                        type: "text",
                        color: "white",
                        font: {
                            size: "14px"
                        }
                    },
                    labelPlacement: "center-center",
                }]
            })
        })
    }

    const createMapView = (mapDiv: any, webmap: any) => {
        return new MapView({
            container: mapDiv.current, // The id or node representing the DOM element containing the view.
            map: webmap, // An instance of a Map object to display in the view.
            center: [-117.1490, 32.7353],
            scale: 10000000, // Represents the map scale at the center of the view.,
            constraints:{
                minZoom: 3
            }
        });

    }

    useEffect(() => {
        // perform API call to get coordinates data

        const markers = createMapMarkers(DUMMY_COORDINATES);    
        const layer = createFeatureLayer(markers);

        if (mapDiv.current) {
            const webmap = new Map({
                basemap: "streets"
            });
            const view = createMapView(mapDiv, webmap);
            view.when(() => {
                webmap.add(layer);
            })
            return () => view && view.destroy()
        }
    }, []);

    return (
        <>
            <div className="col-span-8 h-[100vh] overflow-hidden" ref={mapDiv}></div>
            <div className="fixed flex flex-col gap-3 right-0 h-full w-1/5 p-4">
                <TagFilter />
                <MapTypeFilter />
            </div>
        </>
        
    )
}

export default MapViewer;