import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


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
        width: "80px",
        margin: '20px',
    };

    const uploadIconStyle = {
        fontSize: 40,
        marginRight: 10,
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
                        <div className="alert">
                            <CloudUploadIcon style={uploadIconStyle} />
                        </div>
                        <Button onClick={onClose}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};


const MUIUploadMap = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const confirmationInfo = "Browse for Shapefile, GeoJson, Keyhole (KML), PBJson files:";

    const handleSave = () => {
        // Handle the confirmation logic
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
                onDiscard={handleClose}
                onConfirm={handleSave}
                confirmationInfo={confirmationInfo}
            />
        </div>
    );
};

export default MUIUploadMap;