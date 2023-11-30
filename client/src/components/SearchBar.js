
import React, { useState, useEffect, useContext } from "react";

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Sort from './Sort';


import StoreContext from '../store';



export default function SelectVariants() {

  const { store } = useContext(StoreContext);
  const [searchBy, setsearchBy] = useState('Map ID');
  const [searchText, setsearchText] = useState('');

  const handleChange = (event) => {
    setsearchBy(event.target.value);
  };
  const handleSearch = (event) =>{
    store.changeView(store.viewTypes.COMMUNITY);
    setsearchText(event.target.value);
    console.log(event.target.value);
  }
  const handleKeyPress = async (event) =>{
    if (event.code === "Enter") {
      if (searchBy === "Map ID"){
        let mapObj = await store.getMapById(searchText);
        await store.setMapList([mapObj]);
      }
      else if (searchBy === "Map Name"){
      }

      else if (searchBy === "Property"){
      }

    }
  }

  return (
    <div id="edit-toolbar">
        <Select
          labelId="demo-simple-select-standard-label"
          id="searchOn"
          value={searchBy}
          required
          onChange={handleChange}
          variant="standard"
          sx={{ m: 1, minWidth: 20 }}
        >
          <MenuItem value={'Map ID'}>Map ID</MenuItem>
          <MenuItem value={'Map Name'}>Map Name</MenuItem>
          <MenuItem value={'Proporty'}>Property</MenuItem>
        </Select>
          <TextField 
          id="search" 
          required
          label="search" 
          variant="standard"
          onChange = {handleSearch}
          onKeyUp = {(event)=>{handleKeyPress(event);}}
          sx={{ m: -2, minWidth: 120, marginLeft: "3px", marginBottom: "3px", marginRight: "20px"}}/>
          <Sort/>
    </div>
  );
}
