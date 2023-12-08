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
    if (store.currentMapObject.mapProps) {
      console.log("updating");
      if (store.currentMapObject.mapProps.maxColor) {
        store.maxColor = store.currentMapObject.mapProps.maxColor;
        store.setMaxColor(store.currentMapObject.mapProps.maxColor);
      }
    }

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
    if (!geoJsonData) {
      return;
    }

    //add base map
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

    // remove old layers
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

    // add uploaded geojson data
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

    if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
      return;
    } else {
      // console.log("geoJsonData", geoJsonData);
      // console.log("store.label", store.label);
      // console.log("store.key", store.key);
      // console.log("store.parsed_CSV_Data", store.parsed_CSV_Data);
      console.log("store.currentMapObject", store.currentMapObject);
      console.log("store.maxColor", store.maxColor);

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

          try {
            var index = store.parsed_CSV_Data[store.label].indexOf(
              feature.properties.name
            );
          } catch (error) {
            console.log(error);
          }

          // console.log("matchingCSVEntry", matchingCSVEntry);

          // Extract the value from parsedCSV[store.key]
          let gdp_md = store.parsed_CSV_Data[store.key][index];
          gdp_md = gdp_md === "" ? "NA" : Number(gdp_md);

          // console.log("gdp_md", gdp_md);

          // Extract only the necessary properties
          const reducedProperties = {
            name: properties.name,
            gdp_md: gdp_md,
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
            fillColor: store.maxColor ? store.maxColor : "red",
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
              fillColor: store.maxColor ? store.maxColor : "red",
              fillOpacity: 1,
            });
          });

          layer.on("mouseout", function () {
            layer.setStyle({
              fillColor: store.maxColor ? store.maxColor : "red",
              fillOpacity: 0.3,
            });
            layer.bindPopup(popup).closePopup();
          });
        },
      }).addTo(mapRef.current);
    }
  }, [
    geoJsonData,
    store.label,
    store.key,
    store.parsed_CSV_Data,
    store.maxColor,
  ]);

  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  function getRadius(area) {
    if(area === "NA"){
      return 0;
    }
    var radius = Math.sqrt(area / Math.PI);
    var sigmoidRadius = sigmoid(radius) * 40;
    // console.log("sigmoid(radius)", sigmoidRadius);
    return sigmoidRadius;
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
