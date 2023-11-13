import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';


export default function SelectVariants() {
  const [age, setAge] = React.useState('');
  const [text, setText] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleSearch = (event) =>{
    setText(event.target.value);
    console.log(event.target.value);
  }
  const handleKeyPress = (event) =>{
    if (event.code === "Enter") {
      console.log("enter key");
      console.log(text,", ", age);
      
    }
  }

  return (
    <div>
        <Select
          labelId="demo-simple-select-standard-label"
          id="searchOn"
          value={age}
          required
          onChange={handleChange}
          variant="standard"
          sx={{ m: 3, minWidth: 20 }}
        >
          <MenuItem value={'Map ID'}>Map ID</MenuItem>
          <MenuItem value={'Map Name'}>Map Name</MenuItem>
          <MenuItem value={'Proporty'}>Proporty</MenuItem>
        </Select>
          <TextField 
          id="search" 
          required
          label="search" 
          variant="standard"
          onChange = {handleSearch}
          onKeyPress = {handleKeyPress}
          sx={{ m: 1, minWidth: 120 }}/>
    </div>
  );
}
