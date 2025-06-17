
const express = require("express");
const { verifyToken } = require("../../utils/Auith");
const { getWallets } = require("../../controllers/Admin/WalletController");


const router = express.Router();


router.get("/getWallets",verifyToken,getWallets)


module.exports = router;
