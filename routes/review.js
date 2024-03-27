const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrror = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isloggedin, isReviewAuthor } = require("../middleware.js");

const reviewController=require("../controllers/review.js");

const validateReview = (req, res, next) => {
  console.log("i am in ValidateReview");
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrror(400, errMsg);
  } else {
    next();
  }
};


//review
router.post(
  "/",isloggedin,validateReview,
  wrapAsync(reviewController.createReview)
);


//git comment
//delete review route
router.delete(
  "/:reviewId",isloggedin,isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;