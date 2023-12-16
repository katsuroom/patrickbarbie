import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import { MapType } from "@/store";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";
import Script from "next/script";


export default function Politicalmap(props) {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const mapRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const heatmapOverlayRef = useRef(null);
    const markers = useRef([]);
    const { store } = useContext(StoreContext);
    const [legendVisible, setLegendVisible] = useState(true);
    const legendRef = useRef(null);
    const [isColorInit, setIsColorInit] = useState(false);

    const { categoryColorMappings } = useContext(StoreContext);
    const { selectedAttribute, setSelectedAttribute } = useContext(StoreContext);


    const initColor = () => {
        // Initialize minColor and maxColor
        store.minColor = store.currentMapObject.mapProps?.minColor || "#FFFFFF";
        store.maxColor = store.currentMapObject.mapProps?.maxColor || "#FF0000";
        store.setMinColor(store.minColor);
        store.setMaxColor(store.maxColor);

        // // Initialize categoryColorMappings
        // if (store.currentMapObject.mapProps?.categoryColorMappings) {
        //     store.categoryColorMappings = store.currentMapObject.mapProps.categoryColorMappings;
        // } else {
        //     // Default to white for all categories if not provided
        //     store.categoryColorMappings = {};
        //     Object.keys(store.parsed_CSV_Data || {}).forEach(attr => {
        //         store.categoryColorMappings[attr] = '#FFFFFF';
        //     });
        // }
        // store.updateCategoryColorMappings(store.categoryColorMappings);

        // // Initialize selectedAttribute
        // store.selectedAttribute = store.currentMapObject.mapProps?.selectedAttribute || Object.keys(store.parsed_CSV_Data 3|| {})[0] || 'none';
        // store.updateSelectedAttribute(store.selectedAttribute);
        // Initialize categoryColorMappings
        if (!store.currentMapObject.mapProps?.categoryColorMappings) {
            console.log("no categoryColorMappings");
            const defaultMappings = {};
            Object.keys(store.parsed_CSV_Data || {}).forEach(attr => {
                defaultMappings[attr] = '#FFFFFF'; // Set each category to white
            });
            store.categoryColorMappings = defaultMappings;
        } else {
            console.log("categoryColorMappings");
            store.categoryColorMappings = store.currentMapObject.mapProps.categoryColorMappings;
        }
        store.updateCategoryColorMappings(store.categoryColorMappings);

        // Initialize selectedAttribute
        if (!store.currentMapObject.mapProps?.selectedAttribute && store.parsed_CSV_Data) {
            store.selectedAttribute = Object.keys(store.parsed_CSV_Data)[0] || 'none';
        } else {
            store.selectedAttribute = store.currentMapObject.mapProps?.selectedAttribute || 'none';
        }
        store.updateSelectedAttribute(store.selectedAttribute);

        if (legendRef.current) {
            legendRef.current.remove();
        }
    };

    useEffect(() => {
        const resizeListener = () => {
            setMapHeight(window.innerHeight / 2);
        };
        window.addEventListener("resize", resizeListener);
        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    }, []);

    useEffect(() => {
        initColor();
    }, [store.currentMapObject, store.parsed_CSV_Data]);

    useEffect(() => {
        if (store.selectedAttribute && store.parsed_CSV_Data && store.parsed_CSV_Data[store.selectedAttribute]) {
            const uniqueValues = new Set(store.parsed_CSV_Data[store.selectedAttribute]);
            const newMapping = {};
            uniqueValues.forEach(value => {
                newMapping[value] = '#ffffff';
            });
            store.updateCategoryColorMappings(newMapping);
        }
    }, [store.selectedAttribute, store.parsed_CSV_Data]);

    const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);

    function geoJsonStyle(feature) {
        let fillColor = 'white';

        if (store.parsed_CSV_Data && store.categoryColorMappings && store.selectedAttribute) {
            const countryIndex = store.parsed_CSV_Data.Country.indexOf(feature.properties.name);

            if (countryIndex !== -1) {
                const attributeValue = store.parsed_CSV_Data[store.selectedAttribute][countryIndex];

                if (attributeValue && store.categoryColorMappings.hasOwnProperty(attributeValue)) {
                    fillColor = store.categoryColorMappings[attributeValue];
                }
            }
        }

        return {
            stroke: true,
            color: 'black',
            weight: 1,
            fillColor,
            fillOpacity: 1,
        };
    }


    useEffect(() => {
        const resizeListener = () => {
            setMapHeight(window.innerHeight / 2);
        };
        window.addEventListener("resize", resizeListener);
        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    }, []);

    useEffect(() => {
        if (store.rawMapFile) setGeoJsonData(store.rawMapFile);
    }, [store.rawMapFile]);

    useEffect(() => {
        if (geoJsonLayerRef.current) {
            geoJsonLayerRef.current.setStyle(geoJsonStyle);
        }
    }, [store.selectedAttribute, store.categoryColorMappings]);

    useEffect(() => {


        if (!geoJsonData) {
            return;
        }

        if (!mapRef.current) {
            mapRef.current = L.map("map-display").setView([0, 0], 2);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
                mapRef.current
            );
        }

        if (geoJsonLayerRef.current) {
            mapRef.current.removeLayer(geoJsonLayerRef.current);
        }
        markers.current.forEach((marker) => {
            mapRef.current.removeLayer(marker);
        });
        markers.current = [];

        if (geoJsonData) {
            geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
                onEachFeature: (feature, layer) => {
                    // check if label_y and label_x exist, since they don't exist for KML
                    if (feature.properties.label_y && feature.properties.label_x) {
                        const label = L.marker(
                            [feature.properties.label_y, feature.properties.label_x],
                            {
                                icon: L.divIcon({
                                    className: "countryLabel",
                                    html: feature.properties.name,
                                    iconSize: [1000, 0],
                                    iconAnchor: [0, 0],
                                }),
                            }
                        ).addTo(mapRef.current);
                        markers.current.push(label);
                    }
                },
            });

            geoJsonLayerRef.current.addTo(mapRef.current);

            if (geoJsonLayerRef.current) {
                const bounds = geoJsonLayerRef.current.getBounds();
                if (bounds.isValid()) {
                    mapRef.current.fitBounds(bounds);
                } else {
                    console.log("bounds are not valid");
                }
            } else {
                console.log("geoJsonLayerRef.current is undefined or empty");
            }
        }



        if (heatmapOverlayRef.current) {
            mapRef.current.removeLayer(heatmapOverlayRef.current);
        }

        if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
            return;
        }

        if (store.currentMapObject?.mapType === MapType.POLITICAL_MAP) {
            heatmapOverlayRef.current = L.geoJSON(geoJsonData, {
                style: geoJsonStyle,
                onEachFeature: (feature, layer) => {
                    layer.on({
                        mouseover: function (e) {
                            console.log(e.target);
                            e.target.setStyle({
                                weight: 10,
                                // color: "black"
                            });
                        },
                        mouseout: function (e) {
                            e.target.setStyle({
                                weight: 2,
                                // color: "light blue"
                            });
                        },
                        click: function (e) {
                            console.log("Layer clicked!");
                        },
                    });
                },
            });

            heatmapOverlayRef.current.addTo(mapRef.current);
            // if (legendVisible) {
            //     if (legendRef.current) {
            //         legendRef.current.remove();
            //     }

            //     const legend = L.control({ position: "bottomright" });

            //     legend.onAdd = function (map) {
            //         const div = L.DomUtil.create("div", "info legend");

            //         (div.innerHTML +=
            //             '<div style="background-color:' +
            //             store.minColor +
            //             '"> Min: ' +
            //             Math.min(...store.parsed_CSV_Data[store.key])),
            //             +"</div> " + "<br>";

            //         (div.innerHTML +=
            //             '<div style="background-color:' +
            //             store.maxColor +
            //             '"> Max: ' +
            //             Math.max(...store.parsed_CSV_Data[store.key])),
            //             +"</div> " + "<br>";

            //         return div;
            //     };

            //     legend.addTo(mapRef.current);

            //     legendRef.current = legend;
            // }

            // L.easyPrint({
            //     title: 'Save my map',
            //     position: 'topleft',
            //     sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
            //     filename: 'myMap',
            //     exportOnly: true,
            //     hideControlContainer: true
            // }).addTo(mapRef.current);
        }
    },

        [
            geoJsonData,
            store.label,
            store.key,
            store.parsed_CSV_Data,
            store.minColor,
            store.maxColor,
            store.selectedAttribute,
            store.categoryColorMappings,
        ]);

    return (
        <div>
            <Script src="https://cdn.jsdelivr.net/npm/heatmapjs@2.0.2/heatmap.js"></Script>
            <Script src="https://cdn.jsdelivr.net/npm/leaflet-heatmap@1.0.0/leaflet-heatmap.js"></Script>

            <div
                id={"map-display"}
                style={{ height: `${mapHeight}px`, margin: "10px" }}
            ></div>
        </div>
    );
}
