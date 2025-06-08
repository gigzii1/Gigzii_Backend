const express = require("express");
const { signupUser, sendOTP, login, artistSignup, artistLogin, AdminLogin } = require("../../controllers/V3/Authcontroller");

const router = express.Router();

router.post("/signupUser", signupUser);
router.post("/sendOtp", sendOTP);
router.post("/login", login);

router.post("/artistSignup",artistSignup)
router.post("/artistLogin",artistLogin)


router.post("/adminLogin",AdminLogin)
module.exports = router;
