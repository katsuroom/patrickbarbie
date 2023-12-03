const axios = require('axios');

axios.defaults.withCredentials = true;
const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth';
const api = axios.create({ baseURL: baseURL });

const registerUser = (username, email, password) => {
    console.log("in register: ", baseURL);
    return api.post(`/register/`, { username, email, password });
};

const apis = { registerUser };

describe("Registration Tests", () => {
    let username, email, password;
    let existingEmail = "Teampink416@gmail.com";
    let existingUsername = "Teampink416";

    it("register a new account", async () => {
        var currentdate = new Date();
        username = "Test User: " + currentdate.getDate() + "/" +
                   (currentdate.getMonth() + 1) + "/" +
                   currentdate.getFullYear() + " @ " +
                   currentdate.getHours() + ":" +
                   currentdate.getMinutes() + ":" +
                   currentdate.getSeconds();

        email = Date.now() + "@gmail.com";
        password = "Asdfghjkl;'!";
        const response = await apis.registerUser(username, email, password);
        expect(response.status).toEqual(200);
    });

    it("Fail to register with missing fields", async () => {
        await expect(apis.registerUser("", email, password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to register with invalid email format", async () => {
        const invalidEmail = "invalidemail";
        await expect(apis.registerUser(username, invalidEmail, password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to register with short password", async () => {
        const shortPassword = "short";
        await expect(apis.registerUser(username, email, shortPassword))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to register with existing email", async () => {
        await expect(apis.registerUser(username, existingEmail, password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to register with existing username", async () => {
        await expect(apis.registerUser(existingUsername, email, password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to register with email in use (case insensitivity)", async () => {
        const caseInsensitiveEmail = "TeamPink416@GMAIL.com";
        await expect(apis.registerUser(username, caseInsensitiveEmail, password))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });

    it("Fail to register with commonly used weak password", async () => {
        const weakPassword = "password123";
        await expect(apis.registerUser(username, email, weakPassword))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 })
            }));
    });
});
