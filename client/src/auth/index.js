import React, { createContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

//comment
// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    const history = useHistory();

    // useEffect(() => {
    //     auth.getLoggedIn();
    // }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    // auth.getLoggedIn = async function () {
    //     // const response = await api.getLoggedIn();
    //     // if (response.status === 200) {
    //     //     authReducer({
    //     //         type: AuthActionType.GET_LOGGED_IN,
    //     //         payload: {
    //     //             loggedIn: response.data.loggedIn,
    //     //             user: response.data.user
    //     //         }
    //     //     });
    //     // }

    //     console.log("getLoggedIn");
    //     api.getLoggedIn().then((response) => {
    //       if (response.status === 200) {
    //         console.log("getLoggedIn successful:", response);
    //         authReducer({
    //           type: AuthActionType.GET_LOGGED_IN,
    //           payload: {
    //             loggedIn: response.data.loggedIn,
    //             user: response.data.user,
    //           },
    //         });
    //       }
    //     });
    // }

    auth.registerUser = async function(username, email, password) {
        console.log("REGISTERING USER");
        // try{   
        //     const response = await api.registerUser(username, email, password);   
        //     if (response.status === 200) {
        //         console.log("Registered Sucessfully");
        //         authReducer({
        //             type: AuthActionType.REGISTER_USER,
        //             payload: {
        //                 user: response.data.user,
        //                 loggedIn: true,
        //                 errorMessage: null
        //             }
        //         })
        //         history.push("/login");
        //         console.log("NOW WE LOGIN");
        //         auth.loginUser(email, password);
        //         console.log("LOGGED IN");
        //     }
        // } catch(error){
        //     let errorMessage = 'An error occurred';
        //     if (error.response && error.response.data) {
        //         errorMessage = error.response.data.errorMessage;
        //     }
        //     authReducer({
        //         type: AuthActionType.REGISTER_USER,
        //         payload: {
        //             user: auth.user,
        //             loggedIn: false,
        //             errorMessage
        //         }
        //     })
        // }

        api.registerUser(username, email, password)
        .then(response => {
            if(response.status === 200){
                console.log('Registration successful:', response);
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                history.push("/login");
                console.log("NOW WE LOGIN");
                auth.loginUser(email, password);
                console.log("LOGGED IN");
            }else{
                console.log('Registration failed:', response);
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        errorMessage: response.data.error
                    }
                })
            }
        })
    }

    auth.loginUser = async function(email, password) {
        // try{
        //     console.log("Logging in user");
        //     const response = await api.loginUser(email, password);
        //     console.log("response: ", response.status);
        //     if (response.status === 200) {
        //         console.log("Logged in Sucessfully");
        //         authReducer({
        //             type: AuthActionType.LOGIN_USER,
        //             payload: {
        //                 user: response.data.user,
        //                 loggedIn: true,
        //                 errorMessage: null
        //             }
        //         })
        //         history.push("/main");
                
        //     }
        // } catch(error){
        //     authReducer({
        //         type: AuthActionType.LOGIN_USER,
        //         payload: {
        //             user: auth.user,
        //             loggedIn: false,
        //             errorMessage: error.response.data.errorMessage
        //         }
        //     })
        // }

        api.loginUser(email, password)
        .then(response => {

            // Handle the successful login response
            if(response.status === 200){
                console.log('Login successful:', response);
                console.log("token: ", response.data.token);
                if(response.data.token){
                    const jsonData = JSON.stringify(response);
                    localStorage.setItem("user", jsonData);
                    console.log("token: ", localStorage.getItem("user"));
                }
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                history.push("/main");
            }
            else if(response.status === 401){
                console.log('Login failed: Unauthorized access');
                console.log(response);
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        errorMessage: "Invalid email or password. Please try again."
                    }
                })
            }else{
                console.log('Login failed:', response);
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        errorMessage: response.data.error
                    }
                })
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the login
            var message = "something went wrong";
            console.error('Login failed:', error);
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: message
                }
            })
        });
    }

    auth.logoutUser = async function() {
        console.log("Logout user");
        api.logoutUser()
        .then(response => {
            if(response.status === 200){
                console.log('Logout successful:', response);
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload: null
                })
                history.push("/");
            }else{
                console.log('Logout failed:', response);
            }
        })
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };