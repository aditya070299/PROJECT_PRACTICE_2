const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrror = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isloggedin, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");




//index route---------------------------
router.get("/", wrapAsync(listingController.index));

//New route-----------------------------
router.get("/new", isloggedin, listingController.renderNewForm);

//Creat Route---------------------------
router.post("/", validateListing, wrapAsync(listingController.createListing));

//Edit Route----------------------------------
router.get("/:id/edit",isloggedin,isOwner,wrapAsync(listingController.renderEdit));

//Update Route---------------------------------
router.put("/:id",isloggedin,isOwner,validateListing,
wrapAsync(listingController.updateListing)
);

//DELETE Route---------------------------------
router.delete(
  "/:id",
  isloggedin,
  isOwner,
  wrapAsync(listingController.deleteListing)
);


//show route-------------------------------------
router.get("/:id", wrapAsync(listingController.showListing));



// //show route
// router.get(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listings = await Listing.findById(id).populate("reviews").populate("owner");
//     if(!listings){
//         req.flash("error","No Such Listing!");
//         res.redirect("/listings");
//     }
//     console.log(listings);
//     res.render("listings/show.ejs", { listings });
//   })
// );



module.exports = router;
