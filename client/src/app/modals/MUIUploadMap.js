"use client"


import React, { useContext, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import shp from "shpjs";
import tj from "@mapbox/togeojson";

import StoreContext from "@/store";
import { CurrentModal } from "@/store";

export default function MUIUploadMap() {
  const { store } = useContext(StoreContext);
  const workerRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

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

  const uploadIconStyle = {
    fontSize: 40,
    marginRight: 10,
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    await handleFile(file);
  };

  const handleFile = async (file) => {
    if (file) {
      setUploading(true);
      setUploadStatus("Uploading...");

      let geojson = null;
      let ext = file.name.split(".").pop();

      try {
        switch (ext) {
          case "json": {
            const jsonDataString = await readFile(file);
            geojson = await parseJsonData(jsonDataString);
            store.uploadMapFile(geojson);
            setUploadStatus("Upload complete.");
            break;
          }
          case "zip": {
            const data = await readFileAsArrayBuffer(file);
            geojson = await parseShpData(data);
            store.uploadMapFile(geojson);
            setUploadStatus("Upload complete.");
            break;
          }
          case "kml": {
            const kmlData = await readFile(file);
            geojson = await parseKmlData(kmlData);
            store.uploadMapFile(geojson);
            setUploadStatus("Upload complete.");
            break;
          }
          default:
            break;
        }
      } catch (error) {
        console.error("Error processing file:", error);
        setUploadStatus("Error uploading file.");
      } finally {
        setUploading(false);
      }
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);

      // Use the progress event to track reading progress
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadStatus(`Reading file: ${percentage}%`);
        }
      };

      reader.readAsText(file);
    });
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const parseJsonData = (jsonDataString) => {
    return new Promise((resolve) => {
      if (window.Worker) {
        console.log("Web worker supported");
        const worker = new Worker("worker.js");
        worker.onmessage = (event) => resolve(event.data);
        worker.postMessage(jsonDataString);
      } else {
        const jsonData = JSON.parse(jsonDataString);
        resolve(jsonData);
      }
    });
  };

  const parseShpData = (data) => {
    return new Promise((resolve) => {
      shp(data).then((shpJson) => {
        const geojson = shpJson[shpJson.length - 1];
        resolve(geojson);
      });
    });
  };

  const parseKmlData = (kmlData) => {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlData, "text/xml");
        const jsonData = tj.kml(kml);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    });
  };

  const onClose = () => {
    store.closeModal();
  };

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
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="alertContainer">
          <div className="alert">
            {"Drag and drop or browse for Shapefile, GeoJson, Keyhole (KML), PBJson files:"}
          </div>
          <div className="confirm">
            <div>
              <input
                type="file"
                id="fileInput"
                accept=".geojson,.json,.kml, .zip"
                onChange={handleFileSelect}
                style={{ display: "none" }}
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
            </div>
            <div>
              {uploading ? (
                <CircularProgress />
              ) : (
                <div>
                  {uploadStatus && <p>{uploadStatus}</p>}
                  <Button
                    onClick={onClose}
                    variant="contained"
                    sx={buttonStyle}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
