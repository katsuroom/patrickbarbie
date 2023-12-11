"use client";

import React, { createContext, useState, useContext } from "react";
import AuthContext from "../auth";
import { usePathname } from "next/navigation";


import api from "./api";

const geobuf = require("geobuf");
const Pbf = require("pbf");



const StoreContext = createContext();

// comments indicate important action types that must not be removed
export const StoreActionType = {
  OPEN_MODAL: "OPEN_MODAL", // display a modal
  CLOSE_MODAL: "CLOSE_MODAL", // close the current modal

  UPLOAD_MAP_FILE: "UPLOAD_MAP_FILE", // upload a map file
  EMPTY_RAW_MAP_FILE: "EMPTY_RAW_MAP_FILE",
  SET_CSV_KEY: "SET_CSV_KEY",
  SET_CSV_LABEL: "SET_CSV_LABEL",
  SET_RAW_MAP_FILE: "SET_RAW_MAP_FILE",
  LOAD_MAP_LIST: "LOAD_MAP_LIST",

  LOAD_MAP: "LOAD_MAP",
  CREATE_MAP: "CREATE_MAP", // create a map from the uploaded file
  FORK_MAP: "FORK_MAP", // fork an existing map
  DELETE_MAP: "DELETE_MAP", // delete the currently selected map

  SET_PARSED_CSV_DATA: "SET_PARSED_CSV_DATA",
  CHANGE_VIEW: "CHANGE_VIEW",
  CHANGE_CURRENT_MAP_OBJ: "CHANGE_CURRENT_MAP_OBJ",
  SET_MAP_LIST: "SET_MAP_LIST",
  SET_MIN_COLOR: "SET_MIN_COLOR",
  SET_MAX_COLOR: "SET_MAX_COLOR",
  SET_PROPORTIONAL_VALUE: "SET_PROPORTIONAL_VALUE",
  SET_PROPORTIONAL_COLOR: "SET_PROPORTIONAL_COLOR",
  SET_POLITICAL_COLOR: "SET_POLITICAL_COLOR",

  SET_DOT_COLOR: "SET_DOT_COLOR",

  LOGOUT_USER: "LOGOUT_USER",
};

export const CurrentModal = {
  NONE: "",
  UPLOAD_MAP: "UPLOAD_MAP",
  CREATE_MAP: "CREATE_MAP",
  FORK_MAP: "FORK_MAP",
  PUBLISH_MAP: "PUBLISH_MAP",
  DELETE_MAP: "DELETE_MAP",
  EXIT_EDIT: "EXIT_EDIT",
  SAVE_EDIT: "SAVE_EDIT",
  EXPORT_MAP: "EXPORT_MAP"
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
  HOME: "Home",
};

