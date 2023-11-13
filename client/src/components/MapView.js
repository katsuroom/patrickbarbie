import { IconButton, Typography } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./font.css";
import React, { useEffect, useState, useRef } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Grid } from "@mui/material";
import { Delete, CloudUpload, Edit, Download, Share } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

export default function MapView()
{
    const history = useHistory();
    useEffect(() => {
        let map = L.map('map').setView([51.505, -0.09], 2);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    });

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
        history.push("/forkMap");
    }
    

  return (
    <div style={{overflowY: "scroll", height: "50%"}}>
        <div id="map" style={{height: 400}}></div>
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
                    <Typography sx={{fontFamily: 'Sen', color: "black"}}>Kerrance</Typography>
                </Grid>
                <Grid item xs={0.4}>
                    <VisibilityIcon />
                </Grid>
                <Grid item xs={1}>
                    <Typography sx={{fontFamily: 'Sen', color: "black"}}>10</Typography>
                </Grid>
                <Grid item xs={0.4}>
                    <FavoriteIcon />
                </Grid>
                <Grid item xs={5.5}>
                    <Typography sx={{fontFamily: 'Sen', color: "black"}}>26</Typography>
                </Grid>

                <Grid item xs={0.5}>
                <IconButton>
                    <Delete onClick={handleDeleteClick} />
                    </IconButton>
                </Grid>
                <Grid item xs={0.5}>
                 <IconButton>
                    <CloudUpload onClick={handlePublishClick} />
                    </IconButton>
                </Grid>
                <Grid item xs={0.5}>
                    <IconButton>
                        <Edit onClick={handleEditClick} />
                    </IconButton>
                </Grid>
                <Grid item xs={0.5}>
                <IconButton>
                    <Download onClick={handleDownloadClick} />
                    </IconButton>
                </Grid>
                <Grid item xs={0.5}>
                <IconButton>
                    <Share onClick={handleForkClick} />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
        {/* <div style={styles.commentsSection}>
            <div style={styles.commentCount}>{comments.length} comments</div>
            {comments.map((comment) => (
            <div key={comment.id} style={styles.comment}>
                <div style={styles.commentUser}>{comment.name}</div>
                <div style={styles.commentText}>{comment.text}</div>
            </div>
            ))}
        </div> */}
        <div style={{backgroundColor: "#FDF4F3", padding: 10, margin: 10}}>
            <Typography sx={{fontFamily: 'Sen', color: "black", fontSize: "16pt"}}>0 comments</Typography>

        </div>
    </div>
  )
}