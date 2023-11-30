import React, { useState, useContext } from "react";
import { IconButton, Link, Menu, MenuItem, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import AuthContext from "../auth";
import StoreContext from "../store";

import patrickBarbie from "../images/patrick-barbie.png";
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div
        style={{ backgroundColor: "#fce8f1", minHeight: "50px", height: "9vh" }}
      >
        <Link href="/main">
          <img
            src={patrickBarbie}
            width="5%"
            style={{
              marginTop: 5,
              marginLeft: 10,
              clipPath: "inset(0% 0% 35% 0%)",
            }}
          />
        </Link>
        {!store.disableSearchBar ? (
          <HomeIcon
            sx={{
              position: "absolute",
              top: "1%",
              left: "8%",
              fontSize: "30pt",
              color:
                store.currentView === store.viewTypes.HOME
                  ? "#f786b9"
                  : "lightpink",
              "&:hover": {
                border: "2px solid #f786b9",
                borderRadius: "50%",
                padding: "4px",
                cursor: "pointer",
              },
            }}
            disabled={
              store.currentView === store.viewTypes.HOME || !auth.loggedIn
            }
            onClick={() => {
              store.changeView(store.viewTypes.HOME);
            }}
          />
        ) : (
          <></>
        )}
        {!store.disableSearchBar ? (
          <PeopleIcon
            sx={{
              position: "absolute",
              top: "1%",
              left: "13%",
              fontSize: "30pt",
              color:
                store.currentView === store.viewTypes.COMMUNITY
                  ? "#f786b9"
                  : "lightpink",
              "&:hover": {
                border: "2px solid #f786b9",
                borderRadius: "50%",
                padding: "4px",
                cursor: "pointer",
              },
            }}
            disabled={store.currentView === store.viewTypes.COMMUNITY}
            onClick={() => {
              store.changeView(store.viewTypes.COMMUNITY);
            }}
          />
        ) : (
          <></>
        )}
        <Box sx={{ position: "absolute", top: "1%", right: "50%" }}>
          {!store.disableSearchBar ? <SearchBar /> : <></>}
        </Box>
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
            <>
              <MenuItem
                className="icon-menuItem"
                onClick={() => {
                  handleClose();
                  auth.logoutUser();
                }}
              >
                Sign Out
              </MenuItem>
            </>
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
