const User = require("../models/User");  // Ensure this line is present

module.exports.signup = (req, res) => {
    res.render("user/signup");
  }

  module.exports.postSignup = (req, res, next) => {
      const { username, password } = req.body;
      User.register(new User({ username }), password, (err, user) => {
        if (err) {
          req.flash("error", err.message);
          return next(err);
        }
        req.login(user, (err) => {
          if (err) return next(err);
          req.flash("success", "Successfully registered and logged in!");
          res.redirect("/");
        });
      });
    }

    module.exports.getLogin= (req, res) => {
        res.render("user/login");
      }

      module.exports.logout = (req, res, next) => {
        req.logout((err) => {
          if(err){
            return next(err)
          }
          req.flash("success", "You successfully logged out.");
          res.redirect("/")
        })
      } 
    
    