const Map = require("../models/map_model");
const User = require("../models/user_model");
const CSV = require("../models/csv_model");
const Chunk = require("../models/mapdata_model");

const jwt = require("jsonwebtoken");
const auth = require("../auth");
const path = require("path");
const fs = require("fs");

const mongoose = require("mongoose");

const extractUserIdFromToken = (token) => {
  try {
    const isCustomAuth = token.length < 500;
    let decodeData;

    // If token is a custom token, verify it
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, process.env.JWT_SECRET);
    } else {
      // If token is a Google token, decode it
      decodeData = jwt.decode(token);
    }

    return decodeData?.userId || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

createMap = async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({
        success: false,
        error: "You must provide a map",
      });
    }

    // Create the Map instance
    const map = new Map({
      title: body.title,
      author: body.author,
      mapType: body.mapType,
    });

    User.findOne({ _id: req.userId })
      .then((user) => {
        console.log("user found: " + JSON.stringify(user));
        user.maps.push(map);
        return user.save();
      })
      .then(() => map.save())
      .catch((error) => {
        return res.status(400).json({
          error,
          message: "Map not created!",
        });
      });

    // Save map data

    const chunkSize = 15 * 1024 * 1024;
    const mapDataBuffer = body.mapData;
    const totalChunks = Math.ceil(mapDataBuffer.length / chunkSize);
    console.log("totalChunks", totalChunks);

    // const chunks = [];

    // Iterate through the buffer and create chunks

    for (let i = 0; i < totalChunks; i++) {
      console.log("creating chunk #", i);
      const start = i * chunkSize;
      const end = Math.min((i + 1) * chunkSize, mapDataBuffer.length);
      const chunk = mapDataBuffer.slice(start, end);

      const mapData = new Chunk({
        n: i,
        mapDataID: map._id,
        totalChunks,
        data: chunk,
      });

      await mapData.save().catch((error) => {
        console.error("Error saving MapData:", error);
      });
    }

    return res.status(201).json({
      success: true,
      mapData: map,
      message: "Map created!",
    });
  } catch (error) {
    console.error("Error creating map:", error);
    return res.status(500).json({
      success: false,
      error: "Error creating map",
    });
  }
};

deleteMap = (req, res) => {
  console.log("start delete Map");

  User.findOne({ _id: req.userId })
    .then((user) => {
      console.log("user found, and try to delete map");

      // Assuming you want to delete the map associated with the user
      Map.findOneAndDelete({ _id: req.params.id })
        .then((map) => {
          if (!map) {
            // Map not found
            console.log("Map not found");
            return res.status(404).json({
              success: false,
              error: "Map not found",
            });
          }

          // Remove the map from the user's maps array
          user.maps.pull({ _id: req.params.id });

          // Save the user after removing the map reference
          return user.save();
        })
        .then(() => {
          // Send a response after successfully deleting the map
          console.log("map deleted");
          return res.status(200).json({
            success: true,
            message: "Map deleted",
          });
        })
        .catch((error) => {
          console.log("Error deleting map: " + error);

          // Send an error response if there's an issue during deletion
          return res.status(500).json({
            success: false,
            error: "Error deleting map",
          });
        });
    })
    .catch((error) => {
      console.log("Error finding user: " + error);

      // Send an error response if there's an issue finding the user
      return res.status(500).json({
        success: false,
        error: "Error finding user",
      });
    });
};

deleteMapData = (req, res) => {
  Chunk.deleteMany({ mapDataID: req.params.id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Map Data not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Map data deleted",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        error: "Error deleting map data",
      });
    });
};

deleteCSV = (req, res) => {
  CSV.findOneAndDelete({ _id: req.params.id })
    .then((csv) => {
      if (!csv) {
        return res.status(404).json({
          success: false,
          error: "CSV not found",
        });
      }
    })
    .then(() => {
      return res.status(200).json({
        success: true,
        message: "CSV deleted",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        error: "Error deleting CSV",
      });
    });
};

updateMap = (req, res) => {
  console.log("start update Map");
  // if (auth.verifyUser(req) === null) {
  //   return res.status(401).json({
  //     loggedIn: false,
  //     user: null,
  //     errorMessage: "Unauthorized",
  //   });
  // }
  const body = req.body.mapData;
  // console.log("body: " + JSON.stringify(body));
  console.log("req: ", req.userId);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  const mapId = req.params.id;
  console.log("mapId: " + mapId);

  Map.findById(mapId)
    .then((map) => {
      if (!map) {
        return res.status(404).json({
          success: false,
          error: "Map not found",
        });
      }
      // console.log("map found: " + JSON.stringify(map));

      for (const [key, value] of Object.entries(body)) {
        if (!["__v", "createdAt", "updatedAt", "_id"].includes(key))
          map[key] = value;
      }

      // Save the updated map
      return map.save();
    })
    .then((updatedMap) => {
      return res.status(200).json({
        success: true,
        data: updatedMap,
        message: "Map updated successfully",
      });
    })
    .catch((error) => {
      console.log("Error updating map: " + error);
      return res.status(500).json({
        success: false,
        error: "Error updating map",
      });
    });
};

