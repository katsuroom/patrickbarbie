// import React, { useState } from "react";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import './MUIPublishMap.css'
// import { useHistory } from 'react-router-dom';

// export const ConfirmationDialog = ({ open, onClose, onConfirm, confirmationInfo }) => {
//     const buttonStyle = {
//         mt: 1,
//         mb: 3,
//         backgroundColor: "white",
//         color: "black",
//         ":hover": {
//             backgroundColor: "lightpink",
//         },
//         border: "3px solid white",
//         width: "50px",
//         margin: '40px',
//     };

//     return (
//         <Modal open={open} onClose={onClose}>
//             <Box
//                 sx={{
//                     position: "absolute",
//                     width: 400,
//                     bgcolor: "lightPink",
//                     color: "black",
//                     border: "2px solid #000",
//                     boxShadow: 24,
//                     p: 10,
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     padding: 0,
//                     textAlign: "center",
//                 }}
//             >
//                 <div className="alertContainer">
//                     <div className="alert">
//                         {confirmationInfo}
//                     </div>
//                     <div className="confrim">
//                         <Button onClick={onClose}
//                             variant="contained"
//                             sx={buttonStyle}
//                         >
//                             No
//                         </Button>
//                         <Button onClick={onConfirm}
//                             variant="contained"
//                             sx={buttonStyle}
//                         >
//                             Yes
//                         </Button>
//                     </div>
//                 </div>
//             </Box>
//         </Modal>
//     );
// };


// const MUIPublishMap = () => {
//     const history = useHistory();
//     const [open, setOpen] = useState(false);

//     const handleOpen = () => setOpen(true);
//     const handleClose = () => {
//         setOpen(false);
//         history.push("/main");
//     }

//     const confirmationInfo = "Are you sure you want to publish this map?";

//     const handleConfirm = () => {
//         console.log("Map published!");
//         handleClose();
//     };

//     return (
//         <div>
//             {/* //publish button should link to here */}
//             {/* <Button onClick={handleOpen}>Open Confirmation</Button> */}
//             <ConfirmationDialog
//                 open={true}
//                 onClose={handleClose}
//                 onConfirm={handleConfirm}
//                 confirmationInfo={confirmationInfo}
//             />
//         </div>
//     );
// };

// export default MUIPublishMap;
import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import './MUIPublishMap.css'

import StoreContext from '../../store';
import { CurrentModal } from '../../store';
// import { ObjectId } from "mongodb";

export default function MUIPublishMap() {
    const { store } = useContext(StoreContext);

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

    const handleSave = () => {
        console.log("publish map");
        // TODO: I need pass the mapId to the backend here

        var mapId = "655a9d69bb02d728d9fbcf76";
        store.publishMap(mapId);
        onClose();
    }

    const onClose = () => {
        store.closeModal();
    }

    return (
      <Modal open={store.currentModal === CurrentModal.PUBLISH_MAP}>
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
            <div className="alert">Are you sure you want to publish this map?</div>
            <div className="confirm">
              <Button onClick={handleSave} variant="contained" sx={buttonStyle}>
                Confirm
              </Button>
              <Button onClick={onClose} variant="contained" sx={buttonStyle}>
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    );
};