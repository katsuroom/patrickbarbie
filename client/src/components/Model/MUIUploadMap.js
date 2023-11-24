import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import StoreContext from '../../store';
import { CurrentModal } from '../../store';

export default function MUIUploadMap() {
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
        margin: '20px',
    };

    const uploadIconStyle = {
        fontSize: 40,
        marginRight: 10,
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            store.uploadMapFile(file);
        }
    };

    const onClose = () => {
        store.closeModal();
    }

    return (
        <Modal open={store.currentModal === CurrentModal.UPLOAD_MAP}>
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
                        {"Browse for Shapefile, GeoJson, Keyhole (KML), PBJson files:"}
                    </div>
                    <div className="confirm">
                        <input
                            type="file"
                            id="fileInput"
                            accept=".geojson,.json,.kml, .zip" // accepted file types here
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="fileInput">
                            <Button
                                variant="contained"
                                component="span"
                                sx={buttonStyle}
                            >
                                <CloudUploadIcon style={uploadIconStyle} />
                            </Button>
                        </label>
                        <br />
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
