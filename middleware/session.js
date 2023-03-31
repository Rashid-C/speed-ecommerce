const userdetails = require("../model/userModel");

module.exports = {
  verifyAdmin: (req, res, next) => {
    if (req.session.admin) {
      next();
    } else {
      res.redirect("/admin");
    }
  },

  verifyUser: (req, res, next) => {
    if (req.session.user) {
      const email = req.session.user;
      userdetails.findOne({ email: email }).then((user) => {
        if (user.isBlocked) {
          res.redirect("/logout");
        } else {
          next();
        }
      });
    } else {
      res.redirect("/login");
    }
  },
};
