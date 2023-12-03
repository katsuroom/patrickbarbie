"use client"

import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'

import StoreContext from '@/store';
import { CurrentModal } from '@/store';

export default function MUIForkMap() {
    const { store } = useContext(StoreContext);
    const [projectName, setProjectName] = useState("");

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

    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    }

    const handleSave = () => {
        console.log("fork map: ", projectName);
        store.forkMap(projectName);
        onClose();
    }

    const onClose = () => {
        store.emptyRawMapFile();
        store.closeModal();
    }

    return (
      <Modal open={store.currentModal === CurrentModal.FORK_MAP}>
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
            <div className="alert">Enter the new name of the forked map:</div>
            <div className="confirm">
              <input
                type="text"
                onChange={handleInputChange}
                placeholder="Your Project Name"
              />
              <Button onClick={handleSave} variant="contained" sx={buttonStyle}>
                Confirm
              </Button>
              <Button onClick={onClose} variant="contained" sx={buttonStyle}>
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    );
};