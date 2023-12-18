"use client";

import React, { useContext } from "react";
import StoreContext, { CurrentModal , MapType } from "@/store";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./MUIPublishMap.css";
import { useRouter } from "next/navigation";
import domtoimage from "dom-to-image";

const imgSettings = {
  // width: 1400,
  // height: 600,
  style: {
    transform: "scale(2)",
    transformOrigin: "topleft",
    width: 1400,
    height: 600,
  },
};

export default function MUIExit() {
  const router = useRouter();
  const { store } = useContext(StoreContext);
  store.pageLoading = false

  const buttonStyle = {
    mt: 1,
    mb: 3,
    backgroundColor: "white",
    color: "black",
    ":hover": {
      backgroundColor: "lightpink",
    },
    border: "3px solid white",
    width: "80px",
    margin: "20px",
  };

  const handleClose = () => {
    store.closeModal();
  };

  // const handleSave = () => {
  //   store.saveCSV();
  //   console.log("Map Saved!");
  //   store.clearCsv();
  //   store.closeModal();
  //   router.push("/main");
  // };

  const handleSave = async () => {
    console.log("saving map");
    store.saveCSV();

    // initialize mapProps to empty object if null
    if (!store.currentMapObject.mapProps) store.currentMapObject.mapProps = {};

    // currently only handles 4/5 map types
    const mapTypes = store.currentMapObject.mapType || store.mapType;
    switch (mapTypes) {
      case MapType.PROPORTIONAL_SYMBOL_MAP:
        {
          console.log("save map props proportional");
          store.currentMapObject.mapProps.proColor = store.proColor;
          store.currentMapObject.mapProps.proportional_value =
            store.proportional_value;
        }
        break;
      case MapType.DOT_DISTRIBUTION_MAP:
        {
          console.log("save map props dot distribution");
          store.currentMapObject.mapProps.dotColor = store.dotColor;
        }
        break;
      case MapType.HEATMAP:
        {
          console.log("save map props heat map");
          store.currentMapObject.mapProps.minColor = store.minColor;
          store.currentMapObject.mapProps.maxColor = store.maxColor;
        }
        break;
      case MapType.POLITICAL_MAP:
        {
          console.log("save maps props political map")
          store.currentMapObject.mapProps.categoryColorMapping = store.currentMapObject.mapProps.categoryColorMapping;
          store.currentMapObject.mapProps.selectedAttribute = store.currentMapObject.mapProps.selectedAttribute;
        }
        break;
      case MapType.TRAVEL_MAP:
        {
          store.currentMapObject.mapProps.waypoints = store.waypoints;
        }
        break;
      default:
        break;
    }

    let map = document.getElementsByClassName("leaflet-map-pane")[0];
    let dim = document.getElementById("map-display");
    await domtoimage
      .toPng(map, {
        width: dim.offsetWidth * 2,
        height: dim.offsetHeight * 2,
        ...imgSettings,
      })
      .then(function (dataUrl) {
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");

        console.log("imageBuffer", imageBuffer);
        store.currentMapObject.imageBuffer = imageBuffer;

      })
      .catch(function (error) {
        console.error("Error capturing image:", error);
      });

    store.updateMap(store.currentMapObject);

    //update map data
    store.updateMapData();

    console.log("Map Saved!");
    store.closeModal();
    router.push("/main");
  };

  const handleDiscard = () => {
    console.log("Map Discarded!");
    store.clearCsv();
    store.closeModal();
    router.push("/main");
  };

  return (
    <Modal open={store.currentModal === CurrentModal.EXIT_EDIT}>
      <Box
        sx={{
          position: "absolute",
          width: 500,
          bgcolor: "lightPink",
          color: "black",
          border: "2px solid #000",
          boxShadow: 24,
          p: 10,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: 0,
          textAlign: "center",
        }}
      >
        <div className="alertContainer">
          <div className="alert">
            Do you want to save your changes before leaving this page?
          </div>
          <div className="confirm">
            <Button onClick={handleClose} variant="contained" sx={buttonStyle}>
              Cancel
            </Button>
            <Button onClick={handleDiscard} variant="contained" sx={buttonStyle}>
              Discard
            </Button>
            <Button onClick={handleSave} variant="contained" sx={buttonStyle}>
              Save
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
