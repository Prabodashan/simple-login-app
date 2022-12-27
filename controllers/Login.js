// Third-party libraries & modules
const bcrypt = require("bcrypt");

// Custom libraries & modules
const LoginModel = require("../models/Login");
const { generateJWT } = require("../helpers/WebTokens");

// Function for create login
const createLogin = async (req, res) => {
  const { userName, emailAddress, password, userType } = req.body;

  // Check if user id already exist
  const login = await LoginModel.findOne({ emailAddress });

  if (login) {
    return res.json({ errors: { message: "User ID already exist!" } });
  }

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 8);

  // Create new login
  const newLogin = new LoginModel({
    userName,
    emailAddress,
    password: hashedPassword,
    userType,
  });

  try {
    // Save login
    await newLogin.save();
    return res.status(201).json({
      created: true,
      success: { message: "Successfully created a login!" },
    });
  } catch (err) {
    return res.json({ errors: err });
  }
};

// Function for initialize the login
const InitializeLogin = async (req, res) => {
  const { emailAddress, password } = req.body;
  console.log("emailAddress:", emailAddress);

  // Check if email doesn't exist
  const login = await LoginModel.findOne({ emailAddress: emailAddress });
  console.log(login);

  if (!login) {
    return res.json({ errors: { message: "Wrong email address!" } });
  }

  // Check if password matches
  const passMatch = await bcrypt.compare(password, login.password);
  if (!passMatch) {
    return res.json({ errors: { message: "Wrong password!" } });
  }

  // Generate a login token
  const loginToken = generateJWT(login);

  // Custom user data
  const userData = {
    userId: login._id,
    userName: login.userName,
    emailAddress: login.emailAddress,
    userType: login.userType,
    userStatus: login.userStatus,
  };

  return res
    .status(200)
    .json({ authentication: true, token: loginToken, data: userData });
};

// Function for get all logins
const getAllLogins = async (req, res) => {
  try {
    const logins = await LoginModel.find();
    return res.status(200).json(logins);
  } catch (err) {
    return res.json({ errors: err });
  }
};

// Function for get login by user id
const getLoginByUserId = async (req, res) => {
  const { userId } = req.params;

  // Restrict patients and doctors to view other user details
  // if (req.user.userType !== "admin") {
  //   if (req.user.id !== userId) {
  //     return res.json({
  //       errors: { message: "You can't view other user's details!" },
  //     });
  //   }
  // }

  try {
    const login = await LoginModel.findOne({ userId });
    return res.status(200).json(login);
  } catch (err) {
    return res.json({ errors: err });
  }
};

// Function for update existing login
const updateLoginByUserId = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  // Restrict patients and doctors to view other user details
  // if (req.user.userType !== "admin") {
  //   if (req.user.id !== userId) {
  //     return res.json({
  //       errors: { message: "You can't view other user's details!" },
  //     });
  //   }
  // }

  // Check if login is available
  const login = await LoginModel.findOne({ userId });
  if (login) {
    // If provided password empty use existing password as the new one
    if (password === "" || password === undefined) {
      req.body.password = login.password;
    } else {
      // Password hashing
      const hashPass = await bcrypt.hash(password, 8);
      req.body.password = hashPass;
    }
  } else {
    return res.json({ errors: { message: "Login not available!" } });
  }

  try {
    await LoginModel.findOneAndUpdate({ userId }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      created: true,
      success: { message: "Successfully updated the login!" },
    });
  } catch (err) {
    res.json({ errors: err });
  }
};

// Function for delete login by user id
const deleteLoginByUserId = async (req, res) => {
  const { userId } = req.params;

  // Check if login is available
  const login = await LoginModel.findOne({ userId });
  if (!login) {
    return res.json({ errors: { message: "Login not available!" } });
  }

  try {
    await LoginModel.findByIdAndDelete(login._id);
    res.status(200).json({
      created: true,
      success: { message: "Successfully deleted the login!" },
    });
  } catch (err) {
    res.json({ errors: err });
  }
};

module.exports = {
  createLogin,
  InitializeLogin,
  getAllLogins,
  getLoginByUserId,
  updateLoginByUserId,
  deleteLoginByUserId,
};
