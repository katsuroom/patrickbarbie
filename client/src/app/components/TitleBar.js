"use client"

import React, { useState, useContext, useEffect } from "react";
import { IconButton, Menu, MenuItem, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import AuthContext from "@/auth";
import StoreContext from "@/store";
import Link from "next/link";

import { useRouter } from 'next/navigation';

import SearchBar from "./SearchBar";

export default function TitleBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { auth } = useContext(AuthContext);
  const { store } = useContext(StoreContext);
  const router = useRouter();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const enableHome = () => auth.loggedIn;

  const handlePatrick = () => {
    if(auth.loggedIn)
      router.push("/mapcards");
    else
    {
      router.push("/");
      store.logoutUser();
    }
  };

  const buttonHoverStyle = {
      border: "2px solid #f786b9",
      borderRadius: "50%",
      padding: "2px",
      cursor: "pointer",
      backgroundColor: "transparent"
    }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div
        style={{ backgroundColor: "#fce8f1", height: "9vh" }}
      >
        <img
          onClick={handlePatrick}
          src="/patrick-barbie.png"
          height="125%"
          style={{
            marginTop: 5,
            marginLeft: 10,
            clipPath: "inset(0% 0% 27% 0%)",
            cursor: "pointer"
          }}
        />
        {store.showSearchBar() ? (
          <div>
          <IconButton
            disabled={ !enableHome() }
            onClick={() => {
              store.changeView(store.viewTypes.HOME);
              store.getMapList();
            }}
            sx={{
              position: "absolute",
              top: "0.75%",
              left: "8vw",
              
              color:
                store.currentView === store.viewTypes.HOME
                  ? "#f786b9" : enableHome()
                  ? "lightpink":
                  "darkgray",
              "&:hover": enableHome() ? buttonHoverStyle : {}
            }}
          >
            <HomeIcon sx={{fontSize: "30pt"}}/>
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              top: "0.75%",
              left: "13vw",
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
          >
            <PeopleIcon sx={{fontSize: "30pt"}}/>
          </IconButton>
        <Box sx={{ position: "absolute", top: "1%", left: "23vw" }}>
          <SearchBar />
        </Box>
        </div>
        ) : null}
        {auth.loggedIn ? (
          <IconButton
            className="icon-menu"
            sx={{ position: "absolute", top: "0.5%", right: "1%" }}
            onClick={handleMenu}
          >
            {auth.loggedIn ? (
              <div
                style={{
                  fontSize: "32pt",
                  color: "#F1B3CD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#fce8f1",
                  border: "2px solid #F1B3CD",
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                {auth.user.username?.charAt(0)}
                {/* {auth.user} */}
              </div>
            ) : (
              <AccountCircleIcon sx={{ fontSize: "32pt", color: "#F1B3CD" }} />
            )}
          </IconButton>
        ) : (
          <></>
        )}
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
                  store.logoutUser();
                }}
              >
                Sign Out
              </MenuItem>
          ) : (
            <MenuItem onClick={() => {
              handleClose();
              store.logoutUser();
            }}>
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
