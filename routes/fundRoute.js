const express = require("express");
const { verifyJWT } = require("../utility/authManager");
const { createFund, getAllFunds, updateFundNAV } = require("../controllers/fundController");
const fundrouter = express.Router();

fundrouter.post("/",verifyJWT,createFund);
fundrouter.get("/", verifyJWT,getAllFunds);
fundrouter.put("/:fundId/nav",verifyJWT,updateFundNAV);

module.exports = fundrouter;