import React, { useEffect, useState, useRef, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StoreContext from "@/store";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import * as turf from "@turf/turf";
import "./proportionalMap.css";


export default function DotDistribution(props){
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [buttonAdded, setButtonAdded] = useState(false);
    const mapRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const dotDistributionRef = useRef(null);
    const markers = useRef([]);
    const { store } = useContext(StoreContext);
    let downloadComplete = props.downloadComplete;

    useEffect(() => {
      const resizeListener = () => {
        setMapHeight(window.innerHeight / 2);
      };
      window.addEventListener("resize", resizeListener);
      return () => {
        window.removeEventListener("resize", resizeListener);
      };
    }, []);

    const [mapHeight, setMapHeight] = useState(window.innerHeight / 2);

    useEffect(() => {
      if (store.rawMapFile) setGeoJsonData(store.rawMapFile);
    }, [store.rawMapFile]);

    useEffect(() => {
        if (!geoJsonData) return;

        if(!mapRef.current){}
    }, [geoJsonData]);
        
}