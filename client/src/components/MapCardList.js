import React, { useState, useContext } from 'react';
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import AddIcon from '@mui/icons-material/Add';
import MUICreateMap from './Model/MUICreateMap';
import {useHistory} from 'react-router-dom';
import MUIUploadMap from './Model/MUIUploadMap';

import StoreContext from '../store';
import { CurrentModal } from '../store';

export default function MapCardList() {
  const history = useHistory();
  const { store } = useContext(StoreContext);

  const [maps, setMaps] = useState([
    { id: 1, name: 'Korea Map' },
    { id: 2, name: 'Japan Map' },
    { id: 3, name: 'USA Map' },
    { id: 4, name: 'World Map' }
  ]);

  // const addMapCard = () => {
  //   // history.push('/createMap');
  //   // const newMap = { id: maps.length + 1, name: `Map Title ${maps.length + 1}` };
  //   // setMaps([...maps, newMap]);
  //   store.openModal(CurrentModal.CREATE_MAP);
  // };

  const handleCreateMap = () => {
    store.openModal(CurrentModal.UPLOAD_MAP);
  };

  return (
    <Box sx={{ 
        width: '25%', 
        bgcolor: '#F7D3E4', 
        float: 'left', 
        height: '83vh', 
        position: 'relative',
      }}>
      <List component="nav" aria-label="map folders" sx={{ 
          maxHeight: '85vh',
          overflow: 'auto', 
          '&::-webkit-scrollbar': { 
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
          },
        }}>
        {maps.map((map, index) => (
          <React.Fragment key={map.id}>
            {index > 0 && <Divider />}
            <ListItem button>
              <ListItemText primary={map.name} style={{padding: "0px", backgroundColor: index === maps.length - 1 ? '#f6c0fa' : '#F7D3E4' }}/>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
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
      <MUIUploadMap />
      <MUICreateMap />
    </Box>
  );
};