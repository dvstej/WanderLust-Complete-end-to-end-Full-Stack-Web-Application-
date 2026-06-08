//listing.js
const express= require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync")
const {listingSchema , reviewSchema} = require("../schema");
const ExpressError= require("../utils/ExpressError")
const Listing=require("../models/listing")
const {isLoggedIn} = require("../middleware.js")
const {isOwner,validateListing}= require("../middleware.js")

const listingController = require("../controllers/listings.js")
const multer= require("multer")
const upload = multer({dest:'uploads/'})

router.route("/")
//index route
  .get(wrapAsync(listingController.index))
//create route
   .post(isLoggedIn,validateListing, wrapAsync(listingController.createListing))

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
   //show route
  .get(wrapAsync(listingController.showListings))
  //update route
  .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
  //delete route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))


//edit route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router;