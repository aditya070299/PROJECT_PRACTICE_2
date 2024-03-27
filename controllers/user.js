const User = require("../models/user");

module.exports.renderSignUpForm=(req, res) => {
  console.log("i am in");
  res.render("users/signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
      console.log("in post request");
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerdeUser = await User.register(newUser, password);
      console.log(registerdeUser);
      req.login(registerdeUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "Walcome to WanderTravel");
        res.redirect("/listings");
      })
      
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLogin=(req, res) => {
  console.log("wanna login ");
  res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
    req.flash("success", "Walcome back to WanderTravel");
    let redirectUrl=  res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
  }

  module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}