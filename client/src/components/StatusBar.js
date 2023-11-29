import React, { useContext } from "react";
import StoreContext from "../store";
import Typography from "@mui/material/Typography";

import "./font.css"






export default function StatusBar() {
  const { store } = useContext(StoreContext);

    return (
    <div 
    // style={{backgroundColor: "#f786b9", minHeight: "50px", height: "8vh"}}
    style={{backgroundColor: "#f786b9", position: "absolute", width: "100%", height: "8vh", bottom: "0%", textAlign: "center"}}
    >
      <Typography variant="h4" component="div" sx={{ fontFamily: 'Sen' }}>
      {store.currentMapObject && store.currentMapObject.title}
                </Typography>
      
  
    </div>);
  }
  