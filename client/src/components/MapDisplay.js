import React, { useRef, useContext } from "react";
import "leaflet/dist/leaflet.css";
import MUIExportImage from "./Model/MUIExportImage";
import GeoJSONDisplay from "./GeoJSONDisplay";
import TravelMapPage from "./TravelMapPage";
import 'leaflet.heat';

import StoreContext from "../store";
import { useState } from "react";

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

  console.log("MapDisplay++++++")
  console.log("store.mapType " + store.mapType)
  console.log("store.rawMapFile " + store.rawMapFile)

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
        {
          store.rawMapFile && store.currentMapObject && (
            store.mapType === store.mapTypes.TRAVEL_MAP ? <TravelMapPage file={store.rawMapFile}
              openModal={() => {
                setDownloadModalOpen(true);
              }}
              imageType={imageType}
              completeDownloadCB={() => {
                setImageType(null);
              }}
              downloadComplete={false} /> :
              store.mapType === store.mapTypes.HEATMAP ?
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
                /> : <><h1>map type no display</h1></>
          )}
      </div>
    </div>
  );
}