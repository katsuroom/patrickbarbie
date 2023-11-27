import React, { useState, useContext } from 'react';
import { IconButton, Link, Menu, MenuItem, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthContext from '../auth';

import patrickBarbie from "../images/patrick-barbie.png";
import SearchBar from './SearchBar';

export default function TitleBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { auth } = useContext(AuthContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={{ backgroundColor: "#fce8f1", minHeight: "50px", height: "9vh" }}>
        <Link href="/main">
          <img src={patrickBarbie} width="5%" style={{ marginTop: 5, marginLeft: 10, clipPath: "inset(0rem 0rem 2rem 0rem)" }} />
        </Link>
        <Box sx={{ position: "absolute", top: "2%", right: "50%" }}>
          {auth.loggedIn? <SearchBar /> : <></>}
        </Box>
        <IconButton
          sx={{ position: "absolute", top: "0.5%", right: "1%" }}
          onClick={handleMenu}
        >
          <AccountCircleIcon sx={{ fontSize: "32pt", color: "#F1B3CD" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {auth.loggedIn ? (
            <>

              <MenuItem onClick={() => {
                handleClose();
                auth.logoutUser();
              }}>
                  Sign Out
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleClose}>
              <Link href="/login" color="inherit" style={{ textDecoration: 'none' }}>
                Sign In
              </Link>
            </MenuItem>
          )}
        </Menu>
      </div>
    </Box>
    
  );
}
