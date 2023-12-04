"use client"

import React, { useEffect, useState, useRef, useContext } from 'react';
import './TravelMap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

// import endIconUrl from './img/red.png';
// import startIconUrl from './img/blue.png';
import StoreContext from "@/store";


const TravelMap = (props) => {
    // const [start, setStart] = useState('');
    // const [end, setEnd] = useState('');
    const mapRef = useRef(null);
    const routeControlRef = useRef(null);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const { store } = useContext(StoreContext);
    const geoJsonLayerRef = useRef(null);
    const markers = useRef([]);
    const [buttonAdded, setButtonAdded] = useState(false);
    const [loadScripts, setLoadScripts] = useState(false);




    const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);
    useEffect(() => {
        const resizeListener = () => {
            setMapHeight(window.innerHeight * 2 / 3);
        };
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);


    useEffect(() => {
        if (store.rawMapFile)
            setGeoJsonData(store.rawMapFile);
    }, [store.rawMapFile]);

    useEffect(() => {
        console.log('travel map + ' + geoJsonData )
        if (!geoJsonData) {
            return;
        }

        if (!mapRef.current) {
            mapRef.current = L.map("map-display").setView([0, 0], 2);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
                mapRef.current
            );
        }
        console.log('L.routing + in mapref + ' + L.routing)

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
                    '<Button id="saveImageButton" >Save Image</Button>';
                return this._div;
            };
            saveImageButton.addTo(mapRef.current);

            document
                .getElementById("saveImageButton")
                .addEventListener("click", props.openModal);
            setButtonAdded(true);
        }
        if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
            return;
        }
        
        setLoadScripts(true)

        // runDirection(store.parsed_CSV_Data[store.label][0], store.parsed_CSV_Data[store.key][0]);

    }, [geoJsonData, store.label, store.key, store.parsed_CSV_Data]);


    useEffect(() => {
        if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
            return;
        }

        for (let i = 0; i < store.parsed_CSV_Data[store.label].length; i++) {

            runDirection(store.parsed_CSV_Data[store.label][i], store.parsed_CSV_Data[store.key][i]);
        }
    }, [store.label, store.key, store.parsed_CSV_Data])


    useEffect(() => {
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve(script);
                script.onerror = () => reject(new Error(`Script load error for ${src}`));
                document.body.appendChild(script);
            });
        };

        if (mapRef.current) {
            mapRef.current.remove();
        }

        loadScript("https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC")
            .then(() => {
                loadScript("https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC")
                    .then(() => {
                        console.log('L.Routing' + L.Routing)
                        mapRef.current = L.map('map-display', {
                            center: [35.791188, -78.636755],
                            zoom: 12,
                            layers: window.MQ.mapLayer()
                        });
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));

        // return () => {
        //     if (mapRef.current) {
        //         mapRef.current.remove();
        //     }
        // };
    }, [loadScripts]);

    const runDirection = async (start, end) => {
        const geocode = async (address) => {
            const url = `https://www.mapquestapi.com/geocoding/v1/address?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC&location=${encodeURIComponent(address)}`;
            const response = await fetch(url);
            const data = await response.json();
            const location = data.results[0].locations[0].latLng;
            return location;
        };

        try {
            const startPoint = await geocode(start);
            const endPoint = await geocode(end);

            const startIcon = L.icon({
                // iconUrl: startIconUrl,
                iconUrl: "/blue.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });

            const endIcon = L.icon({
                // iconUrl: endIconUrl,
                iconUrl: "/red.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });
            console.log('endIcon' + endIcon)

            // if (routeControlRef.current) {
            //     mapRef.current.removeControl(routeControlRef.current);
            // }

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(startPoint.lat, startPoint.lng),
                    L.latLng(endPoint.lat, endPoint.lng)
                ],
                routeWhileDragging: true,
                createMarker: function (i, waypoint, n) {
                    const markerIcon = i === 0 ? startIcon : endIcon;
                    return L.marker(waypoint.latLng, { icon: markerIcon });
                }
            }).addTo(mapRef.current);
            routeControlRef.current = routingControl;

        } catch (error) {
            console.error('Error in geocoding or routing:', error);
        }
    };


    const submitForm = (event) => {
        event.preventDefault();
        // runDirection(start, end);
        setStart('');
        setEnd('');
    };

    return (
        <div>
            {/* <div id='map' style={{ height: '100vh', width: '100%' }}></div> */}
            {/* <div className="formBlock">
                <form id="form" onSubmit={submitForm}>
                    <input type="text" value={start} onChange={e => setStart(e.target.value)} className="input" id="start" placeholder="Choose starting point" />
                    <input type="text" value={end} onChange={e => setEnd(e.target.value)} className="input" id="destination" placeholder="Choose destination point" />
                    <button style={{ display: 'none' }} type="submit">Get Directions</button>
                </form>
            </div> */}
            <div id={"map-display"} style={{ height: `${mapHeight}px`, margin: '10px' }}></div>
        </div>

    );
};

export default TravelMap;
