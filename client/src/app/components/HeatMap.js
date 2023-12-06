import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";
import Script from "next/script";
 
function normalize(value, min, max) {
  return (value - min) / (max - min);
}
function interpolateColor(minColor, maxColor, minValue, maxValue, value) {
  // Convert hex colors to RGB format
  const hexToRgb = (hex) => hex.match(/\w\w/g).map((hex) => parseInt(hex, 16));

  const minRGB = hexToRgb(minColor);
  const maxRGB = hexToRgb(maxColor);
  console.log(minRGB, maxRGB, value);

  // Calculate the fraction between the min and max values
  const fraction = (value - minValue) / (maxValue - minValue);

  // Interpolate each RGB component
  const interpolatedRGB = minRGB.map((component, index) =>
    Math.round(component + fraction * (maxRGB[index] - component))
  );

  // Convert back to hex format
  const rgbToHex = (rgb) =>
    rgb
      .map((value) => Math.max(0, Math.min(255, Math.round(value))))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");

  const interpolatedColor = `#${rgbToHex(interpolatedRGB)}`;

  console.log(interpolatedColor);

  return interpolatedColor;
}

export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [buttonAdded, setButtonAdded] = useState(false);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const heatmapOverlayRef = useRef(null);
  const markers = useRef([]);
  const { store } = useContext(StoreContext);
  let downloadComplete = props.downloadComplete;
  // const [downloadComplete, setDownloadComplete] = useState(props.downloadComplete);

  useEffect(() => {
    const resizeListener = () => {
      setMapHeight(window.innerHeight / 2);
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);

  function geoJsonStyle(feature) {
    let fillColor;
    let idx;

    try {
      idx = store.parsed_CSV_Data[store.label].indexOf(feature.properties.name);
    } catch (error) {}

    if (!idx || idx < 0 || !store.parsed_CSV_Data) {
      fillColor = "white";
    } else {
      fillColor = interpolateColor(
        store.minColor,
        store.maxColor,
        Math.min(...store.parsed_CSV_Data[store.key]),
        Math.max(...store.parsed_CSV_Data[store.key]),

        store.parsed_CSV_Data[store.key][idx]
      );
    }
    return {
      stroke: true,
      color: "black",
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
      store.mapType === store.mapTypes.HEATMAP ||
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
