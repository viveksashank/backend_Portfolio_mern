const express = require("express");
const investorrouter = express.Router();

const {
  login,
  logout,
  getInvestorById,
  getInvestorHoldings,
  getInvestorNetWorth,
  getInvestorTransactions,
  getInvestorSips
} = require("../controllers/investorController");

const {
  verifyJWT
} = require("../utility/authManager");

investorrouter.post(
  "/login",
  login
);

investorrouter.post(
  "/logout",
  logout
);

investorrouter.get(
  "/:investorId",
  verifyJWT,
  getInvestorById
);

investorrouter.get(
  "/holdings/:investorId",
  verifyJWT,
  getInvestorHoldings
);

investorrouter.get(
  "/networth/:investorId",
  verifyJWT,
  getInvestorNetWorth
);

investorrouter.get(
  "/transactions/:investorId",
  verifyJWT,
  getInvestorTransactions
);

investorrouter.get(
  "/sips/:investorId",
  verifyJWT,
  getInvestorSips
);

module.exports = investorrouter;