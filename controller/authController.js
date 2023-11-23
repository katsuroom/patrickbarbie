const auth = require('../auth')
const User = require('../models/user_model')
const bcrypt = require('bcryptjs')

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            console.log("Wrong email or password provided.", email);
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Incorrect password"
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);
        console.log(existingUser.username);
        console.log("env:", process.env.NODE_ENV);

        res
          .cookie("token", token, {
            httpOnly: false,
            secure: false,
            sameSite: "none",
          })
          .status(200)
          .json({
            success: true,
            user: {
              username: existingUser.username,
              email: existingUser.email,
            },
          });
        console.log("token sent");


        console.log("sent status 200")

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");
    try {
        const { username, email, password } = req.body;
        console.log("create user: " + username + " " + email + " " + password);
        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        // if (password.length < 8) {
        //     return res
        //         .status(400)
        //         .json({
        //             errorMessage: "Please enter a password of at least 8 characters."
        //         });
        // }
        // console.log("password long enough");
        // if (password !== passwordVerify) {
        //     return res
        //         .status(400)
        //         .json({
        //             errorMessage: "Please enter the same password twice."
        //         })
        // }
        // console.log("password and password verify match");
        // const existingUser = await User.findOne({ email: email });
        // console.log("existingUser: " + existingUser);
        // if (existingUser) {
        //     return res
        //         .status(400)
        //         .json({
        //             success: false,
        //             errorMessage: "An account with this email address already exists."
        //         })
        // }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const newUser = new User({username, email, passwordHash});
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        const token = auth.signToken(savedUser._id);
        console.log("token:" + token);
        console.log("env:", process.env.NODE_ENV)

        await res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV,
            sameSite: "none",
          })
          .status(200)
          .json({
            success: true,
            user: {
              username: savedUser.username,
              email: savedUser.email,
            },
          });

        console.log("token sent");

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

getLoggedIn = async (req, res) => {
  try {
    let userId = auth.verifyUser(req);
    if (!userId) {
      return res.status(200).json({
        loggedIn: false,
        user: null,
        errorMessage: "?",
      });
    }

    const loggedInUser = await User.findOne({ _id: userId });
    console.log("loggedInUser: " + loggedInUser);

    return res.status(200).json({
      loggedIn: true,
      user: {
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
      },
    });
  } catch (err) {
    console.log("err: " + err);
    res.json(false);
  }
};

logoutUser = async (req, res) => {
    console.log("logoutUser in backend controller");
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
    console.log("sent logout response");
};


module.exports = {
    registerUser,
    loginUser,
    getLoggedIn,
    logoutUser
}