function StoreContextProvider(props) {
  const { auth } = useContext(AuthContext);
  const pathname = usePathname();

  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE,  // the currently open modal
    uploadedFile: null,
    rawMapFile: null,
    label: null,
    key: null, // csv key [column name] for map displaying
    StartKey: null, // csv key [column name] for map displaying
    EndKey: null, // csv key [column name] for map displaying
    parsed_CSV_Data: null,
    currentMapObject: null,
    mapList: [], // loaded list of maps (idNamePairs)
    currentView: View.COMMUNITY,
    minColor: null,
    maxColor: null,
    proportional_value: [], // proportional symbol map legend data
    proColor: null,
    polColor: null,
    dotColor: null,
  });

  store.viewTypes = View;
  store.currentModalTypes = CurrentModal;

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
          uploadedFile: payload.file,
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

      case StoreActionType.SET_RAW_MAP_FILE: {
        return setStore({
          ...store,
          rawMapFile: payload.file,
        });
      }

      case StoreActionType.LOAD_MAP_LIST: {
        console.log("payload", payload);
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentMapObj: payload.currentMapObj,
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

      case StoreActionType.LOAD_MAP: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentMapObject: payload.currentMapObject,
          rawMapFile: payload.rawMapFile
        });
      }

      case StoreActionType.CREATE_MAP: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentMapObject: payload.currentMapObject,
          rawMapFile: store.uploadedFile,
          uploadedFile: null,
          currentModal: CurrentModal.NONE
        });
      }

      case StoreActionType.FORK_MAP: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentView: View.HOME,
          currentModal: CurrentModal.NONE,
          currentMapObject: payload.currentMapObject,
        });
      }

      case StoreActionType.DELETE_MAP: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentModal: CurrentModal.NONE,
          currentMapObject: null,
          rawMapFile: null,
        });
      }

      case StoreActionType.CHANGE_VIEW: {
        return setStore({
          ...store,
          currentView: payload.view,
        });
      }

      case StoreActionType.CHANGE_CURRENT_MAP_OBJ: {
        return setStore({
          ...store,
          currentMapObject: payload.mapObject,
          mapList: payload.mapList || store.mapList,
          currentModal: CurrentModal.NONE

        });
      }
      case StoreActionType.SET_MIN_COLOR: {
        return setStore({
          ...store,
          minColor: payload,
        });
      }
      case StoreActionType.SET_MAX_COLOR: {
        return setStore({
          ...store,
          maxColor: payload,
        });
      }
      case StoreActionType.SET_PROPORTIONAL_VALUE: {
        return setStore({
          ...store,
          proportional_value: payload,
        });
      }
      case StoreActionType.SET_PROPORTIONAL_COLOR:{
        return setStore({
          ...store,
          proColor: payload,
        });
      }
      case StoreActionType.SET_POLITICAL_COLOR:{
        return setStore({
          ...store,
          polColor: payload,
        });
      }
      case StoreActionType.SET_DOT_COLOR:{
        return setStore({
          ...store,
          dotColor: payload,
        });
      }
      case StoreActionType.LOGOUT_USER: {
        return setStore({
          ...store,
          rawMapFile: null,
          currentMapObject: null,
          mapList: [],
          currentView: View.COMMUNITY
        });
      };

      default:
        return store;
    }
  };

  store.setMinColor = function (color) {
    console.log("setMinColor", color);
    storeReducer({
      type: StoreActionType.SET_MIN_COLOR,
      payload: color,
    });
  };

  store.setMaxColor = function (color) {
    console.log("setMaxColor", color);

    storeReducer({
      type: StoreActionType.SET_MAX_COLOR,
      payload: color,
    });
  };

  store.setProColor = function (color) {
    console.log("setProColor", color);

    storeReducer({
      type: StoreActionType.SET_PROPORTIONAL_COLOR,
      payload: color,
    });
  };

  store.setPolColor = function (color) {
    console.log("setPolColor", color);

    storeReducer({
      type: StoreActionType.SET_POLITICAL_COLOR,
      payload: color,
    });
  };

  store.setDotColor = function (color) {
    console.log("setDotColor", color);

    storeReducer({
      type: StoreActionType.SET_DOT_COLOR,
      payload: color,
    });
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

  // uploading a map file
  store.uploadMapFile = function (file) {
    console.log("file entered store");
    console.log(file);
    storeReducer({
      type: StoreActionType.UPLOAD_MAP_FILE,
      payload: { file },
    });
  };


  // create map using uploaded file
  store.createMap = function (title, mapType) {
    console.log("in create map");

    let file = store.uploadedFile;
    // var data = geobuf.encode(file, new Pbf());
    var data = JSON.stringify(file)
    console.log(data);



    asyncCreateMap();
    async function asyncCreateMap() {
      let response = await api.createMap(data, auth.user.username, title, mapType);
      let mapObj = response.data.mapData;

      // refresh user maps
      api.getMapsByUser().then((response) => {
        console.log("fetched user maps", response.data.data);
        storeReducer({
          type: StoreActionType.CREATE_MAP,
          payload: {
            mapList: response.data.data,
            currentMapObject: mapObj
          }
        });
      });
    }
  };

  // loads map data when the map card is clicked
  store.loadMapFile = function (mapId) {
    const selected = store.mapList.find((map) => map._id === mapId);
    console.log("selected: ", selected);

    if(!selected)
      return;

    if (!store.currentMapObject || selected._id != store.currentMapObject._id)
    {
      selected.views = selected.views + 1;
      store.updateViews(selected);
    }

    // load raw map file
    // let mapDataId = selected.mapData;
    
    asyncGetMapData();
    async function asyncGetMapData()
    {
      let res = await api.getMapDataById(mapId);
      // const rawMapFile = geobuf.decode(new Pbf(res.data.data));
      // const rawMapFile = geobuf.decode(res.data.data);


      console.log(res);
      const rawMapFile = JSON.parse(res.data.data);





      storeReducer({
        type: StoreActionType.LOAD_MAP,
        payload: {
          mapList: store.mapList,
          currentMapObject: selected,
          rawMapFile: rawMapFile
        }
      });
    }
  };

  store.emptyRawMapFile = function () {
    console.log("store.emptyRawMapFile");
    storeReducer({
      type: StoreActionType.EMPTY_RAW_MAP_FILE,
    });
  };

  // fork map
  store.forkMap = function (maptitle) {
    let mapData = geobuf.encode(store.rawMapFile, new Pbf());
    console.log("mapData: ", mapData, auth.user.username, maptitle, store.currentMapObject.mapType);
    asyncForkMap();
    async function asyncForkMap() {

      // copy csv data
      let csvData = null;
      if(store.currentMapObject.csvData)
      {
        const csvObj = (await api.getCsvById(store.currentMapObject.csvData)).data.data;
        csvData = (await api.createCSV(csvObj.key, csvObj.label, csvObj.csvData)).data.csvData._id;
      }

      let response = await api.forkMap(
        mapData,
        csvData ? csvData : undefined,
        auth.user.username,
        maptitle,
        store.currentMapObject.mapType
      );

      let mapObj = response.data.mapData;

      // refresh user maps
      api.getMapsByUser().then((response) => {
        console.log("fetched user maps", response.data.data);
        storeReducer({
          type: StoreActionType.FORK_MAP,
          payload: {
            mapList: response.data.data,
            currentMapObject: mapObj,
          }
        });
      });
    }
  };

  store.updateMap = function (mapObject) {
    asyncUpdateMap(mapObject);
    async function asyncUpdateMap(mapObject) {
      let response = await api.updateMap(mapObject);
      if (response.status != 200) return;
    }

    // replace the map in maplist
    let list = store.mapList;
    let index = list.findIndex(map => map._id == mapObject._id);
    list[index] = mapObject;

    store.currentMapObject = mapObject;

    storeReducer({
      type: StoreActionType.CHANGE_CURRENT_MAP_OBJ,
      payload: {
        mapObject,
        mapList: list
      }
    });
  };

  store.updateViews = function (mapObject) {
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
  };

  store.updateCSV = function (csvObject) {
    api.updateCSV(csvObject).then((response) => {
      console.log(response);
    });
  };

  store.deleteMap = function (mapObj) {
    let mapId = mapObj._id;
    console.log("deleting map: ", mapId);
    // let mapData = mapObj.mapData;
    let csvData = mapObj.csvData;

    // delete map
    asyncDeleteMap();
    async function asyncDeleteMap()
    {
      let response = await api.deleteMap(mapId);
      if (response.status != 200) return;

      console.log("delete map success");
  
      // delete map data
      response = await api.deleteMapData(mapId);
      if (response.status != 200) return;

      console.log("delete map data success");
  
      // delete csv data
      if(csvData)
      {
        response = await api.deleteCSV(csvData);
        if (response.status != 200) return;

        console.log("delete csv data success");

        response = await api.getMapsByUser();
        storeReducer({
          type: StoreActionType.DELETE_MAP,
          payload: { mapList: response.data.data },
        });
      }
      else
      {
        response = await api.getMapsByUser();
        storeReducer({
          type: StoreActionType.DELETE_MAP,
          payload: { mapList: response.data.data },
        });
      }
    }
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

  // fetches map list based on current view
  store.getMapList = async function () {
    if (store.isHomePage())
    {
      await api.getMapsByUser().then((response) => {
        console.log("fetched user maps", response.data.data);
  
        let currentMapObj = null;
  
        if (store.currentMapObject) {
          console.log("refreshing same map");
          currentMapObj = response.data.data.find(
            (map) => map._id === store.currentMapObject._id
          );
          console.log("found same map", currentMapObj);
        }
  
        store.mapList = response.data.data;
        storeReducer({
          type: StoreActionType.LOAD_MAP_LIST,
          payload: {
            mapList: response.data.data,
            currentMapObj: currentMapObj,
          },
        });
      });
    }
    else
    {
      await api.getPublishedMaps().then((response) => {
        console.log("fetched published maps", response.data.data);
  
        let currentMapObj = null;
  
        if (store.currentMapObject)
          currentMapObj = response.data.data.find(
            (map) => map._id === store.currentMapObject._id
          );
  
        store.mapList = response.data.data;
        
        storeReducer({
          type: StoreActionType.LOAD_MAP_LIST,
          payload: {
            mapList: response.data.data,
            currentMapObj: currentMapObj,
          },
        });
      });
    }
  };

  store.searchMapsById = async function(id) {
    const response = await api.getMapById(id);
    const mapObj = response.data.data;
    console.log(mapObj);
    storeReducer({
      type: StoreActionType.SET_MAP_LIST,
      payload: { mapList: [mapObj] },
    });
  }

  store.getCsvById = async function (id) {
    const response = await api.getCsvById(id);
    const csvObj = response.data.data;
    console.log(csvObj);
    return csvObj;
  };

  store.saveCSV = async function () {
    let csvObj;
    console.log(store.currentMapObject.csvData);

    if (!store.parsed_CSV_Data) {
      store.updateMap(store.currentMapObject);
      return;
    }

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

  // switches between home and community
  store.changeView = function (view) {
    if (view === store.viewTypes.HOME && !auth.loggedIn) {
      return;
    }
    console.log("changing view to", view);

    if (store.currentView === view){
      return;
    }
    store.currentView = view;
    storeReducer({
      type: StoreActionType.CHANGE_VIEW,
      payload: { view },
    });
  };

  store.logoutUser = function() {
    storeReducer({
      type: StoreActionType.LOGOUT_USER,
      payload: { }
    });
  };
 
  store.clearCsv = function() {
    store.setParsedCsvData(null);
    store.setCsvKey(null);
    store.setCsvLabel(null);
    store.setMinColor(null);
    store.setMaxColor(null);
    store.setProColor(null);
    store.setPolColor(null);
    store.setDotColor(null);
    store.setProportionalValue([]);
  }
  

  store.isCommunityPage = () => {
    return store.currentView === store.viewTypes.COMMUNITY;
  };
  store.isHomePage = () => {
    return store.currentView === store.viewTypes.HOME;
  };
  store.showSearchBar = () => {
    return pathname == "/main" || pathname == "/mapcards";
  }

  store.setProportionalValue = function (value) {
    storeReducer({
      type: StoreActionType.SET_PROPORTIONAL_VALUE,
      payload: value,
    });
  };

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
