import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import { MapType } from "@/store";
import Script from "next/script";

export default function Politicalmap(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const heatmapOverlayRef = useRef(null);
  const markers = useRef([]);
  const { store } = useContext(StoreContext);
  const [legendVisible, setLegendVisible] = useState(true);
  const legendRef = useRef(null);
  const [isColorInit, setIsColorInit] = useState(false);

  const { categoryColorMappings } = useContext(StoreContext);
  const { selectedAttribute, setSelectedAttribute } = useContext(StoreContext);

  const [defaultLayerAdded, setDefaultLayerAdded] = useState(false);

  const mapLayerRef = useRef(null);
  const hybridLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);
  const darkLayerRef = useRef(null);
  const lightLayerRef = useRef(null);
  const settingLayerRef = useRef(null);

  const [loadScripts, setLoadScripts] = useState(false);

  const initColor = () => {
    store.minColor = store.currentMapObject.mapProps?.minColor || "#FFFFFF";
    store.maxColor = store.currentMapObject.mapProps?.maxColor || "#FF0000";
    store.setMinColor(store.minColor);
    store.setMaxColor(store.maxColor);

    if (!store.currentMapObject.mapProps) {
      store.currentMapObject.mapProps = {};
    }

    if (!store.currentMapObject.mapProps?.categoryColorMappings) {
      console.log("no categoryColorMappings");
      const defaultMappings = {};
      Object.keys(store.parsed_CSV_Data || {}).forEach((attr) => {
        defaultMappings[attr] = "#FFFFFF";
      });
      store.categoryColorMappings = defaultMappings;
    } else {
      console.log("yes categoryColorMappings");
      store.categoryColorMappings =
        store.currentMapObject.mapProps.categoryColorMappings;
    }
    store.updateCategoryColorMappings(store.categoryColorMappings);
    store.currentMapObject.mapProps.categoryColorMappings =
      store.categoryColorMappings;

    // Initialize selectedAttribute
    if (
      !store.currentMapObject.mapProps?.selectedAttribute &&
      store.parsed_CSV_Data
    ) {
      store.selectedAttribute = Object.keys(store.parsed_CSV_Data)[0] || "none";
    } else {
      store.selectedAttribute =
        store.currentMapObject.mapProps?.selectedAttribute || "none";
    }
    store.updateSelectedAttribute(store.selectedAttribute);
    store.currentMapObject.mapProps.selectedAttribute = store.selectedAttribute;

    if (legendRef.current) {
      legendRef.current.remove();
    }
  };

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
  }, [store.currentMapObject, store.parsed_CSV_Data]);

  // useEffect(() => {
  //     console.log("in polticalmap.js")
  //     if (store.selectedAttribute && store.parsed_CSV_Data && store.parsed_CSV_Data[store.selectedAttribute]) {
  //         const uniqueValues = new Set(store.parsed_CSV_Data[store.selectedAttribute]);
  //         const newMapping = {};
  //         uniqueValues.forEach(value => {
  //             newMapping[value] = '#ffffff';
  //         });
  //         store.updateCategoryColorMappings(newMapping);
  //         store.currentMapObject.mapProps.categoryColorMappings = store.categoryColorMappings;
  //         // store.currentMapObject.mapProps.selectedAttribute = store.selectedAttribute;

  //     }
  // }, [store.selectedAttribute, store.parsed_CSV_Data]);

  const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);

  function geoJsonStyle(feature) {
    let fillColor = "white";
    let geoUnit = store.parsed_CSV_Data
      ? Object.keys(store.parsed_CSV_Data)[0]
      : null;

    if (
      geoUnit &&
      store.parsed_CSV_Data[geoUnit] &&
      store.selectedAttribute &&
      store.parsed_CSV_Data[store.selectedAttribute]
    ) {
      const geoUnitIndex = store.parsed_CSV_Data[geoUnit].indexOf(
        feature.properties.name
      );

      if (geoUnitIndex !== -1) {
        const attributeValue =
          store.parsed_CSV_Data[store.selectedAttribute][geoUnitIndex];

        if (
          attributeValue &&
          store.categoryColorMappings.hasOwnProperty(attributeValue)
        ) {
          fillColor = store.categoryColorMappings[attributeValue];
        }
      }
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
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle(geoJsonStyle);
    }
  }, [store.selectedAttribute, store.categoryColorMappings]);

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
        // onEachFeature: (feature, layer) => {
        //     // check if label_y and label_x exist, since they don't exist for KML
        //     if (feature.properties.label_y && feature.properties.label_x) {
        //         const label = L.marker(
        //             [feature.properties.label_y, feature.properties.label_x],
        //             {
        //                 icon: L.divIcon({
        //                     className: "countryLabel",
        //                     html: feature.properties.name,
        //                     iconSize: [1000, 0],
        //                     iconAnchor: [0, 0],
        //                 }),
        //             }
        //         ).addTo(mapRef.current);
        //         markers.current.push(label);
        //     }
        // },
        onEachFeature: (feature, layer) => {
          let labelData = store.getJsonLabels(feature, layer);
          if (!labelData) return;

          const [pos, text] = labelData;

          const label = L.marker(pos, {
            icon: L.divIcon({
              className: "countryLabel",
              html: `<div style="font-size: 30px;">${text}</div>`,
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
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds);
        } else {
          console.log("bounds are not valid");
        }
      } else {
        console.log("geoJsonLayerRef.current is undefined or empty");
      }
    }

    if (heatmapOverlayRef.current) {
      mapRef.current.removeLayer(heatmapOverlayRef.current);
    }

    if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
      return;
    }

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

    if (store.currentMapObject?.mapType === MapType.POLITICAL_MAP) {
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

      if (legendVisible) {
        console.log("adding legend");

        if (legendRef.current) {
          legendRef.current.remove();
        }

        const legend = L.control({ position: "bottomleft" });

        legend.onAdd = function (map) {
          const div = L.DomUtil.create("div", "info legend");
          div.style.maxHeight = "300px"; // Increase maximum height
          div.style.overflowY = "scroll"; // Force scrollbar to always show

          // loop through our density intervals and generate a label with a colored square for each interval
          for (let attribute in store.categoryColorMappings) {
            div.innerHTML +=
              '<div style="background-color:' +
              store.categoryColorMappings[attribute] +
              '; height: 10px; font-size: 10px; margin: 2px 0;"> ' + // Reduce height, font size, and margin
              attribute +
              "</div>";
          }

          return div;
        };

        legend.addTo(mapRef.current);

        legendRef.current = legend;
      }
    }
  }, [
    geoJsonData,
    store.label,
    store.key,
    store.parsed_CSV_Data,
    store.minColor,
    store.maxColor,
    store.selectedAttribute,
    store.categoryColorMappings,
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