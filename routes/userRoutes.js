const express = require('express');
// Create a router
const router = express.Router();
const userController = require('../controllers/userControllers');

// Define multiple routes
router.route("/register")
  .post(userController.registerUser);

router.route("/login")
  .post(userController.loginUser);

router.route("/getUser")
  .get(userController.getUser);

router.route("/forgotpassword")
  .post(userController.forgotUserPassword);

router.route("/resetpassword/:token")
  .post(userController.resetUserPassword);

router.route("/newpassword/:token")
  .post(userController.newUserPassword);

module.exports = router;