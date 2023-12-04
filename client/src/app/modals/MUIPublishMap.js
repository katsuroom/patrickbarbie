"use client"

import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'

import StoreContext from '@/store';
import { CurrentModal } from '@/store';

export default function MUIPublishMap() {
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
        margin: '20px',
    };

    const handlePublish = () => {
        console.log("publish map");
        // TODO: I need pass the mapId to the backend here

        var mapObject = store.currentMapObject;
        mapObject.isPublished = true;
        console.log(mapObject);
        store.updateMap(mapObject);
    }

    const onClose = () => {
      store.closeModal();
    }

    return (
      <Modal open={store.currentModal === CurrentModal.PUBLISH_MAP}>
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
            <div className="alert">Are you sure you want to publish this map?</div>
            <div className="confirm">
              <Button onClick={onClose} variant="contained" sx={buttonStyle}>
                Cancel
              </Button>
              <Button onClick={handlePublish} variant="contained" sx={buttonStyle}>
                Confirm
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    );
};