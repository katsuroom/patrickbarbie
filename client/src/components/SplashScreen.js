// import "./stylesheet.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import AuthContext from '../auth';
import { useContext } from 'react';

export default function SplashScreen() {

  const { auth } = useContext(AuthContext);
  // auth.registerUser("btesttest", "test1234@gmail.com", "Az123456!");

  return (
    <div style={{backgroundColor: "#FFCDD2", paddingTop: "20px"}}>
      <Grid container>
        {/* Left Screen */}
        <Grid item xs={5}>
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
            sx={{ padding: "50px" }}
          >
          </Box>

          <Box
            display="flex"
            height="20%"
            alignItems="flex-end"
            justifyContent="center"
            sx={{ padding: "50px" }}
          >
            <Typography variant="h6" component="div">
              Create Edit and Share Maps!
            </Typography>
          </Box>
        </Grid>

        {/* Right Screen */}
        <Grid item xs={7}>
          <Grid
            container
            component="main"
            sx={{ height: "100vh", paddingLeft: "120px" }}
          >
            <Box
            display="flex"
            sx={{ paddingLeft: "50px", alignItems: "center"}}
          >
            <Typography variant="h2" component="div">
              Patrick Barbie
            </Typography>

          </Box>

          <Box
            display="flex"
            sx={{ paddingLeft: "20px", alignItems: "center"}}
          >
            <Typography variant="h6" component="div">
            A friendly community for map creators and enjoyers.
            </Typography>

          </Box>
            <CssBaseline />
            <Grid
              sx={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid item xs={12} sx={{ marginLeft: { xs: 13 } }}>
              <Link href="/register">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 1,
                  backgroundColor: "#F06292",
                  color: "black",
                  ":hover": {
                    backgroundColor: "lightpink",
                  },
                  border: "3px solid white",
                  width: "300px"

                }}
              >
          
                Create Account
              </Button>
              </Link>
              </Grid>
              <Grid item xs={12} sx={{ marginLeft: { xs: 13 } }}>
              <Link href="/login">

              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 1,
                  backgroundColor: "#F06292",
                  color: "black",
                  ":hover": {
                    backgroundColor: "lightpink",
                  },
                  border: "3px solid white",
                  width: "300px"


                }}
              >
                Login in
              </Button>
              </Link>

              </Grid>
              <Grid item xs={12} sx={{ marginLeft: { xs: 13 } }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 1,
                  backgroundColor: "#F06292",
                  color: "black",
                  ":hover": {
                    backgroundColor: "lightpink",
                  },
                  border: "3px solid white",
                  width: "300px"

                }}
              >
                Continue as Guest
              </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
