"use client";

import React, { useContext, useState, useEffect } from "react";
import MapEditorToolbar from "../components/MapEditorToolBar";
import PHeatmap from "../components/PHeatmap";
import dynamic from "next/dynamic";

import MapDisplay from "../components/MapDisplay";
import StoreContext, { MapType, CurrentModal } from "@/store";
const PTravelMap = dynamic(() => import("../components/PTravelMap"));
const PPoliticalmap = dynamic(() => import("../components/PPoliticalmap"));
const PProportional = dynamic(() => import("../components/PProportional"));
const PDotDistribution = dynamic(() =>
  import("../components/PDotDistribution")
);
const GeneralProperty = dynamic(() => import("../components/GeneralProperty"));
import Button from "@mui/joy/Button";

// import { ObjectId } from 'mongodb';
// import PTravelMap from "../components/PTravelMap";
// import PPoliticalmap from "../components/PPoliticalmap";
// import PProportional from "../components/PProportional";
// import PDotDistribution from "../components/PDotDistribution";
// import GeneralProperty from "../components/GeneralProperty";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function EditScreen() {
  const { store } = useContext(StoreContext);
  const [tabValue, setTabValue] = useState("general");
  const [readyToRender, setReadyToRender] = useState(!!store.rawMapFile);
  console.log("readyToRender", readyToRender);
  console.log("store.rawMapFile", store.rawMapFile, !!store.rawMapFile);
  

  // const [loadScripts, setLoadScripts] = useState(false);

  // const loadScript = (src) => {
  //   return new Promise((resolve, reject) => {
  //     const script = document.createElement("script");
  //     script.src = src;
  //     script.onload = () => resolve(script);
  //     script.onerror = () => reject(new Error(`Script load error for ${src}`));
  //     document.body.appendChild(script);
  //   });
  // };

  // if (!loadScripts) {
  //   Promise.all([
  //     loadScript("./mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
  //     loadScript("./mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
  //   ])
  //     .then(() => {
  //       setLoadScripts(true);
  //       store.setRawMapFile(store.rawMapFile);
  //     })
  //     .catch((error) => console.error(error));
  // }

  useEffect(() => {
    store.setPropertyTable();
    console.log(store.table);
    
    const f = async () => {
      console.log("refreshing edit");
      if (!store.currentMapObject) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let mapId = urlParams.get("mapId");
        await store.getMapListHome();
        await store.loadMapFile(mapId);

        setReadyToRender(true);
      }
    };
    if (!readyToRender) {
      f();
    }
    store.tps.clearAllTransactions();
  }, []);

  useEffect(() => {
    const func = async () => {
      console.log("refreshing edit");
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

  // useEffect(() => {
  //   const f = async () => {
  //       console.log(store.currentMapObject)
  //       if (store.currentMapObject && store.currentMapObject.csvData) {
  //         const csvObj = await store.getCsvById(store.currentMapObject.csvData);

  //         console.log(csvObj);

  //         await store.setParsedCsvData(csvObj.csvData);
  //         await store.setCsvKey(csvObj.key);
  //         await store.setCsvLabel(csvObj.label);

  //       }
  //     }

  //   if (!readyToRender){
  //     f();
  //   }
  // }, [store.currentMapObject]);

  const panelStyle = {
    width: "30%",
    position: "absolute",
    top: "10%",
    right: "5%",
    height: "70vh", // 80
    overflowY: "scroll"
  };

  const buttonsStyle= {
    width: "30%",
    position: "absolute",
    top: "82%",
    right: "5%",
  }

  const toolbarStyle = {
    justifyContent: "center",
    display: "flex",
    width: "30%",
    margin: "0",
    marginLeft: "18%",
  };

  let propertyPanel = null;

  switch (store.currentMapObject?.mapType) {
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
      propertyPanel = <PTravelMap />; // PTravel
      break;
    default:
      break;
  }

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const openSaveModal = () => store.openModal(CurrentModal.SAVE_EDIT);

  const openExitModal = () => store.openModal(CurrentModal.EXIT_EDIT);

  return readyToRender && store.currentMapObject ? (
    <div>
      <div style={toolbarStyle}>
        <MapEditorToolbar />
      </div>
      <div style={{ width: "65vw" }}>
        <MapDisplay />
      </div>

      {store.currentMapObject?.mapType !== MapType.TRAVEL_MAP && (
        <div>
          <div style={panelStyle}>
            <div className="propertyTitle">Properties</div>
            {/* <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="General" value="general" />
              <Tab label="Specific" value="specific" />
            </Tabs>
            {tabValue === "general" && <GeneralProperty />}
            {tabValue === "specific" && propertyPanel} */}
            {propertyPanel}
          </div>
          <div style={buttonsStyle}>
            <Button
              variant="solid"
              className="exit"
              sx={{ margin: 1 }}
              onClick={openExitModal}
            >
              EXIT
            </Button>
            <Button
              variant="solid"
              className="save"
              sx={{ margin: 1 }}
              onClick={openSaveModal}
            >
              SAVE
            </Button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}
