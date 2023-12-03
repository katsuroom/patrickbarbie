import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";
import Script from "next/script";

function normalize(value, min, max) {
  return (value - min) / (max - min) * 10;
}

export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [buttonAdded, setButtonAdded] = useState(false);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const heatmapOverlayRef = useRef(null);
  const markers = useRef([]);
  const workerRef = useRef(null);
  const { store } = useContext(StoreContext);
  let downloadComplete = props.downloadComplete;
  // const [downloadComplete, setDownloadComplete] = useState(props.downloadComplete);


  useEffect(() => {
    const resizeListener = () => {
      setMapHeight(window.innerHeight / 2);
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  // useEffect(() => {
  //   if (!(store.rawMapFile instanceof File)) {
  //     setGeoJsonData(store.rawMapFile);
  //   } else {
  //     const reader = new FileReader();

  //     if (window.Worker) {
  //       workerRef.current = new Worker("worker.js");
  //     }

  //     reader.onload = function (event) {
  //       const jsonDataString = event.target.result;
  //       workerRef.current.postMessage(jsonDataString);
  //     };

  //     workerRef.current.onmessage = function (event) {
  //       console.log(event.data)
  //       setGeoJsonData(event.data);
  //     };

  //     reader.readAsText(store.rawMapFile);

  //     // Clean up the worker when component unmounts
  //     return () => {
  //       workerRef.current.terminate();
  //     };
  //   }
  // }, []);

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

    if (!geoJsonData ) {
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

    if (heatmapOverlayRef.current) {
      mapRef.current.removeLayer(heatmapOverlayRef.current);
    }

    if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
      return;
    }


    
    if (store.mapType === store.mapTypes.HEATMAP || (store.currentMapObject && store.currentMapObject.mapType === store.mapTypes.HEATMAP)) {
      

     
      let heatMapData = geoJsonData.features.map((feature) => {
        let idx = -1;

        const bounds = L.geoJSON(feature).getBounds();
        const centroid =
          bounds && bounds.isValid() ? bounds.getCenter() : L.latLng(0, 0);

        if (
          !bounds ||
          !bounds.isValid() ||
          !centroid ||
          isNaN(centroid.lat) ||
          isNaN(centroid.lng)
        ) {
          console.error("Invalid bounds or centroid:", bounds, centroid);
          return [0, 0, 0]; // Provide a default value or handle the error accordingly
        }

        const name = feature.properties.name;
        if (!name) {
          return [centroid.lat, centroid.lng, 0];
        }

        try {
          idx = store.parsed_CSV_Data[store.label].indexOf(
            feature.properties.name
          );
        } catch (error) {}

        if (idx < 0) {
          return [centroid.lat, centroid.lng, 0];
        }

        // console.log(store.parsed_CSV_Data);
        // console.log(store.key);

        const intensity = parseFloat(store.parsed_CSV_Data[store.key][idx]);
        // const intensity = normalize(
        //   parseFloat(store.parsed_CSV_Data[store.key][idx]),
        //   Math.min(...store.parsed_CSV_Data[store.key]),
        //   Math.max(...store.parsed_CSV_Data[store.key])
        // );

        return { ...centroid, value: intensity ? intensity : 0 };
      });

      console.log("heatMapData", heatMapData);
      
      heatMapData = heatMapData.filter(item => {
        return item && typeof item === 'object' && item.constructor === Object && item.value;
      })

      console.log("heatMapData", heatMapData);

      heatmapOverlayRef.current = new HeatmapOverlay({
        "useLocalExtrema": false,
        "scaleRadius": true,
        "maxOpacity": .8,
        valueField: 'value',
        radius: 20
      }).addTo(mapRef.current);

      heatmapOverlayRef.current.setData({ data: heatMapData });
    }

  }, [geoJsonData, store.label, store.key, store.parsed_CSV_Data]);

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
      <div id={"map-display"} style={{height: `${mapHeight}px`, margin: '10px' }}></div>
    </div>
  );
}
