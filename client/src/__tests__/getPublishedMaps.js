const axios = require("axios");

// Axios instance for map routes
const mapApi = axios.create({
    baseURL: 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/api',
    withCredentials: true,
});
// Function to get maps by user
const getPublishedMaps = () => {
  // console.log("in api.getMapsByUser");

  return mapApi
    .get('/published-maps', {})
    .then((response) => {
      // console.log("Maps retrieved:", response.data);
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      // console.error("Error getting maps by user:", error);
      return Promise.reject(error);
    });
};


describe("Get Published Maps", () => {

    it("get published maps", async () => {
      const response = await getPublishedMaps();
      expect(response.status).toEqual(200); // Status 200: Logged in
    });

});