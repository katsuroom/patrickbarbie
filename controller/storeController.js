const Map = require("../models/map_model");
const User = require("../models/user_model");
const CSV = require("../models/csv_model");
const jwt = require("jsonwebtoken");
const auth = require("../auth");
const path = require("path");
const fs = require("fs");

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

createMap = (req, res) => {
  console.log("start create Map");

  // if (auth.auth(req) === null) {
  //   return res.status(401).json({
  //     loggedIn: false,
  //     user: null,
  //     errorMessage: "Unauthorized",
  //   });
  // }

  var userId;

  //   console.log("req: ", req.body);
  //   console.log("req: ", req.headers);

  const token = req.headers.authorization.split(" ")[1];
  userId = extractUserIdFromToken(token);

  console.log("userId: " + req.userId);

  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a map",
    });
  }

  const mapData = Buffer.from(Object.values(body.mapData));

  // Create the Map instance
  const map = new Map({
    title: body.title,
    author: body.author,
    mapData: mapData,
    mapType: body.mapType,
  });

  //   const map = new Map(body);
  //   console.log("map: " + JSON.stringify(map));
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
        message: "Map created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Map not created!",
      });
    });
};

deleteMap = (req, res) => {
  console.log("start delete Map");

  // if (auth.verifyUser(req) === null) {
  //   return res.status(401).json({
  //     loggedIn: false,
  //     user: null,
  //     errorMessage: "Unauthorized",
  //   });
  // }

  console.log("delete " + req.params.id);
  console.log("req: ", req.userId);

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

      // Update map properties with the data from the request body
      Object.assign(map, body);

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
      console.log("map found: " + JSON.stringify(map));
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

forkMap = (req, res) => {
  console.log("start create Map");
  // var userId;
  // const token = req.headers.authorization.split(" ")[1];
  // userId = extractUserIdFromToken(token);

  console.log("userId: " + req.userId);

  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a map",
    });
  }

  // const mapData = Buffer.from(Object.values(body.mapData));

  // Create the Map instance
  const map = new Map(body);

  //   const map = new Map(body);
  //   console.log("map: " + JSON.stringify(map));
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
        message: "Map created!",
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

  if (key === null || label === null || csvData === null) {
    return res.status(400).json({
      success: false,
      error: "You must provide a key, label, and csvData",
    });
  }

  if (!csv) {
    return res.status(403).json({ success: false, error: err });
  }

  try{
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

module.exports = {
  createMap,
  deleteMap,
  updateMap,
  getMapById,
  getMapsByUser,
  getPublishedMaps,
  forkMap,
  sendMapFile,
  createCSV,
  getCSVById,
  updateCSV,
};
