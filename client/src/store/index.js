import React, { createContext, useState } from "react";

const StoreContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const StoreActionType = {
    OPEN_MODAL: "OPEN_MODAL",
    CLOSE_MODAL: "CLOSE_MODAL",
    SET_MAP_FILE: "SET_MAP_FILE"
};

export const CurrentModal = {
    NONE: "",
    UPLOAD_MAP: "UPLOAD_MAP",
    CREATE_MAP: "CREATE_MAP",
    FORK_MAP: "FORK_MAP",
};

function StoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,            // the currently open modal
        uploadedMap: null                           // map file uploaded for creating a new map
    });

    // useEffect(() => {
    //     auth.getLoggedIn();
    // }, []);

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
            case StoreActionType.SET_MAP_FILE: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.CREATE_MAP,
                    uploadedMap: payload.file
                });
            }
            default:
                return store;
        }
    }

    store.openModal = function(modal)
    {
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

    store.setMapFile = function(file)
    {
        storeReducer({
            type: StoreActionType.SET_MAP_FILE,
            payload: { file }
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