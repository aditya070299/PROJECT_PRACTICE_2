const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author =  req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review Saved!");

    console.log("new review sand");
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;

   await Listing.findByIdAndUpdate(id, {
      $pull: { review: reviewId },
    });
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  }