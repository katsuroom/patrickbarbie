"use client"

import React, { useRef, useContext } from "react";

import MUIExportImage from "../modals/MUIExportImage";

import StoreContext from "@/store";
import { useState } from "react";

import dynamic from "next/dynamic";

const GeoJSONDisplay = dynamic(() => import('./GeoJSONDisplay'));
import "leaflet/dist/leaflet.css";

export default function MapDisplay() {
  const { store } = useContext(StoreContext);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [imageType, setImageType] = useState(null);

  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    justifyContent: "center",
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