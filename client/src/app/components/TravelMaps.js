import React, { useEffect, useState, useRef, useContext } from 'react';
import './travelmap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import StoreContext, { CurrentModal } from "@/store";
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';


const TravelMap = () => {
    const mapRef = useRef(null);
    const routeControlRef = useRef(null);
    const { store } = useContext(StoreContext);
    const geoJsonLayerRef = useRef(null);
    const markers = useRef([]);
    const [loadScripts, setLoadScripts] = useState(false);

    const mapLayerRef = useRef(null);
    const hybridLayerRef = useRef(null);
    const satelliteLayerRef = useRef(null);
    const darkLayerRef = useRef(null);
    const lightLayerRef = useRef(null);
    const settingLayerRef = useRef(null);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [defaultLayerAdded, setDefaultLayerAdded] = useState(false);

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Script load error for ${src}`));
            document.body.appendChild(script);
        });
    };

    const [mapHeight, setMapHeight] = useState(window.innerWidth / 2);
    useEffect(() => {
        const resizeListener = () => {
            setMapHeight(window.innerWidth / 2);
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);

    useEffect(() => {
        setDefaultLayerAdded(false);
        if (store.rawMapFile) {
            setGeoJsonData(store.rawMapFile);
        }
    }, [store.rawMapFile]);

    useEffect(() => {
        if (store.rawMapFile) {
            if (!loadScripts) {
                Promise.all([
                    loadScript("./mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
                    loadScript("./mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC")
                ]).then(() => {
                    setLoadScripts(true);
                }).catch(error => console.error(error));
            }
            refreshMap();
        }
    }, [store.rawMapFile]);



    const refreshMap = () => {
        try {
            console.log('travel map + ' + store.rawMapFile)
            if (!loadScripts || !geoJsonData) {
                return;
            }

            if (!mapRef.current) {
                var mapLayer = window.MQ.mapLayer();
                mapRef.current = L.map('map-display', {
                    layers: [mapLayer],
                    center: [40.731701, -73.993411],
                    zoom: 10,
                });
            }

            if (mapRef.current) {
                try {
                    if (mapLayerRef.current) mapRef.current.removeLayer(mapLayerRef.current);
                    if (hybridLayerRef.current) mapRef.current.removeLayer(hybridLayerRef.current);
                    if (satelliteLayerRef.current) mapRef.current.removeLayer(satelliteLayerRef.current);
                    if (darkLayerRef.current) mapRef.current.removeLayer(darkLayerRef.current);
                    if (lightLayerRef.current) mapRef.current.removeLayer(lightLayerRef.current);
                } catch (removeLayerError) {
                    console.error('Error removing layers:', removeLayerError);
                }
            }

            if (window.MQ) {
                mapLayerRef.current = window.MQ.mapLayer();
                hybridLayerRef.current = window.MQ.hybridLayer();
                satelliteLayerRef.current = window.MQ.satelliteLayer();
                darkLayerRef.current = window.MQ.darkLayer();
                lightLayerRef.current = window.MQ.lightLayer();

                // if (settingLayerRef.current && mapRef.current) {
                //     mapRef.current.removeControl(settingLayerRef.current);
                // }

                // settingLayerRef.current = L.control.layers({
                //     'Map': mapLayerRef.current,
                //     'Hybrid': hybridLayerRef.current,
                //     'Satellite': satelliteLayerRef.current,
                //     'Dark': darkLayerRef.current,
                //     'Light': lightLayerRef.current
                // });

                // settingLayerRef.current.addTo(mapRef.current);

                // mapRef.current.on("baselayerchange", function (event) {
                //     const layerName = event.name; // Name of the selected layer
                //     const layer = event.layer; // Reference to the selected layer

                //     if (!store.currentMapObject.mapProps) {
                //         store.currentMapObject.mapProps = {};
                //     }

                //     store.currentMapObject.mapProps.layerName = layerName;

                //     console.log("Base layer changed to:", layerName);
                //     console.log("Base layer changed to:", layer);
                //     console.log(mapRef.current);
                //     setDefaultLayerAdded(true);
                // });

                if (!defaultLayerAdded && store.currentMapObject.mapProps?.layerName) {
                    console.log("changing layer...");
                    switch (store.currentMapObject.mapProps?.layerName) {
                        case "Map":
                            mapRef.current.addLayer(mapLayerRef.current);
                            break;
                        case "Hybrid":
                            mapRef.current.addLayer(hybridLayerRef.current);
                            break;
                        case "Satellite":
                            mapRef.current.addLayer(satelliteLayerRef.current);
                            break;
                        case "Dark":
                            mapRef.current.addLayer(darkLayerRef.current);
                            break;
                        case "Light":
                            mapRef.current.addLayer(lightLayerRef.current);
                            break;
                        default:
                            break;
                    }
                }
            }

            if (geoJsonLayerRef.current && mapRef.current) {
                try {
                    mapRef.current.removeLayer(geoJsonLayerRef.current);
                } catch (removeLayerError) {
                    console.error('Error removing geoJsonLayer:', removeLayerError);
                }
            }

            markers.current.forEach((marker) => {
                mapRef.current.removeLayer(marker);
            });
            markers.current = [];

            // if (geoJsonData) {
            //     geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
            //         onEachFeature: (feature, layer) => {
            //             let labelData = store.getJsonLabels(feature, layer);
            //             if (!labelData) return;

            //             const [pos, text] = labelData;
            //             const fontWeight = store.bold ? 'bold' : 'normal';
            //             const fontStyle = store.italicize ? 'italic' : 'normal';
            //             const textDecoration = store.underline ? 'underline' : 'none';
            //             const fontFamily = store.fontStyle;

            //             const label = L.marker(
            //                 pos, {
            //                 icon: L.divIcon({
            //                     className: "countryLabel",
            //                     html: `<div style="font-size: ${store.fontSize}px; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration}; font-family: ${fontFamily};">${text}</div>`,
            //                     iconSize: [1000, 0],
            //                     iconAnchor: [0, 0],
            //                 }),
            //                 text: text,
            //             }
            //             ).addTo(mapRef.current);
            //             markers.current.push(label);
            //         },
            //     });

            if (geoJsonData) {
                geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
                    onEachFeature: (feature, layer) => {
                        let labelData = store.getJsonLabels(feature, layer);
                        if (!labelData) return;

                        const [pos, text] = labelData;
                        // Use properties from store.currentMapObject?.mapProps with fallbacks
                        const fontSize = store.currentMapObject?.mapProps?.fontSize || 12;
                        const fontWeight = store.currentMapObject?.mapProps?.bold ? 'bold' : 'normal';
                        const fontStyle = store.currentMapObject?.mapProps?.italicize ? 'italic' : 'normal';
                        const textDecoration = store.currentMapObject?.mapProps?.underline ? 'underline' : 'none';
                        const fontFamily = store.fontStyle;

                        const label = L.marker(
                            pos, {
                            icon: L.divIcon({
                                className: "countryLabel",
                                html: `<div style="font-size: ${fontSize}px; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration}; font-family: ${fontFamily};">${text}</div>`,
                                iconSize: [1000, 0],
                                iconAnchor: [0, 0],
                            }),
                            options: { text: text }, 
                        }).addTo(mapRef.current);

                        markers.current.push(label);
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

            runDirection();

        } catch (error) {
            console.error('Error in refreshing map:', error);
        }
    };


    useEffect(() => {
        refreshMap();
    }, [loadScripts]);

    useEffect(() => {
        store.waypoints = []
        if (store.currentMapObject.mapProps?.waypoints) {
            console.log("store.currentMapObject.mapProps" + store.currentMapObject.mapProps.waypoints)
            store.setWaypoints(store.currentMapObject.mapProps.waypoints)
            runDirection();
        }
    }, [store.currentMapObject]);

    const runDirection = async () => {

        try {
            const startIcon = L.icon({
                iconUrl: "/blue.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });

            const inBetweenIcon = L.icon({
                iconUrl: "/gray.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });

            const endIcon = L.icon({
                iconUrl: "/red.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });

            if (routeControlRef.current && mapRef.current) {
                mapRef.current.removeControl(routeControlRef.current);
            }

            const routingControl = L.Routing.control({
                waypoints: store.waypoints,
                createMarker: function (i, waypoint, n) {
                    const markerIcon = i === 0 ? startIcon : (i > 0 && i < n - 1) ? inBetweenIcon : endIcon;
                    return L.marker(waypoint.latLng, { icon: markerIcon });
                },
                routeWhileDragging: false,
                addWaypoints: false,
            });

            routingControl.on('waypointschanged', function (e) {
                const updatedWaypoints = e.waypoints;
                console.log('Waypoints Updated:', updatedWaypoints);
                store.setWaypoints(updatedWaypoints.map(p => {
                    return p.latLng
                }));
            });

            // Add the routing control to the map
            if (mapRef.current) {
                routingControl.addTo(mapRef.current);
                routeControlRef.current = routingControl;
            }
            // .on('routingstart', showSpinner)
            // .on('routesfound routingerror', hideSpinner)
            // .addTo(mapRef.current);

            routeControlRef.current = routingControl;

        } catch (error) {
            console.error('Error in geocoding or routing:', error);
        }
    };

    return (
        <div>
            <div id={"map-display"} style={{ height: `${mapHeight}px`, margin: '10px' }}></div>
            {/* <div id={"map-display"} style={{ width: "99vw", height: `${mapHeight}px`, margin: '10px' }}></div> */}
            {/* <div id={"loader"} style={{ height: `5px`, margin: '5px' }}></div> */}
        </div>

    );
};

export default TravelMap;