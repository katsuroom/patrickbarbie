import React, { useContext } from "react";

import StoreContext, {MapType} from "@/store";

import dynamic from "next/dynamic";

const PoliticalMap = dynamic(() => import('./PoliticalMap'));
const Heatmap = dynamic(() => import('./HeatMap'));
const Proportional = dynamic(() => import('./MProportional'));
const TravelMap = dynamic(() => import("./TravelMaps"));
const DotDistribution = dynamic(() => import("./MDotDistribution"));
const PTravelMap = dynamic(() => import("./PTravelMap"));
import "leaflet/dist/leaflet.css";



export default function MapDisplay() {
  const { store } = useContext(StoreContext);

  const layoutStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    justifyContent: "center",
  };

  return (
    <div style={layoutStyle}>
      {store.rawMapFile && store.currentMapObject?.mapType ? (
            store.currentMapObject.mapType === MapType.PROPORTIONAL_SYMBOL_MAP ? <Proportional />
          : store.currentMapObject.mapType === MapType.HEATMAP ? <Heatmap />
          : store.currentMapObject.mapType === MapType.POLITICAL_MAP ? <PoliticalMap />
          : store.currentMapObject.mapType === MapType.DOT_DISTRIBUTION_MAP ? <DotDistribution />
          : store.currentMapObject.mapType === MapType.TRAVEL_MAP ? (store.isEditPage() ? <PTravelMap /> : <TravelMap />) 
          : null
        ) : null}
    </div>
  );
}