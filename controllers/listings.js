const Listing=require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

//index route
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings})
}

//New route
module.exports.renderNewForm=(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing")
       return  res.redirect("/login")
    }
    res.render("listings/new.ejs")
}

//show route
module.exports.showListings=async (req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner")
    if(!listing){
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}

//create 
module.exports.createListing=async(req,res,next)=>{
   let response=  await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
       limit: 1
    })
     .send()


    //let result = listingSchema.validate(req.body);
    //console.log(result)
   const newListing= new Listing(req.body.listing);
   newListing.owner= req.user._id;

   newListing.geometry=response.body.features[0].geometry;

   let savedListing= await newListing.save()
   console.log(savedListing)
   
    req.flash("success","New listing created");
    res.redirect("/listings")
}

//edit
module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
}

//update
module.exports.updateListing=async (req,res)=>{
    let {id} = req.params;
    //authorization..if and then 
    await Listing.findByIdAndUpdate(id,{
      title:req.body.listing.title,
      description:req.body.listing.description,
      price:req.body.listing.price,
      country:req.body.listing.country,
      location:req.body.listing.location,
      "image.url": req.body.listing.image.url
   }); 
   req.flash("success","listing updated");
    res.redirect(`/listings/${id}`)
}

//delete
module.exports.destroyListing=async (req,res)=>{
     let {id} = req.params;
     await Listing.findByIdAndDelete(id)
      req.flash("success","Listing Deleted");
     res.redirect("/listings")
}