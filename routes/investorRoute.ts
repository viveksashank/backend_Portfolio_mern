import express, { Router } from "express";

import {
  login,
  logout,
  getInvestorById,
  getInvestorHoldings,
  getInvestorNetWorth,
  getInvestorTransactions,
  getInvestorSips,
} from "../controllers/investorController";

import { verifyJWT } from "../utility/authManager";

const investorrouter: Router = express.Router();

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

export default investorrouter;