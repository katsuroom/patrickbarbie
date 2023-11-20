import { IconButton, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import patrickBarbie from "../images/patrick-barbie.png";
import SearchBar from './SearchBar';
import Box from '@mui/material/Box';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import AuthContext from '../auth';
import { GlobalStoreContext } from "../store";
import { useContext, useState } from "react";


export default function TitleBar() {

  const { auth } = useContext(AuthContext);
  // const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    auth.logoutUser();
  };

  const menuId = "primary-search-account-menu";
  const loggedInMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  ); 

  let menu = null;
  if (auth.loggedIn) {
    // console.log(auth);
    menu = loggedInMenu;
  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <div
        style={{ backgroundColor: "#fce8f1", minHeight: "50px", height: "9vh" }}
      >
        <Link href="/">
          <img
            src={patrickBarbie}
            width="5%"
            style={{
              marginTop: 5,
              marginLeft: 10,
              clipPath: "inset(0rem 0rem 2rem 0rem)",
            }}
          />
        </Link>
        <Box sx={{ position: "absolute", top: "2%", right: "50%" }}>
          <SearchBar />
        </Box>
        <IconButton
          sx={{
            position: "absolute",
            top: "0.5%",
            right: "1%",
          }}
          onClick={handleProfileMenuOpen}
        >
          <AccountCircleIcon sx={{ fontSize: "32pt", color: "#F1B3CD" }} />
        </IconButton>
      </div>
      {menu}
    </Box>
  );
}
