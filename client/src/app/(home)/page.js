"use client"

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import AuthContext from "@/auth";
import StoreContext from "@/store";
import { useContext, useEffect } from "react";
import { redirect } from "next/navigation";

export default function SplashScreen() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(StoreContext);

  useEffect(() => {
    if(auth.loggedIn) {
      console.log("logged in");
      redirect("/mapcards");
    }
  }, [auth.loggedIn]);

  const buttonStyle = {
    mt: 1,
    mb: 1,
    backgroundColor: "#F06292",
    color: "black",
    ":hover": {
      backgroundColor: "pink",
    },
    border: "3px solid white",
    width: "340px",
  };

  return (
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
            <img src="/background-image.jpeg" alt="" width="60%"/>
          </Box>

          <Box
            display="flex"
            alignItems="center"
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
                <Link href="/register">
                  <Button type="submit" variant="contained" sx={buttonStyle}>Create Account</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sx={{ marginLeft: { xs: "30%" } }}>
                <Link href="/login">
                  <Button type="submit" variant="contained" sx={buttonStyle}>Log in</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sx={{ marginLeft: { xs: "30%" } }}>
                <Button type="submit" variant="contained" onClick={auth.loginGuest} sx={buttonStyle}>Continue as Guest</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
