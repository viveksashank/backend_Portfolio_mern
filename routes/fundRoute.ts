import express, { Router } from "express";

import { verifyJWT } from "../utility/authManager";

import {
  createFund,
  getAllFunds,
  updateFundNAV,
} from "../controllers/fundController";

const fundrouter: Router = express.Router();

fundrouter.post("/", verifyJWT, createFund);

fundrouter.get("/", verifyJWT, getAllFunds);

fundrouter.put(
  "/:fundId/nav",
  verifyJWT,
  updateFundNAV
);

export default fundrouter;