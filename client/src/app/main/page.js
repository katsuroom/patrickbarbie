"use client"

import MapCardList from "../components/MapCardList";
import MapView from "../components/MapView";
import StoreContext from "@/store";
import React, { useContext, useEffect } from "react";
import AuthContext from "@/auth";


export default function MainScreen() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const func = async () => {
      if (auth.loggedIn) {
        console.log("change view to home");
        console.log("auth.loggedIn", auth.loggedIn)
        await store.changeView(store.viewTypes.HOME);
      } else {
        console.log("change view to community");
        await store.changeView(store.viewTypes.COMMUNITY);
      }

      store.getMapList();
    }
    func();
  }, []);


  useEffect(() => {
    const func = async () => {
      // clear CSV fields

      store.setParsedCsvData(null);
      store.setCsvKey(null);
      store.setCsvLabel(null);

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


  return (
    <div>
      <div>
        <MapCardList />
        {store.currentMapObject ? <MapView /> : null}
      </div>
    </div>
  );
}
