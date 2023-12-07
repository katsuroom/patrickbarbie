"use client"

import React, { useState, useEffect, useContext } from "react";

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Sort from './Sort';


import StoreContext from "@/store";



export default function SelectVariants() {

  const { store } = useContext(StoreContext);
  const [searchBy, setSearchBy] = useState('Map ID');
  const [searchText, setSearchText] = useState('');

  const handleChange = (event) => {
    setSearchBy(event.target.value);
  };
  const handleSearch = (event) =>{
    setSearchText(event.target.value);
  }
  const handleKeyPress = async (event) =>{
    if (event.code === "Enter") {
      switch(searchBy)
      {
        case "Map ID":
          store.searchMapsById(searchText);
          break;

        case "Map Name":
          alert("Search by map name not yet implemented.");
          break;

        case "Property":
          alert("Search by property not yet implemented.");
          break;

        default: break;
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
          label="search" 
          variant="filled"
          size="small"
          onChange = {handleSearch}
          onKeyUp = {(event)=>{handleKeyPress(event);}}
          sx={{ m: -2, width: "30vw", marginLeft: "3px", marginTop: 0, marginRight: "20px"}}/>
          <Sort/>
    </div>
  );
}
