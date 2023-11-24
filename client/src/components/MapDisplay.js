import React, { useEffect, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeoJSONDisplay from "./GeoJSONDisplay";
import MUIExportImage from "./Model/MUIExportImage";

import StoreContext from "../store";
import { useState } from "react";

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

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([51.505, -0.09], 2);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }
  });

  return (
    <div style={layoutStyle}>
      <div id="map" style={{ width: "0%", height: 0 }}></div>
      <div id="image-capture-div">
        <MUIExportImage
          open={downloadModalOpen}
          setImageType={setImageType}
          closeModal={() => {
            setDownloadModalOpen(false);
          }}
        />
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
