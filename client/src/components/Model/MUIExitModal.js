import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'
import {useHistory} from 'react-router-dom';

export const ConfirmationDialog = ({ open, onClose, onConfirm, confirmationInfo }) => {
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
        margin: '20px',
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
                            Cancel
                        </Button>
                        <Button onClick={onClose}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            Discard
                        </Button>
                        <Button onClick={onConfirm}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};


const MUIExit = (props) => {
    const history = useHistory();
    const [open, setOpen] = useState(props.open);

    const handleOpen = () => setOpen(true);
    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const handleClose = () => {
        props.closeModal();
    }

    const confirmationInfo = "Do you want to save your changes before leaving this page?";

    const handleSave = () => {
        console.log("Map Saved!");
        handleClose();
    };

    const handleDiscard = () => {
        console.log("Map Discarded!");
    }



    return (
        <div>
             {/* //Save button should link to here */}
            {/* <Button onClick={handleOpen}>Open Confirmation</Button> */}
            <ConfirmationDialog
                open={true}
                onClose={handleClose}
                onDiscard={handleDiscard}
                onConfirm={handleSave}
                confirmationInfo={confirmationInfo}
            />
        </div>
    );
};

export default MUIExit;