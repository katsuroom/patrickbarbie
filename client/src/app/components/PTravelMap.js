import React, { useEffect, useState, useRef, useContext } from 'react';
import './travelmap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import StoreContext, { CurrentModal } from "@/store";
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import 'leaflet-control-geocoder';
import Button from "@mui/joy/Button";
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';


const PTravelMap = () => {
  const mapRef = useRef(null);
  const routeControlRef = useRef(null);
  const { store } = useContext(StoreContext);
  const geoJsonLayerRef = useRef(null);
  const markers = useRef([]);
  const [loadScripts, setLoadScripts] = useState(false);

  const mapLayerRef = useRef(null);
  const hybridLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);
  const darkLayerRef = useRef(null);
  const lightLayerRef = useRef(null);
  const settingLayerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [defaultLayerAdded, setDefaultLayerAdded] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const updateMarkerIcon = (marker, text) => {
    const fontSize = store.currentMapObject?.mapProps?.fontSize || 12;
    const fontWeight = store.currentMapObject?.mapProps?.bold ? 'bold' : 'normal';
    const fontStyle = store.currentMapObject?.mapProps?.italicize ? 'italic' : 'normal';
    const textDecoration = store.currentMapObject?.mapProps?.underline ? 'underline' : 'none';
    const fontFamily = store.fontStyle;

    marker.setIcon(L.divIcon({
      className: "countryLabel",
      html: `<div style="font-size: ${fontSize}px; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration}; font-family: ${fontFamily};">${text}</div>`, // Apply font weight, style, decoration, and family
      iconSize: [1000, 0],
      iconAnchor: [0, 0],
    }));
  };



  const startHere = (e) => {
    if (geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.contains(e.latlng)) {
        if (routeControlRef.current) {
          try {
            routeControlRef.current.spliceWaypoints(0, 1, e.latlng);
          } catch (error) {
            window.alert("Selected start location data is not available.");
          }
        }
      } else {
        window.alert("Selected start location is outside the data range.");
      }
    }
  };

  const goHere = (e) => {
    if (geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.contains(e.latlng)) {
        if (routeControlRef.current) {
          try {
            routeControlRef.current.spliceWaypoints(routeControlRef.current.getWaypoints().length - 1, 1, e.latlng);
          } catch (error) {
            window.alert("Selected destination location data is not available");
          }
        }
      } else {
        window.alert("Selected destination location is outside the data range.");
      }
    }
  };


  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Script load error for ${src}`));
      document.body.appendChild(script);
    });
  };

  const [mapHeight, setMapHeight] = useState(window.innerWidth / 3);
  useEffect(() => {
    const resizeListener = () => {
      setMapHeight(window.innerWidth / 3);
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);


  useEffect(() => {
    if (store.rawMapFile) {
      if (!loadScripts) {
        Promise.all([
          loadScript("./mq-map.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC"),
          loadScript("./mq-routing.js?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC")
        ]).then(() => {
          setLoadScripts(true);
        }).catch(error => console.error(error));
      }
      refreshMap();
    }
  }, [store.rawMapFile]);


  const refreshMap = () => {

    console.log('travel map + ' + store.rawMapFile)
    if (!loadScripts || !geoJsonData) {
      return;
    }

    if (!mapRef.current) {
      var mapLayer = window.MQ.mapLayer();
      mapRef.current = L.map('map-display', {
        layers: [mapLayer],
        center: [40.731701, -73.993411],
        zoom: 10,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
          text: 'Start from here',
          callback: startHere
        }, {
          text: 'Go to here',
          callback: goHere
        }]
      });
    }
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }
    markers.current.forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    markers.current = [];

    if (mapLayerRef.current) mapRef.current.removeLayer(mapLayerRef.current);
    if (hybridLayerRef.current) mapRef.current.removeLayer(hybridLayerRef.current);
    if (satelliteLayerRef.current) mapRef.current.removeLayer(satelliteLayerRef.current);
    if (darkLayerRef.current) mapRef.current.removeLayer(darkLayerRef.current);
    if (lightLayerRef.current) mapRef.current.removeLayer(lightLayerRef.current);

    if (window.MQ) {
      mapLayerRef.current = window.MQ.mapLayer();
      hybridLayerRef.current = window.MQ.hybridLayer();
      satelliteLayerRef.current = window.MQ.satelliteLayer();
      darkLayerRef.current = window.MQ.darkLayer();
      lightLayerRef.current = window.MQ.lightLayer();

      if (settingLayerRef.current) {
        mapRef.current.removeControl(settingLayerRef.current);
      }

      settingLayerRef.current = L.control.layers({
        'Map': mapLayerRef.current,
        'Hybrid': hybridLayerRef.current,
        'Satellite': satelliteLayerRef.current,
        'Dark': darkLayerRef.current,
        'Light': lightLayerRef.current
      });

      settingLayerRef.current.addTo(mapRef.current);

      mapRef.current.on("baselayerchange", function (event) {
        const layerName = event.name; // Name of the selected layer
        const layer = event.layer; // Reference to the selected layer

        if (!store.currentMapObject.mapProps) {
          store.currentMapObject.mapProps = {};
        }

        store.currentMapObject.mapProps.layerName = layerName;

        console.log("Base layer changed to:", layerName);
        console.log("Base layer changed to:", layer);
        console.log(mapRef.current);
        setDefaultLayerAdded(true);
      });

      if (!defaultLayerAdded && store.currentMapObject.mapProps?.layerName) {
        console.log("changing layer...");
        switch (store.currentMapObject.mapProps?.layerName) {
          case "Map":
            mapRef.current.addLayer(mapLayerRef.current);
            break;
          case "Hybrid":
            mapRef.current.addLayer(hybridLayerRef.current);
            break;
          case "Satellite":
            mapRef.current.addLayer(satelliteLayerRef.current);
            break;
          case "Dark":
            mapRef.current.addLayer(darkLayerRef.current);
            break;
          case "Light":
            mapRef.current.addLayer(lightLayerRef.current);
            break;
          default:
            break;
        }
      }
    }


    if (geoJsonData) {
      geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
        onEachFeature: (feature, layer) => {
          let labelData = store.getJsonLabels(feature, layer);
          if (!labelData) return;

          const [pos, text] = labelData;
          const fontSize = store.currentMapObject?.mapProps?.fontSize || 12; 
          const fontWeight = store.currentMapObject?.mapProps?.bold ? 'bold' : 'normal';
          const fontStyle =  store.currentMapObject?.mapProps?.italicize ? 'italic' : 'normal';
          const textDecoration= store.currentMapObject?.mapProps?.underline ? 'underline' : 'normal';
          const fontFamily = store.fontStyle;


          const label = L.marker(
            pos, {
            icon: L.divIcon({
              className: "countryLabel",
              html: `<div style="font-size: ${fontSize}px; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration}; font-family: ${fontFamily};">${text}</div>`, // Apply font weight, style, decoration, and family
              iconSize: [1000, 0],
              iconAnchor: [0, 0],
            }),
            text: text,
          }
          ).addTo(mapRef.current);
          markers.current.push(label);
        },
      });

      geoJsonLayerRef.current.addTo(mapRef.current);

      if (geoJsonLayerRef.current) {
        const bounds = geoJsonLayerRef.current.getBounds();
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds);
        } else {
          console.log("bounds are not valid");
        }
      } else {
        console.log("geoJsonLayerRef.current is undefined or empty");
      }
    }

    runDirection();

    store.pageLoading = false
  }

  // useEffect(() => {
  //   markers.current.forEach((marker) => {
  //     updateMarkerIcon(marker, marker.options.text);
  //   });
  // }, [store.fontSize, store.bold, store.italicize, store.underline, store.fontStyle]);

  useEffect(() => {
    markers.current.forEach((marker) => {
      updateMarkerIcon(marker, marker.options.text);
    });
  }, [
    store.currentMapObject?.mapProps?.fontSize,
    store.currentMapObject?.mapProps?.bold,
    store.currentMapObject?.mapProps?.italicize,
    store.currentMapObject?.mapProps?.underline,
    store.fontStyle
  ]);

  useEffect(() => {
    setDefaultLayerAdded(false);
    if (store.rawMapFile) {
      setGeoJsonData(store.rawMapFile);
    }
  }, [store.rawMapFile]);

  useEffect(() => {
    refreshMap();
  }, [loadScripts]);

  useEffect(() => {
    store.waypoints = []
    if (store.currentMapObject.mapProps?.waypoints) {
      console.log("store.currentMapObject.mapProps" + store.currentMapObject.mapProps.waypoints)
      store.setTravelWaypointsTransaction(store.currentMapObject.mapProps.waypoints)
      runDirection();
    }
  }, [store.currentMapObject]);

  useEffect(() => {
      runDirection();
  }, [store.waypoints]);

  const openSaveModal = () => store.openModal(CurrentModal.SAVE_EDIT);
  const openExitModal = () => store.openModal(CurrentModal.EXIT_EDIT);

  const runDirection = async () => {
    try {
      if (routeControlRef.current) {
        mapRef.current.removeControl(routeControlRef.current);
      }

      const startIcon = L.icon({
        iconUrl: "/blue.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      const inBetweenIcon = L.icon({
        iconUrl: "/gray.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      const endIcon = L.icon({
        iconUrl: "/red.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      const routingControl = L.Routing.control({
        waypoints: store.waypoints,
        routeWhileDragging: true,
        createMarker: function (i, waypoint, n) {
          const markerIcon = i === 0 ? startIcon : (i > 0 && i < n - 1) ? inBetweenIcon : endIcon;
          return L.marker(waypoint.latLng, { draggable: true, icon: markerIcon });
        },
        geocoder: L.Control.Geocoder.nominatim(),
      });

      // Listen for the waypointsUpdated event
      routingControl.on('waypointschanged', function (e) {
        const updatedWaypoints = e.waypoints;
        console.log('Waypoints Updated:', updatedWaypoints);
        store.setTravelWaypointsTransaction(updatedWaypoints.map(p => {
          return p.latLng
        }));
      });

      routingControl.addTo(mapRef.current);

      routingControl.on('routingstart', function () {
        if (!mapRef.current._zooming) 
          store.setPageLoading(true);
      });

      routingControl.on('routesfound', function () {
        console.log('-----routesfound------');
        store.setPageLoading(false);
      });

      routingControl.on('routingerror', function () {
        store.setPageLoading(false);
      });

      routeControlRef.current = routingControl;
    } catch (error) {
      console.error('Error in geocoding or routing:', error);
      store.setPageLoading(false);
    }
  };


  return (
    <div style={{
      width: "99vw"
    }}>
      {/* <div id={"map-display"} style={{ height: `${mapHeight}px`, margin: '10px' }}></div> */}
      {<div id={"map-display"} style={{ width: "99vw", height: `${mapHeight}px`, margin: '10px' }}></div>}
      {/* {loading && <div id={"loader"}></div>} */}
      {store.pageLoading && <div id="loader" className="custom-loader" />}
      <Button variant="solid" className="exit" sx={{ margin: 1 }} onClick={openExitModal}>
        EXIT
      </Button>
      <Button variant="solid" className="save" sx={{ margin: 1 }} onClick={openSaveModal}>
        SAVE
      </Button>
    </div>

  );
};

export default PTravelMap;