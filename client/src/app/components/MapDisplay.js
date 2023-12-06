"use client"

import React, { useRef, useContext } from "react";

import MUIExportImage from "../modals/MUIExportImage";

import StoreContext from "@/store";
import { useState } from "react";

import dynamic from "next/dynamic";

const GeoJSONDisplay = dynamic(() => import('./HeatMap'));
const ProportionalMap = dynamic(() => import('./ProportionalMap'));
const TravelMap = dynamic(() => import("./TravelMaps"));
import "leaflet/dist/leaflet.css";
// import TravelMap from "./TravelMaps";



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
        {store.rawMapFile &&
        store.currentMapObject &&
        store.currentMapObject.mapType ? (
          store.mapType === store.mapTypes.PROPORTIONAL_SYMBOL_MAP ||
          store.currentMapObject.mapType ===
            store.mapTypes.PROPORTIONAL_SYMBOL_MAP ? (
            <ProportionalMap
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
          ) : store.mapType === store.mapTypes.HEATMAP ||
            store.currentMapObject.mapType === store.mapTypes.HEATMAP ? (
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
          ) : store.mapType === store.mapTypes.POLITICAL_MAP ||
            store.currentMapObject.mapType === store.mapTypes.POLITICAL_MAP ? (
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
          ) : store.mapType === store.mapTypes.DOT_DISTRIBUTION_MAP ||
            store.currentMapObject.mapType ===
              store.mapTypes.DOT_DISTRIBUTION_MAP ? (
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
          ) : store.mapType === store.mapTypes.TRAVEL_MAP ||
            store.currentMapObject.mapType === store.mapTypes.TRAVEL_MAP ? (
            <TravelMap
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
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}