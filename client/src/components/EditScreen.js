import React, { useEffect, useRef, useContext } from 'react';
import PPolitical from "./PPolitical";
import MapEditorToolbar from "./MapEditorToolBar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeoJSONDisplay from './GeoJSONDisplay';
import MUIExportImage from './Model/MUIExportImage';

import StoreContext from '../store';
import { CurrentModal } from '../store';
import { useState } from 'react';

export default function EditScreen() {
    const { store } = useContext(StoreContext);
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);
    const [imageType, setImageType] = useState(null);

    const mapRef = useRef(null); // To store the map instance

    const layoutStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '10vh 0',
        boxSizing: 'border-box',
    };

    const toolbarStyle = {
        justifyContent: 'center',
        display: 'flex',
        width: '30%',
        margin: '0',
        marginLeft: '18%',
    };

    const imageStyle = {
        width: '65%', // Set the image width to 50%
        marginLeft: '1%',

    };

    const politicalStyle = {
        width: '30%',
        position: 'absolute',
        top: '20%',
        right: '5%',
        paddingBottom: '10%',
    };

    useEffect(() => {
        if(!mapRef.current)
        {
            mapRef.current = L.map('map').setView([51.505, -0.09], 2);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapRef.current);
        }
    });
    


    return (
        <div style={layoutStyle}>
            <div style={toolbarStyle}>
                <MapEditorToolbar />
            </div>
            <div id="map" style={{width: "0%", height: 0}}></div>
            <div id="image-capture-div">
                <MUIExportImage open={downloadModalOpen} setImageType={
                        setImageType
                }
                
                closeModal={() => {setDownloadModalOpen(false)}}/>
                {store.rawMapFile && <GeoJSONDisplay file={store.rawMapFile}
                openModal={() => {setDownloadModalOpen(true)}}
                imageType={imageType}
                completeDownloadCB={() => {setImageType(null)}}
                downloadComplete={false}
                />}
            </div>
            <div style={politicalStyle}>
                <PPolitical />
            </div>
        </div>
    );
}
