"use client";

import MapCardList from "../components/MapCardList";
import MapView from "../components/MapView";
import StoreContext from "@/store";
import React, { useContext, useEffect, useState } from "react";

export default function MainScreen() {
  const { store } = useContext(StoreContext);

  // const [loadScripts, setLoadScripts] = useState(false);

  // const loadScript = (src) => {
  //   return new Promise((resolve, reject) => {
  //     const script = document.createElement("script");
  //     script.src = src;
  //     script.onload = () => resolve(script);
  //     script.onerror = () => reject(new Error(`Script load error for ${src}`));
  //     document.body.appendChild(script);
  //   });
  // };

  // if (!loadScripts) {
  //   Promise.all([
  //     loadScript("./mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
  //     loadScript("./mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
  //   ])
  //     .then(() => {
  //       setLoadScripts(true);
  //     })
  //     .catch((error) => console.error(error));
  // }

  useEffect(() => {
    if (store.mapList.length == 0) store.getMapList();
  }, []);

  useEffect(() => {
    const func = async () => {
      // clear CSV fields

      store.clearCsv();

      if (store.currentMapObject && store.currentMapObject.csvData) {
        const csvObj = await store.getCsvById(store.currentMapObject.csvData);

        console.log(csvObj);

        store.setParsedCsvData(csvObj.csvData);
        store.setCsvKey(csvObj.key);
        store.setCsvLabel(csvObj.label);
        store.setTable();

      }
    };
    func();
  }, [store.currentMapObject]);

  return (
    <div>
      <div>
        <MapCardList />
        {store.currentMapObject ? <MapView /> : null}
      </div>
    </div>
  );
}
