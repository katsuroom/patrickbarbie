
// GeoJSONDisplay.js

import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from '../store';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';


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
 
  
  
  
  useEffect(() => {
    const saveImageButton = L.control({position: 'bottomright'});
    saveImageButton.onAdd = function () {
      this._div = L.DomUtil.create('div', 'saveImageButton');
      this._div.innerHTML = '<Button id="saveImageButton">Save Image</Button>'; 
      return this._div;
    };
    saveImageButton.addTo(mapRef.current);

    document.getElementById('saveImageButton').addEventListener('click', function() {
      domtoimage.toBlob(document.getElementById('map-display'), {
        width: 1600,
        height: 600,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
          width: "50%",
          height: "50%"
        }
      })
        .then(function (blob) {
          saveAs(blob, 'map.png');
        });
    });
  }, [props.mapId]);


  return (
    <div id={"map-display"} style={{ width: "60%", height: "300px" }}></div>
  );
}