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
import StoreContext from "@/store";
import AuthContext from "@/auth";
import "../font.css";
import { useRouter } from "next/navigation";

export default function EditScreen() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);
  const [hoveredMap, setHoveredMap] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const func = async () => {
      if (auth.loggedIn) {
        await store.changeView(store.viewTypes.HOME);
      } else {
        await store.changeView(store.viewTypes.COMMUNITY);
      }

      await store.getMapList();

      if (!store.mapList.length) {
        router.push("/main");
      }
    };
    func();
  }, []);

  useEffect(() => {
    const func = async () => {
      store.setParsedCsvData(null);
      store.setCsvKey(null);
      store.setCsvLabel(null);

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

  const renderMapItem = (map) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={map._id}>
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
            paddingLeft: "16px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            width: "100%",
            borderRadius: "16px",
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

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "1.25rem",
            }}
            className="map-list-types"
            primary={`Map Type: ${map.mapType}`}
          />

          {store.isCommunityPage() ? (
            <ListItemText
              primaryTypographyProps={{
                fontFamily: "Sen",
                fontSize: "1.25rem",
              }}
              className="map-list-author"
              primary={`Author: ${map.author}`}
            />
          ) : (
            <></>
          )}

          <Divider sx={{ marginY: 1 }} />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "1rem",
            }}
            className="map-list-likes"
            primary={`Likes: ${map.likedUsers.length}`}
          />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "1rem",
            }}
            className="map-list-views"
            primary={`Views: ${map.views}`}
          />

          <Divider sx={{ marginY: 1 }} />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "1rem",
            }}
            className="map-list-created_time"
            primary={`Created At: ${new Date(map.createdAt).toLocaleString(
              "en-US",
              { timeZone: "America/New_York" }
            )}`}
          />

          <ListItemText
            primaryTypographyProps={{
              fontFamily: "Sen",
              fontSize: "1rem",
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
