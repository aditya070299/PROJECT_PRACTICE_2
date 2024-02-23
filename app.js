const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); // used to create tamplates in multiple pages
const ExpressErrror = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");

const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

// -------------------------ROUTES-----------------------
app.get("/", (req, res) => {
  res.send("Hii i am root!");
});


const sessionOptions = {
    secret : "mySecret",
    resave : false,
    saveUninitialized : true
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); 
    next();
})



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



//-----------------------------midlile Ware for all errors--------------------

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
