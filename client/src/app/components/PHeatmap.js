"use client"

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
import { useContext, useEffect } from "react";
import StoreContext from '@/store';
import CsvFileReader from "./CsvFileReader";

import MUISaveChanges from '../modals/MUISaveChanges';
import MUIExit from '../modals/MUIExitModal';


const Data = {
  "population": 20,
  "GDP": 50,
  "Color": "FFFFFF",
}


export default function PHeatmap() {
  const [MinHex, setMinHex] = React.useState("#fff");
  const [MaxHex, setMaxHex] = React.useState("#fff");
  const [age, setAge] = React.useState('');

  const { store } = useContext(StoreContext);

  const [menuItems, setMenuItems] = React.useState([]);
  // const [renderTable, setRenderTable] = React.useState(false);
  // const [page, setPage] = React.useState(0);
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const [exitModalOpen, setExitModalOpen] = React.useState(false);
  const [textFields, setTextFields] = React.useState([]);

  useEffect(() => {
    let tfs = [];
    if (store.parsed_CSV_Data) {
      for (let idx in store.parsed_CSV_Data[store.key]) {
        console.log(111);
        tfs.push(
          <TextField
            id={"tf-" + idx}
            defaultValue={store.parsed_CSV_Data[store.key][idx]}
            variant="standard"
            sx={{ m: 1, minWidth: 120 }}
            onChange={(e) =>
              (store.parsed_CSV_Data[store.key][idx] = e.target.value)
            }
          />
        );
      }
    }
    setTextFields(tfs);
  }, [store.parsed_CSV_Data]);

  console.log(store.key);
  console.log(store.label);

  // const ROW_PER_PAGE = 30;

  function zip(...arrays) {
    let length;
    try {
      length = Math.min(...arrays.map((arr) => arr.length));
    } catch (error) {
      length = 0;
    }

    return Array.from({ length }, (_, index) =>
      arrays.map((arr) => arr[index])
    );
  }

  const handleChangeKey = (event) => {
    console.log(event.target.value);

    let tfs = [];
    for (let idx in store.parsed_CSV_Data[store.key]) {
      tfs.push(
        // <input
        //   id={"search-" + idx}
        //   defaultValue={store.parsed_CSV_Data[store.key][idx]}
        //   style={{margin: "8px", width: "100px", height:"30px"}}
        // />
        <TextField
          id={"tf-" + idx}
          defaultValue={store.parsed_CSV_Data[store.key][idx]}
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
          onChange={(e) =>
            (store.parsed_CSV_Data[store.key][idx] = e.target.value)
          }
        />
      );
    }
    setTextFields(tfs);
    store.setCsvKey(event.target.value);
  };

  const handleChangeLabel = (event) => {
    console.log(event.target.value);
    store.setCsvLabel(event.target.value);
  };

  const openSaveModal = () => {
    setSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setSaveModalOpen(false);
  };

  const openExitModal = () => {
    setExitModalOpen(true);
  };

  const closeExitModal = () => {
    setExitModalOpen(false);
  };

  const saveCsvChanges = () => {
    // for (let idx in store.parsed_CSV_Data[store.key]) {
    //   store.parsed_CSV_Data[store.key][idx] = textFields[idx].value;
    // }
  };

  const fileOnLoadComplete = (data) => {
    // setRenderTable(false);

    console.log(data);
    let csv_data = {};
    let keys = new Set();
    try {
      for (let rowNum in data) {
        for (let key in data[rowNum]) {
          let val = data[rowNum][key];
          // console.log(key, val);
          if (val === undefined) {
            continue;
          }
          // console.log(key, val);
          keys.add(key);
          if (!csv_data[key]) {
            csv_data[key] = [];
          }
          csv_data[key].push(val);
        }
      }
    } catch (error) {
      console.log("parse CSV file failed", error);
    }

    console.log(csv_data);
    keys = Array.from(keys);
    console.log(keys);

    store.setParsedCsvDataWOR(csv_data);
    store.setCsvKeyWithoutRerendering(keys[1]);
    // store.setCsvKey(keys[1]);
    console.log("setting key to", keys[1]);
    store.setCsvLabelWithoutRerendering(keys[0]);
    console.log("setting label to", keys[0]);
    setMenuItems(keys);
    console.log("setting menu item to", keys);
    // setRenderTable(true);
  };

  // if (store.parsed_CSV_Data && !renderTable){
  //   console.log("enter here")
  //   setMenuItems(Object.keys(store.parsed_CSV_Data))
  //   setRenderTable(true);
  // }
  if (menuItems.length === 0 && store.parsed_CSV_Data) {
    setMenuItems(Object.keys(store.parsed_CSV_Data));
  }

  // let maxPage =
  //   store.label && store.parsed_CSV_Data && store.parsed_CSV_Data[store.label]
  //     ? parseInt(store.parsed_CSV_Data[store.label].length / ROW_PER_PAGE)
  //     : 0;

  console.log(store.currentMapObject);
  console.log(store.parsed_CSV_Data);
  console.log(store.label);
  console.log(menuItems);

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
      <div className="propertyTitle">Property</div>
      <CsvFileReader fileOnLoadComplete={fileOnLoadComplete} />
      <div style={{ overflow: "auto", maxHeight: "400px" }}>
        <Table
          className="property-table"
          sx={{ "& thead th::nth-of-type(1)": { width: "40%" } }}
        >
          <thead>
            <tr>
              <th>
                <Select
                  // labelId="demo-simple-select-standard-label"
                  // id="searchOn"
                  value={store.label ? store.label : "label"}
                  required
                  onChange={handleChangeLabel}
                  sx={{ minWidth: "80%" }}
                  MenuProps={{
                    style: { maxHeight: "50%" },
                  }}
                >
                  {menuItems.map((mi) => (
                    <MenuItem key={mi} value={mi}>{mi}</MenuItem>
                  ))}
                  {/* <MenuItem>
                    <Button variant="text" startDecorator={<Add />}>
                      New Label
                    </Button>
                  </MenuItem> */}
                </Select>
              </th>
              <th>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="searchOn"
                  value={store.key ? store.key : "key"}
                  required
                  onChange={handleChangeKey}
                  sx={{ minWidth: "80%" }}
                  MenuProps={{
                    style: { maxHeight: "50%" },
                  }}
                >
                  {menuItems.map((mi) => (
                    <MenuItem key={mi} value={mi}>{mi}</MenuItem>
                  ))}
                  {/* <MenuItem>
                    <Button variant="text" startDecorator={<Add />}>
                      New Column
                    </Button>
                  </MenuItem> */}
                </Select>
              </th>
              {/* <th>Update</th> */}
            </tr>
          </thead>
          <tbody>
            {store.parsed_CSV_Data &&
              zip(
                // store.parsed_CSV_Data[store.label].slice(
                //   page * ROW_PER_PAGE,
                //   (page + 1) * ROW_PER_PAGE
                // ),
                // textFields.slice(page * ROW_PER_PAGE, (page + 1) * ROW_PER_PAGE)
                store.parsed_CSV_Data[store.label],
                textFields
              ).map((row) => (
                <tr key={row.name}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  {/* <td>
                    <TextField
                      id="search"
                      defaultValue={row.calories}
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                    />
                  </td> */}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <div>
        <FormControl className="formcolor" sx={{ m: 2, minWidth: 100 }}>
          <InputLabel id="demo-simple-select-helper-label">Property</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="searchOn"
            value={store.key ? store.key : "key"}
            required
            onChange={handleChangeKey}
            sx={{ minWidth: "80%" }}
            MenuProps={{
              style: { maxHeight: "50%" },
            }}
          >
            {menuItems.map((mi) => (
              <MenuItem key={mi} value={mi}>{mi}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="formcolor" sx={{ m: 2, minWidth: 100 }}>
          <InputLabel id="demo-simple-select-helper-label">Min</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            label="Age"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value={MinHex}>
              <Compact onChange={handleMinColorChange} color={MinHex} />
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl className="formcolor" sx={{ m: 2, minWidth: 100 }}>
          <InputLabel id="demo-simple-select-helper-label">Max</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            label="Age"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value={MaxHex}>
              <Compact onChange={handleMaxColorChange} color={MaxHex} />
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <Button
        variant="solid"
        className="exit"
        sx={{ margin: 1 }}
        onClick={openExitModal}
      >
        EXIT
      </Button>
      <Button
        variant="solid"
        className="save"
        sx={{ margin: 1 }}
        onClick={openSaveModal}
      >
        SAVE
      </Button>

      <MUISaveChanges
        open={saveModalOpen}
        closeModal={closeSaveModal}
        saveCB={saveCsvChanges}
      />
      <MUIExitModal open={exitModalOpen} closeModal={closeExitModal} />
    </div>
  );
}