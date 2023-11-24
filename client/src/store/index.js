import React, { createContext, useState, useContext } from "react";
import AuthContext from '../auth';
import { Base64 } from "js-base64";

import api from "./store-request-api";
const StoreContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const StoreActionType = {
    OPEN_MODAL: "OPEN_MODAL",
    CLOSE_MODAL: "CLOSE_MODAL",
    UPLOAD_MAP_FILE: "UPLOAD_MAP_FILE",
    UPDATE_MAP: "UPDATE_MAP",
    GET_MAP_FILE: "GET_MAP_FILE"
};

export const CurrentModal = {
    NONE: "",
    UPLOAD_MAP: "UPLOAD_MAP",
    CREATE_MAP: "CREATE_MAP",
    FORK_MAP: "FORK_MAP",
};

export const MapType = {
    POLITICAL_MAP: "Political Map",
    HEATMAP: "Heatmap",
    DOT_DISTRIBUTION_MAP: "Dot Distribution Map",
    PROPORTIONAL_SYMBOL_MAP: "Proportional Symbol Map",
    TRAVEL_MAP: "Travel Map"
};

function StoreContextProvider(props) {

    const { auth } = useContext(AuthContext);

    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,            // the currently open modal
        mapFile: null,                           // map file uploaded for creating a new map
        rawMapFile: null
    });

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case StoreActionType.OPEN_MODAL: {
                return setStore({
                    ...store,
                    currentModal: payload.modal
                });
            }
            case StoreActionType.CLOSE_MODAL: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE
                });
            }
            case StoreActionType.UPLOAD_MAP_FILE: {
                console.log(payload.file);
                return setStore({
                    ...store,
                    currentModal: CurrentModal.CREATE_MAP,
                    rawMapFile: payload.file
                });
            }
            case StoreActionType.UPDATE_MAP: {
                return setStore({
                    ...store,
                    mapFile: payload.file
                });
            }
            case StoreActionType.GET_MAP_FILE: {
                return setStore({
                    ...store,
                    rawMapFile: payload.file
                });
            }
            default:
                return store;
        }
    }

    store.openModal = function(modal)
    {
        console.log("opening modal: ", modal);
        storeReducer({
            type: StoreActionType.OPEN_MODAL,
            payload: { modal }
        });
    }

    store.closeModal = function()
    {
        storeReducer({
            type: StoreActionType.CLOSE_MODAL,
            payload: null
        });
    }

    store.uploadMapFile = function(file)
    {
        console.log(file);
        storeReducer({
            type: StoreActionType.UPLOAD_MAP_FILE,
            payload: { file }
        });
    }

    store.createMap = function(title, mapType)
    {
        let file = store.mapFile;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const textData = event.target.result;
                const jsonData = JSON.parse(textData);
        
                let mapFile = {
                    title,
                    author: auth.user?.username || "guest",
                    views: 0,
                    likes: 0,
                    likedUsers: [],
                    isPublished: false,
                    mapData: {
                        type: mapType,
                        // data: Base64.encode(textData)
                        data: jsonData
                    },
                    csvField: {},
                    comments: []
                };


                switch (mapType) {
                    // POLITICAL MAP
                    case MapType.POLITICAL_MAP:
                        mapFile.mapData.polygons = []; 
                        mapFile.mapData.key = []; 
                        break;
                    // HEATMAP
                    case MapType.HEATMAP:
                        mapFile.mapData.color1 = "#FFC0CB"; // Light Pink
                        mapFile.mapData.color2 = "#FF69B4"; // Brighter Pink
                        mapFile.mapData.min = 0;
                        mapFile.mapData.max = 100; 
                        mapFile.mapData.display = "property"; 
                        break;
                }

                // call router to add map to database

                mapFile.mapData.data = jsonData;

                storeReducer({
                    type: StoreActionType.UPDATE_MAP,
                    payload: { file: mapFile }
                });

            } catch (error) {
                console.error("Error parsing GeoJSON:", error);
            }
        };
        
        // reader.readAsText(file);
    }

    store.getMapFile = async function(fileName)
    {
        console.log("getMapFile: ", fileName);
        const file  = await api.getMainScreenMap(fileName);
        console.log(file.data);
        // const blob = await response.blob();
        // const file = new File([blob], fileName);


        storeReducer({
            type: StoreActionType.GET_MAP_FILE,
            payload: { file: file.data }
        });
    }

    return (
        <StoreContext.Provider value={{
            store
        }}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContext;
export { StoreContextProvider };