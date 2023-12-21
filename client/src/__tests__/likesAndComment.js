const axios = require("axios");

// Axios instance for authentication
const authApi = axios.create({
  baseURL: "https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth",
  withCredentials: true,
});

// Axios instance for map routes
const mapApi = axios.create({
  baseURL: "https://patrick-barbie-f64046e3bb4b.herokuapp.com/api",
  // baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

const loginUser = (email, password) => {
  return authApi.post(`/login/`, {
    email: email,
    password: password,
  });
};

const loginAndGetToken = async (email, password) => {
  const response = await authApi.post(`/login/`, { email, password });
  return response.data.token;
};

const createMap = (mapData, username, mapName, mapType, token) => {
  // console.log("in api.createMap");

  return mapApi
    .post(
      `/map/`,
      {
        title: mapName,
        mapData: mapData,
        author: username,
        mapType: mapType,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      // console.log(response.data);
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      // console.error("Error creating map:", error);
      return Promise.reject(error);
    });
};

const getMapById = (mapId, token) => {
  // console.log("in api.getMapById");

  return mapApi
    .get(`/map/${mapId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      // console.log("Map found:", response.data);
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      // console.error("Error getting map:", error);
      return Promise.reject(error);
    });
};


const updateMap = (mapId, mapData, token) => {
  // console.log("in api.updateMap");

  return mapApi
    .put(`/map/${mapId}`, mapData, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      // console.log("Map updated:", response.data);
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      // console.error("Error updating map:", error);
      return Promise.reject(error);
    });
};


const apis = {
  loginUser,
  createMap,
  getMapById,
  forkMap,
  deleteMap,
  updateMap,
  getMapsByUser,
  createCSV,
};

describe("politicalmap Test", () => {
  const email = "Admin123@admin.com";
  const password = "Admin123@admin.com";
  const username = "admin";
  const mapType = "politicalmap";
  const mapData = Buffer.from(Object.values("test"));
  let token;
  let politicalmap1id;
  let politicalmap2id;
  let forkedpoliticalmap1id;

  // Run before all tests
  beforeAll(async () => {
    token = await loginAndGetToken(email, password);
  });

  it("login 1", async () => {
    const response = await apis.loginUser(email, password);
    expect(response.status).toEqual(200); // Status 200: Logged in
  });

  it("Fail login with invalid credentials", async () => {
    await expect(
      apis.loginUser("incorrect@example.com", "wrongPassword")
    ).rejects.toEqual(
      expect.objectContaining({
        response: expect.objectContaining({
          status: 401,
        }),
      })
    );
  });

  
});