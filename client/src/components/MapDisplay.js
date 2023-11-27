import React, { useEffect, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { heatLayer } from 'leaflet.heat';
import GeoJSONDisplay from "./GeoJSONDisplay";
import MUIExportImage from "./Model/MUIExportImage";
import 'leaflet.heat'; 

import StoreContext from "../store";
import { useState } from "react";
import southAmericaData from './south_america (1).json'

export default function MapDisplay() {
  const { store } = useContext(StoreContext);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [imageType, setImageType] = useState(null);

  const mapRef = useRef(null); // To store the map instance

  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "10vh 0",
    boxSizing: "border-box",
  };

  const politicalStyle = {
    width: "30%",
    position: "absolute",
    top: "20%",
    right: "5%",
    paddingBottom: "10%",
  };

  // useEffect(() => {
  //   if (!mapRef.current) {
  //     mapRef.current = L.map("map").setView([51.505, -0.09], 2);
  //     L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       maxZoom: 19,
  //       attribution:
  //         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     }).addTo(mapRef.current);
  //   }
  // });

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([-22.9068, -43.1729], 3);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      // console.log('mapType in display : ' + mapType)
      console.log('store.current.mapType in display : ' + mapRef.current.mapType)
      console.log('store.current.mapType in display : ' + mapRef.current.mapType)

      if (mapRef.current.mapType === 'Heatmap') {
        const heatMapData = southAmericaData.features.map(feature => {
          const centroid = L.geoJSON(feature).getBounds().getCenter();
          const intensity = feature.properties.population; 
          return [centroid.lat, centroid.lng, intensity];
        });

        L.heatLayer(heatMapData, { radius: 25 }).addTo(mapRef.current);
      }
    }
  }, []);


  return (
    <div style={layoutStyle}>
      {/* <div id="map" style={{ height: "100vh" }}></div>  */}
      <div id="map" style={{ width: "0%", height: 0 }}></div>
      <div id="image-capture-div">
        {/* <MUIExportImage
          open={downloadModalOpen}
          setImageType={setImageType}
          closeModal={() => {
            setDownloadModalOpen(false);
          }}
        /> */}
        {downloadModalOpen && (
          <MUIExportImage
            open={downloadModalOpen}
            setImageType={setImageType}
            closeModal={() => {
              setDownloadModalOpen(false);
            }}
          />
        )}
        {store.rawMapFile && (
          <GeoJSONDisplay
            file={store.rawMapFile}
            openModal={() => {
              setDownloadModalOpen(true);
            }}
            imageType={imageType}
            completeDownloadCB={() => {
              setImageType(null);
            }}
            downloadComplete={false}
          />
        )}
      </div>
    </div>
  );
}