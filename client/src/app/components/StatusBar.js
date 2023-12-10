"use client";

import React, { useContext } from "react";
import StoreContext from "../../store";
import Typography from "@mui/material/Typography";

export default function StatusBar() {
  const { store } = useContext(StoreContext);
  return (
    <div
      style={{
        backgroundColor: "#f786b9",
        position: "absolute",
        width: "100%",
        height: "8vh",
        bottom: "0%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" component="div" sx={{ fontFamily: "Sen" }}>
        {store.currentMapObject &&
          store.currentMapObject.title +
            " (Map ID: " +
            store.currentMapObject._id +
            ")"}
      </Typography>
    </div>
  );
}
