const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const tokenController = require("../controllers/token.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get(
    "/me",
    authenticate,
    authController.me
);
router.post(
    "/refresh-token",
    tokenController.refreshToken
);

module.exports = router;