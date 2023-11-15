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
  const [key, setkey] = React.useState(null);

  const handleChange = (event) => {
    setkey(event.target.value);
  };

  const openExitModal = () => {
    history.push("/MUIExit");
  };

  const openSaveModal = () => {
    history.push("/saveMap");
  };

  var CSV_Data;
  var Parsed_CSV_Data = {};
  const fileOnLoadComplete = (data) => {
    console.log(data);
    CSV_Data = data;
    try {
      for (let rowNum in CSV_Data) {
        for (let key in CSV_Data[rowNum]) {
          let val = CSV_Data[rowNum][key];
          // console.log(key, val);
          if (!val){
            continue;
          }
          console.log(key, val);
          if (!Parsed_CSV_Data[key]) {
            Parsed_CSV_Data[key] = [];
          }
          Parsed_CSV_Data[key].push(val);
        }
      }
    } catch (error) {
      console.log("parse CSV file failed", error);
    }
    console.log(Parsed_CSV_Data);
  };

  console.log(Data.population);

  return (
    <div>
      <div className="propertyTitle">Property</div>
      <CsvFileReader fileOnLoadComplete={fileOnLoadComplete} />
      {/*        
      <Table
        className="property-table"
        sx={{ "& thead th::nth-of-type(1)": { width: "40%" } }}
      >
        <thead>
          <tr>
            <th>Country Name</th>
            <th>
              <Select
                labelId="demo-simple-select-standard-label"
                id="searchOn"
                value={key}
                required
                onChange={handleChange}
                sx={{ minWidth: 20 }}
              >
                <MenuItem value={"GDP"}>GDP</MenuItem>
                <MenuItem value={"Population"}>Population</MenuItem>
                <MenuItem value={"Color"}>Color</MenuItem>
                <MenuItem>
                  <Button variant="text" startDecorator={<Add />}>
                    New Property
                  </Button>
                </MenuItem>
              </Select>
            </th>
          </tr>
        </thead>
        <tbody>
          {key || CSV_Data || CSV_Data[key] || CSV_Data[key].map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              {/* <td>{row.calories}</td> */}
      {/* <td>
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
      </Table> */}

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
