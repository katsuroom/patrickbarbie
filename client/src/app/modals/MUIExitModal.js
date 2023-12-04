"use client";

import React, { useContext } from "react";
import StoreContext, { CurrentModal } from "@/store";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./MUIPublishMap.css";
import { useRouter } from "next/navigation";

export default function MUIExit() {
  const router = useRouter();
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
    console.log("Map Saved!");
    router.push("/main");
  };

  const handleDiscard = () => {
    console.log("Map Discarded!");
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
