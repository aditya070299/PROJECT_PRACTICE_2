const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressErrror = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");



module.exports.isloggedin=(req,res,next)=>{
    // console.log(req.path,".............",req.originalUrl );
    
    // console.log(req.user)
    if(!req.isAuthenticated()){
        //redirectUrl
        req.session.redirectUrl= req.originalUrl;
    req.flash("error", "You mush be logged-In!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveredirectUrl=(req,res,next)=>{

  console.log("------------");
   
  console.log(req.session.redirectUrl);
    if(req.session.redirectUrl){
        
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
      req.flash("error","You are not the owner of this Listing");
      return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
      req.flash("error","You did not creat this review");
      return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrror(400, errMsg);
  } else {
    next();
  }
};