getMapById = (req, res) => {
  console.log("start get Map by id");

  const mapId = req.params.id;
  console.log("mapId: " + mapId);

  Map.findById(mapId)
    .then((map) => {
      if (!map) {
        return res.status(404).json({
          success: false,
          error: "Map not found",
        });
      }
      return res.status(200).json({
        success: true,
        data: map,
        message: "Map found",
      });
    })
    .catch((error) => {
      console.log("Error getting map: " + error);
      return res.status(500).json({
        success: false,
        error: "Error getting map",
      });
    });
};

getMapDataById = (req, res) => {
  const mapDataID = req.params.id;

  Chunk.find({ mapDataID })
    .sort({ n: 1 })
    .then((mapDataChunks) => {
      if (mapDataChunks.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Map data not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: mapDataChunks.map((chunk) => chunk.data).join(""),
        message: "Map data found",
      });
    })
    .catch((error) => {
      console.log("Error getting map data: " + error);
      return res.status(500).json({
        success: false,
        error: "Error getting map data",
      });
    });
};

getMapsByUser = (req, res) => {
  console.log("start get Maps");
  var userId;
  console.log("req: ", req.body);
  console.log("req: ", req.headers);

  const token = req.headers.authorization.split(" ")[1];
  userId = extractUserIdFromToken(token);
  console.log("req: ", userId);
  console.log("req: ", typeof userId);

  //   if (auth.verifyUser(req) === null) {
  //     return res.status(401).json({
  //       loggedIn: false,
  //       user: null,
  //       errorMessage: "Unauthorized",
  //     });
  //   }

  User.findById(userId)
    .populate("maps")
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Extract the maps from the user object
      const userMaps = user.maps;

      return res.status(200).json({
        success: true,
        data: userMaps,
        message: "Maps retrieved successfully",
      });
    })
    .catch((error) => {
      console.log("Error getting user maps: " + error);
      return res.status(500).json({
        success: false,
        error: "Error getting user maps",
      });
    });
};

getPublishedMaps = (req, res) => {
  console.log("start get published Maps");

  Map.find({ isPublished: true })
    .then((publishedMaps) => {
      return res.status(200).json({
        success: true,
        data: publishedMaps,
        message: "Published maps retrieved successfully",
      });
    })
    .catch((error) => {
      console.log("Error getting published maps: " + error);
      return res.status(500).json({
        success: false,
        error: "Error getting published maps",
      });
    });
};

forkMap = async (req, res) => {
  console.log("start create Map");

  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a map",
    });
  }

  // Save map data
  const mapData = new Chunk({
    mapData: Buffer.from(Object.values(body.mapData)),
  });

  const savedMapData = await mapData.save();

  // Create the Map instance
  // map.mapData is currently in json form, must be changed to id string later
  let map = new Map(body);
  map.mapData = savedMapData.id;

  if (!map) {
    return res.status(403).json({ success: false, error: err });
  }
  //   console.log("req.userId: ", req.userId);

  User.findOne({ _id: req.userId })
    .then((user) => {
      console.log("user found: " + JSON.stringify(user));
      user.maps.push(map);
      return user.save();
    })
    .then(() => map.save())
    .then(() => {
      return res.status(201).json({
        success: true,
        mapData: map,
        message: "Map created! (Forked)",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Map not created!",
      });
    });
};

createCSV = async (req, res) => {
  console.log("creating a csv...");

  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a csv file",
    });
  }

  console.log(body);

  const csv = new CSV({
    key: body.key,
    label: body.label,
    csvData: body.csvData,
  });

  if (body.key === null || body.label === null || body.csvData === null) {
    return res.status(400).json({
      success: false,
      error: "You must provide a key, label, and csvData",
    });
  }

  if (!csv) {
    return res.status(403).json({ success: false, error: err });
  }

  try {
    const savedCSV = await csv.save();
    console.log(savedCSV);

    return res.status(201).json({
      success: true,
      csvData: savedCSV,
      message: "CSV created!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error,
    });
  }
};

