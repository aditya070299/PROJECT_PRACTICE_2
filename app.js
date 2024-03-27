const express = require("express");
const app = express();

const mongoose = require("mongoose");

const ejsMate = require("ejs-mate"); // used to create tamplates in multiple pages

const ExpressErrror = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// now i can use path to travel to diffrent folders
const path = require("path");

// -----npm i method-override/ for PUT and DELETE request
const methodOverride = require("method-override");

// --------------Seting_Path--------------------
// ---------For_All_EJS_FILES-------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//for parcing data
app.use(express.urlencoded({ extended: true }));
//for PUT and DELETE requests
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:js ke liye engine define kiya jo h ejsMate
app.engine("ejs", ejsMate); //(express ko btaya ki ejs k liye engine ejs Mate hoga ab )

app.use(express.static(path.join(__dirname, "/public")));

// ---------------MONGOOSE_SETUP----------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderTravel";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// ---------------session--------------
const sessionOptions = {
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
  coolie: Date.now() + 7 * 24 * 60 * 60 * 1000,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};
// -------------------------ROUTES-----------------------
app.get("/", (req, res) => {
  res.send("Hii i am root!");
});

// ---------------------passport package for logimn an signUp-------------
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //single session me har bar login rhega user
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// app.get("/demouser",async(rew,res)=>{
//     let fakeUser = new User({
//         email: "student6@gmail.com",
//         username: "sita-student"
//     });

//     let registeredUser=await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//-----------------------------midlileWare for all errors--------------------

app.all("*", (req, res, next) => {
  next(new ExpressErrror(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "default msg:page not found" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

// -----------------------------------------------------------

app.listen(8080, () => {
  console.log("listening at port 8080");
});
