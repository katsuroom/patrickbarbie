// // GeoJSONDisplay.js

// import React, { useEffect, useState, useRef, useContext } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import StoreContext from "../store";
// import domtoimage from "dom-to-image";
// import { saveAs } from "file-saver";
// import southAmericaData from "./south_america (1).json";

// function normalize(value, min, max) {
//   return (value - min) / (max - min);
// }

// export default function GeoJSONDisplay(props) {
//   const [geoJsonData, setGeoJsonData] = useState(null);
//   const [buttonAdded, setButtonAdded] = useState(false);
//   const mapRef = useRef(null);
//   const geoJsonLayerRef = useRef(null);
//   const heatLayerRef = useRef(null);
//   const markers = useRef([]);
//   const workerRef = useRef(null);
//   const { store } = useContext(StoreContext);
//   let downloadComplete = props.downloadComplete;
//   // const [downloadComplete, setDownloadComplete] = useState(props.downloadComplete);

//   useEffect(() => {
//     console.log(store.rawMapFile instanceof File);
//     if (!(store.rawMapFile instanceof File)) {
//       console.log("not a file");
//       setGeoJsonData(store.rawMapFile);
//     } else {
//       const reader = new FileReader();

//       if (window.Worker) {
//         console.log("Web worker supported");
//         workerRef.current = new Worker("worker.js");
//       } else {
//         console.log("Web worker not supported");
//       }

//       reader.onload = function (event) {
//         const jsonDataString = event.target.result;
//         // Use the web worker for parsing
//         workerRef.current.postMessage(jsonDataString);
//       };

//       workerRef.current.onmessage = function (event) {
//         setGeoJsonData(event.data);
//       };
//       console.log(store.rawMapFile);
//       reader.readAsText(store.rawMapFile);

//       // Clean up the worker when component unmounts
//       return () => {
//         workerRef.current.terminate();
//       };
//     }
//   }, [store.rawMapFile]);

//   useEffect(() => {
//     if (!geoJsonData) {
//       return;
//     }

//     console.log("store.rawMapFile", store.rawMapFile);
//     if (!mapRef.current) {
//       mapRef.current = L.map("map-display").setView([0, 0], 2);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
//         mapRef.current
//       );
//     }

//     if (store.mapType === "Heatmap") {
//       if (heatLayerRef.current) {
//         mapRef.current.removeLayer(heatLayerRef.current);
//       }
//       const heatMapData = geoJsonData.features.map((feature) => {
//         let idx = -1;

//         const centroid = L.geoJSON(feature).getBounds().getCenter();
//         const name = feature.properties.name;
//         if (!name) {
//           return [centroid.lat, centroid.lng, 0];
//         }

//         try {
//           // console.log(store.label);
//           // console.log("store.parsed_CSV_Data", store.parsed_CSV_Data[store.label])
//           idx = store.parsed_CSV_Data[store.label].indexOf(
//             feature.properties.name
//           );
//         } catch (error) {}

//         if (idx < 0) {
//           return [centroid.lat, centroid.lng, 0];
//         }

//         const intensity = normalize(
//           parseFloat(store.parsed_CSV_Data[store.key][idx]),
//           Math.min(...store.parsed_CSV_Data[store.key]),
//           Math.max(...store.parsed_CSV_Data[store.key])
//         );
//         console.log(name, "intensity", intensity);

//         return [centroid.lat, centroid.lng, intensity ? intensity : 0];
//       });

//       console.log("heatMapData", heatMapData);

//       heatLayerRef.current = L.heatLayer(heatMapData, {
//         radius: 25,
//         gradient: { 0: 'white',
//         0.2: 'blue',
//         0.4: 'green',
//         0.6: 'yellow',
//         0.8: 'orange',
//         1.0: 'red' },
//         // max: 1.0, // Maximum intensity
//         // minOpacity: 0.5, // Minimum opacity
//         // blur: 15, // Amount of blur
//         // maxZoom: 18, // Maximum zoom level
//       }).addTo(mapRef.current);
//     }

//     if (geoJsonLayerRef.current) {
//       mapRef.current.removeLayer(geoJsonLayerRef.current);
//     }
//     markers.current.forEach((marker) => {
//       mapRef.current.removeLayer(marker);
//     });
//     markers.current = [];

//     if (geoJsonData) {
//       console.log(geoJsonData);
//       geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
//         onEachFeature: (feature, layer) => {
//           const label = L.marker(
//             [feature.properties.label_y, feature.properties.label_x],
//             {
//               icon: L.divIcon({
//                 className: "countryLabel",
//                 html: feature.properties.name,
//                 iconSize: [1000, 0],
//                 iconAnchor: [0, 0],
//               }),
//             }
//           ).addTo(mapRef.current);
//           markers.current.push(label);
//         },
//       });

