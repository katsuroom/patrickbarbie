"use client"

import React, { useContext, useState } from "react";
import MapEditorToolbar from "../components/MapEditorToolBar";
import PHeatmap from "../components/PHeatmap";

// Import components using dynamic import
const MapEditorToolbar = lazy(() => import("../components/MapEditorToolBar"));
const PHeatmap = lazy(() => import("../components/PHeatmap"));
const MapDisplay = lazy(() => import("../components/MapDisplay"));
const PTravelMap = lazy(() => import("../components/PTravelMap"));
const PPoliticalmap = lazy(() => import("../components/PPoliticalmap"));
const PProportional = lazy(() => import("../components/PProportional"));
const PDotDistribution = lazy(() => import("../components/PDotDistribution"));
const GeneralProperty = lazy(() => import("../components/GeneralProperty"));


import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function EditScreen() {



  const { store } = useContext(StoreContext);


  const [tabValue, setTabValue] = useState("general");

  const panelStyle = {
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

  let propertyPanel = null;

  switch(store.currentMapObject?.mapType)
  {
    case MapType.POLITICAL_MAP:
      propertyPanel = <PPoliticalmap />;
      break;
    case MapType.HEATMAP:
      propertyPanel = <PHeatmap />;
      break;
    case MapType.DOT_DISTRIBUTION_MAP:
      propertyPanel = <PDotDistribution />;
      break;
    case MapType.PROPORTIONAL_SYMBOL_MAP:
      propertyPanel = <PProportional />;
      break;
    case MapType.TRAVEL_MAP:
      propertyPanel = <PTravelMap />;   // PTravel
      break
    default:
      break;
  }

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <div style={toolbarStyle}>
        <MapEditorToolbar />
      </div>
      <div style={{ width: "65vw" }}>
        <MapDisplay />
      </div>
      {/* <div style={panelStyle}>
        {propertyPanel}
      </div> */}

      {!MapType.TRAVEL_MAP && <div style={panelStyle}>
        <div className="propertyTitle">Property</div>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab label="General" value="general" />
          <Tab label="Specific" value="specific" />
        </Tabs>
        {tabValue === "general" && <GeneralProperty />}
        {tabValue === "specific" && propertyPanel}
      </div>}
    </div>
  );
}