import MapCardList from "./MapCardList";
import MapDisplay from "./MapDisplay";
import MapView from "./MapView";
import StoreContext from "../store";
import React, { useContext } from "react";


export default function MainScreen()
{

    const { store } = useContext(StoreContext);


    const maps = [
        { id: 1, name: 'North America', fileName: "NA2.json"},
        { id: 2, name: 'South America', fileName: "SA2.json"},
        { id: 3, name: 'Asia', fileName: "ASIA2.json"},
        { id: 4, name: 'Africa', fileName: "AFRICA2.json"},
        { id: 5, name: 'Europe', fileName: "EU2.json"},
        { id: 6, name: 'Oceania', fileName: "Oceania2.json"},
        { id: 7, name: 'World', fileName: "World.json"}
    ]


    console.log(maps);
    return(
        <div>
            <div >
                <MapCardList maps={maps}/>
                <MapView />
                {/* <MapDisplay/> */}
            </div>
        </div>
    );
}