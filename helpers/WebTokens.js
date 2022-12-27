// Third-party libraries & modules
const jwt = require("jsonwebtoken");

// Function for generate json web tokens
const generateJWT = (user) => {
  const { userId, emailAddress, userType, userStatus } = user;
  return jwt.sign(
    {
      userId,
      emailAddress,
      userType,
      userStatus,
    },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );
};

module.exports = { generateJWT };
