const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js")

const listingSchema=new Schema({
    title :{
      type:String,
      required:true
    } ,
    description: String,
    image: {
      filename: String,
      url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1684508638760-72ad80c0055f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWlyYm5ifGVufDB8fDB8fHww",

      set: (v) =>
        v === ""
          ? "https://plus.unsplash.com/premium_photo-1684508638760-72ad80c0055f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWlyYm5ifGVufDB8fDB8fHww"
          : v,
    },
    },
    price:Number,
    location: String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}})
  }
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;

//default:"https://unsplash.com/s/photos/destinationhttps://plus.unsplash.com/premium_photo-1719843013722-c2f4d69db940?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzdGluYXRpb258ZW58MHx8MHx8fDA%3D",