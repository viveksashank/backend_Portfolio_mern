const express = require("express");
const { login, logout, getInvestorById, getInvestorHoldings, getInvestorNetWorth } = require("../controllers/investorController");
const { verifyJWT } = require("../utility/authManager");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);

router.get("/:investorId", verifyJWT, getInvestorById);
router.get("/:investorId/holdings", verifyJWT, getInvestorHoldings);
router.get("/:investorId/networth", verifyJWT, getInvestorNetWorth);

module.exports = router;