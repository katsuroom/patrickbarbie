// import "./stylesheet.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import background_image from "../images/background-image.jpeg"
import "./font.css"


import AuthContext from "../auth";
import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
  useEffect(() => {
    if(auth.loggedIn) {
      console.log("logged in");
      history.push("/main");
    }
  });

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
              sx={{ padding: "10px" }}
            >
              <img src={background_image} alt="" width="60%"/>
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
              <Grid item xs={12} sx={{ margin: { xs: "5%" }, marginRight: { xs: "20%" } , marginLeft: { xs: "15%" }}}>
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
