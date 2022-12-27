// Third-party libraries & modules
const Express = require("express");

// Custom libraries & modules
const {
  createLogin,
  InitializeLogin,
  getAllLogins,
  getLoginByUserId,
  updateLoginByUserId,
  deleteLoginByUserId,
} = require("../controllers/Login");
const { authUser, authRole } = require("../middlewares/Authorization");

// Global instances
const router = Express.Router();

// Create
router.post("/create", createLogin);

// Login
router.post("/login", InitializeLogin);

// Get all logins
router.get("/all", authUser, authRole(["admin"]), getAllLogins);

// Get login by user id
router.get(
  "/:userId",
  authUser,
  authRole(["admin", "designer", "customer"]),
  getLoginByUserId
);

// Update login by user id
router.put(
  "/update/:userId",
  // authUser,
  // authRole(["admin", "designer", "doctor"]),
  updateLoginByUserId
);

// Delete login by user id
router.delete(
  "/delete/:userId",
  // authUser,
  // authRole(["admin"]),
  deleteLoginByUserId
);

module.exports = router;
