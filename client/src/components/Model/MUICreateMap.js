import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./MUIPublishMap.css";
import { useHistory } from "react-router-dom";
import { TextField } from "@mui/material";

import StoreContext from "../../store";
import { CurrentModal, MapType } from "../../store";
import MapDisplay from "../MapDisplay";

export default function MUICreateMap() {
  const history = useHistory();
  const { store } = useContext(StoreContext);

  const [projectName, setProjectName] = useState("");
  // const setMapType = store.setMapType
  const [mapType, setMapType] = useState(MapType.POLITICAL_MAP);

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
    console.log("onClose");
    store.emptyRawMapFile();
    store.closeModal();
  };

  const handleCreateMap = () => {
    // console.log(
    //     `Map Created!\n` +
    //     `name: ${projectName}\n` +
    //     `type: ${mapType}\n` +
    //     `file: ${store.mapFile.name}`);
    store.mapType = mapType
    store.closeModal();
    store.createMap(projectName, mapType);
    history.push("/edit");
    console.log("mapType : " + mapType);
    // <MapDisplay mapType={mapType}/>
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
            <div className="alert">
              {"Enter the new name of the forked map:"}
            </div>
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
              <Button
                onClick={handleCreateMap}
                variant="contained"
                sx={buttonStyle}
                // disabled={mapType != MapType.POLITICAL_MAP}
                // disabled={mapType !== MapType.POLITICAL_MAP && mapType !== MapType.HEATMAP}
              >
                Create
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
