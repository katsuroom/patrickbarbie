import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'

export const ConfirmationDialog = ({ open, onClose, onConfirm, confirmationInfo, projectName, handleInputChange }) => {
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
                        {/* <input type="text" value={e=>e.target.value} /> */}
                        <input
                            type="text"
                            value={projectName}
                            onChange={handleInputChange}
                            placeholder="Your Project Name"
                        />
                        <Button onClick={onClose}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            Cancel
                        </Button>
                        <Button onClick={onConfirm}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};


const MUIForkMap = () => {
    const [projectName, setProjectName] = useState("");

    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const confirmationInfo = "Enter the new name of the forked map:";

    const handleSave = () => {
        console.log("Map Forked!");
        handleClose();
    };

    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    };


    return (
        <div>
            {/* //fork button should link to here */}
            <Button onClick={handleOpen}>Open Confirmation</Button>
            <ConfirmationDialog
                open={open}
                onClose={handleClose}
                onDiscard={handleClose}
                onConfirm={handleSave}
                confirmationInfo={confirmationInfo}
                projectName={projectName}
                handleInputChange={handleInputChange}
            />
        </div>
    );
};

export default MUIForkMap;