"use client";

import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import StoreContext, { CurrentModal, View } from "@/store";
import AuthContext from "@/auth";
import { useRouter } from "next/navigation";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import './page.css'

export default function EditScreen() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);
  const [hoveredMap, setHoveredMap] = useState(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

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
      store.setParsedCsvData(null);
      store.setCsvKey(null);
      store.setCsvLabel(null);
      store.setTableLabel(null)

      if (store.currentMapObject && store.currentMapObject.csvData) {
        const csvObj = await store.getCsvById(store.currentMapObject.csvData);

        store.setParsedCsvData(csvObj.csvData);
        store.setCsvKey(csvObj.key);
        store.setCsvLabel(csvObj.label);
      }
    };
    func();
  }, [store.currentMapObject]);

  const handleMapClick = (mapId) => {
    store.loadMapFile(mapId);
    router.push("/main");
  };

  const handleCreateMap = () => {
    store.openModal(CurrentModal.UPLOAD_MAP);
  };

  const renderMapItem = (map) => (
    <Grid item xs={12} sm={3} md={3} lg={3} key={map._id}>
      <ListItem
        onClick={() => handleMapClick(map._id)}
        sx={{
          padding: 1,
          cursor: "pointer",
        }}
      >
        <Stack
          direction="column"
          spacing={0.5}
          sx={{
            marginLeft: 1,
            paddingLeft: "16px",
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingRight: "16px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            width: "100%",
            borderRadius: "8px",
            backgroundColor:
              store.currentMapObject && store.currentMapObject._id === map._id
                ? "#FDF4F3"
                : "pink",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            transform: "translateY(0)",
            ":hover": {
              backgroundColor: "#FDF4F3",
              transform: "translateY(-10px)",
            },
          }}
        >
          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
            className="map-list-name"
            primary={map.title}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <ListItemText
              primaryTypographyProps={{
                fontFamily: "Sen",
                fontSize: "0.75rem",
              }}
              className="map-list-types"
              primary={map.mapType}
            />

            {store.isCommunityPage() ? (
              <ListItemText
                primaryTypographyProps={{
                  fontFamily: "Sen",
                  fontSize: "0.75rem",
                  textAlign: "right",
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
                className="map-list-author"
                primary={`${map.author}`}
              />
            ) : null}
          </Box>

          <Divider sx={{ marginY: 1 }} />

          {/* Image Preview */}
          <img
            src={
              map.imageBuffer
                ? `data:image/png;base64,${Buffer.from(map.imageBuffer).toString('base64')}`
                : "./empty_world.png"
            }
            alt="Map Preview"
            style={{ width: 200, height: 80 }}
          />

          <Divider sx={{ marginY: 1 }} />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "0.75rem",
            }}
            className="map-list-likes"
            primary={`Likes: ${map.likedUsers.length}`}
          />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "0.75rem",
            }}
            className="map-list-views"
            primary={`Views: ${map.views}`}
          />

          <Divider sx={{ marginY: 1 }} />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "0.75rem",
            }}
            className="map-list-created_time"
            primary={`Created: ${new Date(map.createdAt).toLocaleString(
              "en-US",
              { timeZone: "America/New_York" }
            )}`}
          />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "0.75rem",
            }}
            className="map-list-last-modified"
            primary={`Last Modified: ${new Date(map.updatedAt).toLocaleString(
              "en-US",
              { timeZone: "America/New_York" }
            )}`}
          />
        </Stack>
      </ListItem>
    </Grid>
  );

  return (
    <>
      <Box
        sx={{
          height: "8vh",
          backgroundColor: "#FC9ABD",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center"
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
        {auth.loggedIn && store.currentView === View.HOME ? (
          <Fab
            size="small"
            sx={{
              left: 80,
              bgcolor: "#ffabd1",
              "&:hover": {
                bgcolor: "#ffabd1",
              },
            }}
            onClick={handleCreateMap}
          >
            <AddIcon />
          </Fab>
        ) : null}
      </Box>
      {store.pageLoading && <div id="loader" className="custom-loader" />}

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
        <Grid container spacing={2}>
          {store.mapList.map((map, index) => [
            index > 0 && <Divider key={`divider-${map._id}`} />,
            renderMapItem(map),
          ])}
        </Grid>
      </List>
    </>
  );

}
