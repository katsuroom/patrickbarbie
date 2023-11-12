import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
    const buttonStyle = {
        mt: 1,
        mb: 3,
        backgroundColor: "white",
        color: "black",
        ":hover": {
            backgroundColor: "lightpink",
        },
        border: "3px solid white",
        width: "250px",
        margin: '10px',
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
                <div className="alertContainer" style={{ height: '60%' }}>
                    <div >
                        <Button onClick={onClose}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            PNG
                        </Button>
                        <Button onClick={onClose}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            JPG
                        </Button>
                        <Button onClick={onClose}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            JSON
                        </Button>
                        <Button onClick={onConfirm}
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


const MUIExportMap = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    // const handleConfirm = () => {
    //     console.log("Map published!");
    //     handleClose();
    // };

    return (
        <div>
            {/* //publish button should link to here */}
            <Button onClick={handleOpen}>Open Confirmation</Button>
            <ConfirmationDialog
                open={open}
                onClose={handleClose}
                // onConfirm={handleConfirm}
                // confirmationInfo={confirmationInfo}
            />
        </div>
    );
};

export default MUIExportMap;