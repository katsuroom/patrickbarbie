import React, { useState, useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconButton, Typography, Grid } from '@mui/material';
import './font.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Delete, CloudUpload, Edit, Download, Share } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import CommentSection from './Comments/CommentSection';
import StoreContext from '../store';
import { CurrentModal } from '../store';
import AuthContext from '../auth';
import MapDisplay from './MapDisplay';
import MUIDeleteMap from './Model/MUIDeleteMap';
import MUIForkMap from './Model/MUIForkMap';
import MUIPublishMap from './Model/MUIPublishMap';

export default function MapView({ fileSelected, projectName, mapType, views }) {
    const { store } = useContext(StoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    // State for likes and like status
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    // Handling the like click
    const handleLikeClick = () => {
        if (!hasLiked) {
            setLikes(likes + 1);
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
        history.push("/edit");
    }

    function handleDownloadClick() {
        history.push("/exportMap");
    }

    function handleForkClick() {
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


    // Main component render
    const res = (
        <div style={{ overflowY: "scroll", height: "50%" }}>
            <div style={{ width: "1500px" }}>
                <MapDisplay />
            </div>
            <div style={{ backgroundColor: "#F8D6DD", padding: 10, margin: 10, height: "40px", marginTop: "0px", display: "flex", flexDirection: "column", justifyContent: "center", flexWrap: "wrap" }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Typography sx={{ fontFamily: 'Sen', color: "black" }}>{ }</Typography>
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
                        <IconButton onClick={handleLikeClick} disabled={hasLiked}>
                            <FavoriteIcon />
                        </IconButton>
                        <Typography sx={{ fontFamily: 'Sen', color: "black", marginLeft: 1 }}>
                            {likes}
                        </Typography>
                    </Grid>
                    {auth.loggedIn && (
                        <>
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
                        </>
                    )}
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

    return store.rawMapFile ? res : <></>;
}
