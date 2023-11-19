/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
// // const dotenv = require('dotenv')
// require('dotenv').config({path:__dirname+'/./../../.env'})
// console.log("process.env.url", process.env.URL);

axios.defaults.withCredentials = true;
const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/' + "auth"

// const baseURL = "http://localhost:4000/auth"
const api = axios.create({
    baseURL: baseURL,
    // ...config,
})

api.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';
api.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
api.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token, Authorization';
 
// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

// export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
// export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (username, email, password) => {
    console.log("inregister: ", baseURL);
    return api.post(`/register/`, {
        username : username,
        email : email,
        password : password,
    })
}
const apis = {
    // getLoggedIn,
    registerUser,
    loginUser,
    // logoutUser
}

export default apis
