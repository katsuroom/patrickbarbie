// GeoJSONDisplay.js

import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "../store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import southAmericaData from './south_america (1).json'


export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const markers = useRef([]);
  // const workerRef = useRef(null);
  const { store } = useContext(StoreContext);
  let downloadComplete = props.downloadComplete;
  // const [downloadComplete, setDownloadComplete] = useState(props.downloadComplete);
  const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);

  useEffect(() => {
    const resizeListener = () => {
      setMapHeight(window.innerHeight / 2);
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  useEffect(() => {
    if(store.rawMapFile)
      setGeoJsonData(store.rawMapFile);
  }, [store.rawMapFile]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map-display").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );
    }

    if (store.mapType === 'Heatmap') {
      console.log("heatmap !! ")
      const heatMapData = southAmericaData.features.map(feature => {
        const centroid = L.geoJSON(feature).getBounds().getCenter();
        const intensity = feature.properties.population;
        return [centroid.lat, centroid.lng, intensity];
      });

      L.heatLayer(heatMapData, { radius: 25 }).addTo(mapRef.current);
    }

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }
    markers.current.forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    markers.current = [];

    if (geoJsonData) {
      console.log(geoJsonData);
      geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
        onEachFeature: (feature, layer) => {

          // check if label_y and label_x exist, since they don't exist for KML
          if(feature.properties.label_y && feature.properties.label_x)
          {
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
        console.log(bounds);
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds);
        } else {
          console.log("bounds are not valid");
        }
      } else {
        console.log("geoJsonLayerRef.current is undefined or empty");
      }
    }
  }, [geoJsonData, props.mapId]);

  useEffect(() => {
    const saveImageButton = L.control({ position: "bottomright" });
    saveImageButton.onAdd = function () {
      this._div = L.DomUtil.create("div", "saveImageButton");
      this._div.innerHTML = '<Button id="saveImageButton" >Save Image</Button>';
      return this._div;
    };
    saveImageButton.addTo(mapRef.current);

    document
      .getElementById("saveImageButton")
      .addEventListener("click", props.openModal);
  }, []);

  if (!downloadComplete) {
    if (props.imageType === "JPEG") {
      console.log("JEPG");
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
      console.log("PNG");
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
    <div id={"map-display"} style={{height: `${mapHeight}px`, margin: '10px' }}></div>
  );
}
