const User = require("../models/User");
const passport = require("passport")


const express = require("express");
const { signup, postSignup, getLogin, logout } = require("../controllers/user");
const router = express.Router();

router.get("/signup", signup);
  
router.post("/signup", postSignup);
  
router.get("/login",getLogin );
  
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
      }), 
      (req, res) => {
        req.flash("success", "Welcome back");
        res.redirect("/")
      }
  );
  
router.get("/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.send(req.user);
    } else {
      res.redirect("/login");
    }
  });
  
router.get("/logout", logout)

  module.exports = router;