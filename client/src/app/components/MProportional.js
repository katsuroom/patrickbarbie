import React, { useEffect, useState, useRef, useContext } from "react";
import StoreContext from "@/store";
import L from "leaflet";
import * as turf from "@turf/turf";
import JsonDisplay from "./JsonDisplay";

export default function ProportionalMap() {
  const { store } = useContext(StoreContext);
  const proportionalRef = useRef(null);
  const legendRef = useRef(null);

  useEffect(() => {
    if (store.currentMapObject.mapProps) {
      store.proColor = store.currentMapObject.mapProps.proColor;
      store.setProColor(store.currentMapObject.mapProps.proColor);
      if (store.currentMapObject.mapProps.proportional_value) {
        store.proportional_value = store.currentMapObject.mapProps.proportional_value;
        store.setProportionalValue(store.currentMapObject.mapProps.proportional_value);
      }
    }
  }, [store.currentMapObject]);

  function clearLayer(mapRef) {
    if (proportionalRef.current) {
      mapRef.current.removeLayer(proportionalRef.current);
    }
    if (legendRef.current) {
      mapRef.current.removeControl(legendRef.current);
    }
  }

  function addLayer(mapRef) {
    if (!(store.rawMapFile && store.label && store.key && store.parsed_CSV_Data && store.table)) {
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
        features: store.rawMapFile.features.map((feature) => {
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
            var index = store.table[store.label].indexOf(
              feature.properties[store.currentMapObject.selectedLabel]
            );
            console.log("index", index);
          } catch (error) {
            console.log(error);
          }

          // console.log("matchingCSVEntry", matchingCSVEntry);

          // Extract the value from parsedCSV[store.key]
          let gdp_md = store.table[store.key][index];
          gdp_md = gdp_md === "" ? "NA" : Number(gdp_md);

          // Extract only the necessary properties
          const reducedProperties = {
            name: properties[store.currentMapObject.selectedLabel],
            gdp_md: gdp_md,
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
          if (feature.properties[store.currentMapObject.selectedLabel]) {
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
            layer.feature.properties[store.currentMapObject.selectedLabel] +
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
      if (store.proportional_value !== null && store.proColor !== null) {
        legendRef.current = L.control({ position: "bottomright" });
        legendRef.current.onAdd = function (map) {
          console.log("store.proportional_value", store.proportional_value);
          var div = L.DomUtil.create("div", "info legend"),
            labels = [],
            categories = [
              store.proportional_value[1].toFixed(2),
              (1 / 2) * (store.proportional_value[0] + store.proportional_value[1]).toFixed(2),
              store.proportional_value[0].toFixed(2),
            ];

          // console.log("store.proportional_value", store.proportional_value);
          // console.log("store.proColor", store.proColor);
          // for (var i = 0; i < categories.length; i++) {
          div.innerHTML =
            `<i class="circle1" style="background: ${store.proColor}"></i>
            <div style="text-align: center;">${categories[0]}</div>
            <br>
            <i class="circle2" style="background: ${store.proColor}"></i>
            <div style="text-align: center;">${categories[1]}</div>
            <br>
            <i class="circle3" style="background: ${store.proColor}"></i>
            <div style="text-align: center;">${categories[2]}</div>`
          // }

          return div;
        };
        legendRef.current.addTo(mapRef.current);
      }

      function getRadius(area) {
        // console.log("area", area);
        // console.log("area === NaN", isNaN(area));
        if (isNaN(area) || area === "NA" || area === "") {
          return 0;
        }
        // var radius = Math.sqrt(area / Math.PI);
        // console.log("radius", radius);
        // var sigmoidRadius = sigmoid(radius);

        const validGDPs = reducedAndCenteredGeoJSON.features
          .map((feature) => feature.properties.gdp_md)
          .filter((value) => !isNaN(value));

        const minGDP = Math.min(...validGDPs);
        const maxGDP = Math.max(...validGDPs);

        var proportional = [minGDP, maxGDP];
        store.proportional_value = proportional;
        store.setProportionalValue(proportional);

        // Normalize the GDP value between 0 and 1
        const normalizedGDP = (area - minGDP) / (maxGDP - minGDP);

        // Map the normalized value to the range [0, 70]
        const mappedRadius = normalizedGDP * (70 - 10) + 10;

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
  }

  return (
    <JsonDisplay clearLayer={clearLayer} addLayer={addLayer}/>
  );
}
