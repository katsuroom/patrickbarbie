import React, { createContext, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './store-request-api'

const StoreContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const StoreActionType = {
    OPEN_MODAL: "OPEN_MODAL",
    CLOSE_MODAL: "CLOSE_MODAL"
};

export const CurrentModal = {
    NONE: "",
    CREATE_MAP: "CREATE_MAP"
};

function StoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE
    });
    const history = useHistory();

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