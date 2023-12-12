import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import * as turf from "@turf/turf";
import "./proportionalMap.css";


export default function ProportionalMap() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [buttonAdded, setButtonAdded] = useState(false);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const proportionalRef = useRef(null);
  const legendRef = useRef(null);
  const markers = useRef([]);
  const workerRef = useRef(null);
  const { store } = useContext(StoreContext);

  useEffect(() => {
    if (store.currentMapObject.mapProps) {
      console.log("updating");
      if (store.currentMapObject.mapProps.proColor) {
        store.proColor = store.currentMapObject.mapProps.proColor;
        store.setProColor(store.currentMapObject.mapProps.proColor);
      }
      if(store.currentMapObject.mapProps.proportional_value){
        console.log("store.currentMapObject.mapProps.proportional_value", store.currentMapObject.mapProps.proportional_value);
        store.proportional_value = store.currentMapObject.mapProps.proportional_value;
        store.setProportionalValue(store.currentMapObject.mapProps.proportional_value);
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
    if (legendRef.current) {
      mapRef.current.removeControl(legendRef.current);
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

    if (!(geoJsonData && store.label && store.key && store.parsed_CSV_Data)) {
      return;
    } else {
      // console.log("geoJsonData", geoJsonData);
      // console.log("store.label", store.label);
      // console.log("store.key", store.key);
      // console.log("store.parsed_CSV_Data", store.parsed_CSV_Data);
      console.log("store.currentMapObject", store.currentMapObject);
      console.log("store.proColor", store.proColor);

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
            console.log(index);
          } catch (error) {
            console.log(error);
          }

          // console.log("matchingCSVEntry", matchingCSVEntry);

          // Extract the value from parsedCSV[store.key]
          let gdp_md = store.parsed_CSV_Data[store.key][index];
          gdp_md = gdp_md === "" ? "NA" : Number(gdp_md);
          console.log("gdp_md", gdp_md);

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

          // const validGDPs = reducedAndCenteredGeoJSON.features
          // .map((feature) => feature.properties.gdp_md)
          // .filter((value) => !isNaN(value));

          // const minGDP = Math.min(...validGDPs);
          // const maxGDP = Math.max(...validGDPs);
          // console.log("minGDP", minGDP);
          // console.log("maxGDP", maxGDP);
          return L.circleMarker(latlng, {
            color: "orange",
            weight: 1,
            fillColor: store.proColor ? store.proColor : "red",
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
              fillColor: store.proColor ? store.proColor : "red",
              fillOpacity: 1,
            });
          });

          layer.on("mouseout", function () {
            layer.setStyle({
              fillColor: store.proColor ? store.proColor : "red",
              fillOpacity: 0.3,
            });
            layer.bindPopup(popup).closePopup();
          });
        },
      }).addTo(mapRef.current);

      // add legend
      if (store.proportional_value !== null && store.proColor !== null){
        legendRef.current = L.control({ position: "bottomright" });
      legendRef.current.onAdd = function (map) {
        console.log("store.proportional_value", store.proportional_value);
        var div = L.DomUtil.create("div", "info legend"),
          labels = [],
          categories = [
            store.proportional_value[1].toFixed(2),
            (1 / 2) *
              (
                store.proportional_value[0] + store.proportional_value[1]
              ).toFixed(2),
            store.proportional_value[0].toFixed(2),
          ];

        // console.log("store.proportional_value", store.proportional_value);
        // console.log("store.proColor", store.proColor);
        // for (var i = 0; i < categories.length; i++) {
        div.innerHTML =
          '<i class="circle1" style="background: ' +
          store.proColor +
          '"></i>' +
          '<div style="text-align: center;">' +
          categories[0] +
          "</div>" +
          "<br>" +
          '<i class="circle2" style="background: ' +
          store.proColor +
          '"></i>' +
          '<div style="text-align: center;">' +
          categories[1] +
          "</div><br>" +
          '<i class="circle3" style="background: ' +
          store.proColor +
          '"></i>' +
          '<div style="text-align: center;">' +
          categories[2] +
          "</div>";
        // }

        return div;
      };
      legendRef.current.addTo(mapRef.current);
    }

      function getRadius(area) {
        // console.log("area", area);
        // console.log("area === NaN", isNaN(area));
        console.log("store.proportional value: ", store.proportional_value);
        if (isNaN(area) || area === "NA" || area === "") {
          return 0;
        }
        console.log("hereeeeeee");
        // var radius = Math.sqrt(area / Math.PI);
        // console.log("radius", radius);
        // var sigmoidRadius = sigmoid(radius);

        const validGDPs = reducedAndCenteredGeoJSON.features
          .map((feature) => feature.properties.gdp_md)
          .filter((value) => !isNaN(value));

        const minGDP = Math.min(...validGDPs);
        const maxGDP = Math.max(...validGDPs);

        var proportional = [minGDP, maxGDP];
        console.log("proportional", proportional);
        store.proportional_value = proportional;
        store.setProportionalValue(proportional);
        console.log(store.proportional_value);

        // Normalize the GDP value between 0 and 1
        const normalizedGDP = (area - minGDP) / (maxGDP - minGDP);

        // Map the normalized value to the range [0, 70]
        const mappedRadius = normalizedGDP * (70 - 10) + 10;

        console.log("mappedRadius", mappedRadius);
        return mappedRadius;

        // Update maxRadiusArray
        // console.log("area", area);
        // console.log("maxRadiusArray[1]", maxRadiusArray[1]);
        // console.log("area > maxRadiusArray[1]", area > maxRadiusArray[1])
        // if (area > maxRadiusArray[1]) {
        //   setMaxRadiusArray([sigmoidRadius, area]);
        // }

        // // Update minRadiusArray
        // if (area < minRadiusArray[1]) {
        //   setMinRadiusArray([sigmoidRadius, area]);
        // }
      }
    }
  }, [
    geoJsonData,
    store.label,
    store.key,
    store.parsed_CSV_Data,
    store.proColor,
  ]);

  return (
    <div>
      <div
        id={"map-display"}
        style={{ height: `${mapHeight}px`, margin: "10px" }}
      ></div>
    </div>
  );
}
