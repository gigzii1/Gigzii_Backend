
const express = require("express");
const { verifyToken } = require("../../utils/Auith");
const { getUsers } = require("../../controllers/Admin/UserController");

const router = express.Router();


router.get("/getUsers",verifyToken,getUsers)


module.exports = router;
