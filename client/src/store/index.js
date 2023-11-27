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
  SET_MAP_TYPE: "SET_MAP_TYPE",
  SET_RAW_MAP_FILE: "SET_RAW_MAP_FILE",
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
  SET_PARSED_CSV_DATA: "SET_PARSED_CSV_DATA",
};

function StoreContextProvider(props) {
  const { auth } = useContext(AuthContext);

  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE, // the currently open modal
    mapFile: null, // map file uploaded for creating a new map
    rawMapFile: null,
    key: null, // csv key [column name] for map displaying
    parsed_CSV_Data: null,
    mapType: null,
    currentMapObject: null,
  });

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

      case StoreActionType.SET_MAP_TYPE: {
        return setStore({
          ...store,
          mapType: payload.mapType,
        });
      }

      case StoreActionType.SET_RAW_MAP_FILE: {
        return setStore({
          ...store,
          rawMapFile: payload.file,
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
    console.log(file);
    storeReducer({
      type: StoreActionType.UPLOAD_MAP_FILE,
      payload: { file },
    });
  };

  store.createMap = function (title, mapType) {
    console.log("in create map");

    let file = store.rawMapFile;

    let worker;

    if (file instanceof File) {
      const reader = new FileReader();

      if (window.Worker) {
        console.log("Web worker supported");
        worker = new Worker("worker.js");
      } else {
        console.log("Web worker not supported");
      }

      reader.onload = function (event) {
        const jsonDataString = event.target.result;
        // Use the web worker for parsing
        worker.postMessage(jsonDataString);
      };
      
      worker.onmessage = function (event) {
        console.log("enter here")
        file = event.data;
        console.log(file);
      
        // Clean up the worker when done
        worker.terminate();
      
        var data = geobuf.encode(file, new Pbf());
      
        api
          .createMap(data, auth.user.username, title, mapType)
          .then((response) => {
            console.log(response);
          });
      };
      
      console.log(file);
      reader.readAsText(file);
      
    }

    // console.log(file);

    // console.log("type of file:", typeof file);

    // var data = geobuf.encode(file, new Pbf());

    // api.createMap(data, auth.user.username, title, mapType).then((response) => {
    //   console.log(response);
    // });

    //   const reader = new FileReader();
    //   reader.onload = function (event) {
    //     try {
    //       const textData = event.target.result;
    //       const jsonData = JSON.parse(textData);

    //       let mapFile = {
    //         title,
    //         author: auth.user?.username || "guest",
    //         views: 0,
    //         likes: 0,
    //         likedUsers: [],
    //         isPublished: false,
    //         mapData: {
    //           type: mapType,
    //           // data: Base64.encode(textData)
    //           //   data: jsonData,
    //           data: geobuf.encode(jsonData, new Pbf()),
    //         },
    //         csvField: {},
    //         comments: [],
    //       };

    //       switch (mapType) {
    //         // POLITICAL MAP
    //         case MapType.POLITICAL_MAP:
    //           mapFile.mapData.polygons = [];
    //           mapFile.mapData.key = [];
    //           break;
    //         // HEATMAP
    //         case MapType.HEATMAP:
    //           mapFile.mapData.color1 = "#FFC0CB"; // Light Pink
    //           mapFile.mapData.color2 = "#FF69B4"; // Brighter Pink
    //           mapFile.mapData.min = 0;
    //           mapFile.mapData.max = 100;
    //           mapFile.mapData.display = "property";
    //           break;
    //       }

    //       //   console.log("mapFile: ", mapFile.mapData);
    //       //   console.log("type of: ", typeof(mapFile.mapData));

    //       //   api
    //       //     .createMap(mapFile.mapData.data, auth.user.username, title)
    //       //     .then((response) => {
    //       //       console.log(response);
    //       //     });

    //       mapFile.mapData.data = jsonData;

    //       storeReducer({
    //         type: StoreActionType.UPDATE_MAP,
    //         payload: { file: mapFile },
    //       });
    //     } catch (error) {
    //       console.error("Error parsing GeoJSON:", error);
    //     }
    //   };

    // reader.readAsText(file);
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

  store.forkMap = function (maptitle) {
    var mapData = "";
    console.log("mapData: ", auth.user.username, maptitle);
    api.createMap(mapData, auth.user.username, maptitle).then((response) => {
      console.log(response);
    });
  };

  store.updateMap = function (mapObject) {
    console.log("publishing map: ", mapObject);
    api.updateMap(mapObject)
    .then((response) => {
        console.log(response);
    });
  };

  store.deleteMap = function (mapId) {
    console.log("deleting map: ", mapId);
    api.deleteMap(mapId).then((response) => {
      console.log(response);
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
    if (key !== undefined) {
      store.key = key; // for synchronization purpose
      console.log(store.key);
      storeReducer({
        type: StoreActionType.SET_CSV_KEY,
        payload: { key },
      });
    }
  };

  store.setCsvKeyWithoutRerendering = function (key) {
    if (key !== undefined) {
      console.log(store.key);
      store.key = key;
    }
  };
  store.setParsedCsvData = function (data) {
    // console.log('store.setParsedCsvData', data);
    storeReducer({
      type: StoreActionType.SET_CSV_KEY,
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
