"use client";

import * as React from "react";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "./property.css";
import { useHistory } from "react-router-dom";
import CsvFileReader from "./CsvFileReader";
import { useContext, useEffect } from "react";
import StoreContext, { CurrentModal } from "@/store";

// import Table from '@mui/joy/Table';
// import Button from '@mui/joy/Button';
// import Add from '@mui/icons-material/Add';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import TextField from '@mui/material/TextField';
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Compact from "@uiw/react-color-compact";
// import './property.css'
// import { useContext, useEffect } from "react";
// import StoreContext from "../store";
// import CsvFileReader from "./CsvFileReader";

export default function PProportional() {
  const { store } = useContext(StoreContext);

  const [menuItems, setMenuItems] = React.useState([]);
  // const [renderTable, setRenderTable] = React.useState(false);
  // const [page, setPage] = React.useState(0);
  const [textFields, setTextFields] = React.useState([]);

  const [MinHex, setMinHex] = React.useState(store.minColor);
  const [MaxHex, setMaxHex] = React.useState(store.proColor);

  const handleMinColorChange = (event) => {
    setMinHex(event.hex);
    store.setMinColor(event.hex);
  };

  const handleMaxColorChange = (event) => {
    setMaxHex(event.hex);
    store.setProColorTransaction(event.hex);
  };

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

    

  }, [store.parsed_CSV_Data, store.key, store.label]);



  function zip() {
    console.log(store.selectedLabel);
    console.log(store.key);
    console.log(store.label);
    console.log(store.table);
    if (!store.selectedLabel || !store.key) {
      return [];
    }

    
    //merge the csv to rawMapFile

    console.log(store.parsed_CSV_Data);
    
    let table = [];
    

    let res = [];

   
    // // general property
    // if (Object.keys(generalProperty).indexOf(store.key) !== -1) {
    //   store.table[store.tableLabel].forEach((element, idx) => {
    //     res.push([
    //       element,
    //       store.table[store.tableLabel].indexOf(element) === -1
    //         ? ""
    //         : store.table[store.key][
    //             store.table[store.tableLabel].indexOf(element)
    //           ],
    //     ]);
    //   });
    // } else {
    //   store.table[store.tableLabel].forEach((element, idx) => {
    //     res.push([
    //       element,
    //       store.table[store.label].indexOf(element) === -1
    //         ? ""
    //         : store.table[store.key][store.table[store.label].indexOf(element)],
    //     ]);
    //   });
    // }

    return res;
  }

  const handleChangeKey = (event) => {
    let tfs = [];
    for (let idx in store.parsed_CSV_Data[event.target.value]) {
      // console.log("gay", idx);
      tfs.push(
        // <input
        //   id={"search-" + idx}
        //   defaultValue={store.parsed_CSV_Data[store.key][idx]}
        //   style={{margin: "8px", width: "100px", height:"30px"}}
        // />
        <TextField
          id={"tf-" + idx}
          defaultValue={store.parsed_CSV_Data[event.target.value][idx]}
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
          onChange={(e) =>
            (store.parsed_CSV_Data[event.target.value][idx] = e.target.value)
          }
        />
      );
    }
    setTextFields(tfs);
    store.setCsvKey(event.target.value);
  };

  const handleChangeLabel = (event) => {
    // console.log(event.target.value);
    store.setCsvLabel(event.target.value);
  };

  const openSaveModal = () => {
    store.openModal(CurrentModal.SAVE_EDIT);
  }

  const openExitModal = () => store.openModal(CurrentModal.EXIT_EDIT);

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

    // console.log(csv_data);
    keys = Array.from(keys);
    // console.log(keys);

    store.setParsedCsvDataWOR(csv_data);
    store.setCsvKeyWithoutRerendering(keys[1]);
    // store.setCsvKey(keys[1]);
    console.log("setting key to", keys[1]);
    store.setCsvLabelWithoutRerendering(keys[0]);
    console.log("setting label to", keys[0]);
    setMenuItems(keys);
    console.log("setting menu item to", keys);
    // setRenderTable(true);
    store.setCsvLabel(keys[0]);
    store.setCsvKey(keys[1]);
  };

  const handleChangeCsvLabel = (event) => {
    console.log(event.target.value);
    store.setCsvLabel(event.target.value);
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

  // console.log(store.currentMapObject);
  // console.log(store.parsed_CSV_Data);
  // console.log(store.label);
  // console.log(menuItems);

  return (
    <div>
      <CsvFileReader fileOnLoadComplete={fileOnLoadComplete} />
      <div style={{ overflow: "auto", maxHeight: "45vh" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ paddingRight: "10%" }}>Select CSV Label: </div>
          <Select
            value={store.label ? store.label : "label"}
            required
            onChange={handleChangeCsvLabel}
            sx={{ minWidth: "40%", marginLeft: "auto" }}
            MenuProps={{
              style: { maxHeight: "50%" },
            }}
          >
            {store.parsed_CSV_Data &&
              Object.keys(store.parsed_CSV_Data).map((mi) => (
                <MenuItem key={mi} value={mi}>
                  {mi}
                </MenuItem>
              ))}
          </Select>
        </div>

        <hr />

        <Table
          className="property-table"
          sx={{ "& thead th::nth-of-type(1)": { width: "40%" } }}
        >
          <thead>
            <tr>
              <th>
                {/* <Select
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
                    <MenuItem key={mi} value={mi}>
                      {mi}
                    </MenuItem>
                  ))}
                </Select> */}
                Label:
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
                    <MenuItem key={mi} value={mi}>
                      {mi}
                    </MenuItem>
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
            {
              zip().map((row, idx) => (
                <tr key={"tr" + idx}>
                  <td key={"td1" + idx}>{row[0]}</td>
                  <td key={"td2" + idx}>{row[1]}</td>
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
          <InputLabel id="demo-simple-select-helper-label">
            Circle Color
          </InputLabel>
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
      <div>
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
      </div>
      {/* <Button
        variant="solid"
        className="prev"
        sx={{ margin: 1 }}
        disabled={page <= 0}
        onClick={() => {
          setPage(page <= 0 ? 0 : page - 1);
        }}
      >
        Prev
      </Button>
      Page: {page + 1}
      <Button
        variant="solid"
        className="next"
        sx={{ margin: 1 }}
        disabled={page >= maxPage}
        onClick={() => {
          setPage(page >= maxPage ? maxPage : page + 1);
        }}
      >
        Next
      </Button> */}
    </div>
  );
}
