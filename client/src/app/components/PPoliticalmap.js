"use client";

import React from "react";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
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
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";


import EditContext from "@/edit";

export default function PPoliticalmap() {
    const { store, categoryColorMappings } = useContext(StoreContext);
    const { edit } = useContext(EditContext);

    // const { selectedAttribute, setSelectedAttribute } = useContext(StoreContext);
    // const [attributeColorMapping, setAttributeColorMapping] = useState({});


    const [properties, setProperties] = React.useState([]);
    const [newPropertyName, setNewPropertyName] = React.useState('');
    const [newPropertyColor, setNewPropertyColor] = React.useState('#fff');

    // Function to handle adding a new category-color mapping
    const handleAddProperty = () => {
        // Check if the category already exists to prevent duplicates
        if (!properties.some(property => property.category === newPropertyName)) {
            const newMappings = [...properties, { category: newPropertyName, color: newPropertyColor }];
            setProperties(newMappings);
            onMappingsChange(newMappings);
            setNewPropertyName('');
            setNewPropertyColor('#fff');
        }
    };


    // useEffect(() => {
    //     if (store.selectedAttribute && store.parsed_CSV_Data && store.parsed_CSV_Data[store.selectedAttribute]) {
    //         const uniqueValues = new Set(store.parsed_CSV_Data[store.selectedAttribute]);
    //         const newMapping = {};
    //         uniqueValues.forEach(value => {
    //             newMapping[value] = '#ffffff';
    //         });
    //         // setAttributeColorMapping(newMapping);
    //         store.updateSelectedAttribute(store.selectedAttribute);
    //         store.updateCategoryColorMappings(newMapping);
    //         store.currentMapObject.mapProps.categoryColorMappings = store.categoryColorMappings;
    //         store.currentMapObject.mapProps.selectedAttribute = store.selectedAttribute;
    //     }
    // }, [store.selectedAttribute, store.parsed_CSV_Data]);

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

    ;

    const handleColorChange = (value, color) => {
        const updatedMappings = { ...store.categoryColorMappings, [value]: color.hex };
        store.updateCategoryColorMappings(updatedMappings);
        store.currentMapObject.mapProps.categoryColorMappings = updatedMappings;
    };


    const [menuItems, setMenuItems] = React.useState([]);

    const [textFields, setTextFields] = React.useState([]);

    const [minHex, setMinHex] = React.useState(store.minColor);
    const [maxHex, setMaxHex] = React.useState(store.maxColor);

    // const handleMinColorChange = (event) => {
    //     const color = event.hex;
    //     setMinHex(color);
    //     store.setMinColor(color);

    // };

    // const handleMaxColorChange = (event) => {
    //     const color = event.hex;
    //     setMaxHex(color);
    //     store.setMaxColor(color);

    // };

    useEffect(() => {
        let tfs = [];
        if (store.parsed_CSV_Data) {
            for (let idx in store.parsed_CSV_Data[store.key]) {
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
            tfs.push(

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
        console.log(event.target.value);
        store.setCsvLabel(event.target.value);
    };

    const openSaveModal = () => {
        // store.saveMapProperties({ categoryColorMappings: store.categoryColorMappings, selectedAttribute: store.selectedAttribute });
        store.openModal(CurrentModal.SAVE_EDIT);
    };
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

                                </Select>
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {store.parsed_CSV_Data &&
                            zip(

                                store.parsed_CSV_Data[store.label],
                                store.parsed_CSV_Data[store.key]

                            ).map((row) => (
                                <tr key={row.name}>
                                    <td>{row[0]}</td>
                                    <td>{row[1]}</td>

                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>


            <div>
                <Select value={store.selectedAttribute} onChange={e => store.updateSelectedAttribute(e.target.value)}>
                    {store.parsed_CSV_Data && Object.keys(store.parsed_CSV_Data).length > 0 ?
                        Object.keys(store.parsed_CSV_Data).map(key => (
                            <MenuItem key={key} value={key}>{key}</MenuItem>
                        )) : null
                    }
                </Select>

                <div>
                    {Object.entries(store.categoryColorMappings).map(([value, color]) => (
                        <div key={value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ marginBottom: '5px' }}>{value}</div>
                            <CompactPicker color={color} onChange={color => handleColorChange(value, color)} style={{ marginBottom: '5px' }} />
                            {/* <Button onClick={updateMapColors} variant="contained">Update</Button> */}
                        </div>
                    ))}
                </div>
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
        </div>
    );
}



