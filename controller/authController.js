const auth = require("../auth");
const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    const caseInsensitiveEmail = new RegExp("^" + req.body.email + "$", "i");

    const existingUser = await User.findOne({ email: caseInsensitiveEmail });
    console.log("existingUser: " + existingUser);
    if (!existingUser) {
      console.log("Wrong email.", email);
      return res.status(401).json({
        errorMessage: "User does not exist.",
      });
    }

    console.log("provided password: " + password);
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect) {
      console.log("Incorrect password");
      return res.status(401).json({
        errorMessage: "Incorrect password",
      });
    }

    // LOGIN THE USER
    // const token = auth.signToken(existingUser._id);
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET
    );
    console.log(token);
    console.log(existingUser.username);

    res.status(200).json({
      token: `Bearer ${token}`,
      success: true,
      user: {
        username: existingUser.username,
        email: existingUser.email,
        numMaps: existingUser.maps.length,
      },
    });

    // console.log("header: ", res.getHeaders());
    console.log("token sent");

    console.log("sent status 200");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

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

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("passwordHash: " + passwordHash);

    const newUser = new User({ username, email, passwordHash });
    const savedUser = await newUser.save();
    console.log("new user saved: " + savedUser._id);

    // const token = auth.signToken(savedUser._id);
    // console.log("token:" + token);
    // console.log("env:", process.env.NODE_ENV);

    res.status(200).json({
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
};

getLoggedIn = async (req, res) => {
  try {
    let userId = req?.userId;
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
        username: loggedInUser.username,
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

getHashedPassword = async (req, res) => {
  console.log("getting hashed password");

  const email = req.query.email;

  console.log("email", email);

  const caseInsensitiveEmail = new RegExp("^" + email + "$", "i");

  User.findOne({ email: caseInsensitiveEmail })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      console.log("user found: " + JSON.stringify(user));
      return res.status(200).json({
        success: true,
        data: user.passwordHash,
        message: "User found",
      });
    })
    .catch((error) => {
      console.log("Error getting user: " + error);
      return res.status(500).json({
        success: false,
        error: "Error getting user",
      });
    });
};

sendPasswordRecoveryEmail = async (req, res) => {
  console.log("sendPasswordRecoveryEmail");

  const email = req.query.email;
  let PwHash = req.query.PwHash;
  PwHash = PwHash.replace(/\//g, "SPECIAL_ESCAPE_CHAR");

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "Admin123@admin.com",
      pass: "ycrl ahby kbwf ijrn",
    },
  });

  try {
    // Define the email content

    let url = `https://patrick-barbie-f64046e3bb4b.herokuapp.com/password-recovery?email=${email}&token=${PwHash}`;
    // let url = `localhost:4000/password-recovery?email=${email}&token=${PwHash}`;

    let info = await transporter.sendMail({
      from: '"Patrick Barbie" <TeamPink416@gmail.com>',
      to: email,
      subject: "Password Recovery",
      html: `
      <h1>Password Recovery</h1>
      <p>Hello,</p>
      <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
      <p>To reset your password, click the link below:</p>
      <a href="${url}">Reset Password</a>
      <p>If the above link does not work, copy and paste the following URL into your browser:</p>
      <p style="text-decoration:none;">${url}</p>
      <p>Thank you,</p>
      <p>Patrick Barbie Team</p>
    `,
    });

    console.log("Email sent: ", info.messageId);

    res.status(200).json({
      success: true,
      message: "Password recovery email sent successfully.",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).json({
      success: false,
      error: "Error sending password recovery email.",
    });
  }
};


setNewPassword  = async (req, res) => {
  const email = req.query.email;
  const newPassword = req.query.newPassword;

  const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    console.log("passwordHash: " + passwordHash);



  const caseInsensitiveEmail = new RegExp("^" + email + "$", "i");

  User.findOne({ email: caseInsensitiveEmail })
  .then((user) => {
    console.log("user found: " + JSON.stringify(user));
    user.passwordHash = passwordHash
    return user.save();
  })
  .then(() => {
    return res.status(201).json({
      success: true,
      message: "Password Updated!",
    });
  })
  .catch((error) => {
    return res.status(400).json({
      error,
      message: "Password Not Updated!",
    });
  });



}

module.exports = {
  registerUser,
  loginUser,
  getLoggedIn,
  logoutUser,
  getHashedPassword,
  sendPasswordRecoveryEmail,
  setNewPassword
};
