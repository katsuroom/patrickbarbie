"use client"

import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import "./MUIPublishMap.css";
import { useRouter } from "next/navigation";

import StoreContext from "@/store";
import { CurrentModal, MapType } from "@/store";

export default function MUICreateMap() {
  const router = useRouter();
  const { store } = useContext(StoreContext);

  const [projectName, setProjectName] = useState("");
  const [mapType, setMapType] = useState(MapType.POLITICAL_MAP);
  const [creatingMap, setCreatingMap] = useState(false);

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

  const selectStyle = {
    width: "100%",
    marginBottom: "20px",
  };

  const handleClose = () => {
    store.emptyRawMapFile();
    store.closeModal();
  };

  const handleCreateMap = async () => {
    setCreatingMap(true);
  
    // Simulate an asynchronous delay (remove this in a real-world scenario)
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    store.mapType = mapType;
    store.clearCsv();
    await store.createMap(projectName, mapType);
    router.push("/edit");
    setCreatingMap(false);
  };
  

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };

  return (
    <div>
      <Modal open={store.currentModal == CurrentModal.CREATE_MAP}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "lightPink",
            color: "black",
            border: "2px solid #000",
            boxShadow: 24,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 0,
            textAlign: "center",
          }}
        >
          <div className="alertContainer">
            <div className="alert">Enter the name of the new map:</div>
            <div className="confirm" style={{ height: "100%" }}>
              <TextField
                label="Your map name"
                variant="outlined"
                value={projectName}
                onChange={handleInputChange}
                style={selectStyle}
              />
              <Select
                value={mapType}
                onChange={(e) => setMapType(e.target.value)}
                style={selectStyle}
              >
                <MenuItem value={MapType.POLITICAL_MAP}>Political Map</MenuItem>
                <MenuItem value={MapType.HEATMAP}>Heatmap</MenuItem>
                <MenuItem value={MapType.DOT_DISTRIBUTION_MAP}>
                  Dot Distribution Map
                </MenuItem>
                <MenuItem value={MapType.PROPORTIONAL_SYMBOL_MAP}>
                  Proportional Symbol Map
                </MenuItem>
                <MenuItem value={MapType.TRAVEL_MAP}>Travel Map</MenuItem>
              </Select>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={buttonStyle}
              >
                Cancel
              </Button>
              {creatingMap ? (
                <CircularProgress style={{ marginTop: "20px" }} size={30} />
              ) : (
                <Button
                  onClick={handleCreateMap}
                  variant="contained"
                  sx={buttonStyle}
                >
                  Create
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
