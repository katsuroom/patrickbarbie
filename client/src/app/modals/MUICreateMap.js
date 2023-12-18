"use client"

import React, { useState, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { LinearProgress } from "@mui/material";

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
  const [selectedLabel, setSelectedLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [menuItems, setMenuItems] = React.useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");


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

    // const chunkSize = 1 * 1024 * 1024;
    // const mapDataBuffer = store.uploadedFile;
    // const totalChunks = Math.ceil(mapDataBuffer.length / chunkSize);
    // console.log("totalChunks", totalChunks);
    // for (let i = 0; i < totalChunks; i++) {
    //   console.log("creating chunk #", i);
    //   const start = i * chunkSize;
    //   const end = Math.min((i + 1) * chunkSize, mapDataBuffer.length);
    //   const chunk = mapDataBuffer.slice(start, end);
    //   var percentage = ((i + 1) / totalChunks) * 100;
    //   setProgress(percentage)
    // }

    // Simulate an asynchronous delay (remove this in a real-world scenario)
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    store.mapType = mapType;
    store.clearCsv();
    await store.createMap(projectName, mapType, selectedLabel);
    router.push(`/edit?mapId=${store.currentMapObject._id}`);
    setCreatingMap(false);
  };
  
  // useEffect (()=>{

  // }, [percentage])

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };

  const changeLabel = (e) => {
    setSelectedLabel(e.target.value);
    // store.selectedLabel = e.target.value;
    // console.log("selectedLabel", store.selectedLabel);
  };

  if (menuItems.length === 0 && store.uploadedFile) {
    setMenuItems(Object.keys(store.uploadedFile.features[0].properties));
    // console.log("menuItems", menuItems);
  }

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
              <div>Select a property label representing your region name:</div>
              {/* <Select
                onChange={changeLabel}
                style={selectStyle}
              >
                {menuItems.map((value, index) =>{
                  return(
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>)
                })} 
              </Select> */}
              <Select
                labelId="demo-simple-select-standard-label"
                required
                onChange={changeLabel}
                style={selectStyle}
              >
                {menuItems.map((mi, index) => (
                  <MenuItem key={index} value={mi}>
                    {mi}
                  </MenuItem>
                ))}
              </Select>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={buttonStyle}
              >
                Cancel
              </Button>
              {creatingMap ? (
                // <LinearProgress variant="determinate" value={progress} />
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
