"use client";

import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import StoreContext, { CurrentModal, View } from "@/store";
import AuthContext from "@/auth";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function MapCardList() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Add state for editing mode
  const [newTitle, setNewTitle] = useState(""); // Add state for new title

  const handleMapClick = (mapId) => {
    store.loadMapFile(mapId);
  };

  const handleCreateMap = () => {
    store.openModal(CurrentModal.UPLOAD_MAP);
  };

  const handleEditTitle = () => {
    setIsEditing(true);
    setNewTitle(store.currentMapObject.title);
  };

  const handleSaveTitle = () => {
    // Save the new title
    store.currentMapObject.title = newTitle;
    store.updateMap(store.currentMapObject)
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
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
      <Box
        sx={{
          height: "8vh",
          backgroundColor: "#FC9ABD",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontFamily: "Sen",
            fontSize: "20pt",
            fontWeight: "bold",
          }}
        >
          {store.currentView}
        </Typography>
      </Box>
      <List
        component="nav"
        aria-label="map folders"
        sx={{
          maxHeight: "73vh",
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
          <div style={{ margin: "8px", boxSizing: "border-box" }} key={map._id}>
            <ListItem
              onClick={() => handleMapClick(map._id)}
              sx={{
                padding: 0.5,
                cursor: "pointer",
              }}
            >
              <Stack
                direction="column"
                spacing={0.25}
                sx={{
                  marginLeft: 1,
                  // borderRadius: "16px",
                  paddingLeft: "8px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  paddingRight: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: "90%",

                  backgroundColor:
                    store.currentMapObject &&
                      store.currentMapObject._id === map._id
                      ? "#FDF4F3"
                      : "pink",
                  transition: "background-color 0.3s ease", // Add a smooth transition for background color change
                  ":hover": {
                    backgroundColor: "#FDF4F3", // Change background color on hover
                  },
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    fontFamily: "Sen",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    // letterSpacing: "1px",
                  }}
                  className="map-list-name"
                  primary={isEditing && store.currentMapObject._id === map._id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyPress={handleKeyPress} // Add event listener for Enter key press
                    />
                  ) : (
                    map.title
                  )}
                />
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <ListItemText
                    primaryTypographyProps={{
                      fontFamily: "Sen",
                      fontSize: "0.75rem",
                      // letterSpacing: "1px",
                    }}
                    className="map-list-types"
                    primary={map.mapType}
                  />

                  {store.isCommunityPage() ? <ListItemText
                    primaryTypographyProps={{
                      fontFamily: "Sen",
                      fontSize: "0.75rem",
                      textAlign: "right",
                      fontWeight: "bold",
                      letterSpacing: 1,
                    }}
                    className="map-list-author"
                    primary={map.author}
                  /> : null}
                </Box>

                <ListItemText
                  primaryTypographyProps={{
                    fontFamily: "Sen",
                    fontSize: "0.75rem",
                  }}
                  className="map-list-created_time"
                  primary={`Created: ${new Date(
                    map.createdAt
                  ).toLocaleString("en-US", { timeZone: "America/New_York" })}`}
                />
              </Stack>
              {store.currentMapObject &&
                store.currentMapObject._id === map._id &&
                !isEditing && store.currentView === View.HOME && ( // Show pencil icon only when the map is selected, not in editing mode, and on the home page
                  <ModeEditIcon
                    sx={{ marginLeft: "auto", cursor: "pointer" }}
                    onClick={handleEditTitle}
                  />
                )}
            </ListItem>
          </div>,
        ])}
      </List>
      {auth.loggedIn && store.currentView === View.HOME ? (
        <Fab
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "#ffabd1",
            "&:hover": {
              bgcolor: "#ffabd1",
            },
            ...(isHovered ? { transform: 'scale(1.8)', transition: 'transform 0.3s ease' } : {})
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCreateMap}
        >
          <AddIcon />
        </Fab>

      ) : null}
    </Box>
  );
}
