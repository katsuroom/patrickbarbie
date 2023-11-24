import MapCardList from "./MapCardList";
import MapDisplay from "./MapDisplay";
import MapView from "./MapView";
import StoreContext from "../store";
import React, { useContext } from "react";


export default function MainScreen()
{

    const { store } = useContext(StoreContext);


    const maps = [
        { id: 1, name: 'North America', fileName: "NA.json"},
        { id: 2, name: 'South America', fileName: "SA.json"},
        { id: 3, name: 'Asia', fileName: "ASIA.json"},
        { id: 4, name: 'Africa', fileName: "AFRICA.json"},
        { id: 5, name: 'Europe', fileName: "EU.json"},
        { id: 6, name: 'Oceania', fileName: "Oceania.json"},
        { id: 7, name: 'World', fileName: "World.json"}
    ]


    console.log(maps);
    return(
        <div>
            <div >
                <MapCardList maps={maps}/>
                {store.rawMapfile || <MapView />}
                {/* <MapDisplay/> */}
            </div>
        </div>
    );
}