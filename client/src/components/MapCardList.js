import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import AuthContext from '../auth';
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import MUICreateMap from "./Model/MUICreateMap";
import { useHistory } from "react-router-dom";

import MUIUploadMap from "./Model/MUIUploadMap";
import MUIForkMap from "./Model/MUIForkMap";
import MUIPublishMap from "./Model/MUIPublishMap";
import MUIDeleteMap from "./Model/MUIDeleteMap";

import StoreContext from "../store";
import { CurrentModal } from "../store";
import MapView from "./MapView";
import { useEffect } from "react";

export default function MapCardList(props) {
  const history = useHistory();
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);

  const [maps, setMaps] = useState([...props.maps]);
  const [selectedMap, setSelectedMap] = useState(null);

  const handleCreateMap = () => {
    store.openModal(CurrentModal.UPLOAD_MAP);
  };

  const handleMapClick = (mapId) => {
    maps.map((map) => {
      if (map.id === mapId) {
        store.getMapFile(map.fileName);
      }
    });

    setSelectedMap(mapId);
  };

  // backend connect here
  const sendUpdateRequest = async (updatedMap) => {
    try {
      const response = await fetch("/api/updateMapViews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: updatedMap.id, views: updatedMap.views }),
      });
    } catch (error) {
      console.error("Error updating map views:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "23vw",
        bgcolor: "#F7D3E4",
        float: "left",
        height: "83vh",
        position: "relative",
      }}
    >
      <List
        component="nav"
        aria-label="map folders"
        sx={{
          maxHeight: "85vh",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
          },
        }}
      >
        {maps.map((map, index) => (
          <React.Fragment key={map.id}>
            {index > 0 && <Divider />}
            <ListItem button onClick={() => handleMapClick(map.id)}>
              <ListItemText
                primary={map.name}
                style={{
                  padding: "0px",
                  backgroundColor:
                    index + 1 === selectedMap ? "#f6c0fa" : "#F7D3E4",
                }}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      {
        auth.loggedIn && (
          <Fab
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              bgcolor: "#ffabd1",
              "&:hover": {
                bgcolor: "#ffabd1",
              },
            }}
            onClick={handleCreateMap}
          >
            <AddIcon />
          </Fab>
        )
      }
      <MUIUploadMap />
      <MUICreateMap />

      {/* {selectedMap && (
        <MapView
          fileSelected={selectedMap.fileSelected}
          projectName={selectedMap.name}
          mapType={selectedMap.mapType}
          views={selectedMap.views}
        />
      )} */}
    </Box>
  );
}
