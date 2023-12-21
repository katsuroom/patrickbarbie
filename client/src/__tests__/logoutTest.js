const axios = require("axios");

axios.defaults.withCredentials = true;
const baseURL = "https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth";
const api = axios.create({ baseURL: baseURL });

const loginUser = (email, password) => {
  return api.post(`/login/`, { email, password });
};

const logoutUser = () => {
  return api.get(`/logout/`);
};

const apis = { loginUser, logoutUser };


describe("Logout Tests", () => {
  let email, password;

  it("logout account", async () => {
    email = "Admin123@admin.com";
    password = "Admin123@admin.com";
    const response = await apis.loginUser(email, password);
    const response2 = await apis.logoutUser();
    expect(response.status).toEqual(200);
    expect(response2.status).toEqual(200);
  });

  
});
