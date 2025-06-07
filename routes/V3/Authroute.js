const express = require("express");
const { signupUser, sendOTP, login, artistSignup, artistLogin, AdminLogin } = require("../../controllers/V3/Authcontroller");
const { default: loginLimiter } = require("../../utils/rateLimiter");

const router = express.Router();

router.post("/signupUser", signupUser);
router.post("/sendOtp", sendOTP);
router.post("/login", login);

router.post("/artistSignup",artistSignup)
router.post("/artistLogin",artistLogin)


router.post("/adminLogin",loginLimiter,AdminLogin)
module.exports = router;
