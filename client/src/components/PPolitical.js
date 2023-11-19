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

function createData(name, calories) {
  return { name, calories };
}

const Data = {
  population: 20,
  GDP: 50,
  Color: "FFFFFF",
};

const rows = [
  createData("USA", 159),
  createData("CHINA", 237),
  createData("JAPAN", 262),
  createData("CANADA", 305),
];

export default function PPolitical() {
  const history = useHistory();
  const [label, setLabel] = React.useState(null);
  const [key, setKey] = React.useState(null);
  const [parsed_CSV_Data, setParsed_CSV_Data] = React.useState({});
  const [menuItems, setMenuItems] = React.useState([]);
  const [renderTable, setRenderTable] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const ROW_PER_PAGE = 30;

  function zip(...arrays) {
    const length = Math.min(...arrays.map((arr) => arr.length));
    return Array.from({ length }, (_, index) =>
      arrays.map((arr) => arr[index])
    );
  }

  const handleChangeKey = (event) => {
    console.log(event.target.value);
    setKey(event.target.value);
  };

  const handleChangeLabel = (event) => {
    console.log(event.target.value);
    setLabel(event.target.value);
  };

  const openExitModal = () => {
    history.push("/MUIExit");
  };

  const openSaveModal = () => {
    history.push("/saveMap");
  };

  const fileOnLoadComplete = (data) => {
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

    setParsed_CSV_Data(csv_data);
    setKey(keys[1]);
    setLabel(keys[0]);
    keys.shift();
    setMenuItems(keys);
    setRenderTable(true);
  };

  return (
    <div>
      <div className="propertyTitle">Property</div>
      <CsvFileReader fileOnLoadComplete={fileOnLoadComplete} />

      <div style={{ overflow: 'auto', maxHeight: '400px' }}>

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
                value={label}
                required
                onChange={handleChangeLabel}
                sx={{ minWidth: "80%"}}
                MenuProps={{
                  style: { maxHeight: "50%" }
                }}
              >
              
                {menuItems.map((mi) => (
                  <MenuItem value={mi}>{mi}</MenuItem>
                ))}
                <MenuItem>
                  <Button variant="text" startDecorator={<Add />}>
                    New Property
                  </Button>
                </MenuItem>
              </Select>
            </th>
            <th>
              <Select
                labelId="demo-simple-select-standard-label"
                id="searchOn"
                value={key}
                required
                onChange={handleChangeKey}
                sx={{ minWidth: "80%"}}
                MenuProps={{
                  style: { maxHeight: "50%" }
                }}
              >
              
                {menuItems.map((mi) => (
                  <MenuItem value={mi}>{mi}</MenuItem>
                ))}
                <MenuItem>
                  <Button variant="text" startDecorator={<Add />}>
                    New Property
                  </Button>
                </MenuItem>
              </Select>
            </th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {!renderTable ||
            zip(
              parsed_CSV_Data[label].slice(
                page * ROW_PER_PAGE,
                (page + 1) * ROW_PER_PAGE
              ),
              parsed_CSV_Data[key].slice(
                page * ROW_PER_PAGE,
                (page + 1) * ROW_PER_PAGE
              )
            ).map((row) => (
              <tr key={row.name}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>
                  <TextField
                    id="search"
                    defaultValue={row.calories}
                    variant="standard"
                    sx={{ m: 1, minWidth: 120 }}
                  />
                </td>
              </tr>
            ))}
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
    </div>
  );
}
