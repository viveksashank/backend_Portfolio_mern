const express = require("express");

const router = express.Router();

const { createSIP, getSIPById, processSIP,  getSIPTransactions } = require("../controllers/sipController");
const { verifyJWT } = require("../utility/authManager");

router.post( "/", verifyJWT, createSIP );
router.get("/:sipId",verifyJWT, getSIPById );
router.post( "/:sipId/process", verifyJWT, processSIP );
router.get( "/:sipId/transactions", verifyJWT, getSIPTransactions );

module.exports = router;
