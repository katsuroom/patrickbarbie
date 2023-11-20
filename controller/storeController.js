const Map = require("../models/map_model");
const User = require("../models/user_model");
const auth = require("../auth");

createMap = (req, res) => {
  console.log("start create Map");

  if (auth.verifyUser(req) === null) {
    return res.status(401).json({
      loggedIn: false,
      user: null,
      errorMessage: "Unauthorized",
    });
  }

  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a map",
    });
  }

  const map = new Map(body);
  console.log("map: " + map.toString());
  if (!map) {
    return res.status(400).json({ success: false, error: err });
  }
  console.log("req: ", req.userId);

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
        id: map._id,
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

  if (auth.verifyUser(req) === null) {
    return res.status(401).json({
      loggedIn: false,
      user: null,
      errorMessage: "Unauthorized",
    });
  }

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

updateMap = (req, res) =>{
  console.log("start update Map");
  if(auth.verifyUser(req) === null){
      return res.status(401).json({
          loggedIn: false,
          user: null,
          errorMessage: "Unauthorized"
      })
  }
  const body = req.body;
  console.log("body: " + JSON.stringify(body));
  console.log("req: ", req.userId);

  if(!body){
      return res.status(400).json({
          success: false,
          error: "You must provide a body to update",
      })
  }

  const mapId  = req.params.id;
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
}

getMapById = (req, res) =>{
  console.log("start get Map by id");

  const mapId  = req.params.id;
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
}

getMapsByUser = (req, res) => {
  console.log("start get Maps");
  if(auth.verifyUser(req) === null){
      return res.status(401).json({
          loggedIn: false,
          user: null,
          errorMessage: "Unauthorized"
      })
  }
  console.log("req: ", req.userId);

  User.findById(req.userId)
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

}
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
}

module.exports = {
  createMap,
  deleteMap,
  updateMap,
  getMapById,
  getMapsByUser,
  getPublishedMaps
};