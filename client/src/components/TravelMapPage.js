

import React, { useEffect, useState, useRef } from 'react';
import './travelmap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import endIconUrl from './img/red.png';
import startIconUrl from './img/blue.png';

const TravelMapPage = () => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const mapRef = useRef(null);
    const routeControlRef = useRef(null);

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

        loadScript("https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC")
            .then(() => {
                loadScript("https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC")
                    .then(() => {
                        console.log('L.Routing: ' + L.Routing)
                        mapRef.current = L.map('map', {
                            center: [35.791188, -78.636755],
                            zoom: 12,
                            layers: window.MQ.mapLayer()
                        });
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

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
                iconUrl: startIconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });

            const endIcon = L.icon({
                iconUrl: endIconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            });

            if (routeControlRef.current) {
                mapRef.current.removeControl(routeControlRef.current);
            }

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
        runDirection(start, end);
        setStart('');
        setEnd('');
    };

    return (
        <div>
            <div id='map' style={{ height: '100vh', width: '100%' }}></div>
            <div className="formBlock">
                <form id="form" onSubmit={submitForm}>
                    <input type="text" value={start} onChange={e => setStart(e.target.value)} className="input" id="start" placeholder="Choose starting point" />
                    <input type="text" value={end} onChange={e => setEnd(e.target.value)} className="input" id="destination" placeholder="Choose destination point" />
                    <button style={{ display: 'none' }} type="submit">Get Directions</button>
                </form>
            </div>
        </div>
    );
};

export default TravelMapPage;
