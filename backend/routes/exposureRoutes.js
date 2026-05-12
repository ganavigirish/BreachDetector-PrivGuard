const express = require("express");

const router = express.Router();

const {
    scanEmail
} = require("../controllers/exposureController");

router.post("/scan", scanEmail);

module.exports = router;