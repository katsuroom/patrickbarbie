"use client"

import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./MUIPublishMap.css";

import StoreContext from "@/store";
import { CurrentModal } from "@/store";

export default function MUIDeleteMap() {
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

  const handleSave = () => {
    console.log("publish map");
    // TODO: I need pass the mapId to the backend here

    // var mapId = "655a9d69bb02d728d9fbcf76";
    var mapId = store.currentMapObject._id;
    store.deleteMap(mapId);
    onClose();
  };

  const onClose = () => {
    store.closeModal();
  };

  return (
    <Modal open={store.currentModal === CurrentModal.DELETE_MAP}>
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
          <div className="alert">
            Are you sure you want to delete this map?
          </div>
          <div className="confirm">
            <Button onClick={handleSave} variant="contained" sx={buttonStyle} className = "modal-button-confirm">
              Confirm
            </Button>
            <Button onClick={onClose} variant="contained" sx={buttonStyle} className = "modal-button">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" sx={buttonStyle}>
              Confirm
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
