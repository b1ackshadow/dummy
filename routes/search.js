const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const searchController = require("../controller/searchController");
const { handleError } = require("../helpers/helper");

router.post("/api/search", handleError(searchController.search));

module.exports = router;
