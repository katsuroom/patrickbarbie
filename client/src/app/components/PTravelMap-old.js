"use client"

import * as React from "react";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "./property.css";
import CsvFileReader from "./CsvFileReader";
import MUISaveChanges from "../modals/MUISaveChanges";
import MUIExit from "../modals/MUIExitModal";
import { useContext, useEffect } from "react";
import StoreContext from "@/store";

export default function PTravelMap-old() {
  console.log("---PTravelMap---")
  const { store } = useContext(StoreContext);

  const [menuItems, setMenuItems] = React.useState([]);
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const [exitModalOpen, setExitModalOpen] = React.useState(false);
  const [textFields, setTextFields] = React.useState([]);

  //   useEffect(() => {
  //   let tfs = [];
  //   if (store.parsed_CSV_Data) {
  //     for (let idx in store.parsed_CSV_Data[store.key]) {
  //       tfs.push(
  //         <TextField
  //           id={"tf-" + idx}
  //           defaultValue={store.parsed_CSV_Data[store.key][idx]}
  //           variant="standard"
  //           sx={{ m: 1, minWidth: 120 }}
  //           onChange={(e) => store.parsed_CSV_Data[store.key][idx] = e.target.value}
  //         />
  //       );
  //     }
  //   }
  //   setTextFields(tfs);
  // }, [store.parsed_CSV_Data])

  console.log(store.key);
  console.log(store.label);

  // const ROW_PER_PAGE = 30;

  function zip(...arrays) {
    let length;
    try {
      length = Math.min(...arrays.map((arr) => arr.length));
    }
    catch (error) {
      length = 0;
    }

    return Array.from({ length }, (_, index) =>
      arrays.map((arr) => arr[index])
    );
  }

  const handleChangeKeyStart = (event) => {
    console.log(event.target.value);
    store.setCsvStartKey(event.target.value);
  };

  const handleChangeKeyEnd = (event) => {
    console.log(event.target.value);
    store.setCsvEndKey(event.target.value);
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



  console.log(store.currentMapObject);
  console.log(store.parsed_CSV_Data);
  console.log(store.label);
  console.log(menuItems);

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
                </Select>
              </th>
              {/* <th>
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
              </th> */}
            </tr>
          </thead>
          <tbody>
            <td>
              <Select
                labelId="select1-label"
                id="select1"
                value={store.StartKey ? store.StartKey : "key"}
                required
                onChange={handleChangeKeyStart}
                sx={{ minWidth: "80%" }}
                MenuProps={{
                  style: { maxHeight: "50%" },
                }}
              >
                {store.parsed_CSV_Data && store.parsed_CSV_Data[store.label].map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>  
                ))}
              </Select>
            </td>
            <td>
              <Select
                labelId="select2-label"
                id="select2"
                value={store.EndKey ? store.EndKey : "key"}
                required
                onChange={handleChangeKeyEnd}
                sx={{ minWidth: "80%" }}
                MenuProps={{
                  style: { maxHeight: "50%" },
                }}
              >
                {store.parsed_CSV_Data && store.parsed_CSV_Data[store.label].map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </td>
          </tbody>
        </Table>
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
      <MUIExit open={exitModalOpen} closeModal={closeExitModal} />
    </div>
  );
}
