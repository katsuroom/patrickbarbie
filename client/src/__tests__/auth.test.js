
import axios from 'axios'
// // const dotenv = require('dotenv')
// require('dotenv').config({path:__dirname+'/./../../.env'})
console.log("process.env.url", process.env.URL);
axios.defaults.withCredentials = true;
const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/' + "auth"

// const baseURL = "http://localhost:4000/auth"
const api = axios.create({
    baseURL: baseURL,
})
 
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


describe("Auth Test", () => {
  let username, email, password;
  it("register a new account", async () => {
    var currentdate = new Date();
    username =
      "Test User: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    email = Date.now() + "@gmail.com";
    password = "Asdfghjkl;'!";
    const response = await apis.registerUser(username, email, password);
    expect(response.status).toEqual(200);
  });

  it("log in account", async () => {
    const response = await apis.loginUser(email, password);

    expect(response.status).toEqual(200);
  });
});
