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
import MUIUploadMap from "../modals/MUIUploadMap";
import MUICreateMap from "../modals/MUICreateMap";
const Pbf = require("pbf");
const geobuf = require("geobuf");
import "../font.css";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";

export default function EditScreen() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const func = async () => {
      if (auth.loggedIn) {
        console.log("change view to home");
        console.log("auth.loggedIn", auth.loggedIn);
        await store.changeView(store.viewTypes.HOME);
      } else {
        console.log("change view to community");
        await store.changeView(store.viewTypes.COMMUNITY);
      }

      store.getMapList();
    };
    func();
  }, []);

  useEffect(() => {
    const func = async () => {
      // clear CSV fields

      store.setParsedCsvData(null);
      store.setCsvKey(null);
      store.setCsvLabel(null);

      if (store.currentMapObject && store.currentMapObject.csvData) {
        const csvObj = await store.getCsvById(store.currentMapObject.csvData);

        console.log(csvObj);

        store.setParsedCsvData(csvObj.csvData);
        store.setCsvKey(csvObj.key);
        store.setCsvLabel(csvObj.label);
      }
    };
    func();
  }, [store.currentMapObject]);

  return (
    <>
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
                spacing={1}
                sx={{
                  marginLeft: 1,
                  // borderRadius: "16px",
                  paddingLeft: "16px",
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
                  primary={map.title}
                />

                <ListItemText
                  primaryTypographyProps={{
                    fontFamily: "Sen",
                    fontSize: "1rem",
                    // letterSpacing: "1px",
                  }}
                  className="map-list-types"
                  primary={`Map Type: ${map.mapType}`}
                />

                <ListItemText
                  primaryTypographyProps={{
                    fontFamily: "Sen",
                    fontSize: "1rem",
                    // letterSpacing: "1px",
                  }}
                  className="map-list-author"
                  primary={`Author: ${map.author}`}
                />
              </Stack>
            </ListItem>
          </div>,
        ])}
      </List>
    </>
  );
}
