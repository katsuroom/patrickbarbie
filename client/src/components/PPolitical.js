import * as React from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

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



export default function PPolitical() {

  const [age, setAge] = React.useState('GDP');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  console.log(Data.population);

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
          <th><Select
          labelId="demo-simple-select-standard-label"
          id="searchOn"
          value={age}
          required
          onChange={handleChange}
          sx={{ minWidth: 20 }}
        >
          <MenuItem value={'GDP'}>GDP</MenuItem>
          <MenuItem value={'Population'}>Population</MenuItem>
          <MenuItem value={'Color'}>Color</MenuItem>
          <MenuItem>
          <Button variant="text" startDecorator={<Add />}>New Property</Button>
          </MenuItem>
        </Select></th>
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
    <Button variant="solid">SAVE</Button>
    <Button variant="solid">EXIT</Button>
    </div>
  );
}