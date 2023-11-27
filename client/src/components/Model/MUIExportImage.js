import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";
import "./MUIPublishMap.css";
import "./ModalAnimation.css";

export const ConfirmationDialog = ({
  open,
  handleDownloadJPEG,
  handleDownloadPNG,
  onClose,
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
            <Typography variant="h6" color="black">
              {confirmationInfo}
            </Typography>
          </header>
          <div className="ErrorModalSouth">
            <div className="alertContainer" sx={{}}>
              <div className="confrim">
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
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

const MUIExportImage = (props) => {
  console.log(props);
  //   const [open, setOpen] = useState(props.open);

  //   useEffect(() => {
  //     setOpen(props.open);
  //   }, [props.open]);

  const handleClose = () => {
    props.closeModal();
  };

  const confirmationInfo = "Download Image";

  const handleDownloadPNG = () => {
    console.log("PNG");
    props.setImageType("PNG");
    handleClose();
  };
  const handleDownloadJPEG = () => {
    console.log("JPEG");
    props.setImageType("JPEG");
    handleClose();
  };

  return (
    <div>
      {/* //Save button should link to here */}
      {/* <Button onClick={handleOpen}>Open Confirmation</Button> */}
      <ConfirmationDialog
        open={props.open}
        handleDownloadPNG={handleDownloadPNG}
        handleDownloadJPEG={handleDownloadJPEG}
        onClose={handleClose}
        confirmationInfo={confirmationInfo}
      />
    </div>
  );
};

export default MUIExportImage;
