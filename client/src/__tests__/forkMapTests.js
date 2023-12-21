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

// Function to create a map for testing
const createMapForTest = async (token) => {
    const mapData = Buffer.from(Object.values("test data"));
    const response = await mapApi.post(`/map/`, {
        title: "Original Map for Fork",
        mapData: mapData,
        author: "TestUser",
        mapType: "TestType"
    }, {
        headers: {
            Authorization: token
        }
    });
    return response.data.mapData._id;
};
// Function to fork a map
const forkMap = (mapData, username, mapName, mapType, token) => {
    return mapApi.post(`/forkmap/`, {
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

// Function to create a map
const createMap = (username, mapName, mapType, selectedLabel, mapData, token) => {
    return mapApi.post(`/map/`, {
        title: mapName,
        mapData: mapData,
        author: username,
        mapType: mapType,
        selectedLabel: selectedLabel,
    }, {
        headers: {
            Authorization: token
        }
    });
};

describe("Fork Map Tests", () => {
    const email = "Admin123@admin.com";
    const password = "Admin123@admin.com";
    const username = "admin";
    const mapType = "Heatmap";
    let token;

    // Run before all tests
    beforeAll(async () => {
        token = await loginAndGetToken(email, password);
    });

    it("Successfully fork a map", async () => {
        const mapData = Buffer.from(Object.values("fork test"));
        const mapName = "Forked Heatmap";
        const selectedLabel = "name";
        const response = await createMap(
          username,
          mapName,
          mapType,
          selectedLabel,
          mapData,
          token
        );
        expect(response.status).toEqual(201); // Status 201: Map Forked
    });

    // it("Fail to fork a map with missing data", async () => {
    //     const mapName = "Incomplete Fork";
    //     await expect(forkMap(null, username, mapName, mapType, token))
    //         .rejects
    //         .toEqual(expect.objectContaining({
    //             response: expect.objectContaining({ status: 503 }) // Bad Request
    //         }));
    // });

    // it("Fail to fork a map with incomplete map", async () => {
    //     const mapName = "Incomplete Map";
    //     await expect(forkMap(null, username, mapName, mapType, token))
    //         .rejects
    //         .toEqual(expect.objectContaining({
    //             response: expect.objectContaining({ status: 503 }) // Bad Request
    //         }));
    // });
    
});