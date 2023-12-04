"use client"

import React, { createContext, useState, useContext } from "react";
import AuthContext from "../auth";

import api from "./store-request-api";

const geobuf = require("geobuf");
const Pbf = require("pbf");

const StoreContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const StoreActionType = {
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
  UPLOAD_MAP_FILE: "UPLOAD_MAP_FILE",
  UPDATE_MAP: "UPDATE_MAP",
  GET_MAP_FILE: "GET_MAP_FILE",
  EMPTY_RAW_MAP_FILE: "EMPTY_RAW_MAP_FILE",
  SET_CSV_KEY: "SET_CSV_KEY",
  SET_CSV_LABEL: "SET_CSV_LABEL",
  SET_MAP_TYPE: "SET_MAP_TYPE",
  SET_RAW_MAP_FILE: "SET_RAW_MAP_FILE",
  LOAD_MAP_LIST: "LOAD_MAP_LIST",
  DELETE_MAP: "DELETE_MAP",
  SET_PARSED_CSV_DATA: "SET_PARSED_CSV_DATA",
  CHANGE_VIEW: "CHANGE_VIEW",
  CHANGE_CURRENT_MAP_OBJ: "CHANGE_CURRENT_MAP_OBJ",
  SET_DISABLE_SEARCH_BAR: "SET_DISABLE_SEARCH_BAR",
  SET_MAP_LIST: "SET_MAP_LIST"
};

export const CurrentModal = {
  NONE: "",
  UPLOAD_MAP: "UPLOAD_MAP",
  CREATE_MAP: "CREATE_MAP",
  FORK_MAP: "FORK_MAP",
  PUBLISH_MAP: "PUBLISH_MAP",
  DELETE_MAP: "DELETE_MAP",
};

export const MapType = {
  POLITICAL_MAP: "Political Map",
  HEATMAP: "Heatmap",
  DOT_DISTRIBUTION_MAP: "Dot Distribution Map",
  PROPORTIONAL_SYMBOL_MAP: "Proportional Symbol Map",
  TRAVEL_MAP: "Travel Map",
};

export const View = {
  COMMUNITY: "Community",
  HOME: "Home"
};

