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

// Function to create a map
const createMap = (username, mapName, mapType, selectedLabel, mapData, token) => {
    return mapApi.post(`/map/`, {
        title: mapName,
        author: username,
        mapType,
        selectedLabel,
        mapData
    }, {
        headers: {
            Authorization: token
        }
    });
};

describe("Create Map Tests", () => {
    const email = "Admin123@admin.com";
    const password = "Admin123@admin.com";
    const username = "admin";
    const mapType = "Heatmap";
    const selectedLabel = "name";
    const mapData = Buffer.from(Object.values("test"));
    let token;

    // Run before all tests
    beforeAll(async () => {
        token = await loginAndGetToken(email, password);
    });

    it("Successfully create a new map", async () => {
        const mapName = "Test Map";
        const response = await createMap(username, mapName, mapType, selectedLabel, mapData, token);
        expect(response.status).toEqual(201); // Status 201: Map Created
        expect(response.data.success).toBe(true);
        expect(response.data.message).toBe("Map created!");
    });

    // it("Fail to create a map with invalid data", async () => {
    //     const invalidMapData = null;
    //     await expect(createMap(invalidMapData, username, "Invalid Map", mapType, token))
    //         .rejects
    //         .toEqual(expect.objectContaining({
    //             response: expect.objectContaining({
    //                 status: 500
    //             })
    //         }));
    // });

    it("Fail to create a map with missing map type", async () => {
        const mapName = "MapWithoutType";
        await expect(createMap(username, mapName, "", selectedLabel, mapData, token))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 400 }) // Bad Request
            }));
    });

    // it("Fail to create a map with incomplete data", async () => {
    //     const incompleteMapData = {};
    //     await expect(createMap(incompleteMapData, username, "", mapType, token))
    //         .rejects
    //         .toEqual(expect.objectContaining({
    //             response: expect.objectContaining({ status: 400 }) // Bad Request
    //         }));
    // });

});
