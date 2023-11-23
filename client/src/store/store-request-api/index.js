// import axios from 'axios'
// axios.defaults.withCredentials = true;
// const baseURL = 'https://patrick-barbie-f64046e3bb4b.herokuapp.com/' + "api"
const baseURL = 'http://localhost:4000/api'
// const api = axios.create({
//     baseURL: baseURL,
// })

const createMap = (mapTitle) => {
    return fetch(`${baseURL}/map/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            mapTitle: mapTitle,
        },
    })
    .then(response => {
        console.log(response);
        return response.json().then(data => ({status: response.status, data}));
    })
}

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

export default {
    createMap,
    // deleteMap,
    // updateMap,
    // getMapById,
    // getMapList,
    // getPublishedMapList,
    // searchMapByName,
    // searchMapByNameInCommunity,
    // searchMapById,
    // searchMapByProperty,
    // searchMapByPropertyInCommunity
}
