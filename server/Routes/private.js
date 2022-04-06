const express = require("express");
const { getPrivateData } = require("../controllers/private");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.route("/").get(protect,getPrivateData);

module.exports = router;