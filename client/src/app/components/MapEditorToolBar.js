"use client";

import React, { useState, useContext } from "react";
import StoreContext from "@/store";

import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { TextField } from "@mui/material";

// First row
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory"; // Add Triangle
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // Add Heart
import CropSquareIcon from "@mui/icons-material/CropSquare"; // Add Square
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye"; // Add Circle
// Second row
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Add location
import LocationOffIcon from "@mui/icons-material/LocationOff"; // Delete location
import StarBorderIcon from "@mui/icons-material/StarBorder"; // Add star
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";



const buttonStyle = {
  margin: "0 5px",
  background: "pink",
  border: "none",
  borderRadius: "4px",
  padding: "4px 8px",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  left: "0",
  zIndex: "1000",
  display: "flex",
  flexDirection: "column",
  background: "pink",
  borderRadius: "4px",
  marginTop: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  padding: "5px",
};

const dropdownItemStyle = {
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: "14px",
  border: "none",
  textAlign: "left",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
};

const textStylePopup = {
  ...dropdownStyle,
  padding: "4px",
  alignItems: "start",
};

const MapEditorToolbar = () => {
  const { store } = useContext(StoreContext);
  const [isFontDropdownVisible, setFontDropdownVisible] = useState(false);
  const [isTextSizePopupVisible, setTextSizePopupVisible] = useState(false);
  const [textSize, setTextSize] = useState(14);

  const handleUndoClick = () => { store.undo() };
  const handleRedoClick = () => { store.redo() };

  const handleFontClick = () => setFontDropdownVisible(!isFontDropdownVisible);
  const handleTextSizeClick = () =>
    setTextSizePopupVisible(!isTextSizePopupVisible);
  const closeDropdown = () => {
    setFontDropdownVisible(false);
    setTextSizePopupVisible(false);
  };

  const handleTextSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setTextSize(newSize);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newSize = parseInt(e.target.value, 10);
      setTextSize(newSize);
      store.setFontSizeTransaction(newSize);
    }
  };



  const handleTextIncreaseClick = () => {
    store.setFontSizeTransaction(store.fontSize + 1)
  };

  const handleTextDecreaseClick = () => {
    store.setFontSizeTransaction(store.fontSize - 1)
  };


  const handleBoldClick = () => {
    store.setBoldTransaction(!store.bold)
  }


  const handleItalicClick =
    () => { store.setItalicizeTransaction(!store.italicize) };


  const handleUnderlinedClick = () => {
    store.setUnderlineTransaction(!store.underline)
  };


  // const handleFillColorClick = () => alert("Fill Color button clicked");
  // const handleBorderColorClick = () => alert("Border Color button clicked");

  const FontDropdown = () => (
    <div style={dropdownStyle}>
      <div
        style={dropdownItemStyle}
        onClick={() => {
          store.setFontStyleTransaction("Arial"); closeDropdown();
        }}
      >
        Arial
      </div>
      <div
        style={dropdownItemStyle}
        onClick={() => {
          store.setFontStyleTransaction("Times New Roman");
          closeDropdown();
        }}
      >
        Times New Roman
      </div>
      <div
        style={dropdownItemStyle}
        onClick={() => {
          store.setFontStyleTransaction("Courier New");
          closeDropdown();
        }}
      >
        Courier New
      </div>

      <div
        style={dropdownItemStyle}
        onClick={() => {
          store.setFontStyleTransaction("Sans Serif");
          closeDropdown();
        }}
      >
        Sans Serif
      </div>


      <div
        style={dropdownItemStyle}
        onClick={() => {
          store.setFontStyleTransaction("Georgia");
          closeDropdown();
        }}
      >
        Georgia
      </div>

      <div
        style={dropdownItemStyle}
        onClick={() => {
          store.setFontStyleTransaction("Comic Sans MS");
          closeDropdown();
        }}
      >
        Comic Sans MS
      </div>

        
    </div>
  );

  const TextSizePopup = () => (
    <div style={textStylePopup}>
      <style>
        {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <input
        type="number"
        value={textSize}
        onChange={handleTextSizeChange}
        onKeyPress={handleKeyPress}
        style={{ width: "60px" }}
        min="1"
        max="100"
      />
    </div>
  );

  const [isShapeDropdownVisible, setShapeDropdownVisible] = useState(false);

  const handleShapeClick = () =>
    setShapeDropdownVisible(!isShapeDropdownVisible);
  const closeShapeDropdown = () => setShapeDropdownVisible(false);

  const ShapeDropdown = () => (
    <div style={dropdownStyle}>
      <div style={{ display: "flex" }}>
        {" "}
        {/* Row for shapes */}
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Triangle button clicked");
            closeShapeDropdown();
          }}
        >
          <ChangeHistoryIcon />
        </div>
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Heart button clicked");
            closeShapeDropdown();
          }}
        >
          <FavoriteBorderIcon />
        </div>
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Square button clicked");
            closeShapeDropdown();
          }}
        >
          <CropSquareIcon />
        </div>
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Circle button clicked");
            closeShapeDropdown();
          }}
        >
          <PanoramaFishEyeIcon />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {" "}
        {/* Row for location and stars */}
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Add location button clicked");
            closeShapeDropdown();
          }}
        >
          <LocationOnIcon />
        </div>
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Delete location button clicked");
            closeShapeDropdown();
          }}
        >
          <LocationOffIcon />
        </div>
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Star button clicked");
            closeShapeDropdown();
          }}
        >
          <StarBorderIcon />
        </div>
        <div
          style={dropdownItemStyle}
          onClick={() => {
            alert("Question mark button clicked");
            closeShapeDropdown();
          }}
        >
          <HelpOutlineIcon />
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        padding: "10px",
      }}
    >
      <button
        style={{ ...buttonStyle, opacity: store.canUndo() ? 1 : 0.5 }}
        disabled={!store.canUndo()}
        onClick={handleUndoClick}
      >
        <UndoIcon />
      </button>
      <button
        style={{ ...buttonStyle, opacity: store.canRedo() ? 1 : 0.5 }}
        disabled={!store.canRedo()}
        onClick={handleRedoClick}
      >
        <RedoIcon />
      </button>
      <div style={{ position: "relative" }}>
        <button style={buttonStyle} onClick={handleFontClick}>
          Font <ArrowDropDownIcon />
        </button>
        {isFontDropdownVisible && <FontDropdown />}
      </div>

      <button style={buttonStyle} onClick={handleTextIncreaseClick}>
        <TextIncreaseIcon />
      </button>
      <div style={{ position: "relative" }}>
        <button style={buttonStyle} onClick={handleTextSizeClick}>
          <FormatSizeIcon />
        </button>
        {isTextSizePopupVisible && (
          <TextSizePopup
            value={textSize}
            onChange={handleTextSizeChange}
            onKeyPress={handleKeyPress}
          />
        )}
      </div>
      <button style={buttonStyle} onClick={handleTextDecreaseClick}>
        <TextDecreaseIcon />
      </button>
      <button style={buttonStyle} onClick={handleBoldClick}>
        <FormatBoldIcon />
      </button>
      <button style={buttonStyle} onClick={handleItalicClick}>
        <FormatItalicIcon />
      </button>
      <button style={buttonStyle} onClick={handleUnderlinedClick}>
        <FormatUnderlinedIcon />
      </button>
      {/* <button style={buttonStyle} onClick={handleFillColorClick}>
        <FormatColorFillIcon />
      </button>
      <button style={buttonStyle} onClick={handleBorderColorClick}>
        <BorderColorIcon />
      </button> */}

      {/* {store.currentMapObject?.mapType === "Travel Map" ? (
        <div style={{ position: "relative" }}>

          <button style={buttonStyle} onClick={handleShapeClick}>
            Shape <ArrowDropDownIcon />
          </button>
          {isShapeDropdownVisible && <ShapeDropdown />}
        </div>
      ) : (
        <> </>
      )} */}
    </div>
  );
};

export default MapEditorToolbar;
