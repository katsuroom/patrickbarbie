"use client";

import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./MUIPublishMap.css";

import StoreContext, { CurrentModal } from "@/store";

export default function MUISaveChanges() {
  const { store } = useContext(StoreContext);

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

  const handleSave = () => {
    store.saveCSV();

    if (store.currentMapObject.mapType == store.mapTypes.HEATMAP){
      console.log("save map props heat map")

      if (!store.currentMapObject.mapProps){
        store.currentMapObject.mapProps = {}
      }
      store.currentMapObject.mapProps.minColor = store.minColor;
      store.currentMapObject.mapProps.maxColor = store.maxColor;

      
      store.updateMap(store.currentMapObject);
    }
    
    console.log("Map Saved!");
    store.closeModal();
  };

  return (
    <Modal open={store.currentModal === CurrentModal.SAVE_EDIT}>
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
          <div className="alert">Do you want to save your changes?</div>
          <div className="confirm">
            <Button onClick={handleClose} variant="contained" sx={buttonStyle} className="modal-button-save-cancel">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" sx={buttonStyle} className="modal-button-save-save">
              Save
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
