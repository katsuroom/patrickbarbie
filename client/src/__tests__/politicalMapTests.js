const axios = require('axios');

// Axios instance for authentication
const authApi = axios.create({
    baseURL: 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/auth',
    withCredentials: true,
});

// Axios instance for map routes
const mapApi = axios.create({
    baseURL: 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/api',
    // baseURL: 'http://localhost:4000/api',
    withCredentials: true,
});

const loginUser = (email, password) => {
    return authApi.post(`/login/`, {
        email: email,
        password: password
    });
};

const loginAndGetToken = async (email, password) => {
    const response = await authApi.post(`/login/`, { email, password });
    return response.data.token;
};

const createMap = (mapData, username, mapName, mapType, token) => {
    // console.log("in api.createMap");

    return mapApi.post(`/map/`, {
        title: mapName,
        mapData: mapData,
        author: username,
        mapType: mapType
    }, {
        headers: {
            Authorization: token
        }
    })
        .then(response => {
            // console.log(response.data);
            return { status: response.status, data: response.data };
        })
        .catch(error => {
            // console.error("Error creating map:", error);
            return Promise.reject(error);
        });
};

const forkMap = (mapData, username, mapName, mapType, token) => {
    // console.log("in api.forkMap");

    return mapApi.post(`/forkmap/`, {
        title: mapName,
        mapData: mapData,
        author: username,
        mapType: mapType
    }, {
        headers: {
            Authorization: token
        }
    })
        .then(response => {
            // console.log(response.data);
            return { status: response.status, data: response.data };
        })
        .catch(error => {
            // console.error("Error forking map:", error);
            return Promise.reject(error);
        });
};

const getMapById = (mapId, token) => {
    // console.log("in api.getMapById");

    return mapApi.get(`/map/${mapId}`, {
        headers: {
            Authorization: token
        }
    })
        .then(response => {
            // console.log("Map found:", response.data);
            return { status: response.status, data: response.data };
        })
        .catch(error => {
            // console.error("Error getting map:", error);
            return Promise.reject(error);
        });
};

const deleteMap = (mapId, token) => {
    // console.log("in api.deleteMap");

    return mapApi.delete(`/map/${mapId}`, {
        headers: {
            Authorization: token
        }
    })
        .then(response => {
            // console.log("Map deleted:", response.data);
            return { status: response.status, data: response.data };
        })
        .catch(error => {
            // console.error("Error deleting map:", error);
            return Promise.reject(error);
        });
};

const updateMap = (mapId, mapData, token) => {
    // console.log("in api.updateMap");

    return mapApi.put(`/map/${mapId}`, mapData, {
        headers: {
            Authorization: token
        }
    })
        .then(response => {
            // console.log("Map updated:", response.data);
            return { status: response.status, data: response.data };
        })
        .catch(error => {
            // console.error("Error updating map:", error);
            return Promise.reject(error);
        });
};

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

