import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IconButton, Typography, Grid } from "@mui/material";
import "./font.css";
import React, { useEffect, useState, useRef, useContext } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Delete, CloudUpload, Edit, Download, Share } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import CommentSection from "./Comments/CommentSection";
import MUIForkMap from "./Model/MUIForkMap";
import StoreContext from "../store";
import { CurrentModal } from "../store"
import AuthContext from "../auth";
import MapDisplay from "./MapDisplay";

export default function MapView({ fileSelected, projectName, mapType, views }) {

    const { store } = useContext(StoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();
    // const mapRef = useRef(null);
    // const geoJsonLayerRef = useRef(null);


    //temp used
    const [likes, setLikes] = useState(0);
    const handleLikeClick = () => {
        setLikes(likes + 1);
    };


    // useEffect(() => {
    //     if (!mapRef.current) {
    //         mapRef.current = L.map('map').setView([51.505, -0.09], 2);
    //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
    //     }

    //     if (fileSelected && fileSelected instanceof File) {
    //         const reader = new FileReader();
    //         reader.onload = function (event) {
    //             try {
    //                 const jsonData = JSON.parse(event.target.result);
    //                 if (geoJsonLayerRef.current) {
    //                     mapRef.current.removeLayer(geoJsonLayerRef.current);
    //                 }
    //                 geoJsonLayerRef.current = L.geoJSON(jsonData);
    //                 geoJsonLayerRef.current.addTo(mapRef.current);
    //                 mapRef.current.fitBounds(geoJsonLayerRef.current.getBounds());
    //             } catch (error) {
    //                 console.error("Error parsing GeoJSON:", error);
    //             }
    //         };
    //         reader.readAsText(fileSelected);
    //     }
    // }, [fileSelected]);

    function handleDeleteClick() {
        history.push("/deleteMap");
    }

    function handlePublishClick() {
        history.push("/publishMap");
    }

    function handleEditClick() {
        history.push("/edit");
    }

    function handleDownloadClick() {
        history.push("/exportMap");
    }

    function handleForkClick() {
        // history.push("/forkMap");
        console.log("Forking map");
        store.openModal(CurrentModal.FORK_MAP);
    }

    // Hardcoded comments
    const initialComments = [
        {
            id: 1,
            author: "Scott",
            timestamp: "1 hour ago",
            text: "I love this map, thanks for sharing",
            replies: [
                {
                    id: 101,
                    author: "Yuxuan",
                    timestamp: "45 minutes ago",
                    text: "I agree, it was brilliant and creative"
                }
            ]
        },
        {
            id: 2,
            author: "Kerrance",
            timestamp: "2 hours ago",
            text: "Creative map! I forked to make some edits myself",
            replies: []
        },
        {
            id: 3,
            author: "Tom",
            timestamp: "3 hours ago",
            text: "I think you can make improvements in the state section of the map",
            replies: []
        }
    ];
    



        const res = (
        <div style={{ overflowY: "scroll", height: "50%" }}>
            {/* <div id="map" style={{ height: 400 }}></div> */}
            <div style={{ width: "1500px" }}>
            <MapDisplay/>
            </div>
            <div style={{
                backgroundColor: "#F8D6DD",
                padding: 10,
                margin: 10,
                height: "40px",
                marginTop: "0px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flexWrap: "wrap"
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Typography sx={{ fontFamily: 'Sen', color: "black" }}>{}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton>
                            <VisibilityIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={0.4}>
                        <Typography sx={{ fontFamily: 'Sen', color: "black" }}></Typography>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleLikeClick}>
                            <FavoriteIcon />
                        </IconButton>
                        <Typography sx={{ fontFamily: 'Sen', color: "black", marginLeft: 1 }}>
                            {likes}
                        </Typography>
                    </Grid>
                    <Grid item xs={0.5}>
                        <IconButton onClick={handleDeleteClick}>
                            <Delete />
                        </IconButton>
                    </Grid>
                    <Grid item xs={0.5}>
                        <IconButton onClick={handlePublishClick}>
                            <CloudUpload />
                        </IconButton>
                    </Grid>
                    <Grid item xs={0.5}>
                        <IconButton onClick={handleEditClick}>
                            <Edit />
                        </IconButton>
                    </Grid>
                    <Grid item xs={0.5}>
                        <IconButton onClick={handleDownloadClick}>
                            <Download />
                        </IconButton>
                    </Grid>
                    <Grid item xs={0.5}>
                        <IconButton onClick={handleForkClick}>
                            <Share />
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
            <div style={{ backgroundColor: "#FDF4F3", padding: 10, margin: 10 }}>
                {/* <Typography sx={{ fontFamily: 'Sen', color: "black", fontSize: "16pt" }}>0 comments</Typography> */}

                {<CommentSection initialComments={initialComments} />}
            </div>
        </div>
    );
    return store.rawMapFile ? res : <></>;
}