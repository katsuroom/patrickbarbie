"use client"

import MapCardList from "../components/MapCardList";
import MapView from "../components/MapView";
import StoreContext from "@/store";
import React, { useContext, useEffect } from "react";


export default function MainScreen() {

 

  const { store } = useContext(StoreContext);

  useEffect(() => {
    if(store.mapList.length == 0)
      store.getMapList();
  }, [])

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
      }
    };
    func();
  }, [store.currentMapObject]);

  if (typeof window == "undefined"){
    return (<></>)
  }


  return (
    <div>
      <div>
        <MapCardList />
        {store.currentMapObject ? <MapView /> : null}
      </div>
    </div>
  );
}
