const express = require("express");
const router = express.Router();
const {
  register,
  login,
  loggedin,
  forgotpassword,
  resetpassword,
  logout,
} = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/loggedin").get(loggedin);

router.route("/logout").get(logout);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

module.exports = router;
