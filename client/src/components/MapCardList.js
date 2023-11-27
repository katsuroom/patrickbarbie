import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import StoreContext, { CurrentModal } from '../store';
import AuthContext from '../auth';

const hardcodedMaps = [
  { _id: '1', title: 'North America', fileName: "NA2.json" },
  { _id: '2', title: 'South America', fileName: "SA2.json" },
  { _id: '3', title: 'Asia', fileName: "ASIA2.json" },
  { _id: '4', title: 'Africa', fileName: "AFRICA2.json" },
  { _id: '5', title: 'Europe', fileName: "EU2.json" },
  { _id: '6', title: 'Oceania', fileName: "Oceania2.json" },
  { _id: '7', title: 'World', fileName: "World.json" }
];

export default function MapCardList() {
  const history = useHistory();
  const { store } = useContext(StoreContext);
  const { auth } = useContext(AuthContext);
  const [maps, setMaps] = useState([...hardcodedMaps]);
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
    if (auth.loggedIn && auth.user) {
      const updateMapsInState = (fetchedMaps) => {
        setMaps([...hardcodedMaps, ...fetchedMaps]); // Combine hardcoded maps with fetched maps
      };
      store.getMapsByUser(updateMapsInState);
    }
  }, [auth.user, auth.loggedIn, store]);

  const handleMapClick = (mapId) => {
    const selected = maps.find((map) => map._id === mapId);
    if (selected) {
      setSelectedMap(selected);
      store.getMapFile(selected.fileName); // Ensure 'fileName' is a valid property
    }
  };

  const handleCreateMap = () => {
    store.openModal(CurrentModal.UPLOAD_MAP);
  };

  return (
    <Box
      sx={{
        width: '25%',
        bgcolor: '#F7D3E4',
        float: 'left',
        height: '83vh',
        position: 'relative',
      }}
    >
      <List
        component="nav"
        aria-label="map folders"
        sx={{
          maxHeight: '85vh',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
          },
        }}
      >
        {maps.map((map, index) => [
          // Use an array and add unique keys for each child
          index > 0 && <Divider key={`divider-${map._id}`} />,
          <ListItem button onClick={() => handleMapClick(map._id)} key={map._id}>
            <ListItemText
              primary={map.title}
              style={{
                padding: '0px',
                backgroundColor: selectedMap && map._id === selectedMap._id ? '#f6c0fa' : '#F7D3E4',
              }}
            />
          </ListItem>,
        ])}
      </List>
      {auth.loggedIn && (
        <Fab
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            bgcolor: '#ffabd1',
            '&:hover': {
              bgcolor: '#ffabd1',
            },
          }}
          onClick={handleCreateMap}
        >
          <AddIcon />
        </Fab>
      )}
      {/* Components such as MUIUploadMap, MUICreateMap, and MapView have been commented out
      since their implementations are not provided. They should be uncommented and adjusted as needed. */}
    </Box>
  );
}
