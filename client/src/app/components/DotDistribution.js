import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import * as turf from "@turf/turf";
import "./proportionalMap.css";


export default function DotDistribution(props){
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [buttonAdded, setButtonAdded] = useState(false);
    const mapRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const dotDistributionRef = useRef(null);
    const markers = useRef([]);
    const { store } = useContext(StoreContext);
    let downloadComplete = props.downloadComplete;

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

    useEffect(() => {
      if (store.rawMapFile) setGeoJsonData(store.rawMapFile);
    }, [store.rawMapFile]);

    useEffect(() => {
      if (!geoJsonData) return;

      if (!mapRef.current) {
        var basemap_options = {
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
          // subdomains: "abcd",
          maxZoom: 19,
        };
        mapRef.current = L.map("map-display").setView([0, 0], 2);
        L.tileLayer(
          "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
          basemap_options
        ).addTo(mapRef.current);
      }

      //remove previous layer
      if (geoJsonLayerRef.current) {
        mapRef.current.removeLayer(geoJsonLayerRef.current);
      }

      if (dotDistributionRef.current) {
        mapRef.current.removeLayer(dotDistributionRef.current);
        // dotDistributionRef.current.removeLayer(dotDistributionRef.current);
      }

      markers.current.forEach((marker) => {
        mapRef.current.removeLayer(marker);
      });
      markers.current = [];

      // add uploaded geojson layer
      function geoJsonStyle(feature) {
        return {
          stroke: true,
          color: "black",
          weight: 1,
          fillColor: "yellow",
          fillOpacity: 0.2,
        };
      }

      if (geoJsonData) {
        geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
          style: geoJsonStyle,
          // onEachFeature: (feature, layer) => {
          //   // check if label_y and label_x exist, since they don't exist for KML
          //   if (feature.properties.label_y && feature.properties.label_x) {
          //     const label = L.marker(
          //       [feature.properties.label_y, feature.properties.label_x],
          //       {
          //         icon: L.divIcon({
          //           className: "countryLabel",
          //           html: feature.properties.name,
          //           iconSize: [1000, 0],
          //           iconAnchor: [0, 0],
          //         }),
          //       }
          //     ).addTo(mapRef.current);
          //     markers.current.push(label);
          //   }
          // },
        });

        geoJsonLayerRef.current.addTo(mapRef.current);

        // zoom to fit uploaded geojson data
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

      if (!(geoJsonData && store.label && store.parsed_CSV_Data)) {
        console.log("not all data is ready");
        return;
      }else{
        // add dot distribution layer
        console.log("adding dot distribution layer");
        console.log(store.parsed_CSV_Data[store.label]);

        dotDistributionRef.current = L.layerGroup();

        var keys = Object.keys(store.parsed_CSV_Data);
        keys = keys.filter((key) => key !== store.label);

        console.log(keys);

        try{
        store.parsed_CSV_Data[store.label].forEach((coordinate) => {
          const coordinateArray = JSON.parse(coordinate);
          // const coordinate = [coordinateArray[1], coordinateArray[0]];
          console.log(coordinateArray);
          const point = turf.point(coordinateArray);
          console.log(point);

          // Check if the point is within the GeoJSON polygons
          // let isInside = false;
          // geoJsonData.features.forEach((feature) => {
          //   const polygon = feature.geometry.coordinates;
          //   console.log(polygon);
          //   var poly = turf.polygon(polygon);
          //   console.log(turf.booleanPointInPolygon(point, poly));
          //   if (turf.booleanPointInPolygon(point, poly)) {
          //     console.log("inside");
          //     isInside = true;
          //   }
          // });

          // Only add markers for points inside the GeoJSON polygons
          // if (isInside) {
            // Create a marker with different colors based on whether it's inside or outside
            // const marker = L.marker(coordinate, {
            //   icon: L.divIcon({
            //     className: "custom-marker",
            //     html: "Inside",
            //   }),
            // });
            // mapRef.current.addLayer(marker); // Add the marker to dotDistributionRef

            
            const marker = L.circleMarker(coordinateArray, {
              radius: 5,
              fillColor: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
            });
            
            console.log(JSON.stringify(store.parsed_CSV_Data));
            var indx = store.parsed_CSV_Data[store.label].indexOf(coordinate);
            console.log(indx);

            var text = ""; 

            console.log(keys.length);
            console.log(store.parsed_CSV_Data[keys[0]][indx]);

            for(var i = 0; i < keys.length; i++){
              text += keys[i] + ": " + store.parsed_CSV_Data[keys[i]][indx] + "<br>";
            }

            console.log(text);

            marker.bindPopup(text);
            

            dotDistributionRef.current.addLayer(marker);
          // }
        });

        // Add the dotDistributionRef to the map
        dotDistributionRef.current.addTo(mapRef.current);
      }catch(err){
        console.log(err);
      };


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
        <div
          id={"map-display"}
          style={{ height: `${mapHeight}px`, margin: "10px" }}
        ></div>
      </div>
    );
        
}