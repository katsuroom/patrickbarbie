import React, { useEffect, useRef, useContext } from "react";
import StoreContext from "@/store";
import L from "leaflet";
import * as turf from "@turf/turf";
import JsonDisplay from "./JsonDisplay";

export default function DotDistribution() {

  const { store } = useContext(StoreContext);
  const dotDistributionRef = useRef(null);

  useEffect(() => {
    if (store.currentMapObject.mapProps) {
      if (store.currentMapObject.mapProps.dotColor) {
        store.dotColor = store.currentMapObject.mapProps.dotColor;
        store.setDotColor(store.currentMapObject.mapProps.dotColor);
      }
    }
  }, []);

  // remove layer from mapRef
  function clearLayer(mapRef) {
    if (dotDistributionRef.current)
      mapRef.current.removeLayer(dotDistributionRef.current);
  }

  // add layer to mapRef
  function addLayer(mapRef) {
    if (!(store.rawMapFile && store.label && store.parsed_CSV_Data)) {
      console.log("not all data is ready");
      return;
    } else {
      console.log("adding dot distribution layer");
      console.log(store.parsed_CSV_Data[store.label]);

      dotDistributionRef.current = L.layerGroup();

      var keys = Object.keys(store.parsed_CSV_Data);
      keys = keys.filter((key) => key !== store.label);

      console.log(keys);

      try {
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
            fillColor: store.dotColor ? store.dotColor : "black",
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

          for (var i = 0; i < keys.length; i++) {
            text +=
              keys[i] + ": " + store.parsed_CSV_Data[keys[i]][indx] + "<br>";
          }

          console.log(text);

          marker.bindPopup(text);

          dotDistributionRef.current.addLayer(marker);
          // }
        });

        // Add the dotDistributionRef to the map
        dotDistributionRef.current.addTo(mapRef.current);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <JsonDisplay clearLayer={clearLayer} addLayer={addLayer}/>
  );
}