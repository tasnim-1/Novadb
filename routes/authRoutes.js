const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  profile,
  getUsers
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// route protégée
router.get("/profile", authMiddleware, profile);

// route admin - voir tous les utilisateurs
router.get("/admin/users", getUsers);

module.exports = router;