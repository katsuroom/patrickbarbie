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
import './property.css'
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();
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

  const openExitModal = () => {
    history.push('/MUIExit');
  }

  const openSaveModal = () => {
    history.push('/saveMap');
  }

  console.log(Data.population);
  console.log(MinHex);

  return (
    <div>
      <div className='propertyTitle'>Property</div>
      <Button className='CSV-button' variant="solid" startDecorator={<Add />} sx={{margin: 1}}>
      CSV file
      </Button>
    <Table className='property-table' sx={{ '& thead th::nth-of-type(1)': { width: '40%' } }}>
      <thead>
        <tr>
          <th>Country Name</th>
          <th>
          <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          onChange={handleChange}
          sx={{ minWidth: 20, height: '30px'  }}>

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
    <FormControl className='formcolor' sx={{ m: 2, minWidth: 100 }}>
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

    <FormControl className='formcolor' sx={{ m: 2, minWidth: 100 }}>
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

    <FormControl className='formcolor' sx={{ m: 2, minWidth: 100 }}>
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
    <Button variant="solid" className='exit' sx={{margin: 1}}
    onClick={openExitModal}>EXIT</Button>
    <Button variant="solid" className='save' sx={{margin: 1}}
    onClick={openSaveModal}>SAVE</Button>
    </div>
  );
}