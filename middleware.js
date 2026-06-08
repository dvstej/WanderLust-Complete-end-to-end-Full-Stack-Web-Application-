const Listing = require("./models/listing.js")
const {listingSchema , reviewSchema} = require("./schema");
const ExpressError= require("./utils/ExpressError")
const Review=require("./models/review.js")

 module.exports.isLoggedIn= (req,res,next) =>{
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in")
       return  res.redirect("/login")
    }
    next();
}

//redirect to same page
module.exports.saveRedirectUrl =(req,res,next) =>{
     if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
     }
     next();

}

// authorization to edit 
module.exports.isOwner = async (req,res,next)=>{
     let {id} = req.params;
    //authorization..if and then 
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing")
      return  res.redirect(`/listings/${id}`)
    }

    next()
}

//server side validating function
module.exports.validateListing= (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview= (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//authorization to delete
module.exports.isReviewAuthor = async (req,res,next)=>{
     let {id ,reviewId} = req.params;
    //authorization..if and then 
    let review= await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the author of this review")
      return  res.redirect(`/listings/${id}`)
    }

    next()
}