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
import { CompactPicker } from "react-color";

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

export default function PHeatmap() {
  const { store } = useContext(StoreContext);

  const [menuItems, setMenuItems] = React.useState([]);
  // const [table, setTable] = React.useState({});

  const handleMinColorChange = (event) => {
    const color = event?.hex;
    if (color) {
      // setMinHex(color);
      // store.setMinColor(color);
      store.setHeatColorTransaction(color, "min");
    }
  };

  const handleMaxColorChange = (event) => {
    const color = event?.hex;
    if (color) {
      // store.setMaxColor(color);
      store.setHeatColorTransaction(color, "max");
    }
  };

  function zip() {
    if (!store.tableLabel || !store.key) {
      return [];
    }

    let res = [];

    // general property
    if (Object.keys(generalProperty).indexOf(store.key) !== -1) {
      store.table[store.tableLabel].forEach((element, idx) => {
        res.push([
          element,
          store.table[store.tableLabel].indexOf(element) === -1
            ? ""
            : store.table[store.key][
                store.table[store.tableLabel].indexOf(element)
              ],
        ]);
      });
    } else {
      store.table[store.tableLabel].forEach((element, idx) => {
        res.push([
          element,
          store.table[store.label].indexOf(element) === -1
            ? ""
            : store.table[store.key][store.table[store.label].indexOf(element)],
        ]);
      });
    }

    return res;
  }

  const handleChangeKey = (event) => {
    store.setCsvKey(event.target.value);
  };

  const handleChangeCsvLabel = (event) => {
    console.log(event.target.value);
    store.setCsvLabel(event.target.value);
  };

  const openSaveModal = () => store.openModal(CurrentModal.SAVE_EDIT);

  const openExitModal = () => store.openModal(CurrentModal.EXIT_EDIT);

  const saveCsvChanges = () => {};

  const handleChangeTableLabel = (event) => {
    console.log(event.target.value);
    store.setTableLabel(event.target.value);
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
    store.setCsvLabel(keys[0]);
    store.setCsvKey(keys[1]);
  };

  const properties = store.rawMapFile.features.map(
    (element) => element.properties
  );
  const generalProperty = {};
  properties.forEach((element) => {
    Object.keys(element).forEach((key) => {
      if (key in generalProperty) {
        generalProperty[key].push(element[key]);
      } else {
        generalProperty[key] = [element[key]];
      }
    });
  });

  if (menuItems.length !== Object.keys(store.table).length) {
    setMenuItems(Object.keys(store.table));
  }

  return (
    <div>
      <CsvFileReader fileOnLoadComplete={fileOnLoadComplete} />
      <div style={{ overflow: "auto", maxHeight: "45vh" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ paddingRight: "10%" }}>Select Label: </div>
          <Select
            // labelId="demo-simple-select-standard-label"
            // id="searchOn"
            value={store.tableLabel}
            required
            onChange={handleChangeTableLabel}
            sx={{ minWidth: "40%", marginLeft: "auto" }}
            MenuProps={{
              style: { maxHeight: "50%" },
            }}
          >
            {Object.keys(generalProperty).map((mi) => (
              <MenuItem key={mi} value={mi}>
                {mi}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ paddingRight: "10%" }}>Select CSV Label: </div>
          <Select
            // labelId="demo-simple-select-standard-label"
            // id="searchOn"
            value={store.label ? store.label : "label"}
            required
            onChange={handleChangeCsvLabel}
            sx={{ minWidth: "40%", marginLeft: "auto" }}
            MenuProps={{
              style: { maxHeight: "50%" },
            }}
          >
            {Object.keys(store.parsed_CSV_Data).map((mi) => (
              <MenuItem key={mi} value={mi}>
                {mi}
              </MenuItem>
            ))}
            {/* <MenuItem>
                    <Button variant="text" startDecorator={<Add />}>
                      New Label
                    </Button>
                  </MenuItem> */}
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
                  onChange={handleChangeCsvLabel}
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
                  
                </Select> 
                */}

                <div>Label</div>
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
            {store.table &&
              zip().map((row, idx) => (
                <tr key={"tr" + idx}>
                  <td key={"td1" + idx}>{row[0]}</td>
                  <td key={"td2" + idx}>{row[1]}</td>
                  {/* <td>
                    <TextField
                      id="search"
                      variant="standard"
                      key={row[idx] + "td3" + idx}
                      sx={{ m: 1, minWidth: 120 }}
                      onChange={(e) =>
                        textFieldChanges[idx] = e.target.value
                        // (store.parsed_CSV_Data[store.key][idx] = e.target.value)
                      }
                      onKeyDown={() => {store.parsed_CSV_Data[store.key][idx] = textFieldChanges[idx]}}
                    />
                  </td> */}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <div>
        {/* <FormControl className="formcolor" sx={{ m: 2, minWidth: 100 }}>
        <InputLabel id="min-color-label">Min</InputLabel>
        <Select
          labelId="min-color-label"
          id="min-color-select"
          label="Min Color"
          sx={{ minWidth: 130 }}
          value={minHex}
          onChange={(event) => setMinHex(event.target.value)}
        >
          <MenuItem value={minHex}> */}
        <div>Select Min Color: </div>
        <CompactPicker
          onChange={handleMinColorChange}
          color={store.minColor || "#FFFFFF"}
          disableAlpha={true} // Disable alpha channel
        />
        {/* </MenuItem>
        </Select>
      </FormControl> */}

        {/* <FormControl className="formcolor" sx={{ m: 2, minWidth: 100 }}>
        <InputLabel id="max-color-label">Max</InputLabel>
        <Select
          labelId="max-color-label"
          id="max-color-select"
          label="Max Color"
          sx={{ minWidth: 130 }}
          value={maxHex}
          onChange={(event) => setMaxHex(event.target.value)}
        >
          <MenuItem value={maxHex}> */}
        <div style={{ paddingTop: "1%" }}>Select Max Color: </div>

        <CompactPicker
          onChange={handleMaxColorChange}
          color={store.maxColor || "#FF0000"}
          disableAlpha={true} // Disable alpha channel
        />
        {/* </MenuItem>
        </Select>
      </FormControl> */}
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
