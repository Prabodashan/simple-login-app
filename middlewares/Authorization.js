// Third-party libraries & modules
const jwt = require("jsonwebtoken");

// Function for authorize user
const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_KEY);
        req.user = user;
        return next();
      } catch (err) {
        console.log(err);
        return res.json({
          authorization: false,
          errors: { message: "Invalid token, Login again!" },
        });
      }
    }
    return res.json({
      errors: { message: "Authorization token must be Bearer [token]" },
    });
  }
  return res.json({
    errors: { message: "Authorization header must be provided!" },
  });
};

// Function for authorize user role
const authRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.userType;
    if (roles.includes(userRole)) {
      return next();
    } else {
      return res.json({ errors: { message: "You don't have permission!" } });
    }
  };
};

module.exports = { authUser, authRole };
