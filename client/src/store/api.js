// DO NOT USE AXIOS

const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4000/api"
    : "https://patrick-barbie-f64046e3bb4b.herokuapp.com/api";

// const api = axios.create({
//     baseURL: baseURL,
// })

const createMap = (mapData, username, mapName, mapType, selectedLabel) => {
  console.log("in api.createMap");
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
      selectedLabel: selectedLabel,
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

const forkMap = async (
  mapData,
  csvData,
  username,
  mapName,
  mapType,
  mapProps,
  selectedLabel
) => {
  let createRes = await createMap(mapData, username, mapName, mapType, selectedLabel);
  let mapObj = createRes.data.mapData;
  mapObj.csvData = csvData;
  mapObj.mapProps = mapProps;
  let updateRes = await updateMap(mapObj);
  return mapObj;
  
  //   let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  // return fetch(`${baseURL}/forkmap/`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: token,
  //   },
  //   body: JSON.stringify({
  //     title: mapName,
  //     mapData: mapData,
  //     author: username,
  //     mapType: mapType,
  //     csvData: csvData
  //   }),
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       // If the response status is not OK, reject the promise with an error
  //       throw new Error(`Failed to create map. Status: ${response.status}`);
  //     }
  //     // Parse JSON and include status in the resolved value
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //     return { status: 200, data }; // Assuming 200 for success, modify as needed
  //   })
  //   .catch((error) => {
  //     // Handle fetch errors (e.g., network issues)
  //     console.error("Error creating map:", error);
  //     // Return a rejected promise with the error
  //     return Promise.reject(error);
  //   });
};

const getMapsByUser = () => {
  console.log("in api.getMapsByUser");
  // console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
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

const getMapById = (id) => {
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/map/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  }).then((response) => {
    // Parse JSON and include status in the resolved value
    return response.json().then((data) => {
      return { status: response.status, data };
    });
  });
};

const getMapDataById = (id) => {
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/mapData/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  }).then((response) => {
    // Parse JSON and include status in the resolved value
    return response.json().then((data) => {
      return { status: response.status, data };
    });
  });
};

const deleteMap = (mapId) => {
  console.log("in api.deleteMap");
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

const deleteMapData = (id) => {
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/mapData/${id}`, {
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

const deleteCSV = (id) => {
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/csv/${id}`, {
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

const updateMap = (mapObject) => {
  console.log("in api.updateMap");
  // console.log(mapObject);
  // console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
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
    return response.json().then((data) => {
      return { status: response.status, data };
    });
  });
};

const updateCSV = (csvObject) => {
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/csv/${csvObject._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      ...csvObject,
    }),
  }).then((response) => {
    // Parse JSON and include status in the resolved value
    console.log(response);
    return response.json().then((data) => {
      console.log(data);
      return { status: response.status, data };
    });
  });
};

const getMainScreenMap = (fileName) => {
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
};

const createCSV = (key, label, csvData, tableLabel) => {
  console.log("in api.createCSV");
  console.log("token: ", JSON.parse(localStorage.getItem("user"))?.data?.token);
  console.log("key: ", key);
  console.log("label: ", label);
  console.log("csvData: ", csvData);
  console.log("tableLabel: ", tableLabel);

  if (!label){
    label = undefined;
  }
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/csv/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      tableLabel,
      key,
      label,
      csvData,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // If the response status is not OK, reject the promise with an error
        throw new Error(`Failed to create csv. Status: ${response.status}`);
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

const getCsvById = (id) => {
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/csv/${id}`, {
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

const getPublishedMaps = () => {
  return fetch(`${baseURL}/published-maps/`, {
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
};

const searchMaps = async (searchText, searchBy) => {

  // if search text is empty, then return all published maps
  if (!searchText.length) {
    return getPublishedMaps();
  } else {
    return fetch(`${baseURL}/search-maps/${searchText}/${searchBy}`, {
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
};

const updateMapData = (mapData, id) =>{
  console.log("in api.updateMapData");
  let token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  return fetch(`${baseURL}/mapData/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      mapData: mapData,
    }),
  }).then((response) => {
    // Parse JSON and include status in the resolved value
    return response.json().then((data) => {
      return { status: response.status, data };
    });
  });
}

export default {
  createMap,
  getMapsByUser,
  deleteMap,
  deleteMapData,
  deleteCSV,
  getMainScreenMap,
  updateMap,
  updateMapData,
  forkMap,
  createCSV,
  getMapById,
  getMapDataById,
  getCsvById,
  updateCSV,
  getPublishedMaps,
  searchMaps,
};
