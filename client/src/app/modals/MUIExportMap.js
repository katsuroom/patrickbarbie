"use client";

import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import StoreContext, { CurrentModal } from "@/store";
import "./MUIPublishMap.css";
import domtoimage from "dom-to-image";

export default function MUIExportImage() {
  const { store } = useContext(StoreContext);

  const imgSettings = {
    // width: 1400,
    // height: 600,
    style: {
      transform: "scale(2)",
      transformOrigin: "top left",
      width: "50%",
      height: "50%",
    },
  };

  const handleClose = () => {
    store.closeModal();
  };

  const handleDownloadPNG = () => {
    console.log("PNG");
    let map = document.getElementsByClassName("leaflet-map-pane")[0];
    let dim = document.getElementById("map-display");
    domtoimage
      .toPng(map, {
        width: dim.offsetWidth * 2,
        height: dim.offsetHeight * 2,
        ...imgSettings,
      })
      .then(function (dataUrl) {
        let link = document.getElementById("download-anchor");
        link.download = `${store.currentMapObject.title || "map"}.png`;
        link.href = dataUrl;
        link.click();
      });

    handleClose();
  };

  const handleDownloadJPEG = () => {
    console.log("JPEG");
    let map = document.getElementsByClassName("leaflet-map-pane")[0];
    let dim = document.getElementById("map-display");
    domtoimage
      .toJpeg(map, {
        width: dim.offsetWidth * 2,
        height: dim.offsetHeight * 2,
        ...imgSettings,
      })
      .then(function (dataUrl) {
        let link = document.getElementById("download-anchor");
        link.download = `${store.currentMapObject.title || "map"}.jpeg`;
        link.href = dataUrl;
        link.click();
      });

    handleClose();
  };

  const handleDownloadJSON = () => {
    console.log("PBJson");
    const { title, mapType, mapProps } = store.currentMapObject;
    let dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({
          type: "PBJSON",
          rawMapFile: store.rawMapFile,
          mapObject: {title, mapType, mapProps},
          parsed_CSV_Data: store.parsed_CSV_Data,
          key: store.key,
          label: store.label
        })
      );
    let link = document.getElementById("download-anchor");
    link.download = `${store.currentMapObject.title || "map"}.json`;
    link.href = dataStr;
    link.click();
    handleClose();
  };

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

  return (
    <Modal open={store.currentModal === CurrentModal.EXPORT_MAP}>
      <Box
        sx={{
          position: "absolute",
          width: 400,
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
          <div className="alert">Download Image</div>
          <div className="confirm">
            <Button
              onClick={handleDownloadPNG}
              variant="contained"
              sx={buttonStyle}
              className="modal-button"
            >
              PNG
            </Button>
            <Button
              onClick={handleDownloadJPEG}
              variant="contained"
              sx={buttonStyle}
              className="modal-button"
            >
              JPEG
            </Button>
            <Button
              onClick={handleDownloadJSON}
              variant="contained"
              sx={buttonStyle}
              className="modal-button"
            >
              JSON
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={buttonStyle}
              className="modal-button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
