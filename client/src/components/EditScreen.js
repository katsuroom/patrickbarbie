import React, { useEffect, useRef, useContext } from "react";
import PPolitical from "./PPolitical";
import MapEditorToolbar from "./MapEditorToolBar";

import MapDisplay from "./MapDisplay";
export default function EditScreen() {
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
      <div style={{width: "65vw"}}>
        <MapDisplay />
      </div>
      <div style={politicalStyle}>
        <PPolitical />
        {/* <PHeatmap /> */}
      </div>
    </div>
  );
}
