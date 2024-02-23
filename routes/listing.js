const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrror = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrror(400, errMsg);
  } else {
    next();
  }
};

//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Creat Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let {title,description,image,price,country,locarion}=req.body;
    // let newlisting=await req.body.listing;
    // if(!req.body.listen){
    //     throw new ExpressErrror(400 , "Sand valid data for listing");
    // }
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","New Listing Created!");
    console.log(newlisting);
    res.redirect("/listings");
  })
);


// aditya code brfanch changes
//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const EditListings = await Listing.findById(id);
    if(!EditListings){
    req.flash("success","Update Saved Successfully!");
    res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { EditListings });
  })
);

//Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Update Saved Successfully!");

    res.redirect(`/listings/${id}`);
  })
);

//DELETE Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    req.flash("success","Delete Successfully!");
    console.log(delList);
    res.redirect("/listings");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate("reviews");
    if(!listings){
        req.flash("error","No Such Listing!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listings });
  })
);

module.exports = router;
