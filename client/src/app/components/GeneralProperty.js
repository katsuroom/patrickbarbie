"use client";

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import StoreContext from "@/store";
import EditContext from "@/edit";

import Table from "@mui/joy/Table";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function GeneralProperty() {
    const { store } = useContext(StoreContext);
    const [menuItems, setMenuItems] = React.useState([]);
    const [selectedLabel, setSelectedLabel] = React.useState("");
    const [selectedKey, setSelectedKey] = React.useState("");

    useEffect(() => {
        // console.log(store.currentMapObject);
        // console.log(Object.keys(store.rawMapFile.features[0].properties));


        if(store.currentMapObject){
            
        }
    }, []);

    const handleChangeLabel = (event) => {
        console.log(event.target.value);
        setSelectedLabel(event.target.value);
        // console.log("");
    }

    const handleChangeKey = (event) => {
        // console.log(store.currentMapObject);
        console.log(event.target.value);
        setSelectedKey(event.target.value);
    }

    if(menuItems.length === 0 && store.rawMapFile){
        setMenuItems(Object.keys(store.rawMapFile.features[0].properties));
    }


    console.log(menuItems);

    return (
      <div>
        <div className="propertyTitle">Property</div>
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
              </tr>
            </thead>
            <tbody>
             
            </tbody>
          </Table>
        </div>
      </div>
    );
}