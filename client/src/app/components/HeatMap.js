import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import StoreContext, { MapType } from "@/store";
import Script from "next/script";

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

export default function Heatmap() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const heatmapOverlayRef = useRef(null);
  const markers = useRef([]);
  const { store } = useContext(StoreContext);
  const [legendVisible, setLegendVisible] = useState(true);
  const legendRef = useRef(null);
  const [isColorInit, setIsColorInit] = useState(false);

  const [defaultLayerAdded, setDefaultLayerAdded] = useState(false);

  const mapLayerRef = useRef(null);
  const hybridLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);
  const darkLayerRef = useRef(null);
  const lightLayerRef = useRef(null);
  const settingLayerRef = useRef(null);

  const [loadScripts, setLoadScripts] = useState(false);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Script load error for ${src}`));
      document.body.appendChild(script);
    });
  };

  if (!loadScripts) {
    Promise.all([
      loadScript("./mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
      loadScript("./mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
    ])
      .then(() => {
        setLoadScripts(true);
        store.setRawMapFile(store.rawMapFile);
        console.log("script loaded");
      })
      .catch((error) => console.error(error));
  }

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

  if (!isColorInit && store.currentMapObject) {
    console.log("color initialized!");
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

  // useEffect(() => {
  //   // const func = async () => {
  //   // if (store.currentMapObject.mapProps) {
  //   //   console.log("store.currentMapObject.mapProps is not null");
  //   //   if (store.currentMapObject.mapProps.minColor) {
  //   //     store.minColor = store.currentMapObject.mapProps.minColor;
  //   //     store.setMinColor(store.currentMapObject.mapProps.minColor);
  //   //   }
  //   //   if (store.currentMapObject.mapProps.maxColor) {
  //   //     store.maxColor = store.currentMapObject.mapProps.maxColor;
  //   //     store.setMaxColor(store.currentMapObject.mapProps.maxColor);
  //   //   }
  //   // } else {
  //   //   console.log("store.currentMapObject.mapProps is null");
  //   //   store.minColor = "#FFFFFF";
  //   //   store.maxColor = "#FF0000";
  //   //   store.setMinColor("#FFFFFF");
  //   //   store.setMaxColor("#FF0000");
  //   // }
  //   // if (legendRef.current) {
  //   //   legendRef.current.remove();
  //   // }
  //   // initColor();
  //   // await func();
  //   // };
  // }, [store.currentMapObject]);

  const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);

  function geoJsonStyle(feature) {
    let fillColor;
    let idx;

    try {
      idx = store.table[store.label].indexOf(feature.properties.name);
    } catch (error) {}

    if (!idx || idx < 0 || !store.table) {
      fillColor = "white";
    } else {
      fillColor = interpolateColor(
        store.minColor ||
          store.currentMapObject.mapProps?.minColor ||
          "#FFFFFF",
        store.maxColor ||
          store.currentMapObject.mapProps?.maxColor ||
          "#FF0000",
        Math.min(...store.table[store.key]),
        Math.max(...store.table[store.key]),
        store.table[store.key][idx]
      );
    }
    return {
      stroke: true,
      color: "black",
      weight: 1,
      fillColor,
      fillOpacity: 0.5,
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
    setDefaultLayerAdded(false);
    if (store.rawMapFile) {
      setGeoJsonData(store.rawMapFile);
    }

    initColor();
  }, [store.rawMapFile]);

  useEffect(() => {
    if (!geoJsonData) {
      return;
    }

    if (!loadScripts) {
      Promise.all([
        loadScript("./mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
        loadScript("./mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
      ])
        .then(() => {
          setLoadScripts(true);
        })
        .catch((error) => console.error(error));
    }

    if (!mapRef.current) {
      var basemap_options = {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        // subdomains: "abcd",
        basemap_options,
        maxZoom: 16,
        zoom: 10,
      };

      mapRef.current = L.map("map-display").setView([0, 0], 2);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"
      ).addTo(mapRef.current);
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
          let labelData = store.getJsonLabels(feature, layer);
          if(!labelData) return;

          const [pos, text] = labelData;

          const label = L.marker(
            pos, {
              icon: L.divIcon({
                className: "countryLabel",
                html: text,
                iconSize: [1000, 0],
                iconAnchor: [0, 0],
              }),
            }
          ).addTo(mapRef.current);
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

    if (mapLayerRef.current) mapRef.current.removeLayer(mapLayerRef.current);
    if (hybridLayerRef.current)
      mapRef.current.removeLayer(hybridLayerRef.current);
    if (satelliteLayerRef.current)
      mapRef.current.removeLayer(satelliteLayerRef.current);
    if (darkLayerRef.current) mapRef.current.removeLayer(darkLayerRef.current);
    if (lightLayerRef.current)
      mapRef.current.removeLayer(lightLayerRef.current);
    if (window.MQ) {
      mapLayerRef.current = window.MQ.mapLayer();
      hybridLayerRef.current = window.MQ.hybridLayer();
      satelliteLayerRef.current = window.MQ.satelliteLayer();
      darkLayerRef.current = window.MQ.darkLayer();
      lightLayerRef.current = window.MQ.lightLayer();
      if (settingLayerRef.current) {
        mapRef.current.removeControl(settingLayerRef.current);
      }
      settingLayerRef.current = L.control.layers({
        Map: mapLayerRef.current,
        Hybrid: hybridLayerRef.current,
        Satellite: satelliteLayerRef.current,
        Dark: darkLayerRef.current,
        Light: lightLayerRef.current,
      });
      settingLayerRef.current.addTo(mapRef.current);

      mapRef.current.on("baselayerchange", function (event) {
        // The 'event' object contains information about the change
        const layerName = event.name; // Name of the selected layer
        const layer = event.layer; // Reference to the selected layer

        if (!store.currentMapObject.mapProps) {
          store.currentMapObject.mapProps = {};
        }
        store.currentMapObject.mapProps.layerName = layerName;

        console.log("Base layer changed to:", layerName);
        console.log("Base layer changed to:", layer);
        console.log(mapRef.current);
        setDefaultLayerAdded(true);
      });

      console.log(defaultLayerAdded);
      console.log(store.currentMapObject);

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

    if (heatmapOverlayRef.current) {
      mapRef.current.removeLayer(heatmapOverlayRef.current);
    }

    

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

    if (!(geoJsonData && store.label && store.key && store.table)) {
      return;
    }

    
    if (legendVisible) {
      console.log("adding legend");

      if (legendRef.current) {
        legendRef.current.remove();
      }

      const legend = L.control({ position: "bottomright" });

      legend.onAdd = function (map) {
        const div = L.DomUtil.create("div", "info legend");

        div.innerHTML +=
          '<div style="background-color:' +
          (store.minColor ||
            store.currentMapObject.mapProps?.minColor ||
            "#FFFFFF") +
          '"> Min: ' +
          Math.min(...store.table[store.key]) +
          "</div> " +
          "<br>";

        div.innerHTML +=
          '<div style="background-color:' +
          (store.maxColor ||
            store.currentMapObject.mapProps?.maxColor ||
            "#FFFFFF") +
          '"> Max: ' +
          Math.max(...store.table[store.key]) +
          "</div> " +
          "<br>";

        return div;
      };

      legend.addTo(mapRef.current);

      legendRef.current = legend;
    }
  }, [
    geoJsonData,
    store.label,
    store.key,
    store.table,
    store.minColor,
    store.maxColor,
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
