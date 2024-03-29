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
import { useContext, useEffect, useState } from "react";
import StoreContext, { CurrentModal } from "@/store";
import { CompactPicker } from "react-color";
import Typography from "@mui/material/Typography";

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

export default function PPoliticalmap() {
    const { store } = useContext(StoreContext);

    const [menuItems, setMenuItems] = React.useState([]);

    const [csvUploaded, setCsvUploaded] = React.useState(false);
    const [prevParsedCsvData, setPrevParsedCsvData] = React.useState({});
    // const [table, setTable] = React.useState({});

    const [uploadedCsvData, setUploadedCsvData] = React.useState({});

    const [editingCell, setEditingCell] = useState(null);


    const handleChangeLabel = (event) => {
        console.log(event.target.value);
        store.setCsvLabel(event.target.value);
    };

    const handleColorChange = (value, color) => {
        const updatedMappings = { ...store.categoryColorMappings, [value]: color.hex };
        store.updateCategoryColorMappings(updatedMappings);
        store.currentMapObject.mapProps.categoryColorMappings = updatedMappings;
    };


    const handleCellClick = (rowIndex, columnIndex) => {
        setEditingCell({ rowIndex, columnIndex });
    };

    const handleCellValueChange = (event) => {
        const { value } = event.target;
        const { rowIndex, columnIndex } = editingCell;
        console.log(rowIndex, columnIndex, value);

        if (columnIndex === 0) {
            store.parsed_CSV_Data[store.currentMapObject.selectedLabel][rowIndex] = value;
        }
        else {
            store.parsed_CSV_Data[store.key][rowIndex] = value;
        }

        const table = { ...store.parsed_CSV_Data };

        console.log(table);
        store.setParsedCsvData(table);

        setEditingCell(null);

    };

    const handleCellBlur = () => {
        setEditingCell(null);
    };

    // useEffect(() => {
        if (!store.parsed_CSV_Data) {


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

            console.log(store.parsed_CSV_Data);
            const table = { ...generalProperty, ...store.parsed_CSV_Data };
            console.log(table);

            store.setParsedCsvDataWOR(table);
            store.setParsedCsvData(table);

            // store.setCsvLabel(Object.keys(store.parsed_CSV_Data)[0]);
            store.setCsvKey(Object.keys(store.parsed_CSV_Data)[0]);
        }
    // }, []);

    useEffect(() => {
        if (store.selectedAttribute && store.parsed_CSV_Data && store.parsed_CSV_Data[store.selectedAttribute]) {

            const uniqueValues = new Set(store.parsed_CSV_Data[store.selectedAttribute]);
            let newMapping = {};

            // If the selectedAttribute has changed, set all unique values to #ffffff
            if (store.currentMapObject.mapProps.selectedAttribute !== store.selectedAttribute) {
                uniqueValues.forEach(value => {
                    newMapping[value] = '#ffffff';
                });
            } else {
                // If the selectedAttribute has not changed, keep the old color mappings
                newMapping = { ...store.categoryColorMappings };
            }

            store.updateSelectedAttribute(store.selectedAttribute);
            store.updateCategoryColorMappings(newMapping);
            store.currentMapObject.mapProps.categoryColorMappings = store.categoryColorMappings;
            store.currentMapObject.mapProps.selectedAttribute = store.selectedAttribute;
        }
    }, [store.selectedAttribute, store.parsed_CSV_Data]);




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
        if (!store.parsed_CSV_Data[store.currentMapObject.selectedLabel]) {
            return [];
        }
        let res = [];

        store.parsed_CSV_Data[store.currentMapObject.selectedLabel].forEach(
            (name, idx) => {
                res.push([name, store.parsed_CSV_Data[store.key][idx]]);
            }
        );

        return res;
    }

    const handleChangeKey = (event) => {
        store.setCsvKey(event.target.value);
    };

    const handleChangeCsvLabel = (event) => {
        // console.log(event.target.value);
        // store.setCsvLabel(event.target.value);

        let table;

        if (!Object.keys(prevParsedCsvData).length) {
            table = { ...store.parsed_CSV_Data };
        } else {
            table = { ...prevParsedCsvData };
        }
        console.log(table);

        const label = event.target.value;

        // if keys in uploadedCsvData already exist in table, then delete the key.
        Object.keys(uploadedCsvData).forEach((key) => {
            if (table[key]) {
                delete table[key];
            }
        });

        // then merge uploadedCsvData to table
        table[store.currentMapObject.selectedLabel].map((name) => {
            Object.keys(uploadedCsvData).forEach((key) => {
                if (!table[key]) {
                    table[key] = [];
                }

                table[key].push(
                    uploadedCsvData[label].indexOf(name) === -1
                        ? ""
                        : uploadedCsvData[key][uploadedCsvData[label].indexOf(name)]
                );
            });
        });

        store.setParsedCsvData(table);
        store.setCsvLabel(label);
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

        // store.setParsedCsvDataWOR(csv_data);
        // store.setCsvKeyWithoutRerendering(keys[1]);
        // // store.setCsvKey(keys[1]);
        // console.log("setting key to", keys[1]);
        // store.setCsvLabelWithoutRerendering(keys[0]);
        // console.log("setting label to", keys[0]);
        // setMenuItems(keys);
        // console.log("setting menu item to", keys);
        // // setRenderTable(true);
        // store.setCsvLabel(keys[0]);
        // store.setCsvKey(keys[1]);

        store.setCsvLabel(null);

        setCsvUploaded(true);
        setUploadedCsvData(csv_data);
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

    // if (store.table && menuItems.length !== Object.keys(store.table).length) {
    //   setMenuItems(Object.keys(store.table));
    // }


    return (
        <div>
            <CsvFileReader fileOnLoadComplete={fileOnLoadComplete} />
            <div style={{ overflow: "auto", maxHeight: "45vh" }}>
                {csvUploaded && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ paddingRight: "10%" }}>Match with label: </div>
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
                            {Object.keys(uploadedCsvData).map((mi) => (
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
                )}

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
                                    {Object.keys(store.parsed_CSV_Data).map((mi) => (
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
                        {zip().map((row, rowIndex) => (
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
                                                onChange={(e) => {

                                                }}
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
                <Typography sx={{ padding: 1 }}>Select Category:</Typography>
                <Select value={store.selectedAttribute} onChange={e => store.updateSelectedAttribute(e.target.value)}>
                    {store.parsed_CSV_Data && Object.keys(store.parsed_CSV_Data).length > 0 ?
                        Object.keys(store.parsed_CSV_Data).map(key => (
                            <MenuItem key={key} value={key}>{key}</MenuItem>
                        )) : null
                    }
                </Select>

                <div>
                    {Object.entries(store.categoryColorMappings).map(([value, color]) => (
                        value ? 
                        <div key={value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ marginBottom: '5px' }}>{value}</div>
                            <CompactPicker color={color} onChange={color => handleColorChange(value, color)} style={{ marginBottom: '5px' }} />
                        </div> : null
                    ))}
                </div>
            </div>
        </div>
    );
}




