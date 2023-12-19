import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import "./proportionalMap.css";

export default function JsonDisplay(props) {
    const { store } = useContext(StoreContext);
    const mapRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const markers = useRef([]);

    const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);

    const geoJsonStyle = {
        stroke: true,
        color: "black",
        weight: 1,
        fillColor: "yellow",
        fillOpacity: 0.2,
    };

    useEffect(() => {
      console.log(store.table);
    }, [store.table]);

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
      if (!store.rawMapFile) return;

      // if mapRef is null, add background layer image
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

      // TODO: remove map specific layer
      props.clearLayer(mapRef);

      markers.current.forEach((marker) => {
        mapRef.current.removeLayer(marker);
      });
      markers.current = [];

      // add uploaded geojson layer
      geoJsonLayerRef.current = L.geoJSON(store.rawMapFile, {
        style: geoJsonStyle,
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

      // zoom to fit uploaded geojson data
      if (geoJsonLayerRef.current) {
        const bounds = geoJsonLayerRef.current.getBounds();
        if (bounds.isValid()) mapRef.current.fitBounds(bounds);
        else console.log("bounds are not valid");
      } else console.log("geoJsonLayerRef.current is undefined or empty");

      // TODO: add map specific layer
      props.addLayer(mapRef);
    }, [
      ...props.triggers,
      store.table,
      store.rawMapFile,
      store.label,
      store.key,
      store.parsed_CSV_Data,
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