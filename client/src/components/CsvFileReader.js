import * as React from "react";
import CSVReader from "react-csv-reader";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";


export default function CsvFileReader(props) {
  function handleForce(data) {  
    props.fileOnLoadComplete(data);
  }
  return (
    <CSVReader
      onFileLoaded={handleForce}
      parserOptions={{ header: true }}
      inputStyle={{
        color: "red",
        backgroundColor: "pink",
        borderRadius: "10px",
        padding: "10px",
        border: "none",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
        fontFamily: 'Sen',
        width: "80%",
        marginLeft: '10%',
      }}
    ></CSVReader>
  );
}
