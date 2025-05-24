const express = require("express");
const { signupUser, sendOTP, login, artistSignup } = require("../../controllers/V3/Authcontroller");

const router = express.Router();

router.post("/signupUser", signupUser);
router.post("/sendOtp", sendOTP);
router.post("/login", login);

router.post("/artistSignup",artistSignup)
module.exports = router;
