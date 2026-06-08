const express= require("express");
const router = express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync")
const ExpressError= require("../utils/ExpressError")
const {listingSchema , reviewSchema} = require("../schema");
const Review=require("../models/review")
const Listing=require("../models/listing")
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewController=require("../controllers/reviews.js")

//Reviews post route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview))

//reviews delete route
router.delete(
    "/:reviewId",isLoggedIn,isReviewAuthor
    ,wrapAsync(reviewController.destroyReview)
 )



module.exports = router;