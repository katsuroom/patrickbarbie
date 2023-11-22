// GeoJSONDisplay.js

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const markers = useRef([]);
  const workerRef = useRef(null);

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

    reader.readAsText(props.file);

    // Clean up the worker when component unmounts
    return () => {
      workerRef.current.terminate();
    };
  }, [props.file]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map" + props.mapId).setView([0, 0], 2);
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

      const bounds = geoJsonLayerRef.current.getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geoJsonData, props.mapId]);

  useEffect(() => {
    const saveImageButton = L.control({position: 'topleft'});
    saveImageButton.onAdd = function () {
      this._div = L.DomUtil.create('div', 'saveImageButton');
      this._div.innerHTML = '<button id="saveImageButton">Save Image</button>'; 
      return this._div;
    };
    saveImageButton.addTo(mapRef.current);

    document.getElementById('saveImageButton').addEventListener('click', function() {
      domtoimage.toBlob(document.getElementById('map' + props.mapId))
        .then(function (blob) {
          saveAs(blob, 'map.png');
        });
    });
  }, [props.mapId]);

  return (
    <div id={"map" + props.mapId} style={{ width: "100%", height: "600px" }}></div>
  );
}
