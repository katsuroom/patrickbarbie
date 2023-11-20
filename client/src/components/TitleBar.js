import React, { useState } from 'react';
import { IconButton, Link, Menu, MenuItem, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import patrickBarbie from "../images/patrick-barbie.png";
import SearchBar from './SearchBar';

export default function TitleBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={{ backgroundColor: "#fce8f1", minHeight: "50px", height: "9vh" }}>
        <Link href="/">
          <img src={patrickBarbie} width="5%" style={{ marginTop: 5, marginLeft: 10, clipPath: "inset(0rem 0rem 2rem 0rem)" }} />
        </Link>
        <Box sx={{ position: "absolute", top: "2%", right: "50%" }}>
          <SearchBar />
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
            vertical: 'top',
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
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>
            <Link href="/" color="inherit" style={{ textDecoration: 'none' }}>
              Sign Out
            </Link>
          </MenuItem>
        </Menu>
      </div>
    </Box>
  );
}
