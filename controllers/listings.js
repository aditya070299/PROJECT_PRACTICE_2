const Listing = require("../models/listing");

module.exports.index= async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

  module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
}
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    try {
      const listings = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
      console.log(listings); // Log the value of listings to see what it contains
      if (!listings) {
        req.flash("error", "No Such Listing!");
        return res.redirect("/listings");
      }
      res.render("listings/show.ejs", { listings });
    } catch (error) {
      console.error(error); // Log any errors that occur during the query
      req.flash("error", "An error occurred while fetching the listing.");
      res.redirect("/listings");
    }
  };


  module.exports.createListing=async (req, res, next) => {
    // let {title,description,image,price,country,locarion}=req.body;
    // let newlisting=await req.body.listing;
    // if(!req.body.listen){
    //     throw new ExpressErrror(400 , "Sand valid data for listing");
    // }
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    console.log(newlisting);
    res.redirect("/listings");
  }

  module.exports.renderEdit=async (req, res) => {
    let { id } = req.params;
    const EditListings = await Listing.findById(id);
    if (!EditListings) {
      req.flash("success", "Update Saved Successfully!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { EditListings });
  }

  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Update Saved Successfully!");

    res.redirect(`/listings/${id}`);
  }

  module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Delete Successfully!");
    console.log(delList);
    res.redirect("/listings");
  }