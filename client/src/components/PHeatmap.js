import * as React from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Compact from '@uiw/react-color-compact';

function createData(name, calories) {
  return { name, calories};
}

const Data = {
  "population": 20,
  "GDP": 50,
  "Color": "FFFFFF",
}

const rows = [
  createData('USA', 159),
  createData('CHINA', 237),
  createData('JAPAN', 262),
  createData('CANADA', 305),
];



export default function PHeatmap() {
  const [MinHex, setMinHex] = React.useState("#fff");
  const [MaxHex, setMaxHex] = React.useState("#fff");

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleMinColorChange = (event) => {
    setMinHex(event.hex);
  }

  const handleMaxColorChange = (event) => {
    setMaxHex(event.hex);
  }

  console.log(Data.population);
  console.log(MinHex);

  return (
    <div>
      <div>Property</div>
      <Button variant="solid" startDecorator={<Add />}>
  CSV file
</Button>
    <Table sx={{ '& thead th::nth-of-type(1)': { width: '40%' } }}>
      <thead>
        <tr>
          <th>Country Name</th>
          <th>
          <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          label="Age"
          onChange={handleChange}
          sx={{ minWidth: 20 }}
        >
          <MenuItem value={'GDP'}>GDP</MenuItem>
          <MenuItem value={'Population'}>Population</MenuItem>
          <MenuItem value={'Color'}>Color</MenuItem>
          <MenuItem>
          <Button variant="text" startDecorator={<Add />}>New Property</Button>
          </MenuItem>
        </Select>
        </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            {/* <td>{row.calories}</td> */}
            <td><TextField 
          id="search" 
          defaultValue={row.calories}
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}/></td>
          </tr>
        ))}
      </tbody>
    </Table>
    <div>
    <FormControl sx={{ m: 2, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-helper-label">Property</InputLabel>
          <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          label="Age"
          onChange={handleChange}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value={'GDP'}>GDP</MenuItem>
          <MenuItem value={'Population'}>Population</MenuItem>
        </Select>
    </FormControl>

    <FormControl sx={{ m: 2, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-helper-label">Min</InputLabel>
          <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          label="Age"
          sx={{ minWidth: 130 }}
        >
          <MenuItem value={MinHex}><Compact
          onChange={handleMinColorChange}
          color={MinHex}/>
    </MenuItem>
        </Select>
    </FormControl>

    <FormControl sx={{ m: 2, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-helper-label">Max</InputLabel>
          <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          label="Age"
          sx={{ minWidth: 130 }}
        >
          <MenuItem value={MaxHex}><Compact
          onChange={handleMaxColorChange}
          color={MaxHex}/>
    </MenuItem>
        </Select>
    </FormControl>

    
    </div>
    <Button variant="solid">SAVE</Button>
    <Button variant="solid">EXIT</Button>
    </div>
  );
}