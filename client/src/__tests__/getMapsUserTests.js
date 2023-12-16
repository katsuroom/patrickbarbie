const axios = require('axios');

// Axios instance for authentication
const authApi = axios.create({
    baseURL: 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth',
    withCredentials: true,
});

// Axios instance for map routes
const mapApi = axios.create({
    baseURL: 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/api',
    withCredentials: true,
});

// Function to log in and retrieve token
const loginAndGetToken = async (email, password) => {
    const response = await authApi.post(`/login/`, { email, password });
    return response.data.token;
};

// Function to get maps by user
const getMapsByUser = (token) => {
    // console.log("in api.getMapsByUser");

    return mapApi.get('/getMapsByUser', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        // console.log("Maps retrieved:", response.data);
        return { status: response.status, data: response.data };
    })
    .catch(error => {
        // console.error("Error getting maps by user:", error);
        return Promise.reject(error);
    });
};

describe("Get Maps By User Tests", () => {
    const email = "Admin123@admin.com";
    const password = "Admin123@admin.com";
    let token;

    // Run before all tests
    beforeAll(async () => {
        token = await loginAndGetToken(email, password);
    });

    it("Fail to retrieve maps with invalid token", async () => {
        const invalidToken = "Bearer invalidToken";
        await expect(getMapsByUser(invalidToken))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // Unauthorized
            }));
    });

    it("Fail to retrieve maps with expired token", async () => {
        const expiredToken = "Bearer expiredToken"; // replace this
        await expect(getMapsByUser(expiredToken))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // Unauthorized
            }));
    });

    it("Fail to retrieve maps with no token provided", async () => {
        await expect(getMapsByUser(""))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // Unauthorized
            }));
    });

    it("Fail to retrieve maps when user has no maps", async () => {
        // Assuming there is a valid token for a user with no maps
        const tokenWithNoMaps = "Bearer tokenWithNoMaps";
        await expect(getMapsByUser(tokenWithNoMaps))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // Not Found
            }));
    });

    it("Fail to retrieve maps due to server error", async () => {
        await expect(getMapsByUser(token))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // Internal Server Error
            }));
    });

});