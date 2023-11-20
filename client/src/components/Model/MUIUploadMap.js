import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MUICreateMap from './MUICreateMap'

export const ConfirmationDialog = ({ open, onClose, setFileSelected, confirmationInfo }) => {
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

    // Handler for file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileSelected(file);
            onClose(); // Close the current modal
        }
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
                        <input
                            type="file"
                            id="fileInput"
                            accept=".geojson,.json,.kml" // accepted file types here
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="fileInput">
                            <CloudUploadIcon style={uploadIconStyle} />
                            {/* Clicking the icon now opens the file dialog */}
                        </label>
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



const MUIUploadMap = ({ open, onClose }) => {
    const [fileSelected, setFileSelected] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileSelected(file);
        }
    };

    return (
        <div>
            <ConfirmationDialog
                open={open}
                onClose={onClose}
                setFileSelected={setFileSelected}
                confirmationInfo="Browse for Shapefile, GeoJson, Keyhole (KML), PBJson files:"
            />
            {fileSelected && <MUICreateMap open={true} fileSelected={fileSelected} onClose={() => setFileSelected(null)} />}
        </div>
    );
};

export default MUIUploadMap;