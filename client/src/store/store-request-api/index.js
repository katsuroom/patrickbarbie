// import axios from 'axios'
// test cypress
// axios.defaults.withCredentials = true;
// const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/' + "api"
// const api = axios.create({
//     baseURL: baseURL,
// })

// export const createMap = (mapData, userEmail, mapName) => {
//     return api.post(`/map/`, {
//         // SPECIFY THE PAYLOAD
//         name: mapName,
//         mapData: mapData,
//         ownerEmail: userEmail
//     })
// }

// export const deleteMap = (mapId) => {
//     return api.delete(`/map/${mapId}`)
// }

// export const updateMap = (mapId, mapData) => {
//     return api.put(`/map/${mapId}`, {
//         mapData: mapData
//     })
// }
// // get one specific map
// export const getMapById = (mapId) => {
//     return api.get(`/map/${mapId}`)
// }

// //get all maps from one user
// export const getMapList = (userId) => {
//     return api.get(`/maplist/${userId}`)
// }

// //get all published maps from all users
// export const getPublishedMapList = () => {
//     return api.get(`/published-maplist/`)
// }

// //search map by map name in home page
// export const searchMapByName = (mapName, userId) => {
//     return api.get(`/searchmap-map-name/${userId}`, {
//         params: {
//             mapName: mapName
//         }
//     })
// }

// //search map by map name in community page
// export const searchMapByNameInCommunity = (mapName) => {
//     return api.get(`/searchmap-map-name-community/`, {
//         params: {
//             mapName: mapName
//         }
//     })
// }

// //search map by mapid
// export const searchMapById = (mapId) => {
//     return api.get(`/searchmap-mapid/`, {
//         params: {
//             mapId: mapId
//         }
//     })
// }

// //search map by property in home page
// export const searchMapByProperty = (userId, property) => {
//     return api.get(`/searchmap-property/${userId}`, {
//         params: {
//             property: property
//         }
//     })
// }

// //search map by property in community page
// export const searchMapByPropertyInCommunity = (property) => {
//     return api.get(`/searchmap-property-community/`, {
//         params: {
//             property: property
//         }
//     })
// }

// const apis = {
//     createMap,
//     deleteMap,
//     updateMap,
//     getMapById,
//     getMapList,
//     getPublishedMapList,
//     searchMapByName,
//     searchMapByNameInCommunity,
//     searchMapById,
//     searchMapByProperty,
//     searchMapByPropertyInCommunity
// }

// export default apis;

// DO NOT USE AXIOS

// when you push to main, use the heroku url
const baseURL = "https://patrick-barbie-f64046e3bb4b.herokuapp.com/" + "api";

// when you test locally, use the localhost url
// const baseURL = "http://localhost:4000/api";

// const api = axios.create({
//     baseURL: baseURL,
// })


const createMap = (mapData, username, mapName, mapType) => {
    console.log("in api.createMap");
    console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
    let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/map/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      title: mapName,
      mapData: mapData,
      author: username,
      mapType: mapType,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // If the response status is not OK, reject the promise with an error
        throw new Error(`Failed to create map. Status: ${response.status}`);
      }
      // Parse JSON and include status in the resolved value
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return { status: 200, data }; // Assuming 200 for success, modify as needed
    })
    .catch((error) => {
      // Handle fetch errors (e.g., network issues)
      console.error("Error creating map:", error);
      // Return a rejected promise with the error
      return Promise.reject(error);
    });
};

const forkMap = (mapData, username, mapName, mapType) => {
  console.log("in api.createMap");
  console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
return fetch(`${baseURL}/forkmap/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: token,
  },
  body: JSON.stringify({
    title: mapName,
    mapData: mapData,
    author: username,
    mapType: mapType,
  }),
})
  .then((response) => {
    if (!response.ok) {
      // If the response status is not OK, reject the promise with an error
      throw new Error(`Failed to create map. Status: ${response.status}`);
    }
    // Parse JSON and include status in the resolved value
    return response.json();
  })
  .then((data) => {
    console.log(data);
    return { status: 200, data }; // Assuming 200 for success, modify as needed
  })
  .catch((error) => {
    // Handle fetch errors (e.g., network issues)
    console.error("Error creating map:", error);
    // Return a rejected promise with the error
    return Promise.reject(error);
  });
}

const getMapsByUser = () => {
  console.log("in api.getMapsByUser");
  console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/maps/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    }).then((response) => {
      // Parse JSON and include status in the resolved value
      console.log(response);
      return response.json().then((data) => {
        console.log(data);
        return { status: response.status, data };
      });
    });
};

const deleteMap = (mapId) => {
    console.log("in api.deleteMap");
    console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
    let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
    return fetch(`${baseURL}/map/${mapId}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        Authorization: token,
        },
        }).then((response) => {
        // Parse JSON and include status in the resolved value
        console.log(response);
        return response.json().then((data) => {
            console.log(data);
            return { status: response.status, data };
        });
    });

};

const updateMap = (mapObject) =>{
    console.log("in api.updateMap");
    console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
    let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
    return fetch(`${baseURL}/map/${mapObject._id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: token,
        },
        body: JSON.stringify({
            mapData: mapObject,
        }),
        }).then((response) => {
        // Parse JSON and include status in the resolved value
        console.log(response);
        return response.json().then((data) => {
            console.log(data);
            return { status: response.status, data };
        });
      });
}

// const getMainScreenMap = (fileName) => {
//   return api.get(/mapFile/, {
//     params: {
//       fileName: fileName,
//     },
//   });
// };

const getMainScreenMap = (fileName) => {
    // console.log("in api.getMainScreenMap");
    // console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
    // let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
    return fetch(`${baseURL}/mapFile?fileName=${fileName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      // Parse JSON and include status in the resolved value
      console.log(response);
      return response.json().then((data) => {
        console.log(data);
        return { status: response.status, data };
      });
    });
}   





export default {
  createMap,
  getMapsByUser,
  deleteMap,
  getMainScreenMap,
  updateMap,
  forkMap,
};
