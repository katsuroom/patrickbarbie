"use client";

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import StoreContext, { CurrentModal } from "@/store";
import EditContext from "@/edit";
import MUISaveChanges from "../modals/MUISaveChanges";
import MUIExit from "../modals/MUIExitModal";

import Table from "@mui/joy/Table";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/joy/Button";
import TextField from '@mui/material/TextField';

export default function GeneralProperty() {
    const { store } = useContext(StoreContext);
    const [menuItems, setMenuItems] = React.useState([]);
    const [selectedLabel, setSelectedLabel] = React.useState("");
    const [selectedKey, setSelectedKey] = React.useState("");

    const handleChangeLabel = (event) => {
        // console.log(event.target.value);
        setSelectedLabel(event.target.value);
        // console.log("");
    }

    const handleChangeKey = (event) => {
        // console.log(store.currentMapObject);
        console.log(event.target.value);
        setSelectedKey(event.target.value);
    }

    const openSaveModal = () => {
      store.openModal(CurrentModal.SAVE_EDIT);
    };

    const openExitModal = () => store.openModal(CurrentModal.EXIT_EDIT);


    const handleEnterPress = (index, value) => {
        // console.log(index);
        // console.log(value);

        // Get the current data type
        const currentDataType =
          typeof store.rawMapFile.features[index].properties[selectedKey];
        // console.log(`Current data type: ${currentDataType}`);

        // Clone the rawMapFile object to avoid modifying the original directly
        const newRawMapFile = JSON.parse(JSON.stringify(store.rawMapFile));

        // Update the property in the cloned object
        newRawMapFile.features[index].properties[selectedKey] =
          convertToProperType(value, currentDataType);

        console.log(newRawMapFile);

        store.rawMapFile = newRawMapFile;
        store.setRawMapFile(newRawMapFile);
        console.log(store.rawMapFile);
        console.log(store.currentMapObject);
        
    }

    const convertToProperType = (value, dataType) => {
      switch (dataType) {
        case "number":
          return parseFloat(value);
        case "boolean":
          return value.toLowerCase() === "true";
        // Add more cases as needed
        default:
          return value;
      }
    };

    if(menuItems.length === 0 && store.rawMapFile){
        setMenuItems(Object.keys(store.rawMapFile.features[0].properties));
    }


    console.log(menuItems);

    return (
      <div>
        <div style={{ overflow: "auto", maxHeight: "45vh" }}>
          <Table
            className="property-table"
            sx={{ "& thead th::nth-of-type(1)": { width: "40%" } }}
          >
            <thead>
              <tr>
                <th>
                  <Select
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
                  </Select>
                </th>
                <th>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="searchOn"
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
                  </Select>
                </th>
                <th>new value: </th>
              </tr>
            </thead>
            <tbody>
              {store.rawMapFile && selectedLabel && selectedKey
                ? store.rawMapFile.features.map((element, index) => (
                    <tr key={index}>
                      <td>
                        {/* <TextField
                          value={element.properties[selectedLabel]}
                          onChange={(e) => setLabelValue(e.target.value, index)}
                          variant="standard"
                        /> */}
                        {element.properties[selectedLabel]}
                      </td>
                      <td>
                        {/* <TextField
                          defaultValue={element.properties[selectedKey]}
                          variant="standard"
                        /> */}
                        {element.properties[selectedKey]}
                      </td>
                      <td>
                        <TextField
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleEnterPress(index, e.target.value);
                            }
                          }}
                          variant="standard"
                        />
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </Table>
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
        <MUISaveChanges />
        <MUIExit />
      </div>
    );
}