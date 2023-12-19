"use client";

import * as React from "react";
import Table from "@mui/joy/Table";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "./property.css";
import CsvFileReader from "./CsvFileReader";
import { useContext, useEffect } from "react";
import StoreContext from "@/store";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Compact from "@uiw/react-color-compact";

export default function PProportional() {
  const { store } = useContext(StoreContext);

  const [menuItems, setMenuItems] = React.useState([]);
  // const [renderTable, setRenderTable] = React.useState(false);
  // const [page, setPage] = React.useState(0);
  const [textFields, setTextFields] = React.useState([]);
  const [uploadedCsv, setUploadedCsv] = React.useState(false);
  const [csvLabels, setCsvLabels] = React.useState([]);
  const [uploadedCSVFile, setUploadedCSVFile] = React.useState(null);

  const [editingCell, setEditingCell] = React.useState(null);

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

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleCellClick = (rowIndex, columnIndex) => {
    setEditingCell({ rowIndex, columnIndex });
  };

  useEffect(() => {
    let tfs = [];
    if (store.parsed_CSV_Data) {
      for (let idx in store.parsed_CSV_Data[store.key]) {
        // console.log(111);
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
      setUploadedCsv(true);
    } catch (error) {
      console.log("parse CSV file failed", error);
    }

    // console.log(csv_data);
    keys = Array.from(keys);
    // console.log(keys);

    // store.setParsedCsvDataWOR(csv_data);
    // store.setCsvKeyWithoutRerendering(keys[1]);
    // store.setCsvKey(keys[1]);

    console.log(store.parsed_CSV_Data);
    setCsvLabels(Object.keys(csv_data));
    setUploadedCSVFile(csv_data);
    setMenuItems(keys);

    console.log("setting key to", keys[1]);
    store.setCsvLabelWithoutRerendering(keys[0]);
    console.log("setting label to", keys[0]);
    
    console.log("setting menu item to", keys);
    // setRenderTable(true);
    store.setCsvLabel(keys[0]);
    // store.setCsvKey(keys[1]);

    // store.setTable();
    // console.log(store.table);
  };

  const handleEnterPress = (index, value) => {
    store.updateTable(store.key, value, index);
  };

  const handleCellValueChange = (event) => {
    const { value } = event.target;
    const { rowIndex, columnIndex } = editingCell;
    console.log(rowIndex, columnIndex, value);

    if (columnIndex === 0) {
      store.parsed_CSV_Data[store.currentMapObject.selectedLabel][rowIndex] =
        value;
    } else {
      store.parsed_CSV_Data[store.key][rowIndex] = value;
    }

    const table = { ...store.parsed_CSV_Data };

    console.log(table);
    store.setParsedCsvData(table);

    setEditingCell(null);
  };

  const handleChangeCsvLabel = (event) => {
    console.log("changing csv Label");
    console.log(event.target.value);
    store.setNewTable(event.target.value, uploadedCSVFile);
    // store.setNewTable(event.target.value);
    setMenuItems(Object.keys(store.parsed_CSV_Data));
    console.log(store.parsed_CSV_Data);
    store.setCsvLabel(event.target.value);
    // console.log(store.table);
    console.log(store.label);
  };

  // if (store.table && menuItems.length !== Object.keys(store.table).length) {
  //   setMenuItems(Object.keys(store.table));
  // }


  console.log(store.label);
  console.log(store.currentMapObject.selectedLabel);
  console.log(store.key);
  console.log(store.parsed_CSV_Data);

  if (menuItems.length === 0 && store.parsed_CSV_Data) {
    setMenuItems(Object.keys(store.parsed_CSV_Data));
  }

  return (
    <div>
      <CsvFileReader fileOnLoadComplete={fileOnLoadComplete} />
      <div style={{ overflow: "auto", maxHeight: "45vh" }}>
        {uploadedCsv ? (
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ paddingRight: "10%" }}>
                Select CSV Label Matching with General Properties:{" "}
              </div>
              <Select
                disabled={uploadedCsv ? false : true}
                value={store.label ? store.label : "label"}
                required
                onChange={handleChangeCsvLabel}
                sx={{ minWidth: "40%", marginLeft: "auto" }}
                MenuProps={{
                  style: { maxHeight: "50%" },
                }}
              >
                {csvLabels &&
                  csvLabels.map((mi) => (
                    <MenuItem key={mi} value={mi}>
                      {mi}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <hr />
          </div>
        ) : null}

        <Table
          className="property-table"
          sx={{ "& thead th::nth-of-type(1)": { width: "40%" } }}
        >
          <thead>
            <tr>
              <th>Label:</th>
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
              {/* <th>Update: </th> */}
            </tr>
          </thead>
          <tbody>
            {store.parsed_CSV_Data &&
              store.key &&
              store.currentMapObject.selectedLabel &&
              zip(
                store.parsed_CSV_Data[store.currentMapObject.selectedLabel],
                store.parsed_CSV_Data[store.key]
                // textFields
              ).map((row, rowIndex) => (
                <tr key={"tr" + rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <td
                      key={`td${columnIndex}${rowIndex}`}
                      onClick={() => handleCellClick(rowIndex, columnIndex)}
                    >
                      {editingCell &&
                      editingCell.rowIndex === rowIndex &&
                      editingCell.columnIndex === columnIndex ? (
                        <input
                          type="text"
                          defaultValue={cell}
                          onChange={(e) => {}}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCellValueChange(e);
                            }
                          }}
                          onBlur={handleCellBlur}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
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
    </div>
  );
}
