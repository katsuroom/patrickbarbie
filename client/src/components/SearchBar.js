import React from "react";
import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

// this file include search bar and sort
export default function SearchBar() {

    const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-standard-label">Map Name</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={age}
          onChange={handleChange}
          label="Map Name"
        >
          <MenuItem value={10}>Map ID</MenuItem>
          <MenuItem value={20}>Map Name</MenuItem>
          <MenuItem value={30}>Proporty</MenuItem>
        </Select>
      </FormControl>
      <TextField id="standard-basic" label="Standard" variant="standard" sx={{ m: 1, minWidth: 30 }}/>
    </div>
  );
}