import React, { useEffect, useState, useRef, useContext } from 'react';
import './travelmap.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

// import endIconUrl from './red.png';
// import startIconUrl from './blue.png';
import StoreContext, { CurrentModal } from "@/store";
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import 'leaflet-control-geocoder';
import Button from "@mui/joy/Button";
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';


const PTravelMap = (props) => {
  // const [start, setStart] = useState('');
  // const [end, setEnd] = useState('');
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



  // const startHere = (e) => {
  //   if (routeControlRef.current) {
  //     routeControlRef.current.spliceWaypoints(0, 1, e.latlng);
  //     console.log('routeControlRef.current.getWaypoints' + routeControlRef.current.getWaypoints().map(wp => wp.latLng))
  //     console.log('routeControlRef.current.Waypoints' + routeControlRef.current.Waypoints)
  //   }
  // };

  // const goHere = (e) => {
  //   if (routeControlRef.current) {
  //     routeControlRef.current.spliceWaypoints(routeControlRef.current.getWaypoints().length - 1, 1, e.latlng);
  //     // store.setWaypoints(routeControlRef.current.getWaypoints());
  //   }
  // };

  const startHere = (e) => {
    if (geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.contains(e.latlng)) {
        if (routeControlRef.current) {
          try {
            routeControlRef.current.spliceWaypoints(0, 1, e.latlng);
          } catch (error) {
            window.alert("Error: Unable to set the start location. Please try a different location.");
          }
        }
      } else {
        window.alert("Selected start location is outside the GeoJSON data range.");
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
            window.alert("Error: Unable to set the destination location. Please try a different location.");
          }
        }
      } else {
        window.alert("Selected destination location is outside the GeoJSON data range.");
      }
    }
  };


  // let spinner = true;

  // const showSpinner = () => {
  //   if (spinner) {
  //     document.getElementById('loader2').style.display = "block";
  //   }
  // }
  // const hideSpinner = () => {
  //   document.getElementById('loader2').style.display = "none";
  // }



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

  const handleMapLayerSelection = (layerName) => {
    console.log("Map layer selected:", layerName);
    store.setSelectedMapLayer(layerName); 
  };

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
      else {
        refreshMap();
      }
    }
  }, [store.rawMapFile]);


  const refreshMap = () => {

    console.log('travel map + ' + store.rawMapFile)
    if (!loadScripts || !store.rawMapFile) {
      return;
    }

    if (!mapRef.current) {
      var mapLayer = window.MQ.mapLayer();
      mapRef.current = L.map('map-display', {
        layers: [mapLayer],
        center: [40.731701, -73.993411],
        zoom: 12,
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
    if (mapLayerRef.current) mapRef.current.removeLayer(mapLayerRef.current);
    if (hybridLayerRef.current) mapRef.current.removeLayer(hybridLayerRef.current);
    if (satelliteLayerRef.current) mapRef.current.removeLayer(satelliteLayerRef.current);
    if (darkLayerRef.current) mapRef.current.removeLayer(darkLayerRef.current);
    if (lightLayerRef.current) mapRef.current.removeLayer(lightLayerRef.current);

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
    if (settingLayerRef.current && typeof settingLayerRef.current.on === 'function') {
      settingLayerRef.current.on('baselayerchange', (e) => {
        handleMapLayerSelection(e.name);
      });
    } else {
      console.error('Layer control is not initialized correctly');
    }

    settingLayerRef.current.addTo(mapRef.current);

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }
    markers.current.forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    markers.current = [];

    if (store.rawMapFile) {
      geoJsonLayerRef.current = L.geoJSON(store.rawMapFile, {
        onEachFeature: (feature, layer) => {

          // check if label_y and label_x exist, since they don't exist for KML
          if (feature.properties.label_y && feature.properties.label_x) {
            const label = L.marker(
              [feature.properties.label_y, feature.properties.label_x],
              {
                icon: L.divIcon({
                  className: "countryLabel",
                  html: feature.properties.name,
                  iconSize: [1000, 0],
                  iconAnchor: [0, 0],
                }),
              }
            ).addTo(mapRef.current);
            markers.current.push(label);
          }
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

    // L.Routing.control ({
    //     geocoder: L.Control.Geocoder.nominatim()
    // }).addTo(mapRef.current)
  }

  useEffect(() => {
    refreshMap();
  }, [loadScripts]);

  useEffect(() => {
    store.waypoints = []
    if (store.currentMapObject.mapProps?.waypoints) {
      console.log("store.currentMapObject.mapProps" + store.currentMapObject.mapProps.waypoints)
      store.setWaypoints(store.currentMapObject.mapProps.waypoints)
      runDirection();
    }
  }, [store.currentMapObject]);

  const openSaveModal = () => store.openModal(CurrentModal.SAVE_EDIT);
  const openExitModal = () => store.openModal(CurrentModal.EXIT_EDIT);

  const runDirection = async () => {

    // const runDirection = async (start, end) => {
    const geocode = async (address) => {
      const url = `https://www.mapquestapi.com/geocoding/v1/address?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC&location=${encodeURIComponent(address)}`;
      const response = await fetch(url);
      const data = await response.json();
      const location = data.results[0].locations[0].latLng;
      return location;
    };

    try {
      // const startPoint = await geocode(start);
      // const endPoint = await geocode(end);

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


      if (routeControlRef.current) {
        mapRef.current.removeControl(routeControlRef.current);
      }

      const routingControl = L.Routing.control({
        waypoints: store.waypoints,
        routeWhileDragging: true,
        createMarker: function (i, waypoint, n) {
          const markerIcon = i === 0 ? startIcon : (i > 0 && i < n - 1) ? inBetweenIcon : endIcon;
          return L.marker(waypoint.latLng, { draggable: true, icon: markerIcon });
        },
        geocoder: L.Control.Geocoder.nominatim(),
      });

      routingControl.on('routingstart', showSpinner);
      routingControl.on('routesfound', hideSpinner);
      routingControl.on('routingerror', hideSpinner);

      routingControl.on('waypointschanged', function (e) {
        const updatedWaypoints = e.waypoints;
        console.log('Waypoints Updated:', updatedWaypoints);
        store.setWaypoints(updatedWaypoints.map(p => {
          return p.latLng
        }));
      });

      routingControl.addTo(mapRef.current);
      routeControlRef.current = routingControl;

      // mapRef.current.forEach((routingControl) => {
      //     mapRef.current.removeLayer(routingControl);
      // });
    } catch (error) {
      console.error('Error in geocoding or routing:', error);
    }
  };

  // var spinner = true;
  // const showSpinner = ()=>{
  //     if(spinner){
  //         document.getElementById('loader').style.display = "block";
  //     }
  // }
  // const hideSpinner = ()=>{
  //         document.getElementById('loader').style.display = "none";
  // }


  const submitForm = (event) => {
    event.preventDefault();
    // runDirection(start, end);
    setStart('');
    setEnd('');
  };

  return (
    <div style={{
      width: "99vw" }}>
      {/* <div id={"map-display"} style={{ height: `${mapHeight}px`, margin: '10px' }}></div> */}
      <div id={"map-display"} style={{ width: "99vw", height: `${mapHeight}px`, margin: '10px' }}></div>
      {/* <div id={"loader2"} style={{ height: `5px`, margin: '5px' }}></div> */}
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
