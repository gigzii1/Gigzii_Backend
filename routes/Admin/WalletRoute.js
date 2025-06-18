const express = require("express");
const { verifyToken } = require("../../utils/Auith");
const {
  getWallets,
  getTransactions,
} = require("../../controllers/Admin/WalletController");

const router = express.Router();

router.get("/getWallets", verifyToken, getWallets);
router.get("/getTransactions/:id", verifyToken, getTransactions);

module.exports = router;
