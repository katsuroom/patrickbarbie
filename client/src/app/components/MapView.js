"use client"

import React, { useState, useContext, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { IconButton, Typography, Grid } from '@mui/material';
import '../font.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Delete, CloudUpload, Edit, Download, Share } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import CommentSection from './CommentSection';
import StoreContext from '@/store';
import { CurrentModal } from '@/store';
import AuthContext from '@/auth';
import MapDisplay from './MapDisplay';
import MUIDeleteMap from '../modals/MUIDeleteMap';
import MUIForkMap from '../modals/MUIForkMap';
import MUIPublishMap from '../modals/MUIPublishMap';

export default function MapView({ fileSelected, projectName, mapType }) {
    const { store } = useContext(StoreContext);
    const { auth } = useContext(AuthContext);
    const router = useRouter();

    // State for likes and like status
    // console.log("likes: ", store.currentMapObject?.likes);
    let likes = store.currentMapObject?.likes;
    // const [likes, setLikes] = useState(store.currentMapObject?.likes);
    const [hasLiked, setHasLiked] = useState(false);
    // let initialComments = [];
    const [initialComments, setInitialComments] = useState([]);


     useEffect(() => {
       // This effect runs whenever store.currentMapObject changes
       if (store.currentMapObject) {
      //  console.log("in MapView.js", store.currentMapObject);
 
       // Shallow copy of comments array
       var newInitialComments = store.currentMapObject.comments;
      //  console.log("newInitialComments: ", newInitialComments);
 
       // Update the state with the new initialComments
       // initialComments = newInitialComments;
       setInitialComments(newInitialComments);
      //  console.log("initialComments: ", initialComments);
       }
     }, [store.currentMapObject]);

    // Handling the like click
    const handleLikeClick = () => {
        if (auth.loggedIn && !hasLiked) {
            // setLikes(likes + 1);
            var mapObject = store.currentMapObject;
            mapObject.likes = likes + 1;
            store.updateMap(mapObject);
            setHasLiked(true);
        }
    };

    // Other event handlers
    function handleDeleteClick() {
        store.openModal(CurrentModal.DELETE_MAP);
    }

    function handlePublishClick() {
        store.openModal(CurrentModal.PUBLISH_MAP);
    }

    function handleEditClick() {
        router.push("/edit");
    }

    function handleDownloadClick() {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.rawMapFile));
        let downloadAnchor = document.getElementById("download-anchor");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "map.json");
        downloadAnchor.click();
    }

    function handleForkClick() {
        store.openModal(CurrentModal.FORK_MAP);
    }

    // Main component render
    const res = (
      <div style={{ overflowY: "scroll", height: "80vh" }}>
        <div style={{ width: "76vw" }}>
          <MapDisplay />
        </div>
        <div
          style={{
            backgroundColor: "#F8D6DD",
            padding: 10,
            margin: 10,
            height: "40px",
            marginTop: "0px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontFamily: "Sen", color: "black", fontWeight: "bold"}}>
                {store.currentMapObject?.author}
              </Typography>
            </Grid>
            <Grid item xs={1} style={{ display: "flex", alignItems: "center" }}>
              <VisibilityIcon />
              <Typography sx={{ fontFamily: "Sen", color: "black", marginLeft: 1 }}>
                {store.currentMapObject?.views}
              </Typography>
            </Grid>
            <Grid item xs={5.4} style={{ display: "flex", alignItems: "center" }}>
              <IconButton className="likeButton" onClick={handleLikeClick} disabled={!auth.loggedIn}>
                <FavoriteIcon />
              </IconButton>
              <Typography
                sx={{ fontFamily: "Sen", color: "black", marginLeft: 1 }}
              >
                {likes}
              </Typography>
            </Grid>
            <Grid item xs={0.5}>
              <IconButton className="deleteButton" onClick={handleDeleteClick} disabled={!auth.loggedIn || !store.currentMapObject || auth.user.username !== store.currentMapObject.author}>
                <Delete />
              </IconButton>
            </Grid>
            {store.currentView === store.viewTypes.HOME ?
            <Grid item xs={0.5}>
              <IconButton
                className="publishButton"
                disabled={store.currentMapObject?.isPublished}
                onClick={handlePublishClick}
              >
                <CloudUpload />
              </IconButton>
            </Grid>
            : <></>
            }
            <Grid item xs={0.5}>
              <IconButton className="editButton" onClick={handleEditClick} disabled={!auth.loggedIn || !store.currentMapObject || auth.user.username !== store.currentMapObject.author}>
                <Edit />
              </IconButton>
            </Grid>
            <Grid item xs={0.5}>
              <IconButton
                className="downloadButton"
                onClick={handleDownloadClick}
              >
                <Download />
              </IconButton>
            </Grid>
            <Grid item xs={0.5}>
              <IconButton className="forkButton" onClick={handleForkClick} disabled={!auth.loggedIn}>
                <Share />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <div style={{ backgroundColor: "#FDF4F3", padding: 10, margin: 10 }}>
          <CommentSection initialComments={initialComments} />
        </div>
        <MUIDeleteMap />
        <MUIForkMap />
        <MUIPublishMap />
      </div>
    );

    return store.rawMapFile ? res : null;
}
