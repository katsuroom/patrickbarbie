import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'

export const ConfirmationDialog = ({ open, onClose, onConfirm, confirmationInfo }) => {
    const buttonStyle = {
        mt: 1,
        mb: 3,
        backgroundColor: "white",
        color: "black",
        ":hover": {
            backgroundColor: "lightpink",
        },
        border: "3px solid white",
        width: "50px",
        margin: '40px',
    };

    return (
        <Modal open={open} onClose={onClose}>
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
                        {confirmationInfo}
                    </div>
                    <div className="confrim">
                        <Button onClick={onClose}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            No
                        </Button>
                        <Button onClick={onConfirm}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            Yes
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};


const MUIPublishMap = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const confirmationInfo = "Are you sure you want to publish this map?";

    const handleConfirm = () => {
        console.log("Map published!");
        handleClose();
    };

    return (
        <div>
            {/* //publish button should link to here */}
            <Button onClick={handleOpen}>Open Confirmation</Button>
            <ConfirmationDialog
                open={open}
                onClose={handleClose}
                onConfirm={handleConfirm}
                confirmationInfo={confirmationInfo}
            />
        </div>
    );
};

export default MUIPublishMap;