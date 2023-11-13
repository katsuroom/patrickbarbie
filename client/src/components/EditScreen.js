import React from 'react';
import PPolitical from "./PPolitical";
import MapEditorToolbar from "./MapEditorToolBar";
import editScreenDemo from "../images/editScreenDemo.png"

export default function EditScreen() {
    const layoutStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '20vh 0',
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
        right: '0',
        paddingBottom: '10%',
    };

    return (
        <div style={layoutStyle}>
            <div style={toolbarStyle}>
                <MapEditorToolbar />
            </div>
            <img src={editScreenDemo} alt="Edit Screen Demo" style={imageStyle} /> {/* Apply the image style */}
            <div style={politicalStyle}>
                <PPolitical />
            </div>
        </div>
    );
}
