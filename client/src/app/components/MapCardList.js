"use client"

import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import StoreContext, { CurrentModal } from "@/store";
import AuthContext from "@/auth";
import MUIUploadMap from "../modals/MUIUploadMap";
import MUICreateMap from "../modals/MUICreateMap";
const Pbf = require("pbf");
const geobuf = require("geobuf");

const hardcodedMaps = [
  // { _id: '1', title: 'North America', fileName: "NA2.json", type: 'hardcoded' },
  // { _id: '2', title: 'South America', fileName: "SA2.json", type: 'hardcoded' },
  // { _id: '3', title: 'Asia', fileName: "ASIA2.json", type: 'hardcoded' },
  // { _id: '4', title: 'Africa', fileName: "AFRICA2.json", type: 'hardcoded' },
  // { _id: '5', title: 'Europe', fileName: "EU2.json", type: 'hardcoded' },
  // { _id: '6', title: 'Oceania', fileName: "Oceania2.json", type: 'hardcoded' },
  // { _id: '7', title: 'World', fileName: "World.json", type: 'hardcoded' }
];

export default function MapCardList() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);
  // const [maps, setMaps] = useState([...hardcodedMaps]);
  const [selectedMap, setSelectedMap] = useState(null);


  useEffect(() => {
    store.getMapList();
  }, [store.currentView]);

  useEffect(() => {
    let fetchedMaps = store.mapList;
    const typedFetchedMaps = fetchedMaps.map((map) => ({
      ...map,
      type: "fetched",
    }));
    // setMaps([...hardcodedMaps, ...typedFetchedMaps]);
  }, [store.mapList]);

  const handleMapClick = (mapId) => {
    const selected = store.mapList.find((map) => map._id === mapId);
    store.currentMapObject = selected;
    console.log(store.currentMapObject);
    if (selected) {
      setSelectedMap(selected);
      
        // fetched map click
        var mapData = selected.mapData;
        console.log("mapData: ", selected);
        const encodedData = geobuf.decode(new Pbf(mapData.data));
        console.log("encodedData: ", encodedData);
        store.setRawMapFile(encodedData);
        // store.getMapFile(selected.fileName);
      
    }
  };

  const handleCreateMap = () => {
    store.openModal(CurrentModal.UPLOAD_MAP);
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
          maxHeight: "80vh",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
          },
        }}
      >
        {store.mapList.map((map, index) => [
          index > 0 && <Divider key={`divider-${map._id}`} />,
          <ListItem
            button
            onClick={() => handleMapClick(map._id)}
            key={map._id}
          >
            <ListItemText
              className="map-list-name"
              primary={map.title}
              style={{
                padding: "0px",
                backgroundColor:
                  // selectedMap && map._id === selectedMap._id
                  store.currentMapObject && store.currentMapObject._id === map._id
                    ? "#f6c0fa"
                    : "#F7D3E4",
              }}
            />
          </ListItem>,
        ])}
      </List>
      {auth.loggedIn && (
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
      )}
      <MUIUploadMap />
      <MUICreateMap />
    </Box>
  );
}
