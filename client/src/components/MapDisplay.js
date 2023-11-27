import React, { useRef, useContext } from "react";
import "leaflet/dist/leaflet.css";
import GeoJSONDisplay from "./GeoJSONDisplay";
import MUIExportImage from "./Model/MUIExportImage";
import 'leaflet.heat';

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

  return (
    <div style={layoutStyle}>
      <div id="image-capture-div">
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