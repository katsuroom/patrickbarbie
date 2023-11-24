
import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/' + "api"
// const baseURL = 'http://localhost:4000/api';
const api = axios.create({
    baseURL: baseURL,
})



// export const getLoggedIn = () => api.get(`/loggedIn/`);
const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
export const getMainScreenMap = (fileName) => {
  return api.get(`/mapFile/`, {
      params: {
          fileName: fileName
      }
  })
}

const apis = {
  getMainScreenMap
}



describe("Retrieve Map Files Test", () => {
  it("get NA.json", async () => {
    const response = await apis.getMainScreenMap("NA.json");
    expect(response.status).toEqual(200);
  });
  it("get SA.json", async () => {
    const response = await apis.getMainScreenMap("SA.json");
    expect(response.status).toEqual(200);
  });
  it("get ASIA.json", async () => {
    const response = await apis.getMainScreenMap("ASIA.json");
    expect(response.status).toEqual(200);
  });
  it("get EU.json", async () => {
    const response = await apis.getMainScreenMap("EU.json");
    expect(response.status).toEqual(200);
  });
  it("get Oceania.json", async () => {
    const response = await apis.getMainScreenMap("Oceania.json");
    expect(response.status).toEqual(200);
  });
  it("get AFRICA.json", async () => {
    const response = await apis.getMainScreenMap("AFRICA.json");
    expect(response.status).toEqual(200);
  });
  it("get World.json", async () => {
    const response = await apis.getMainScreenMap("World.json");
    expect(response.status).toEqual(200);
  });
  it("get NA2.json", async () => {
    const response = await apis.getMainScreenMap("NA2.json");
    expect(response.status).toEqual(200);
  });
  it("get SA2.json", async () => {
    const response = await apis.getMainScreenMap("SA2.json");
    expect(response.status).toEqual(200);
  });
  it("get ASIA2.json", async () => {
    const response = await apis.getMainScreenMap("ASIA2.json");
    expect(response.status).toEqual(200);
  });
  it("get EU2.json", async () => {
    const response = await apis.getMainScreenMap("EU2.json");
    expect(response.status).toEqual(200);
  });
  it("get Oceania2.json", async () => {
    const response = await apis.getMainScreenMap("Oceania2.json");
    expect(response.status).toEqual(200);
  });
  it("get AFRICA2.json", async () => {
    const response = await apis.getMainScreenMap("AFRICA2.json");
    expect(response.status).toEqual(200);
  });
  it("get World2.json", async () => {
    const response = await apis.getMainScreenMap("World2.json");
    expect(response.status).toEqual(200);
  });

});
