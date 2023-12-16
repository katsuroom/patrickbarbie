const axios = require('axios');

axios.defaults.withCredentials = true;
const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth';
const api = axios.create({ baseURL: baseURL });

const loginUser = (email, password) => {
    return api.post(`/login/`, { email, password });
};

const apis = { loginUser };

describe("Login Tests", () => {
    let email, password;

    it("log in account", async () => {
        email = "Admin123@admin.com";
        password = "Admin123@admin.com";
        const response = await apis.loginUser(email, password);
        expect(response.status).toEqual(200);
    });

    it("Fail to login with incorrect email", async () => {
        const incorrectEmail = "incorrect@example.com";
        await expect(apis.loginUser(incorrectEmail, password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 401 })
            }));
    });

    it("Fail to login with incorrect password", async () => {
        const incorrectPassword = "incorrectPassword";
        await expect(apis.loginUser(email, incorrectPassword))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 401 })
            }));
    });

    it("Fail to login with empty email", async () => {
        await expect(apis.loginUser("", password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to login with empty password", async () => {
        await expect(apis.loginUser(email, ""))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to login with user not registered", async () => {
        const unregisteredEmail = "unregistered@example.com";
        await expect(apis.loginUser(unregisteredEmail, password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 401 })
            }));
    });
});
