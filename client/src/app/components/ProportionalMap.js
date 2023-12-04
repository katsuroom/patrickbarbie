import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import * as turf from "@turf/turf";


export default function ProportionalMap(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [buttonAdded, setButtonAdded] = useState(false);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const proportionalRef = useRef(null);
  const markers = useRef([]);
  const workerRef = useRef(null);
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
        var basemap_options = {
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
          // subdomains: "abcd",
          maxZoom: 19,
        };
      mapRef.current = L.map("map-display").setView([0, 0], 2);
      L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png", basemap_options
      ).addTo(mapRef.current);
    }

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }
    if (proportionalRef.current) {
        mapRef.current.removeLayer(proportionalRef.current);
    }
    markers.current.forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    markers.current = [];

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
        //extract geojson data

        const reducedAndCenteredGeoJSON = {
          type: "FeatureCollection",
          features: geoJsonData.features.map((feature) => {
            const { geometry, properties } = feature;

            // Use Turf.js to calculate the center coordinates of the polygon
            const centerOfMass = turf.centerOfMass(feature);
            const centerCoords = centerOfMass.geometry.coordinates;

            // Create a new GeoJSON object with Point geometry
            const centeredGeometry = {
              type: "Point",
              coordinates: centerCoords,
            };

            // Extract only the necessary properties
            const reducedProperties = {
              name: properties.name,
              gdp_md: properties.gdp_md,
              adm0_a3: properties.adm0_a3,
              continent: properties.continent,
            };

            return {
              type: "Feature",
              properties: reducedProperties,
              geometry: centeredGeometry,
            };
          }),
        };

        console.log(reducedAndCenteredGeoJSON);


        console.log(geoJsonData);
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

      // add proportional circles

      proportionalRef.current = L.geoJson(reducedAndCenteredGeoJSON, {
         filter: function (feature) {
           if (feature.properties.name) {
             // This test to see if the key exits
             return feature;
           }
         },
         pointToLayer: function (feature, latlng) {
           // console.log(feature.properties.gdp_md);
           //   console.log(latlng);
           return L.circleMarker(latlng, {
             color: "orange",
             weight: 1,
             fillColor: "yellow",
             fillOpacity: 0.3,
             radius: getRadius(feature.properties.gdp_md),
           });
         },
         onEachFeature: function (feature, layer) {

           var popup =
             "<p><b>" +
             layer.feature.properties.name +
             "</b></p>" +
             "<p>GDP: " +
             layer.feature.properties.gdp_md +
             " </p>";

           layer.on("mouseover", function () {
             layer.bindPopup(popup).openPopup();
             layer.setStyle({
               fillColor: "yellow",
               fillOpacity: 1,
             });
           });

           layer.on("mouseout", function () {
             layer.setStyle({
               fillColor: "yellow",
               fillOpacity: 0.3,
             });
             layer.bindPopup(popup).closePopup();
           });
         },
       }).addTo(mapRef.current);

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

    if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
      return;
    }

   
  }, [geoJsonData, store.label, store.key, store.parsed_CSV_Data]);

  function getRadius(area) {
    var radius = Math.sqrt(area / Math.PI);
    return radius * 0.06;
  }

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
