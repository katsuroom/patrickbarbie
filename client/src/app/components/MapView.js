"use client"

import React, { useState, useContext, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { IconButton, Typography, Divider, Box } from '@mui/material';
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
import MUIExportImage from '../modals/MUIExportMap';
import './MapView.css';

export default function MapView() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  const [initialComments, setInitialComments] = useState([]);
  const [likeAnimation, setLikeAnimation] = useState(false);

  useEffect(() => {
    if (store.currentMapObject) {
      let newInitialComments = store.currentMapObject.comments;
      setInitialComments(newInitialComments);
    }
  }, [store.currentMapObject]);

  // Handling the like click
  const handleLikeClick = () => {
    if (auth.loggedIn) {
      let currentMap = store.currentMapObject;
      console.log(currentMap.likedUsers.includes(auth.user.username));
      if (currentMap.likedUsers.includes(auth.user.username)) {
        let index = currentMap.likedUsers.findIndex((user) => user == auth.user.username);
        currentMap.likedUsers.splice(index, 1);
      }
      else {
        currentMap.likedUsers.push(auth.user.username);
      }
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 500); 
      store.updateMap(currentMap);
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
    router.push(`/edit?mapId=${store.currentMapObject._id}`);
  }

  function handleDownloadClick() {
    store.openModal(CurrentModal.EXPORT_MAP);
  }

  function handleForkClick() {
    store.openModal(CurrentModal.FORK_MAP);
  }

  // Main component render
  const res = (
    <div style={{ overflowY: "scroll", height: "80vh" }}>
      {store.pageLoading && <div id="loader" className="custom-loader" />}
      <div >
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
        <Typography
          sx={{ fontFamily: "Sen", color: "black", fontWeight: "bold", letterSpacing: "1px" }}
        >
          {store.currentMapObject?.author}
        </Typography>
        <Box
          style={{
            marginLeft: "auto",
            marginRight: 0,
            display: "flex",
          }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton disabled={true}>
              <VisibilityIcon sx={{ color: "black" }} />
            </IconButton>
            <Typography
              sx={{ fontFamily: "Sen", color: "black" }}
            >
              {store.currentMapObject?.views}
            </Typography>
          </div>
          <Divider orientation="vertical" flexItem sx={{ padding: 1, borderColor: "#f786b9", borderRightWidth: 2 }} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              className={`likeButton ${likeAnimation ? 'animate-like' : ''}`}
              onClick={handleLikeClick}
              disabled={!auth.loggedIn}
              title="Like"
            >
              <FavoriteIcon sx={{ color: store.currentMapObject?.likedUsers.includes(auth.user?.username) ? "red" : "dark-gray" }} />
            </IconButton>
            <Typography
              sx={{ fontFamily: "Sen", color: "black" }}
            >
              {store.currentMapObject?.likedUsers.length}
            </Typography>
          </div>
          <Divider orientation="vertical" flexItem sx={{ padding: 1, borderColor: "#f786b9", borderRightWidth: 2 }} />
          <IconButton
            className="deleteButton"
            onClick={handleDeleteClick}
            title="Delete"
            disabled={
              !auth.loggedIn ||
              !store.currentMapObject ||
              auth.user.username !== store.currentMapObject.author
            }
          >
            <Delete />
          </IconButton>
          <IconButton
            className="publishButton"
            disabled={store.currentMapObject?.isPublished}
            onClick={handlePublishClick}
            title="Publish"
          >
            <CloudUpload />
          </IconButton>
          <IconButton
            className="editButton"
            onClick={handleEditClick}
            title="Edit"
            disabled={
              !auth.loggedIn ||
              !store.currentMapObject ||
              auth.user.username !== store.currentMapObject.author
            }
          >
            <Edit />
          </IconButton>
          <IconButton
            className="downloadButton"
            onClick={handleDownloadClick}
            title="Download"
          >
            <Download />
          </IconButton>
          <IconButton
            className="forkButton"
            onClick={handleForkClick}
            disabled={!auth.loggedIn}
            title="Fork"
          >
            <Share />
          </IconButton>
        </Box>
      </div>
      <div style={{ backgroundColor: "#FDF4F3", padding: 10, margin: 10 }}>
        <CommentSection initialComments={initialComments} />
      </div>
      <MUIDeleteMap />
      <MUIForkMap />
      <MUIPublishMap />
      <MUIExportImage />
    </div>
  );

  return store.rawMapFile ? res : null;
}
