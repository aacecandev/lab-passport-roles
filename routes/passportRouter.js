const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

const isAuthenticated = require('../middleWares/isAuthenticated');
const checkRole = require("../middleWares/checkRole");



/* LOG IN */
router.get("/login", (req, res) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/passport/bossPage",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

 /* GO TO BOSS PAGE */
router.get("/bossPage", [isAuthenticated(), checkRole("BOSS")], (req, res) => {

  User.find({})
    .then( users => {
      const data = {
        boss: req.user,
        users: users
      }
      res.render("passport/bossPage", data);
    })
});

/* LOGOUT */
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

module.exports = router;