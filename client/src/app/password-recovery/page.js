"use client"

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/auth";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "@mui/material/Button";

import StoreContext from "@/store";

export default function ResetPassword(/*props*/) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { auth } = useContext(AuthContext);
  // const { email, token } = props;
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const { store } = useContext(StoreContext);

  if (!store.disableSearchBar) {
    store.setDisableSearchBar(true);
  }

  useEffect(() => {
    if (auth.errorMessage) {
      setError(auth.errorMessage);
    }
  }, [auth.errorMessage]);

  useEffect(() => {
    async function f() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let email = urlParams.get("email");
      let token = urlParams.get("token").replace(/SPECIAL_ESCAPE_CHAR/g, "/");
      console.log(email, token);

      const response = await auth.getHashedPassword(email);
      const pwHash = response.PwHash;
      setIsTokenValid(pwHash === token);
      setEmail(email);
      setToken(token);
    }
    f();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordPattern =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must contain at least 8 characters, including one uppercase letter, one number, and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // change password
    console.log("password is valid");
    console.log(email, password);
    let res = await auth.setNewPassword(email, password);
    console.log("response", res);
    console.log("setNewPassword end");
    auth.loginUser(
        email,
        password
    );

  };

  const res = isTokenValid ? (
    <div>
      {/* <div style={{ flex: 1, marginTop: '50px'}}> */}
      <form onSubmit={handleSubmit} className="recoveryInfo">
        {error && <p className="errorMessage">{error}</p>}

        <h1 style={{ marginBottom: 0 }}>Reset Password</h1>
        <div className="inputContainer" style={{ marginTop: 0 }}>
          <div className="inputRow">
            <div className="inputLabel">
              <label>
                New Password:
                <br />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </label>
              <p>
                Password must contain at least 8 characters, include both
                uppercase and lowercase letters, and at least 1 special
                character.
              </p>
            </div>
            <div className="inputLabel">
              <label>
                Confirm Password:
                <br />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </label>
            </div>

            <div className="buttonContainer">
              <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  mt: 0,
                  mb: 1,
                  backgroundColor: "#F06292",
                  color: "white",
                  ":hover": {
                    backgroundColor: "lightpink",
                  },
                  border: "3px solid white",
                  width: "300px",
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <h1>Page Not Found</h1>
  );

  return res;
}