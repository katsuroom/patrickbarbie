import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import './MUIPublishMap.css';
import { useHistory } from 'react-router-dom';

export const ConfirmationDialog = ({ open, onClose, onConfirm, confirmationInfo, projectName, handleInputChange }) => {
    const [mapType, setMapType] = useState("Map Type");

    const buttonStyle = {
        mt: 1,
        mb: 3,
        backgroundColor: "white",
        color: "black",
        ":hover": {
            backgroundColor: "lightpink",
        },
        border: "3px solid white",
        width: "80px",
        margin: '20px',
    };

    const selectStyle = {
        width: "100%",
        marginBottom: "20px",
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    width: 400,
                    bgcolor: "lightPink",
                    color: "black",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 10,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: 0,
                    textAlign: "center",
                }}
            >
                <div className="alertContainer">
                    <div className="alert">
                        {confirmationInfo}
                    </div>
                    <div className="confrim" style={{ height: '70%' }}>
                        <input0
                            type="text"
                            value={projectName}
                            onChange={handleInputChange}
                            placeholder="Your Project Name"
                        />
                        <Select
                            value={mapType}
                            onChange={(e) => setMapType(e.target.value)}
                            style={selectStyle}
                        >
                            <MenuItem value="Map Type">Map Type</MenuItem>
                            <MenuItem value="Political Map">Political Map</MenuItem>
                            <MenuItem value="HeatMap">HeatMap</MenuItem>
                            <MenuItem value="Dot Distribution Map">Dot Distribution Map</MenuItem>
                            <MenuItem value="Proportional Symbol Map">Proportional Symbol Map</MenuItem>
                            <MenuItem value="Travel Map">Travel Map</MenuItem>
                        </Select>
                        <Button onClick={onClose} variant="contained" sx={buttonStyle}>
                            Cancel
                        </Button>
                        <Button onClick={onConfirm} variant="contained" sx={buttonStyle}>
                            Create
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

const MUICreateMap = () => {
    const history = useHistory();
    const [projectName, setProjectName] = useState("");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        history.push('/main');
    }

    const confirmationInfo = "Enter the new name of the forked map:";

    const handleSave = () => {
        console.log("Map Created!");
        handleClose();
        history.push("/edit");
    };

    const handleInputChange = (e) => {
        setProjectName(e.target.value);
    };

    return (
        <div>
            {/* <Button onClick={handleOpen}>Open Confirmation</Button> */}
            <ConfirmationDialog
                open={true}
                onClose={handleClose}
                onDiscard={handleClose}
                onConfirm={handleSave}
                confirmationInfo={confirmationInfo}
                projectName={projectName}
                handleInputChange={handleInputChange}
            />
        </div>
    );
};

export default MUICreateMap;
