
const axios = require('axios');

axios.defaults.withCredentials = true;
const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/' + "auth"

// const baseURL = "http://localhost:4000/auth"
const api = axios.create({
    baseURL: baseURL,
})


// export const getLoggedIn = () => api.get(`/loggedIn/`);
const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
// export const logoutUser = () => api.get(`/logout/`)
const registerUser = (username, email, password) => {
    console.log("inregister: ", baseURL);
    return api.post(`/register/`, {
        username : username,
        email : email,
        password : password,
    })
}
const apis = {
    registerUser,
    loginUser,
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
