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

  // const imageStyle = {
  //     width: '65%', // Set the image width to 50%
  //     marginLeft: '1%',
  // };
  return (
    <div>
      <div style={toolbarStyle}>
        <MapEditorToolbar />
      </div>
      <MapDisplay />
      <div style={politicalStyle}>
        <PPolitical />
      </div>
    </div>
  );
}
