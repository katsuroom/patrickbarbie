"use client"

import React, { createContext, useState, useEffect } from "react";
import api from "./api";
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

//comment
// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGIN_GUEST: "LOGIN_GUEST",
  LOGOUT_USER: "LOGOUT_USER",
  SET_ERROR: "SET_ERROR"
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    errorMessage: null,
  });
  const router = useRouter();

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
    if (token) {
      auth.getLoggedIn();
    }
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errorMessage: null,
        });
      }
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          errorMessage: null
        });
      }
      case AuthActionType.LOGIN_GUEST: {
        return setAuth({
          user: payload.user,
          loggedIn: false,
          errorMessage: null
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
          errorMessage: null,
        });
      }
      case AuthActionType.SET_ERROR: {
        return setAuth({
          ...auth,
          errorMessage: payload.errorMessage
        })
      }
      default:
        return auth;
    }
  };

  // recover user from local stored token and login
  auth.getLoggedIn = async function () {
    console.log("getLoggedIn");
    api.getLoggedIn().then((response) => {
      if (response.status === 200) {
        console.log("getLoggedIn successful:", response);
        authReducer({
          type: AuthActionType.GET_LOGGED_IN,
          payload: {
            loggedIn: response.data.loggedIn,
            user: response.data.user,
          },
        });
      }
    });
  };

  // register user and immediately login on success
  auth.registerUser = async function (username, email, password) {
    console.log("REGISTERING USER");
    api.registerUser(username, email, password).then((response) => {
      console.log(response.data);
      if (response.status === 200)
        auth.loginUser(email, password);
      else
      {
        let errorMessage = "Registration failed: Unknown error";
        switch(true)
        {
          case response.data.error.includes("username_1 dup key"):
            errorMessage = "The username is already in use. Please try a different username.";
            break;

          case response.data.error.includes("email_1 dup key"):
            errorMessage = "The email is already in use. Please try a different email.";
            break;

          default:
            break;
        }

        // Dispatch the error message
        authReducer({
          type: AuthActionType.SET_ERROR,
          payload: {
            errorMessage
          },
        });
      }
    });
  };

  // login user
  auth.loginUser = async function (email, password) {
    api.loginUser(email, password)
      .then((response) => {
        // Handle the successful login response
        if (response.status === 200) {
          console.log("Login successful:", response);
          if (response.data.token) {
            const jsonData = JSON.stringify(response);
            localStorage.setItem("user", jsonData);
          }
          authReducer({
            type: AuthActionType.LOGIN_USER,
            payload: {
              user: response.data.user
            },
          });
          router.push("/main");
        } else {
          console.log("Login failed:", response);
          authReducer({
            type: AuthActionType.SET_ERROR,
            payload: {
              errorMessage: response.data.errorMessage,
            },
          });
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the login
        let message = "something went wrong";
        console.error("Login failed:", error);
        authReducer({
          type: AuthActionType.SET_ERROR,
          payload: {
            errorMessage: message,
          },
        });
      });
  };

  // login guest
  auth.loginGuest = async function () {
    authReducer({
      type: AuthActionType.LOGIN_GUEST,
      payload: {
        user: { username: "guest" }
      },
    });
    router.push("/main");
  }

  // logout user
  auth.logoutUser = async function () {
    console.log("Logout user");
    api.logoutUser().then((response) => {
      if (response.status === 200) {
        console.log("Logout successful:", response);
        authReducer({
          type: AuthActionType.LOGOUT_USER,
          payload: null,
        });
        localStorage.removeItem("user");
        router.push("/");
      } else {
        console.log("Logout failed:", response);
      }
    });
  };

  auth.sendPasswordRecoveryEmail = function(email) {
    return api.sendPasswordRecoveryEmail(email);
  }

  auth.getHashedPassword = function(email){
    return api.getHashedPassword(email);
  }

  auth.setNewPassword = function(email, newPassword){
    return api.setNewPassword(email, newPassword);
  }

  return (
    <AuthContext.Provider value={{ auth }} >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
