import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import AddIcon from '@mui/icons-material/Add';

const MapCardList = () => {
  const [maps, setMaps] = useState([
    { id: 1, name: 'Korea Map' },
    { id: 2, name: 'Japan Map' },
    { id: 3, name: 'USA Map' },
  ]);

  const addMapCard = () => {
    const newMap = { id: maps.length + 1, name: `Map Title ${maps.length + 1}` };
    setMaps([...maps, newMap]);
  };

  return (
    <Box sx={{ 
        width: '12.5%', 
        bgcolor: '#ffabd1', 
        float: 'left', 
        height: '100vh', 
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
              <ListItemText primary={map.name} />
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
        onClick={addMapCard}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MapCardList;