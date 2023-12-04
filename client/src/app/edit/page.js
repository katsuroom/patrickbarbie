"use client"

import React, { useEffect, useContext } from "react";
import MapEditorToolbar from "../components/MapEditorToolBar";
import PHeatmap from "../components/PHeatmap";

import MapDisplay from "../components/MapDisplay";
import StoreContext from "@/store";
import PTravelMap from "../components/PTravelMap";
import PPolitical from "../components/PPolitical";

export default function EditScreen() {
  const { store } = useContext(StoreContext);


  useEffect(() => {
    console.log("currentMapObject", store.currentMapObject?.mapType);
    const func = async () => {

        // clear CSV fields
       
        store.setParsedCsvData(null);
        store.setCsvKey(null);
        store.setCsvLabel(null);

      if (store.currentMapObject && store.currentMapObject.csvData) {
        const csvObj = await store.getCsvById(store.currentMapObject.csvData);
        
        console.log(csvObj);
        
        store.setParsedCsvData(csvObj.csvData);
        store.setCsvKey(csvObj.key);
        store.setCsvLabel(csvObj.label);
      }
    };
    func();
  }, [store.currentMapObject]);


  const politicalStyle = {
    width: "30%",
    position: "absolute",
    top: "10%",
    right: "5%",
    maxHeight: "10vh"
  };

  const toolbarStyle = {
    justifyContent: "center",
    display: "flex",
    width: "30%",
    margin: "0",
    marginLeft: "18%",
  };

  return (
    <div>
      <div style={toolbarStyle}>
        <MapEditorToolbar />
      </div>
      <div style={{ width: "65vw" }}>
        <MapDisplay />
      </div>
      <div style={politicalStyle}>
        {/* {store.currentMapObject?.mapType === "Political Map" ||
        store.currentMapObject?.mapType === "Dot Distribution Map" ||
        store.currentMapObject?.mapType === "Travel Map" ? (
          <PPolitical />
        ) : (
          <PHeatmap />
        )} */}

        {store.mapType === store.mapTypes.POLITICAL_MAP || store.currentMapObject?.mapType === store.mapTypes.POLITICAL_MAP ? <PPolitical /> : null}
        {store.mapType === store.mapTypes.TRAVEL_MAP || store.currentMapObject?.mapType === store.mapTypes.TRAVEL_MAP ? <PTravelMap /> : null}
        {store.mapType === store.mapTypes.HEATMAP || store.currentMapObject?.mapType === store.mapTypes.HEATMAP ? <PHeatmap /> : null}
      </div>
    </div>
  );
}