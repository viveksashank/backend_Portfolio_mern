const express = require("express");

const router = express.Router();

const {
    createSIP,
    getAllSIPs,
    getSIPWithTransactions,
    processSIP
} = require("../controllers/sipController");

const {
    verifyJWT
} = require("../utility/authManager");



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


module.exports = router;