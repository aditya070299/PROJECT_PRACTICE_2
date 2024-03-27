const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");

const userController=require("../controllers/user.js");

//sigup rout---------------------
router.get("/signup",userController.renderSignUpForm);

router.post(
  "/signup",
  wrapAsync(userController.signup)
);

router.get("/login", userController.renderLogin);

router.post(
  "/login",saveredirectUrl, 
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login));

router.get("/logout", userController.logout)

// router.post("/login",wrapAsync(async (req, res) => {
//     let { username1, email1, password1 } = req.body;
//     let user = await User.findOne({ username: username1 });
//     if (user && user.email === email1 && user.password === password1) {
//       req.flash("success", "You are loged-in,Walcome to WanderTravel");
//       res.redirect("/listings");
//     } else {
//       req.flash("error", "Invalid username, email, or password");
//       res.redirect("/login"); // Redirect to login page in case of invalid credentials
//     }
//   })
// );
module.exports = router;
