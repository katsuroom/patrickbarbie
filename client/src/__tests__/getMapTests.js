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
const getMapById = (id, token) => {
    return mapApi.get(`/map/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    }).then((response) => {
        return { status: response.status, data: response.data };
    });
};


describe("Get Map Tests", () => {
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

    it("Successfully get a map", async () => {
        const mapId = "65835e4b125330f27799c118";
        const response = await getMapById(mapId, token);
        expect(response.status).toEqual(200); 
        expect(response.data.success).toBe(true);
    });
});