const createCSV = (csvData, token) => {
    return mapApi.post('/createcsv/', csvData, {
        headers: {
            Authorization: token
        }
    })
    .then(response => {
        // console.log("CSV created:", response.data);
        return { status: response.status, data: response.data };
    })
    .catch(error => {
        // console.error("Error creating CSV:", error);
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

describe("Politicalmap Test", () => {
    const email = "Admin123@admin.com";
    const password = "Admin123@admin.com";
    const username = "admin";
    const mapType = "Politicalmap";
    const mapData = Buffer.from(Object.values("test"));
    let token;
    let Politicalmap1id;
    let Politicalmap2id;
    let forkedPoliticalmap1id;

    // Run before all tests
    beforeAll(async () => {
        token = await loginAndGetToken(email, password);
    });

    it("login 1", async () => {
        const response = await apis.loginUser(email, password);
        expect(response.status).toEqual(200); // Status 200: Logged in
    });

    it("Fail login with invalid credentials", async () => {
        await expect(apis.loginUser('incorrect@example.com', 'wrongPassword'))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({
                    status: 401
                })
            }));
    });

    it("create Politicalmap1", async () => {
        const mapName = "Politicalmap1";
        const mapResponse = await apis.createMap(mapData, username, mapName, mapType, token);
        Politicalmap1id = mapResponse.data.mapData._id;
        expect(mapResponse.status).toEqual(201); // Status 201 : Map Created
    });

    // it("Fail creation of Politicalmap with invalid Politicalmap data", async () => {
    //     const invalidMapData = null; // Example of invalid data

    //     await expect(apis.createMap(invalidMapData, username, "invalidMap", mapType, token))
    //         .rejects
    //         .toEqual(expect.objectContaining({
    //             response: expect.objectContaining({
    //                 status: 500
    //             })
    //         }));
    // });

    it("get Politicalmap1 id", async () => {
        const mapResponse = await apis.getMapById(Politicalmap1id, token);
        expect(mapResponse.status).toEqual(200); // Status 200 : Map Found
    });

    it("Fail to retrieve Politicalmaps with invalid token", async () => {
        const invalidToken = "invalidToken";
        await expect(apis.getMapsByUser(invalidToken))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // Unauthorized
            }));
    });

    it("Fail to retrieve Politicalmaps for an unregistered user", async () => {
        const unregisteredUserToken = "token_for_unregistered_user";
        await expect(apis.getMapsByUser(unregisteredUserToken))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // User not found
            }));
    });

    it("Fail to retrieve Politicalmaps with token for another user", async () => {
        const otherUserToken = "token_for_another_user";
        await expect(apis.getMapsByUser(otherUserToken))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // User not found or no maps for this user
            }));
    });

    it("Fail to retrieve Politicalmaps with expired token", async () => {
        const expiredToken = "expired_token"; 
        await expect(apis.getMapsByUser(expiredToken))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({ status: 404 }) // Unauthorized
            }));
    });
    

    it("Fail retrieval of non-existent Politicalmap", async () => {
        await expect(apis.getMapById('nonExistingMapId', token))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({
                    status: 500
                })
            }));
    });

    // it("fork Politicalmap1", async () => {
    //     const mapName = "forkedPoliticalmap1";
    //     const mapResponse = await apis.forkMap(mapData, username, mapName, mapType, token);
    //     forkedPoliticalmap1id = mapResponse.data.mapData._id;
    //     expect(mapResponse.status).toEqual(201); // Status 201 : Map Forked
    // });

    // it("update forkedPoliticalmap1", async () => {
    //     const updatedMapData = {
    //         title: "Updated Forked Politicalmap1",
    //         mapData: Buffer.from(Object.values("updated test data")),
    //         author: username,
    //         mapType: mapType
    //     };

    //     const mapResponse = await apis.updateMap(forkedPoliticalmap1id, updatedMapData, token);
    //     forkedPoliticalmap1id = mapResponse.data.mapData.id;
    //     expect(mapResponse.status).toEqual(200); // Status 200 : Map Updated Successfully
    // });

    // it("delete forkedPoliticalmap1 id", async () => {
    //     const mapResponse = await apis.deleteMap(forkedPoliticalmap1id, token);
    //     expect(mapResponse.status).toEqual(200); // Status 200 : Map Deleted
    // });

    it("Fail to delete a non-existent Politicalmap", async () => {
        await expect(apis.deleteMap('nonExistingMapId', token))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({
                    status: 500
                })
            }));
    });

    it("create Politicalmap2", async () => {
        const mapName = "Politicalmap2";
        const mapResponse = await apis.createMap(mapData, username, mapName, mapType, token);
        Politicalmap2id = mapResponse.data.mapData._id;
        expect(mapResponse.status).toEqual(201); // Status 201 : Map Created
    });

    it("Fail to update a Politicalmap2 with invalid data", async () => {
        const invalidUpdateData = null; // Example of invalid data
        await expect(apis.updateMap(Politicalmap2id, invalidUpdateData, token))
            .rejects
            .toEqual(expect.objectContaining({
                response: expect.objectContaining({
                    status: 400
                })
            }));
    });

    // it("update Politicalmap2", async () => {
    //     const updatedMapData = {
    //         title: "Updated Politicalmap2",
    //         mapData: Buffer.from(Object.values("updated Politicalmap2 data")),
    //         author: username,
    //         mapType: mapType
    //     };

    //     const mapResponse = await apis.updateMap(Politicalmap2id, updatedMapData, token);
    //     expect(mapResponse.status).toEqual(200); // Status 200 : Map Updated Successfully
    // });

    // it("should fail to create a Politicalmap CSV with invalid data", async () => {
    //     const invalidCsvData = {}; // Missing required fields
    //     await expect(apis.createCSV(invalidCsvData, token))
    //         .rejects
    //         .toEqual(expect.objectContaining({
    //             response: expect.objectContaining({ status: 404 }) // Bad Request
    //         }));
    // });


    it("delete Politicalmap1 id", async () => {
        const mapResponse = await apis.deleteMap(Politicalmap1id, token);
        expect(mapResponse.status).toEqual(200); // Status 200 : Map Deleted
    });

    // it("delete Politicalmap2 id", async () => {
    //     const mapResponse = await apis.deleteMap(Politicalmap2id, token);
    //     expect(mapResponse.status).toEqual(200); // Status 200 : Map Deleted
    // });

});

