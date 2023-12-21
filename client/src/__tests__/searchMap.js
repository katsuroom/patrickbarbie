const axios = require("axios");

// Axios instance for map routes
const mapApi = axios.create({
  baseURL: "https://patrick-barbie-f64046e3bb4b.herokuapp.com/api",
  withCredentials: true,
});

const searchMaps = async (searchText, searchBy) => {
  
      return mapApi
        .get(`/search-maps/${searchText}/${searchBy}`, {
        })
        .then((response) => {
          // console.log("Maps retrieved:", response.data);
          return { status: response.status, data: response.data };
        })
        .catch((error) => {
          // console.error("Error getting maps by user:", error);
          return Promise.reject(error);
        });
    
};

describe("search Maps", () => {
  it("search maps by map name", async () => {
    const response = await searchMaps("Africa GDP", "Map Name");
    expect(response.status).toEqual(200); // Status 200: Logged in
  });

  it("search maps by map id", async () => {
    const response = await searchMaps("6581fe72e3ec8b0b7704d9a9", "Map ID");
    expect(response.status).toEqual(200); // Status 200: Logged in
  });

  it("search maps by user name", async () => {
    const response = await searchMaps("Seannn", "User Name");
    expect(response.status).toEqual(200); // Status 200: Logged in
  });
});
