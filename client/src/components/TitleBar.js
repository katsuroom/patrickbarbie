import { IconButton, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import patrickBarbie from "../images/patrick-barbie.png";

export default function TitleBar() {
  return (
  <div
    style={{backgroundColor: "#fce8f1", minHeight: "50px", height: "9vh"}}
  >
    <Link href="/">
      <img src={patrickBarbie} width="5%" style={{marginTop: 5, marginLeft: 10, clipPath: "inset(0rem 0rem 2rem 0rem)"}}/>
    </Link>
    <IconButton sx={{
      position: "absolute",
      top: "0.5%",
      right: "1%"
    }}>
        <AccountCircleIcon sx={{ fontSize: "32pt", color: "#F1B3CD" }}/>
      </IconButton>
  </div>);
}
