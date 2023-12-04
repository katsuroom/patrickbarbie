"use client"

import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'
import './ModalAnimation.css'

import { useHistory } from "react-router-dom";
import StoreContext from '@/store';
import { useRouter } from "next/navigation";

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  confirmationInfo,
}) => {
  const [openDialog, setOpenDialog] = useState(open);
  useEffect(() => {
    setOpenDialog(open);
  }, [open]);
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
    <Modal open={openDialog} onClose={onClose}>
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
        className="modal-root"
      >
        <div
          className={openDialog ? "modal-dialog is-visible" : "modal-dialog"}
        >
          <header className="dialog-header">
            <Alert
              style={{ fontSize: 20, width: "90%", height: 100 }}
              severity="error"
            >
              {confirmationInfo}
            </Alert>
          </header>
          <div className="ErrorModalSouth">
            <div className="alertContainer" sx={{}}>
              <div className="confrim">
                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={buttonStyle}
                  className="modal-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  variant="contained"
                  sx={buttonStyle}
                  className="modal-button"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

const MUISaveChanges = (props) => {
  const history = useHistory();
  const { store } = useContext(StoreContext);
  const router = useRouter();

  console.log(props);
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    props.closeModal();
  };

  const confirmationInfo = "Do you want to save your changes?";

  const handleSave = () => {
    if (props.saveCB){
      props.saveCB();
    }

      
    store.saveCSV();
    handleClose();
    router.push("/main");
  };

  return (
    <div>
      {/* //Save button should link to here */}
      {/* <Button onClick={handleOpen}>Open Confirmation</Button> */}
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleSave}
        confirmationInfo={confirmationInfo}
      />
    </div>
  );
};

export default MUISaveChanges;
