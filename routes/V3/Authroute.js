const express = require("express");
const { signupUser, sendOTP } = require("../../controllers/V3/Authcontroller");

const router = express.Router();

router.post("/signupUser", signupUser);
router.post("/sendOtp", sendOTP);

module.exports = router;
