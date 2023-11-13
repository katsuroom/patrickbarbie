// import "./stylesheet.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import TitleBar from "./TitleBar";
import StatusBar from "./StatusBar";
import splashScreenDemo from "../images/splashScreenDemo.png";
import "./font.css"


import AuthContext from "../auth";
import { useContext } from "react";

const MenuButton = (displayText) => {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        mt: 1,
        mb: 1,
        backgroundColor: "#F06292",
        color: "black",
        ":hover": {
          backgroundColor: "pink",
        },
        border: "3px solid white",
        width: "340px",
      }}
    >
      {displayText}
    </Button>
  );
};

export default function SplashScreen() {
  const { auth } = useContext(AuthContext);
  // auth.registerUser("btesttest", "test1234@gmail.com", "Az123456!");

  return (
    <>
      <div style={{ backgroundColor: "#fcc0db" }}>
        <Grid container>
          {/* Left Screen */}
          <Grid item xs={6}>
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
              sx={{ padding: "50px" }}
            >
              <img src={splashScreenDemo} alt="" width="100%"/>
            </Box>

            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="center"

            >
              <Typography variant="h5" component="div" sx={{ fontFamily: 'Sen' }}>
                Create Edit and Share Maps!
              </Typography>
            </Box>
          </Grid>

          {/* Right Screen */}
          <Grid item xs={6}>
            <Grid container component="main" sx={{ height: "83vh" }}>
              <Grid item xs={12} sx={{ marginLeft: { xs: "10%" } }}>
                <Typography variant="h1" component="div" sx={{ fontFamily: 'Rouge Script' }}>
                  Patrick Barbie
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ margin: { xs: "10%" }, marginRight: { xs: "20%" } , marginLeft: { xs: "15%" }}}>
                  <Typography variant="h5" component="div" sx={{ fontFamily: 'Sen' }}>
                  A friendly community for map creators and enjoyers.
                </Typography>
              </Grid>
              <CssBaseline />
              <Grid
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Grid item xs={12} sx={{ marginLeft: { xs: "30%" } }}>
                  <Link href="/register">{MenuButton("Create Account")}</Link>
                </Grid>
                <Grid item xs={12} sx={{ marginLeft: { xs: "30%" } }}>
                  <Link href="/login">{MenuButton("Log in")}</Link>
                </Grid>
                <Grid item xs={12} sx={{ marginLeft: { xs: "30%" } }}>
                <Link href="/main">{MenuButton("Continue as Guest")}</Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
