import MapCardList from "./MapCardList";
import MapDisplay from "./MapDisplay";
import MapView from "./MapView";
import StoreContext from "../store";
import React, { useContext, useEffect } from "react";
import AuthContext from "../auth";


export default function MainScreen() {
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);

  if (store.disableSearchBar) {
    store.setDisableSearchBar(false);
  }

  useEffect(() => {
    const func = async () => {
    if (!auth.loggedIn) {
      console.log("change view to community");

      await store.changeView(store.viewTypes.COMMUNITY);
    } else {
      console.log("change view to home");
      console.log("auth.loggedIn", auth.loggedIn)
      await store.changeView(store.viewTypes.HOME);
    }
}
func();
  }, [auth.loggedIn]);


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

  // const maps = [
  //     { id: 1, name: 'North America', fileName: "NA2.json"},
  //     { id: 2, name: 'South America', fileName: "SA2.json"},
  //     { id: 3, name: 'Asia', fileName: "ASIA2.json"},
  //     { id: 4, name: 'Africa', fileName: "AFRICA2.json"},
  //     { id: 5, name: 'Europe', fileName: "EU2.json"},
  //     { id: 6, name: 'Oceania', fileName: "Oceania2.json"},
  //     { id: 7, name: 'World', fileName: "World.json"}
  // ]

  // console.log(maps);
  return (
    <div>
      <div>
        <MapCardList />
        <MapView />
        {/* <MapDisplay/> */}
      </div>
    </div>
  );
}
