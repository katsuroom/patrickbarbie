import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import StoreContext, {CurrentModal} from "../store";
import AuthContext from "../auth";


export default function MapCardList(props) {
  const history = useHistory();
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
    if (auth.loggedIn && auth.user) {
      const updateMapsInState = (fetchedMaps) => {
        setMaps(fetchedMaps);
      };

      store.getMapsByUser(updateMapsInState);
    }
  }, [auth.user, auth.loggedIn, store]);


  const handleCreateMap = () => {
    store.openModal(CurrentModal.UPLOAD_MAP);
    // store.openModal("UPLOAD_MAP");
  };

  const handleMapClick = (mapId) => {
    const selected = maps.find(map => map.id === mapId);
    if (selected) {
      setSelectedMap(selected);
      store.getMapFile(selected.fileName);
    }
  };

  return (
    <Box
      sx={{
        width: "25%",
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
          <React.Fragment key={map._id}>
            {index > 0 && <Divider />}
            <ListItem button onClick={() => handleMapClick(map._id)}>
              <ListItemText
                primary={map.title}
                style={{
                  padding: "0px",
                  backgroundColor: selectedMap && map._id === selectedMap._id ? "#f6c0fa" : "#F7D3E4",
                }}
              />
            </ListItem>
          </React.Fragment>
        ))}
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
      {/* <MUIUploadMap />
      <MUICreateMap />
      {selectedMap && (
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
