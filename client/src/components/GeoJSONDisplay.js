
// GeoJSONDisplay.js

import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from '../store';
import { Button } from "@mui/material";
import html2canvas from 'html2canvas';


export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const markers = useRef([]);
  const workerRef = useRef(null);
  const { store } = useContext(StoreContext);

  useEffect(() => {
    const reader = new FileReader();

    if (window.Worker) {
      console.log("Web worker supported");
      workerRef.current = new Worker("worker.js");
    } else {
      console.log("Web worker not supported");
    }

    reader.onload = function (event) {
      const jsonDataString = event.target.result;
      // Use the web worker for parsing
      workerRef.current.postMessage(jsonDataString);
    };

    workerRef.current.onmessage = function (event) {
      setGeoJsonData(event.data);
    };
    console.log(store.rawMapFile);
    reader.readAsText(store.rawMapFile);

    // Clean up the worker when component unmounts
    return () => {
      workerRef.current.terminate();
    };
  }, [store.rawMapFile]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map-display").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapRef.current);
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
          const label = L.marker([feature.properties.label_y, feature.properties.label_x], {
            icon: L.divIcon({
              className: 'countryLabel',
              html: feature.properties.name,
              iconSize: [1000, 0],
              iconAnchor: [0, 0],
            }),
          }).addTo(mapRef.current);
          markers.current.push(label);
        },
      });

      geoJsonLayerRef.current.addTo(mapRef.current);

      if (geoJsonLayerRef.current) {
        const bounds = geoJsonLayerRef.current.getBounds();
        console.log(bounds);
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds);
        } else {
          console.log('bounds are not valid');
        }
      } else {
        console.log('geoJsonLayerRef.current is undefined or empty');
      }
    }
  }, [geoJsonData, props.mapId]);
  const captureScreenshot = () => {
    let elementToCapture = document.getElementById('image-capture-div');
    if (geoJsonLayerRef.current && geoJsonData) {
      mapRef.current.whenReady(() => {
          html2canvas(elementToCapture, { useCORS: true }).then(canvas => {
            document.body.appendChild(canvas);
          });
      });
    }
  };
  
  

  return (
    <>
    <div id={"map-display"} style={{ width: "60%", height: "300px" }}></div>
    <Button onClick={captureScreenshot}> Capture Screenshot</Button>
    </>

  );
}