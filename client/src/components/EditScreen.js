import React, { useEffect, useRef, useContext, useState } from "react";
import PPolitical from "./PPolitical";
import MapEditorToolbar from "./MapEditorToolBar";
import PHeatmap from "./PHeatmap";

import MapDisplay from "./MapDisplay";
import StoreContext from "../store";

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
    top: "20%",
    right: "5%",
    paddingBottom: "10%",
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
        {store.currentMapObject?.mapType === "Political Map" ||
        store.currentMapObject?.mapType === "Dot Distribution Map" ||
        store.currentMapObject?.mapType === "Travel Map" ? (
          <PPolitical />
        ) : (
          <PHeatmap />
        )}
      </div>
    </div>
  );
}