//       geoJsonLayerRef.current.addTo(mapRef.current);

//       if (geoJsonLayerRef.current) {
//         const bounds = geoJsonLayerRef.current.getBounds();
//         console.log(bounds);
//         if (bounds.isValid()) {
//           mapRef.current.fitBounds(bounds);
//         } else {
//           console.log("bounds are not valid");
//         }
//       } else {
//         console.log("geoJsonLayerRef.current is undefined or empty");
//       }
//     }

//     if (!buttonAdded) {
//       const saveImageButton = L.control({ position: "bottomleft" });
//       saveImageButton.onAdd = function () {
//         this._div = L.DomUtil.create("div", "saveImageButton");
//         this._div.innerHTML =
//           '<Button id="saveImageButton" >Save Image</Button>';
//         return this._div;
//       };
//       saveImageButton.addTo(mapRef.current);

//       document
//         .getElementById("saveImageButton")
//         .addEventListener("click", props.openModal);
//       setButtonAdded(true);
//     }
//   }, [geoJsonData, store.label, store.key, store.parsed_CSV_Data]);

//   // useEffect(() => {

//   //   if (!mapRef.current){
//   //     return;
//   //   }

//   //   const saveImageButton = L.control({ position: "bottomleft" });
//   //   saveImageButton.onAdd = function () {
//   //     this._div = L.DomUtil.create("div", "saveImageButton");
//   //     this._div.innerHTML = '<Button id="saveImageButton" >Save Image</Button>';
//   //     return this._div;
//   //   };
//   //   saveImageButton.addTo(mapRef.current);

//   //   document
//   //     .getElementById("saveImageButton")
//   //     .addEventListener("click", props.openModal);
//   // }, []);

//   if (!downloadComplete) {
//     if (props.imageType === "JPEG") {
//       console.log("JEPG");
//       domtoimage
//         .toJpeg(document.getElementById("map-display"), {
//           width: 1400,
//           height: 600,
//           style: {
//             transform: "scale(2)",
//             transformOrigin: "top left",
//             width: "50%",
//             height: "50%",
//           },
//         })
//         .then(function (dataUrl) {
//           saveAs(dataUrl, "map.jpeg");
//         });
//       downloadComplete = true;
//       props.completeDownloadCB();
//     } else if (props.imageType === "PNG") {
//       console.log("PNG");
//       domtoimage
//         .toBlob(document.getElementById("map-display"), {
//           width: 1400,
//           height: 600,
//           style: {
//             transform: "scale(2)",
//             transformOrigin: "top left",
//             width: "50%",
//             height: "50%",
//           },
//         })
//         .then(function (blob) {
//           saveAs(blob, "map.png");
//         });
//       downloadComplete = true;
//       props.completeDownloadCB();
//     }
//   } else {
//     console.log("download already completed!!!");
//   }

//   return (
//     <div id={"map-display"} style={{ width: "60%", height: "300px" }}></div>
//   );
// }

// GeoJSONDisplay.js

import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "../store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import southAmericaData from "./south_america (1).json";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";

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

  useEffect(() => {
    if (!(store.rawMapFile instanceof File)) {
      setGeoJsonData(store.rawMapFile);
    } else {
      const reader = new FileReader();

      if (window.Worker) {
        workerRef.current = new Worker("worker.js");
      }

      reader.onload = function (event) {
        const jsonDataString = event.target.result;
        workerRef.current.postMessage(jsonDataString);
      };

      workerRef.current.onmessage = function (event) {
        console.log(event.data)
        setGeoJsonData(event.data);
      };

      reader.readAsText(store.rawMapFile);

      // Clean up the worker when component unmounts
      return () => {
        workerRef.current.terminate();
      };
    }
  }, []);

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
    if (!geoJsonData) {
      return;
    }

    if (!mapRef.current) {
      mapRef.current = L.map("map-display").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );
    }

    
    if (store.mapType === "Heatmap" && store.parsed_CSV_Data) {
      if (heatmapOverlayRef.current) {
        mapRef.current.removeLayer(heatmapOverlayRef.current);
      }

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

        // const intensity = normalize(
        //   parseFloat(store.parsed_CSV_Data[store.key][idx]),
        //   Math.min(...store.parsed_CSV_Data[store.key]),
        //   Math.max(...store.parsed_CSV_Data[store.key])
        // );

        const intensity = parseFloat(store.parsed_CSV_Data[store.key][idx])

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
    <div id={"map-display"} style={{height: `${mapHeight}px`, margin: '10px' }}></div>
  );
}
