"use client"

import React, { useContext, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import shp from "shpjs";
import tj from "@mapbox/togeojson";

import StoreContext from '@/store';
import { CurrentModal } from '@/store';

export default function MUIUploadMap() {
    const { store } = useContext(StoreContext);
    const workerRef = useRef(null);

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

    const handleFileSelect = async (event) => {
        let file = event.target.files[0];
        console.log(file);
        
        if (file) {
            
            let geojson = null;

            // convert file to GeoJSON if KML or Shapefile
            let ext = file.name.split('.').pop();
            console.log("filetype: " + ext);

            switch(ext)
            {
            case "json":
                {
                    const reader = new FileReader();

                    if (window.Worker) {
                        console.log("Web worker supported");
                        workerRef.current = new Worker("worker.js");
                    } else {
                        console.log("Web worker not supported");
                    }

                    reader.onload = function (event) {
                        const jsonDataString = event.target.result;
                        // Use the web worker for parsing
                        workerRef.current.postMessage(jsonDataString);
                    };

                    workerRef.current.onmessage = function (event) {
                        geojson = event.data;
                        store.uploadMapFile(geojson);
                        workerRef.current.terminate();
                    };

                    reader.readAsText(file);
                }
                break;
            case "zip":
                {
                    const reader = new FileReader();

                    reader.onload = async function (event) {
                        const data = await shp(event.target.result);
                        geojson = data[data.length - 1];
                        console.log(geojson);
                        store.uploadMapFile(geojson);
                    }

                    reader.readAsArrayBuffer(file);
                }
                break;
            case "kml":
                {
                    const reader = new FileReader();

                    reader.onload = function (event) {
                        try {
                            let jsonData;
                            const parser = new DOMParser();
                            const kml = parser.parseFromString(event.target.result, 'text/xml');
                            jsonData = tj.kml(kml);

                            console.log(jsonData);

                            // change file from KML to the new GeoJSON
                            geojson = jsonData;
                            store.uploadMapFile(geojson);
                        } catch (error) {
                            console.error("Error parsing file:", error);
                        }
                    };
                    reader.readAsText(file);
                }
                break;
            default:
                break;
            }
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