function StoreContextProvider(props) {
  const { auth } = useContext(AuthContext);

  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE, // the currently open modal
    mapFile: null, // map file uploaded for creating a new map
    rawMapFile: null,
    label: null,
    currentModal: CurrentModal.NONE, // the currently open modal
    rawMapFile: null, // geojson object
    key: null, // csv key [column name] for map displaying
    StartKey: null, // csv key [column name] for map displaying
    EndKey: null, // csv key [column name] for map displaying
    parsed_CSV_Data: null,
    mapType: null,
    currentMapObject: null,
    mapList: [],
    currentView: View.HOME,
    disableSearchBar: false
  });

  store.viewTypes = View;
  store.currentModalTypes = CurrentModal;
  store.mapTypes = MapType;



  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case StoreActionType.OPEN_MODAL: {
        return setStore({
          ...store,
          currentModal: payload.modal,
        });
      }
      case StoreActionType.CLOSE_MODAL: {
        return setStore({
          ...store,
          currentModal: CurrentModal.NONE,
        });
      }
      case StoreActionType.UPLOAD_MAP_FILE: {
        console.log(payload.file);
        return setStore({
          ...store,
          currentModal: CurrentModal.CREATE_MAP,
          rawMapFile: payload.file,
        });
      }
      case StoreActionType.UPDATE_MAP: {
        return setStore({
          ...store,
          mapFile: payload.file,
        });
      }

      case StoreActionType.EMPTY_RAW_MAP_FILE: {
        console.log("empting raw map file");
        store.rawMapFile = null; // setStore is async
        return setStore({
          ...store,
          rawMapFile: null,
        });
      }

      case StoreActionType.SET_CSV_KEY: {
        console.log("setting key to", payload.key);
        return setStore({
          ...store,
          key: payload.key,
        });
      }

      case StoreActionType.SET_PARSED_CSV_DATA: {
        return setStore({
          ...store,
          parsed_CSV_Data: payload.parsed_CSV_Data,
        });
      }

      case StoreActionType.SET_CSV_LABEL: {
        return setStore({
          ...store,
          label: payload.label,
        });
      }

      case StoreActionType.SET_MAP_TYPE: {
        return setStore({
          ...store,
          mapType: payload.mapType,
        });
      }

      case StoreActionType.SET_DISABLE_SEARCH_BAR: {
        return setStore({
          ...store,
          disableSearchBar: payload,
        });
      }

      case StoreActionType.SET_RAW_MAP_FILE: {
        return setStore({
          ...store,
          rawMapFile: payload.file,
        });
      }

      case StoreActionType.LOAD_MAP_LIST: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentModal: CurrentModal.NONE,
        });
      }

      case StoreActionType.SET_MAP_LIST: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentModal: CurrentModal.NONE,
        });
      }

      case StoreActionType.DELETE_MAP: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentModal: CurrentModal.NONE,
          rawMapFile: null,
        });
      }


      case StoreActionType.CHANGE_VIEW: {
        return setStore({
          ...store,
          currentView: payload.view
        });
      }

      case StoreActionType.CHANGE_CURRENT_MAP_OBJ: {
        return setStore({
          ...store,
          currentMapObject: payload
        });
      }

      default:
        return store;
    }
  };

  store.openModal = function (modal) {
    console.log("opening modal: ", modal);
    storeReducer({
      type: StoreActionType.OPEN_MODAL,
      payload: { modal },
    });
  };

  store.closeModal = function () {
    storeReducer({
      type: StoreActionType.CLOSE_MODAL,
      payload: null,
    });
  };

  store.uploadMapFile = function (file) {
    console.log("file entered store");
    console.log(file);
    storeReducer({
      type: StoreActionType.UPLOAD_MAP_FILE,
      payload: { file },
    });
  };

  store.createMap = function (title, mapType) {
    console.log("in create map");

    let file = store.rawMapFile;
    console.log("store.rawMapFile", store.rawMapFile);

    var data = geobuf.encode(file, new Pbf());

    api.createMap(data, auth.user.username, title, mapType).then((response) => {
      console.log(response);
      store.setCurrentMapObj(response.data.mapData);
    });
  };

  store.getMapFile = async function (fileName) {
    console.log("getMapFile: ", fileName);
    const file = await api.getMainScreenMap(fileName);
    console.log(file.data);
    // const blob = await response.blob();
    // const file = new File([blob], fileName);

    storeReducer({
      type: StoreActionType.SET_RAW_MAP_FILE,
      payload: { file: file.data },
    });
  };

  store.setRawMapFile = async function (file) {
    storeReducer({
      type: StoreActionType.SET_RAW_MAP_FILE,
      payload: { file },
    });
  };

  store.emptyRawMapFile = function () {
    console.log("store.emptyRawMapFile");
    storeReducer({
      type: StoreActionType.EMPTY_RAW_MAP_FILE,
    });
  };

  store.forkMap = async function (maptitle) {
    var mapData = store.currentMapObject.mapData;
    console.log(
      "mapData: ",
      mapData,
      auth.user.username,
      maptitle,
      store.currentMapObject.mapType
    );
    const forkMapResponse = await api
      .forkMap(
        mapData,
        auth.user.username,
        maptitle,
        store.currentMapObject.mapType
      )
      // .then((response) => {
      //   console.log(response);
      //   if (response.status === 200) {
      //     store.getMapList();
      //   }
      // });

      const mapObj = forkMapResponse.data.mapData;

      console.log(mapObj);


      if (store.currentMapObject.csvData){

        const csvObj = (await api.getCsvById(store.currentMapObject.csvData)).data.data;
        const forkedCsvData = (await api.createCSV(csvObj.key, csvObj.label, csvObj.csvData)).data.csvData._id;
        mapObj.csvData = forkedCsvData;
        await store.updateMap(mapObj);
      }

      // await store.getMapList();
      
      // store.currentMapObject = mapObj;

      store.setCurrentMapObj(mapObj);
      

  };


  store.setCurrentMapObj = function(mapObj){
    storeReducer({
      type: StoreActionType.CHANGE_CURRENT_MAP_OBJ,
      payload: mapObj,
    });
  }

  store.updateMap = function (mapObject) {
    console.log("publishing map: ", mapObject);
    api.updateMap(mapObject).then((response) => {
      console.log(response);
      if (response.status === 200) {
        store.getMapList();
      }
    });
  };

  store.updateViews = function (mapObject){
    console.log("updating views");
    api.updateMap(mapObject).then((response) => {
      console.log(response);
      if (response.status === 200) {
        // storeReducer({
        //   type: StoreActionType.CHANGE_CURRENT_MAP_OBJ,
        //   payload: { mapObject },
        // });
      }
    });
  }

  store.updateCSV = function (csvObject) {
    api.updateCSV(csvObject).then((response) => {
      console.log(response);
    });
  };

  store.deleteMap = function (mapId) {
    console.log("deleting map: ", mapId);
    api.deleteMap(mapId).then((response) => {
      console.log(response);
      if (response.status === 200) {
        api.getMapsByUser().then((response) => {
          console.log(response.data.data);
          storeReducer({
            type: StoreActionType.DELETE_MAP,
            payload: { mapList: response.data.data },
          });
        });
      }
    });
  };

  store.getMapsByUser = function (callback) {
    console.log("getting maps by user");
    api
      .getMapsByUser()
      .then((response) => {
        console.log(response);
        if (
          response.status === 200 &&
          callback &&
          response.data &&
          response.data.success
        ) {
          // console.log("============================================================")
          // console.log(response.data.data)
          callback(response.data.data);
        } else {
          console.error("Failed to fetch maps", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching maps", error);
      });
  };

  store.setCsvKey = function (key) {
    store.setCsvKeyWithoutRerendering(key);

    if (key !== undefined) {
      store.key = key; // for synchronization purpose
      console.log(store.key);
      storeReducer({
        type: StoreActionType.SET_CSV_KEY,
        payload: { key },
      });
    }
  };


  store.setCsvStartKey = function (StartKey) {
    store.setCsvKeyWithoutRerendering(StartKey);

    if (StartKey !== undefined) {
      store.StartKey = StartKey; 
      console.log(store.StartKey);
      storeReducer({
        type: StoreActionType.SET_CSV_KEY,
        payload: { StartKey },
      });
    }
  };

  store.setCsvEndKey = function (EndKey) {
    store.setCsvKeyWithoutRerendering(EndKey);

    if (EndKey !== undefined) {
      store.EndKey = EndKey;
      console.log(store.EndKey);
      storeReducer({
        type: StoreActionType.SET_CSV_KEY,
        payload: { EndKey },
      });
    }
  };


  store.setCsvKeyWithoutRerendering = function (key) {
    if (key !== undefined) {
      store.key = key;
    }
  };

  store.setCsvLabel = function (label) {
    store.setCsvLabelWithoutRerendering(label);
    console.log(label);
    if (label !== undefined) {
      store.label = label; // for synchronization purpose
      storeReducer({
        type: StoreActionType.SET_CSV_LABEL,
        payload: { label },
      });
    }
  };

  store.setCsvLabelWithoutRerendering = function (label) {
    console.log(label);
    if (label !== undefined) {
      store.label = label;
    }
  };

  store.setParsedCsvData = function (data) {
    store.setParsedCsvDataWOR(data);
    // console.log('store.setParsedCsvData', data);
    storeReducer({
      type: StoreActionType.SET_PARSED_CSV_DATA,
      payload: { data },
    });
  };

  // setParsedCsvDataWithoutRendering
  store.setParsedCsvDataWOR = function (data) {
    store.parsed_CSV_Data = data;
  };

  store.setMapType = function (mapType) {
    storeReducer({
      type: StoreActionType.SET_MAP_TYPE,
      payload: { mapType },
    });
  };

  store.getMapList = async function () {
    if (store.isHomePage()) {
      api.getMapsByUser().then((response) => {
        console.log(response.data.data);
        storeReducer({
          type: StoreActionType.LOAD_MAP_LIST,
          payload: { mapList: response.data.data },
        });
      });
    } else {
      const publishedMaps = await store.getPublishedMaps();
      console.log(publishedMaps);
      storeReducer({
        type: StoreActionType.LOAD_MAP_LIST,
        payload: { mapList: publishedMaps },
      });
    }
  };
  
  store.setMapList = async function (mapList) {
    store.mapList = mapList;
      storeReducer({
        type: StoreActionType.SET_MAP_LIST,
        payload: { mapList },
      });
  };

  store.getMapById = async function (id) {
    const response = await api.getMapById(id);
    const mapObj = response.data.data;
    console.log(mapObj);
    return mapObj;
  };

  store.getCsvById = async function (id) {
    const response = await api.getCsvById(id);
    const csvObj = response.data.data;
    console.log(csvObj);
    return csvObj;
  };

  store.saveCSV = async function () {
    let csvObj;
    if (!store.currentMapObject.csvData) {
      const response = await api.createCSV(
        store.key,
        store.label,
        store.parsed_CSV_Data
      );
      console.log("response", response);
      const csvObj = response.data.csvData;

      store.currentMapObject.csvData = csvObj._id;
      store.updateMap(store.currentMapObject);
    } else {
      // find the csvObj

      const csvObj = await store.getCsvById(store.currentMapObject.csvData);
      console.log(csvObj);
      csvObj.key = store.key;
      csvObj.label = store.label;
      csvObj.csvData = store.parsed_CSV_Data;
      console.log(csvObj);
      store.updateCSV(csvObj);
    }
  };

  store.getPublishedMaps = async function () {
    const response = await api.getPublishedMaps();
    const publishedMaps = response.data.data;
    return publishedMaps;
  };


  store.changeView = function (view) {


    if (view === store.viewTypes.HOME && !auth.loggedIn){
      return;
    }
    console.log("changing view to", view)
    store.currentView = view; 
    storeReducer({
      type: StoreActionType.CHANGE_VIEW,
      payload: {view}
    });
  };

  store.setDisableSearchBar = function(disableSearchBar) {
    storeReducer({
      type: StoreActionType.SET_DISABLE_SEARCH_BAR,
      payload: disableSearchBar
    });
  }

  store.isCommunityPage = ()=>{return store.currentView === store.viewTypes.COMMUNITY};
  store.isHomePage = ()=>{return store.currentView === store.viewTypes.HOME};


  return (
    <StoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
}

export default StoreContext;
export { StoreContextProvider };
