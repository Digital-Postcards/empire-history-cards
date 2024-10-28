import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Point from '@arcgis/core/geometry/Point';
import Graphic from "@arcgis/core/Graphic";
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster';
import TagFilter from "components/dashboard/tagfilter";
import MapTypeFilter from "components/dashboard/maptypefilter";

const MapViewer = () => {

    const mapDiv = useRef(null);

    useEffect(() => {
        const coordinates = [
            { latitude: 37.7749, longitude: -122.4194 },
            { latitude: 40.7128, longitude: -74.0060 },
            { latitude: 34.0522, longitude: -118.2437 },
            { latitude: 34.0522, longitude: -110.2437 },
            { latitude: 54.0522, longitude: -118.2437 },
            { latitude: 39.0522, longitude: -130.2437 },
            { latitude: 34.0522, longitude: -148.2437 },
            { latitude: 34.0522, longitude: -146.2437 },
            { latitude: 34.0522, longitude: -148.2437 },
            { latitude: 34.0522, longitude: -142.2437 },
            { latitude: 34.0522, longitude: -140.2437 },
            { latitude: 34.0522, longitude: -148.2437 },
        ];
    
        let graphic_arr: any = [];
    
        coordinates.forEach((coordinate) => {
            const point = new Point({
                longitude: coordinate.longitude,
                latitude: coordinate.latitude,
            });
    
            // Add the point to the graphics layer
            graphic_arr.push(new Graphic({
                geometry: point,
                symbol: {
                    // @ts-ignore
                    type: 'simple-fill',
                    color: [226, 119, 40],  // Orange
                }
            }));
        });
    
        const layer = new FeatureLayer({
            source: graphic_arr,
            objectIdField: "wun2r3423i4en",
            featureReduction: new FeatureReductionCluster({
                clusterRadius: "100px",
                clusterMinSize: "24px",
                clusterMaxSize: "60px",
                labelingInfo: [{
                    deconflictionStrategy: "none",
                    labelExpressionInfo: {
                        expression: "Text($feature.cluster_count, '#,###')"
                    },
                    symbol: {
                        type: "text",
                        color: "#004a5d",
                        font: {
                            weight: "bold",
                            size: "12px"
                        }
                    },
                    labelPlacement: "center-center",
                }]
            })
        })

        if (mapDiv.current) {
            /**
             * Initialize application
             */
            const webmap = new Map({
                basemap: "streets"
            });

            const view = new MapView({
                container: mapDiv.current, // The id or node representing the DOM element containing the view.
                map: webmap, // An instance of a Map object to display in the view.
                center: [-117.1490, 32.7353],
                scale: 10000000, // Represents the map scale at the center of the view.,
                constraints:{
                    minZoom: 3
                }
            });

            webmap.add(layer);

            return () => view && view.destroy()
        }
    }, []);

    return (
        <>
            <div className="col-span-8 h-[100vh]" ref={mapDiv}></div>
            <div className="fixed flex flex-col gap-3 right-0 h-full w-1/5 p-4">
                <TagFilter />
                <MapTypeFilter />
            </div>
        </>
        
    )
}

export default MapViewer;