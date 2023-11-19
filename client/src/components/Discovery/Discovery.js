// Import necessary modules
import React, { useState } from "react";
// import "./stylesheet.css";
import GeoJSONDisplay from "./GeoJSONDisplay";
// import KeyholeDisplay from "./handleKeyhole";
// import ShapefileDisplay from "./handleShapefile";
import "leaflet/dist/leaflet.css";

// Define supported file types
const SUPPORTED_TYPES = {
  "shp": "Shapefile",
  "zip": "Shapefile",
  "json": "GeoJSON",
  "kml": "KML",
  "kmz": "KML",
};

// Initial state
const INITIAL_STATE = {
  file: null,
  type: "",
  mapId: 0,
};

// Main component
function Discovery() {
  // State and handleChange function
  const [state, setState] = useState(INITIAL_STATE);

  function handleChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      let ext = file.name.split(".").pop();
      if (!SUPPORTED_TYPES.hasOwnProperty(ext)) {
        alert("FILE TYPE NOT SUPPORTED!");
      }
      let type = SUPPORTED_TYPES[ext];

      if (type) {
        setState({
          ...state,
          file,
          type,
          mapId: state.mapId + 1,
        });
      }
    } else {
      setState({
        ...state,
        file: null,
      });
    }
  }

  // Render the component
  return (
    <div className="discovery-container">
      <h1>File Discovery</h1>
      <p>
        Browse for <b>Shapefile</b>, <b>GeoJSON</b>, or <b>Keyhole (KML)</b> file:
      </p>
      <input
        type="file"
        accept={Object.keys(SUPPORTED_TYPES).reduce(
          (acc, current) => acc + "." + current + ",",
          ""
        )}
        onChange={handleChange}
      />
      {state.file ? (
        <div className="file-details">
          <p>Type: {state.type}</p>
          {state.type === "GeoJSON" && <GeoJSONDisplay file={state.file} mapId={state.mapId} />}
          {/* {state.type === "KML" && <KeyholeDisplay file={state.file} mapId={state.mapId} />}
          {state.type === "Shapefile" && <ShapefileDisplay file={state.file} mapId={state.mapId} />} */}
        </div>
      ) : null}
    </div>
  );
}

// Export the component
export default Discovery;
