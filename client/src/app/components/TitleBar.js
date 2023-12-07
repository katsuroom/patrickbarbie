"use client"

import React, { useState, useContext, useEffect } from "react";
import { IconButton, Menu, MenuItem, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import AuthContext from "@/auth";
import StoreContext from "@/store";
import Link from "next/link";

import SearchBar from "./SearchBar";

export default function TitleBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { auth } = useContext(AuthContext);
  const { store } = useContext(StoreContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const enableHome = () => auth.loggedIn;

  const buttonHoverStyle = {
      border: "2px solid #f786b9",
      borderRadius: "50%",
      padding: "2px",
      cursor: "pointer",
    }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div
        style={{ backgroundColor: "#fce8f1", height: "9vh" }}
      >
        <Link href={auth.loggedIn ? "/main" : "/"}>
          <img
            src="/patrick-barbie.png"
            height="125%"
            style={{
              marginTop: 5,
              marginLeft: 10,
              clipPath: "inset(0% 0% 27% 0%)",
            }}
          />
        </Link>
        {store.showSearchBar() ? (
          <div>
          <HomeIcon
            sx={{
              position: "absolute",
              top: "1.5%",
              left: "10vw",
              fontSize: "30pt",
              color:
                store.currentView === store.viewTypes.HOME
                  ? "#f786b9" : enableHome()
                  ? "lightpink":
                  "darkgray",
              "&:hover": enableHome() ? buttonHoverStyle : {}
            }}
            disabled={ !enableHome() }
            onClick={() => {
              store.changeView(store.viewTypes.HOME);
              store.getMapList();
            }}
          />
          <PeopleIcon
            sx={{
              position: "absolute",
              top: "1.5%",
              left: "15vw",
              fontSize: "30pt",
              color:
                store.currentView === store.viewTypes.COMMUNITY
                  ? "#f786b9"
                  : "lightpink",
              "&:hover": buttonHoverStyle
            }}
            disabled={false}
            className= "peopleIcon"
            onClick={() => {
              store.changeView(store.viewTypes.COMMUNITY);
              store.getMapList();
            }}
          />
        <Box sx={{ position: "absolute", top: "1%", left: "30%" }}>
          <SearchBar />
        </Box>
        </div>
        ) : null}
        <IconButton
          className="icon-menu"
          sx={{ position: "absolute", top: "0.5%", right: "1%" }}
          onClick={handleMenu}
        >
          <AccountCircleIcon sx={{ fontSize: "32pt", color: "#F1B3CD" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {auth.loggedIn ? (
              <MenuItem
                className="icon-menuItem"
                onClick={() => {
                  handleClose();
                  auth.logoutUser();
                }}
              >
                Sign Out
              </MenuItem>
          ) : (
            <MenuItem onClick={handleClose}>
              <Link
                href="/login"
                color="inherit"
                style={{ textDecoration: "none" }}
              >
                Sign In
              </Link>
            </MenuItem>
          )}
        </Menu>
      </div>
    </Box>
  );
}
