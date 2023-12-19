"use client";

import React, { createContext, useState, useContext } from "react";
import AuthContext from "../auth";
import { usePathname } from "next/navigation";
import jsTPS from "../app/common/jsTPS";
import DotColor_Transaction from "../transactions/DotColor_transaction";
import HeatColorTransaction from "../transactions/HeatColorTransaction";
import Procolor_transaction from "../transactions/Procolor_transaction";
import GeneralProperty_Transaction from "../transactions/GeneralProperty_transaction";
import CSV_Transaction from "@/transactions/CSVTransaction";

import api from "./api";

const geobuf = require("geobuf");
const Pbf = require("pbf");

const StoreContext = createContext();

const tps = new jsTPS();

// comments indicate important action types that must not be removed
export const StoreActionType = {
  OPEN_MODAL: "OPEN_MODAL", // display a modal
  CLOSE_MODAL: "CLOSE_MODAL", // close the current modal

  UPLOAD_MAP_FILE: "UPLOAD_MAP_FILE", // upload a map file
  EMPTY_RAW_MAP_FILE: "EMPTY_RAW_MAP_FILE",
  SET_CSV_KEY: "SET_CSV_KEY",
  SET_CSV_LABEL: "SET_CSV_LABEL",
  SET_RAW_MAP_FILE: "SET_RAW_MAP_FILE",
  SET_TABLE: "SET_TABLE",
  SET_TABLE_LABEL: "SET_TABLE_LABEL",
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
  SET_WAYPOINTS: "SET_WAYPOINTS",
  SET_SELECTED_MAP_LAYER: "SET_SELECTED_MAP_LAYER",
  SET_DOT_COLOR: "SET_DOT_COLOR",
  SET_SELECTED_LABEL: "SET_SELECTED_LABEL",

  LOGOUT_USER: "LOGOUT_USER",
  SET_CATEGORY_COLOR_MAPPINGS: "SET_CATEGORY_COLOR_MAPPINGS",
  SET_SELECTED_ATTRIBUTE: "SET_SELECTED_ATTRIBUTE",
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
  EXPORT_MAP: "EXPORT_MAP",
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

const SearchBy = {
  ALL: "All",
  MAP_ID: "Map ID",
  MAP_NAME: "Map Name",
  USER_NAME: "User Name",
};

const SortBy = {
  MAP_NAME: "Map Name",
  LIKES: "Most Likes",
  VIEWS: "Most Views",
  LAST_MODIFIED: "Most Recently Modified",
  CREATED_DATE: "Most Recently Created",
};

function StoreContextProvider(props) {
  const { auth } = useContext(AuthContext);
  const pathname = usePathname();

  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE, // the currently open modal
    uploadedFile: null,
    rawMapFile: null,
    table: null,
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
    categoryColorMappings: [],
    selectedAttribute: null,
    waypoints: [],
    pageLoading: false,
    selectedLabel: null,
  });

  store.viewTypes = View;
  store.currentModalTypes = CurrentModal;
  store.searchBy = SearchBy;
  store.sortBy = SortBy;

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

      case StoreActionType.SET_CATEGORY_COLOR_MAPPINGS: {
        return setStore({
          ...store,
          categoryColorMappings: payload,
        });
      }

      case StoreActionType.SET_SELECTED_ATTRIBUTE: {
        return setStore({
          ...store,
          selectedAttribute: payload,
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
          rawMapFile: payload.rawMapFile,
        });
      }

      case StoreActionType.CREATE_MAP: {
        return setStore({
          ...store,
          mapList: payload.mapList,
          currentMapObject: payload.currentMapObject,
          rawMapFile: payload.rawMapFile || store.uploadedFile,
          uploadedFile: null,
          currentModal: CurrentModal.NONE,
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
          currentModal: CurrentModal.NONE,
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
      case StoreActionType.SET_WAYPOINTS: {
        return setStore({
          ...store,
          waypoints: payload,
        });
      }
      case StoreActionType.SET_SELECTED_MAP_LAYER: {
        return setStore({
          ...store,
          selectedMapLayer: payload,
        });
      }
      case StoreActionType.SET_PROPORTIONAL_VALUE: {
        return setStore({
          ...store,
          proportional_value: payload,
        });
      }
      case StoreActionType.SET_PROPORTIONAL_COLOR: {
        return setStore({
          ...store,
          proColor: payload,
        });
      }
      case StoreActionType.SET_POLITICAL_COLOR: {
        return setStore({
          ...store,
          polColor: payload,
        });
      }
      case StoreActionType.SET_DOT_COLOR: {
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
          currentView: View.COMMUNITY,
        });
      }

      case StoreActionType.SET_TABLE: {
        return setStore({
          ...store,
          table: payload,
        });
      }

      case StoreActionType.SET_SELECTED_LABEL: {
        return setStore({
          ...store,
          selectedLabel: payload,
        });
      }
      

      default:
        return store;
    }
  };




  store.setTable = function () {
    const properties = store.rawMapFile.features.map(
      (element) => element.properties
    );
    const generalProperty = {};
    properties.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (key in generalProperty) {
          generalProperty[key].push(element[key]);
        } else {
          generalProperty[key] = [element[key]];
        }
      });
    });
  
    console.log(store.parsed_CSV_Data);
    const table = { ...generalProperty, ...store.parsed_CSV_Data };
    console.log(table);

    storeReducer({
      type: StoreActionType.SET_PARSED_CSV_DATA,
      payload: table,
    });

  }

  store.setPropertyTable = function () {
    const properties = store.rawMapFile.features.map(
      (element) => element.properties
    );
    const generalProperty = {};
    properties.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (key in generalProperty) {
          generalProperty[key].push(element[key]);
        } else {
          generalProperty[key] = [element[key]];
        }
      });
    });

    const table = { ...generalProperty};
    store.table = table;

    console.log(table);

    storeReducer({
      type: StoreActionType.SET_TABLE,
      payload: table,
    });
  };

  store.setNewTable = function (csvLabel) {
    const properties = store.rawMapFile.features.map(
      (element) => element.properties
    );

    const generalProperty = {};
    properties.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (key in generalProperty) {
          generalProperty[key].push(element[key]);
        } else {
          generalProperty[key] = [element[key]];
        }
      });
    });

    console.log(generalProperty);
    console.log(store.parsed_CSV_Data);

    // var indexs = [];

    // for (let i = 0; i < store.parsed_CSV_Data[csvLabel].length; i++) {
    //   if (
    //     generalProperty[store.currentMapObject.selectedLabel].includes(store.parsed_CSV_Data[csvLabel][i])
    //   ) {
    //     indexs.push(i);
    //   }
    // }

    // // console.log(indexs);

    // let newtable = { ...store.parsed_CSV_Data };

    // function keepElementsAtIndexes(obj, indexes) {
    //   // Iterate over each key in the object
    //   for (let key in obj) {
    //     // Check if the property is an array
    //     if (Array.isArray(obj[key])) {
    //       // Create a new array with elements from the specified indexes
    //       obj[key] = indexes
    //         .map((index) => obj[key][index])
    //         .filter((element) => element !== undefined);
    //     }
    //   }
    // }

    // keepElementsAtIndexes(newtable, indexs);


    const orderMapping = {};
    generalProperty[store.currentMapObject.selectedLabel].forEach(
      (name, index) => {
        orderMapping[name] = index;
      }
    );

    // Function to reorder the elements in 'parsed_CSV_Data' based on 'orderMapping'
    function reorderData(csvData, label, orderMap) {
      // Extract the items and their corresponding orders
      let itemsWithOrder = csvData[label].map((name, index) => {
        return { name, order: orderMap[name], originalIndex: index };
      });

      // Filter out items not present in 'orderMap' and then sort by order
      itemsWithOrder = itemsWithOrder.filter(
        (item) => item.order !== undefined
      );
      itemsWithOrder.sort((a, b) => a.order - b.order);

      // Rebuild the object with the sorted items
      let sortedData = {};
      for (let key in csvData) {
        if (Array.isArray(csvData[key])) {
          sortedData[key] = itemsWithOrder.map(
            (item) => csvData[key][item.originalIndex]
          );
        }
      }
      return sortedData;
    }

    // Reorder 'parsed_CSV_Data' based on the order in 'generalProperty'
    const reorderedParsedCSVData = reorderData(
      store.parsed_CSV_Data,
      csvLabel,
      orderMapping
    );

    const final = { ...generalProperty, ...reorderedParsedCSVData };
    console.log(final);

    store.table = final;

    storeReducer({
      type: StoreActionType.SET_TABLE,
      payload: final,
    });
  };

  store.updateTable = function (key, value, index){
    console.log("old Table: ", store.table);
    let newTable = store.table;
    newTable[key][index] = value;
    
    storeReducer({
      type: StoreActionType.SET_TABLE,
      payload: newTable,
    });
  }


  store.updateCategoryColorMappings = function (categoryColorMappings) {
    storeReducer({
      type: StoreActionType.SET_CATEGORY_COLOR_MAPPINGS,
      payload: categoryColorMappings,
    });
  };

  store.updateSelectedAttribute = function (selectedAttribute) {
    storeReducer({
      type: StoreActionType.SET_SELECTED_ATTRIBUTE,
      payload: selectedAttribute,
    });
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
  store.setWaypoints = function (waypoints) {
    console.log("setWaypoints", waypoints);
    store.waypoints = waypoints;
    storeReducer({
      type: StoreActionType.SET_WAYPOINTS,
      payload: waypoints,
    });
  };
  store.setSelectedMapLayer = function (selectedLayer) {
    console.log("Selected Map Layer:", selectedLayer);
    storeReducer({
      type: StoreActionType.SET_SELECTED_MAP_LAYER,
      payload: selectedLayer,
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
    store.pageLoading = false
  };

  store.closeModal = function () {
    storeReducer({
      type: StoreActionType.CLOSE_MODAL,
      payload: null,
    });
    store.pageLoading = false
  };

  // uploading a map file
  store.uploadMapFile = function (file) {
    store.pageLoading = true
    console.log("file entered store");
    console.log(file);
    storeReducer({
      type: StoreActionType.UPLOAD_MAP_FILE,
      payload: { file },
    });
    store.pageLoading = false
  };

  // create map using uploaded file
  store.createMap = async function (title, mapType, selectedLabel) {
    console.log("in create map");

    let file = store.uploadedFile;
    // var data = geobuf.encode(file, new Pbf());
    var data = JSON.stringify(file);
    console.log(data);

    await asyncCreateMap();
    async function asyncCreateMap() {
      let response = await api.createMap(
        data,
        auth.user.username,
        title,
        mapType,
        selectedLabel
      );
      let mapObj = response.data.mapData;
      store.currentMapObject = mapObj;

      // refresh user maps
      await api.getMapsByUser().then((response) => {
        console.log("fetched user maps", response.data.data);
        storeReducer({
          type: StoreActionType.CREATE_MAP,
          payload: {
            mapList: response.data.data,
            currentMapObject: mapObj,
          },
        });
      });
    }
    store.pageLoading = false
  };

  store.restoreMap = async function (title, mapType, geojson, mapProps) {
    console.log("in restore map");
    console.log("title", title);
    console.log("mapType", mapType);
    console.log("geojson", geojson);

    // var data = geobuf.encode(file, new Pbf());
    var data = JSON.stringify(geojson);
    console.log(data);

    await asyncCreateMap();
    async function asyncCreateMap() {
      let response = await api.createMap(
        data,
        auth.user.username,
        title,
        mapType
      );
      let mapObj = response.data.mapData;
      mapObj.mapProps = mapProps;

      await store.updateMap(mapObj);
      store.currentMapObject = mapObj;

      // refresh user maps
      await api.getMapsByUser().then((response) => {
        console.log("fetched user maps", response.data.data);
        store.mapList = response.data.data;
        store.rawMapFile = geojson;

        storeReducer({
          type: StoreActionType.CREATE_MAP,
          payload: {
            mapList: response.data.data,
            currentMapObject: mapObj,
            rawMapFile: geojson,
          },
        });
      });
    }
  };

  // loads map data when the map card is clicked
  store.loadMapFile = function (mapId) {
    const selected = store.mapList.find(
      (map) => map._id === mapId || map._id.toString() == mapId
    );
    console.log("selected: ", selected);

    if (!selected) return;

    // update view count only if new map, and is published
    if (
      (!store.currentMapObject || selected._id != store.currentMapObject._id) &&
      selected.isPublished
    ) {
      selected.views++;
      store.updateViews(selected);
    }

    tps.clearAllTransactions();

    // load raw map file
    // let mapDataId = selected.mapData;

    asyncGetMapData();
    async function asyncGetMapData() {
      let res = await api.getMapDataById(mapId);
      // const rawMapFile = geobuf.decode(new Pbf(res.data.data));
      // const rawMapFile = geobuf.decode(res.data.data);

      console.log(res);
      if (!res.data?.data) return;

      const rawMapFile = JSON.parse(res.data.data);

      storeReducer({
        type: StoreActionType.LOAD_MAP,
        payload: {
          mapList: store.mapList,
          currentMapObject: selected,
          rawMapFile: rawMapFile,
        },
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
    // let mapData = geobuf.encode(store.rawMapFile, new Pbf());
    let mapData = JSON.stringify(store.rawMapFile);
    console.log(
      "mapData: ",
      mapData,
      auth.user.username,
      maptitle,
      store.currentMapObject.mapType
    );
    asyncForkMap();
    async function asyncForkMap() {
      // copy csv data
      let csvData = null;
      if (store.currentMapObject.csvData) {
        const csvObj = (await api.getCsvById(store.currentMapObject.csvData))
          .data.data;
        csvData = (
          await api.createCSV(csvObj.key, csvObj.label, csvObj.csvData, store.currentMapObject.selectedLabel)
        ).data.csvData._id;
      }

      let mapObj = await api.forkMap(
        mapData,
        csvData ? csvData : undefined,
        auth.user.username,
        maptitle,
        store.currentMapObject.mapType,
        store.currentMapObject.mapProps,
        store.currentMapObject.selectedLabel
      );

      // refresh user maps
      api.getMapsByUser().then((response) => {
        console.log("fetched user maps", response.data.data);
        storeReducer({
          type: StoreActionType.FORK_MAP,
          payload: {
            mapList: response.data.data,
            currentMapObject: mapObj,
          },
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
    let index = list.findIndex((map) => map._id == mapObject._id);
    list[index] = mapObject;

    store.currentMapObject = mapObject;

    storeReducer({
      type: StoreActionType.CHANGE_CURRENT_MAP_OBJ,
      payload: {
        mapObject,
        mapList: list,
      },
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
    async function asyncDeleteMap() {
      let response = await api.deleteMap(mapId);
      if (response.status != 200) return;

      console.log("delete map success");

      // delete map data
      response = await api.deleteMapData(mapId);
      if (response.status != 200) return;

      console.log("delete map data success");

      // delete csv data
      if (csvData) {
        response = await api.deleteCSV(csvData);
        if (response.status != 200) return;

        console.log("delete csv data success");

        response = await api.getMapsByUser();
        storeReducer({
          type: StoreActionType.DELETE_MAP,
          payload: { mapList: response.data.data },
        });
      } else {
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

  store.setParsedCsvData = function (parsed_CSV_Data) {
    store.setParsedCsvDataWOR(parsed_CSV_Data);
    // console.log('store.setParsedCsvData', data);
    storeReducer({
      type: StoreActionType.SET_PARSED_CSV_DATA,
      payload: { parsed_CSV_Data },
    });
  };

  // setParsedCsvDataWithoutRendering
  store.setParsedCsvDataWOR = function (data) {
    store.parsed_CSV_Data = data;
  };

  // fetches map list based on current view
  store.getMapList = async function () {
    if (store.isHomePage()) {
      store.getMapListHome();
    } else {
      store.getMapListCommunity();
    }
  };

  store.getMapListHome = async function () {
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
  };

  store.getMapListCommunity = async function () {
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
  };

  store.sortList = function (by) {
    let list = store.mapList;
    if (by == SortBy.LIKES) {
      list.sort((a, b) => (a.likedUsers.length < b.likedUsers.length ? 1 : -1));
    } else if (by == SortBy.VIEWS) {
      list.sort((a, b) => (a.views < b.views ? 1 : -1));
    } else if (by == SortBy.LAST_MODIFIED) {
      list.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1));
    } else if (by == SortBy.CREATED_DATE) {
      list.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    } else if (by == SortBy.MAP_NAME) {
      list.sort((a, b) => (a.title < b.title ? -1 : 1));
    }
    storeReducer({
      type: StoreActionType.SET_MAP_LIST,
      payload: { mapList: list },
    });
  };

  store.searchMaps = async function (searchText, searchBy) {
    const res = await api.searchMaps(searchText, searchBy);
    if (store.isHomePage()) {
      store.changeView(store.viewTypes.COMMUNITY);
    }
    const maps = res.data.data;

    storeReducer({
      type: StoreActionType.SET_MAP_LIST,
      payload: { mapList: maps },
    });
  };

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
        store.parsed_CSV_Data,
        // store.tableLabel
        store.currentMapObject.selectedLabel
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
      csvObj.tableLabel = store.selectedLabel;
      console.log(csvObj);
      store.updateCSV(csvObj);
    }
  };

  // switches between home and community
  store.changeView = function (view) {
    store.pageLoading = true
    if (view === store.viewTypes.HOME && !auth.loggedIn) {
      store.pageLoading = false
      return;
    }
    console.log("changing view to", view);

    if (store.currentView === view) {
      store.pageLoading = false
      return;
    }
    store.currentView = view;
    storeReducer({
      type: StoreActionType.CHANGE_VIEW,
      payload: { view },
    });
    store.pageLoading = false
  };

  store.logoutUser = function () {
    storeReducer({
      type: StoreActionType.LOGOUT_USER,
      payload: {},
    });
  };

  store.clearCsv = function () {
    store.setParsedCsvData(null);
    store.setCsvKey(null);
    store.setCsvLabel(null);
    store.setMinColor(null);
    store.setMaxColor(null);
    store.setProColor(null);
    store.setPolColor(null);
    store.setDotColor(null);
    store.setProportionalValue([]);
    store.updateCategoryColorMappings([]);
    store.updateSelectedAttribute(null);
  };

  store.isCommunityPage = () => {
    return store.currentView === store.viewTypes.COMMUNITY;
  };
  store.isHomePage = () => {
    return store.currentView === store.viewTypes.HOME;
  };
  store.showSearchBar = () => {
    return pathname == "/main" || pathname == "/mapcards";
  };
  store.isEditPage = () => {
    return pathname == "/edit";
  };

  store.setProportionalValue = function (value) {
    storeReducer({
      type: StoreActionType.SET_PROPORTIONAL_VALUE,
      payload: value,
    });
  };

  store.setRawMapFile = function (object) {
    storeReducer({
      type: StoreActionType.SET_RAW_MAP_FILE,
      payload: { file: object },
    });
  };

  store.updateMapData = async function () {
    console.log("updating map data");
    let newRawMapFile = JSON.stringify(store.rawMapFile);
    let response = await api.updateMapData(
      newRawMapFile,
      store.currentMapObject._id
    );
    if (response.status != 201) {
      alert("Failed to update map data");
      return;
    }
  };

  store.setGeneralProperty = function (selectedKey, value, index){
    // Get the current data type
    const currentDataType =
      typeof store.rawMapFile.features[index].properties[selectedKey];

    // Clone the rawMapFile object to avoid modifying the original directly
    const newRawMapFile = JSON.parse(JSON.stringify(store.rawMapFile));

    // Update the property in the cloned object based on data type
    switch (currentDataType) {
      case "number":
        newRawMapFile.features[index].properties[selectedKey] =
          parseFloat(value);
        break;
      case "boolean":
        newRawMapFile.features[index].properties[selectedKey] =
          value.toLowerCase() === "true";
        break;
      // Add more cases as needed
      default:
        newRawMapFile.features[index].properties[selectedKey] = value;
    }

    // Update the store with the modified object
    store.rawMapFile = newRawMapFile;
    store.setRawMapFile(newRawMapFile);
    console.log(store.rawMapFile);
    console.log(store.currentMapObject);
  }

  store.setHeatColorTransaction = function (newColor, type) {
    if (type === "min") {
      let oldColor = store.minColor;
      let transaction = new HeatColorTransaction(
        type,
        oldColor,
        newColor,
        store
      );
      console.log(transaction);
      tps.addTransaction(transaction);
    } else if (type === "max") {
      let oldColor = store.maxColor;
      let transaction = new HeatColorTransaction(
        type,
        oldColor,
        newColor,
        store
      );
      console.log(transaction);
      tps.addTransaction(transaction);
    }
  };

  store.setDotColorTransaction = function (newColor) {
    let oldColor = store.dotColor;
    let transaction = new DotColor_Transaction(oldColor, newColor, store);
    console.log(transaction);
    tps.addTransaction(transaction);
  };

  store.setProColorTransaction = function (newColor) {
    let oldColor = store.proColor;
    let transaction = new Procolor_transaction(oldColor, newColor, store);
    console.log(transaction);
    tps.addTransaction(transaction);
    console.log(store.proColor);
  };

  store.setGeneralPropertyTransaction = function (selectedKey, newValue, index) {
    let oldValue = store.rawMapFile.features[index].properties[selectedKey];
    let transaction = new GeneralProperty_Transaction(index, selectedKey, oldValue, newValue, store);
    console.log(transaction);
    tps.addTransaction(transaction);
  }

  store.setCsvTransaction = function (newCSV) {
    console.log("newCSV", newCSV);
    console.log("store.parsed_CSV_Data", store.parsed_CSV_Data);
    let transaction = new CSV_Transaction({...store.parsed_CSV_Data}, {...newCSV}, store);
    console.log(transaction);
    tps.addTransaction(transaction);

  }
  

  store.redo = function () {
    console.log("redo");
    tps.redoTransaction();
  };

  store.undo = function () {
    console.log("undo");
    tps.undoTransaction();
  };

  store.canRedo = function () {
    console.log(tps.hasTransactionToRedo());
    return tps.hasTransactionToRedo();
  };
  store.canUndo = function () {
    console.log(tps.hasTransactionToUndo());
    return tps.hasTransactionToUndo();
  };

  store.setSelectedLabel = function (label){
    storeReducer({
      type: StoreActionType.SET_SELECTED_LABEL,
      payload: label,
    });
  }

  store.getJsonLabels = function (feature, layer) {
    // check if GeoJSON
    if (feature.properties.label_y && feature.properties.label_x) {
      return [[feature.properties.label_y, feature.properties.label_x], feature.properties.name];
    }

    // check if KML
    else if(feature.properties.shape_area) {
      return [layer.getBounds().getCenter(), feature.properties.shape_area];
    }

    // check if Shapefile
    else if(feature.properties.NAME_0 || feature.properties.NAME_1 || feature.properties.NAME_2) {
      if (feature.properties.NAME_2)
        return [layer.getBounds().getCenter(), feature.properties.NAME_2];

      else if (feature.properties.NAME_1)
        return [layer.getBounds().getCenter(), feature.properties.NAME_1];

      else if (feature.properties.NAME_0)
        return [layer.getBounds().getCenter(), feature.properties.NAME_0];
    }

    return null;
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
