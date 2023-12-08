"use client"

import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'

import StoreContext from '@/store';
import { CurrentModal } from '@/store';
import { TextField } from "@mui/material";

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

    const selectStyle = {
      width: "100%",
      marginBottom: "20px",
    };

    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    }

    const handleConfirm = () => {
        console.log("fork map: ", projectName);
        store.forkMap(projectName);
    }

    const onClose = () => {
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
              <TextField
                className = "projectName"
                label="Your map name"
                variant="outlined"
                onChange={handleInputChange}
                style={selectStyle}
              />
              <Button onClick={onClose} variant="contained" sx={buttonStyle} className = "modal-button-fork-cancel">
                Cancel
              </Button>
              <Button onClick={handleConfirm} variant="contained" sx={buttonStyle} className = "modal-button-fork-confirm">
                Confirm
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    );
};