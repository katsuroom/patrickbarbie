import { ConfirmationDialog } from "./MUIPublishMap";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const MUIDeleteMap = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const confirmationInfo = "Are you sure you want to delete this map? This action cannot be reversed.";

    const handleConfirm = () => {
        console.log("Map Deleted!");
        handleClose();
    };

    return (
        <div>
            {/* //publish button should link to here */}
            <Button onClick={handleOpen}>Open Confirmation</Button>
            <ConfirmationDialog
                open={open}
                onClose={handleClose}
                onConfirm={handleConfirm}
                confirmationInfo={confirmationInfo}
            />
        </div>
    );
};

export default MUIDeleteMap;