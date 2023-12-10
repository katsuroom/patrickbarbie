import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";
import Script from "next/script";


export default function Politicalmap(props) {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [buttonAdded, setButtonAdded] = useState(false);
    const mapRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const heatmapOverlayRef = useRef(null);
    const markers = useRef([]);
    const { store } = useContext(StoreContext);
    let downloadComplete = props.downloadComplete;
    const [legendVisible, setLegendVisible] = useState(true);
    const legendRef = useRef(null);
    const [isColorInit, setIsColorInit] = useState(false);

    // const [downloadComplete, setDownloadComplete] = useState(props.downloadComplete);

    const initColor = () => {
        if (store.currentMapObject.mapProps) {
            console.log("store.currentMapObject.mapProps is not null");

            if (store.currentMapObject.mapProps.minColor) {
                store.minColor = store.currentMapObject.mapProps.minColor;
                store.setMinColor(store.currentMapObject.mapProps.minColor);
            }
            if (store.currentMapObject.mapProps.maxColor) {
                store.maxColor = store.currentMapObject.mapProps.maxColor;
                store.setMaxColor(store.currentMapObject.mapProps.maxColor);
            }
        } else {
            console.log("store.currentMapObject.mapProps is null");
            store.minColor = "#FFFFFF";
            store.maxColor = "#FF0000";
            store.setMinColor("#FFFFFF");
            store.setMaxColor("#FF0000");
        }

        if (legendRef.current) {
            legendRef.current.remove();
        }
    };

    if (!isColorInit) {
        if (store.currentMapObject.mapProps) {
            console.log("store.currentMapObject.mapProps is not null");

            if (store.currentMapObject.mapProps.minColor) {
                store.minColor = store.currentMapObject.mapProps.minColor;
            }
            if (store.currentMapObject.mapProps.maxColor) {
                store.maxColor = store.currentMapObject.mapProps.maxColor;
            }
        } else {
            console.log("store.currentMapObject.mapProps is null");
            store.minColor = "#FFFFFF";
            store.maxColor = "#FF0000";
        }

        setIsColorInit(true);

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

        initColor();

    }, [store.currentMapObject]);

    const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);








    // function geoJsonStyle(feature) {
    //     let fillColor = "white"; // Default color
    
    //     // Make sure categoryColorMappings is defined and is an array
    //     if (Array.isArray(props.categoryColorMappings)) {
    //         // Assume store.parsed_CSV_Data maps countries to categories
    //         const countryCategory = store.parsed_CSV_Data && store.parsed_CSV_Data.find(data => data.country === feature.properties.name)?.category;
    //         const categoryMapping = props.categoryColorMappings.find(m => m.category === countryCategory);
    
    //         if (categoryMapping) {
    //             fillColor = categoryMapping.color; // Set color based on category
    //         }
    //     }
    
    //     return {
    //         stroke: true,
    //         color: "black",
    //         weight: 1,
    //         fillColor,
    //         fillOpacity: 1,
    //     };
    // }
    


    function geoJsonStyle(feature) {
        let fillColor = 'white'; // Default color
    
        if (props.attributeColorMapping && selectedAttribute) {
            const featureValue = feature.properties[selectedAttribute];
            fillColor = props.attributeColorMapping[featureValue] || 'white';
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

        if (!buttonAdded) {
            const saveImageButton = L.control({ position: "bottomleft" });
            saveImageButton.onAdd = function () {
                this._div = L.DomUtil.create("div", "saveImageButton");
                this._div.innerHTML =
                    '<Button id="saveImageButton" data-cy="save-image-button">Save Image</Button>';
                return this._div;
            };
            saveImageButton.addTo(mapRef.current);

            document
                .getElementById("saveImageButton")
                .addEventListener("click", props.openModal);
            setButtonAdded(true);
        }

        if (heatmapOverlayRef.current) {
            mapRef.current.removeLayer(heatmapOverlayRef.current);
        }

        if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
            return;
        }

        if (
            store.mapType === store.mapTypes.POLITICAL_MAP ||
            (store.currentMapObject &&
                store.currentMapObject.mapType === store.mapTypes.HEATMAP)
        ) {
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
            //   if (legendVisible) {
            //     if (legendRef.current) {
            //       legendRef.current.remove();
            //     }

            //     const legend = L.control({ position: "bottomright" });

            //     legend.onAdd = function (map) {
            //       const div = L.DomUtil.create("div", "info legend");

            //       (div.innerHTML +=
            //         '<div style="background-color:' +
            //         store.minColor +
            //         '"> Min: ' +
            //         Math.min(...store.parsed_CSV_Data[store.key])),
            //         +"</div> " + "<br>";

            //       (div.innerHTML +=
            //         '<div style="background-color:' +
            //         store.maxColor +
            //         '"> Max: ' +
            //         Math.max(...store.parsed_CSV_Data[store.key])),
            //         +"</div> " + "<br>";

            //       return div;
            //     };

            //     legend.addTo(mapRef.current);

            //     legendRef.current = legend;
            //   }

            //   L.easyPrint({
            //     title: 'Save my map',
            //     position: 'topleft',
            //     sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
            //     filename: 'myMap',
            //     exportOnly: true,
            //     hideControlContainer: true
            // }).addTo(mapRef.current);
        }
    }, [
        geoJsonData,
        store.label,
        store.key,
        store.parsed_CSV_Data,
        store.minColor,
        store.maxColor,
    ]);

    if (!downloadComplete) {
        if (props.imageType === "JPEG") {
            domtoimage
                .toJpeg(document.getElementById("map-display"), {
                    width: 1400,
                    height: 600,
                    style: {
                        transform: "scale(2)",
                        transformOrigin: "top left",
                        width: "50%",
                        height: "50%",
                    },
                })
                .then(function (dataUrl) {
                    saveAs(dataUrl, "map.jpeg");
                });
            downloadComplete = true;
            props.completeDownloadCB();
        } else if (props.imageType === "PNG") {
            domtoimage
                .toBlob(document.getElementById("map-display"), {
                    width: 1400,
                    height: 600,
                    style: {
                        transform: "scale(2)",
                        transformOrigin: "top left",
                        width: "50%",
                        height: "50%",
                    },
                })
                .then(function (blob) {
                    saveAs(blob, "map.png");
                });
            downloadComplete = true;
            props.completeDownloadCB();
        }
    } else {
        console.log("download already completed!!!");
    }

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