getCSVById = (req, res) => {
  console.log("getting a csv...");

  const csvId = req.params.id;

  CSV.findById(csvId)
    .then((csv) => {
      if (!csv) {
        return res.status(404).json({
          success: false,
          error: "CSV not found",
        });
      }
      return res.status(200).json({
        success: true,
        data: csv,
        message: "CSV found",
      });
    })
    .catch((error) => {
      console.log("Error getting csv: " + error);
      return res.status(500).json({
        success: false,
        error: "Error getting csv",
      });
    });
};

updateCSV = (req, res) => {
  console.log("updating CSV");

  const body = req.body;
  // console.log("body: " + JSON.stringify(body));
  // console.log("req: ", req.userId);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  const CSVId = req.params.id;

  CSV.findById(CSVId)
    .then((csv) => {
      if (!csv) {
        return res.status(404).json({
          success: false,
          error: "csv not found",
        });
      }

      // Update csv properties with the data from the request body
      Object.assign(csv, body);

      // Save the updated csv
      return csv.save();
    })
    .then((updatedCsv) => {
      return res.status(200).json({
        success: true,
        data: updatedCsv,
        message: "Csv updated successfully",
      });
    })
    .catch((error) => {
      console.log("Error updating map: " + error);
      return res.status(500).json({
        success: false,
        error: "Error updating map",
      });
    });
};

sendMapFile = async (req, res) => {
  console.log(req.query.fileName);
  const fileName = req.query.fileName;
  console.log(fileName);

  // Check if the file exists
  const filePath = path.join(__dirname, "../main-screen-maps", fileName);

  console.log(filePath);
  if (fs.existsSync(filePath)) {
    // If the file exists, send it with a 200 status code
    res.status(200).sendFile(filePath);
  } else {
    // If the file does not exist, send a 404 status code
    res.status(404).send("File not found");
  }
};

searchMaps = async (req, res) => {
  console.log("searchMaps");

  let { searchText, searchBy } = req.params;
  searchText = searchText.toLowerCase();

  console.log(searchText);

  const SearchBy = {
    ALL: "All",
    MAP_ID: "Map ID",
    MAP_NAME: "Map Name",
    USER_NAME: "User Name",
  };

  Map.find({ isPublished: true })
    .then((publishedMaps) => {
      // console.log(publishedMaps)
      // console.log(publishedMaps.filter(map => map._id == searchText))

      let maps = publishedMaps;

      switch (searchBy) {
        case SearchBy.MAP_ID:
          maps = publishedMaps.filter((map) =>
            map._id.toString().includes(searchText)
          );
          break;

        case SearchBy.USER_NAME:
          maps = publishedMaps.filter((map) =>
            map.author.toLowerCase().includes(searchText)
          );
          break;

        case SearchBy.MAP_NAME:
          maps = publishedMaps.filter((map) =>
            map.title.toLowerCase().includes(searchText)
          );
          break;

        case SearchBy.ALL:
          maps = publishedMaps.filter((map) =>
            JSON.stringify(map).toLowerCase().includes(searchText)
          );
          break;

        default:
          break;
      }

      console.log(maps.length);
      return res.status(200).json({
        success: true,
        data: maps,
        message: "searched maps retrieved successfully",
      });
    })
    .catch((error) => {
      console.log("Error searchMaps: " + error);
      return res.status(500).json({
        success: false,
        error: "Error searchMaps",
      });
    });
};

updateMapData = async (req, res) =>{

  try{
    Chunk.deleteMany({ mapDataID: req.params.id })
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            success: false,
            error: "Map Data not found",
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          error: "Error deleting map data",
        });
      });

    // create new map data
    const body = req.body;

    // Save map data

    const chunkSize = 15 * 1024 * 1024;
    const mapDataBuffer = body.mapData;
    const totalChunks = Math.ceil(mapDataBuffer.length / chunkSize);
    console.log("totalChunks", totalChunks);

    // const chunks = [];

    // Iterate through the buffer and create chunks

    for (let i = 0; i < totalChunks; i++) {
      console.log("creating chunk #", i);
      const start = i * chunkSize;
      const end = Math.min((i + 1) * chunkSize, mapDataBuffer.length);
      const chunk = mapDataBuffer.slice(start, end);

      const mapData = new Chunk({
        n: i,
        mapDataID: req.params.id,
        totalChunks,
        data: chunk,
      });

      await mapData.save().catch((error) => {
        console.error("Error saving MapData:", error);
      });
    }

    return res.status(201).json({
      success: true,
      message: "Map updated!",
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Error updating map data",
    });
  }
}

module.exports = {
  createMap,
  deleteMap,
  updateMap,
  getMapById,
  getPublishedMaps,
  searchMaps,
  forkMap,
  sendMapFile,

  getMapDataById,
  deleteMapData,
  updateMapData,
  getMapsByUser,

  createCSV,
  getCSVById,
  updateCSV,
  deleteCSV,
};
