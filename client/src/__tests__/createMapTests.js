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
const createMap = (mapData, username, mapName, mapType, token) => {
    return mapApi.post(`/map/`, {
        title: mapName,
        mapData: mapData,
        author: username,
        mapType: mapType
    }, {
        headers: {
            Authorization: token
        }
    });
};

describe("Create Map Tests", () => {
    const email = "Teampink416@gmail.com";
    const password = "Teampink416@gmail.com";
    const username = "Teampink416@gmail.com";
    const mapType = "Heatmap";
    let token;
    let mapData;

    // Run before all tests
    beforeAll(async () => {
        token = await loginAndGetToken(email, password);
        mapData = Buffer.from(Object.values("test"));
    });

    it("Successfully create a new map", async () => {
        const mapName = "Test Map";
        const response = await createMap(mapData, username, mapName, mapType, token);
        expect(response.status).toEqual(201); // Status 201: Map Created
        expect(response.data.success).toBe(true);
        expect(response.data.message).toBe("Map created!");
        expect(response.data.mapData).toBeDefined();
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
        await expect(createMap(mapData, username, mapName, "", token))
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
