import express, { Router } from "express";

import {
  createSIP,
  getAllSIPs,
  getSIPWithTransactions,
  processSIP,
} from "../controllers/sipController";

import { verifyJWT } from "../utility/authManager";

const router: Router = express.Router();

router.post(
  "/",
  verifyJWT,
  createSIP
);

router.get(
  "/",
  verifyJWT,
  getAllSIPs
);

router.get(
  "/:sipId/details",
  verifyJWT,
  getSIPWithTransactions
);

router.post(
  "/:sipId/process",
  verifyJWT,
  processSIP
);

export default router;