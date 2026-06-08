//app.js

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path=require("path")
const methodOverride= require("method-override")

 const dbUrl = process.env.ATLASDB_URL;
const dns = require("node:dns/promises"); dns.setServers(["1.1.1.1", "1.0.0.1"]);
const ejsMate = require("ejs-Mate")
const ExpressError= require("./utils/ExpressError")    
const session= require("express-session")
const MongoStore = require("connect-mongo")
const flash= require("connect-flash")
const passport= require("passport");
const LocalStrategy = require("passport-local")
const User= require("./models/user.js")

const listingRouter = require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


async function main(){
   await mongoose.connect(dbUrl)
}

main()
.then((res)=>{
    console.log("connected")
})
.catch((err)=>{
    console.log(err)
})

//storing sessions in mongo
// app.use(session({
//   secret: "",
//   store: MongoStore.create({
//     dbName: 'test'
//   })
// }));

const sessionOptions = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



//session middldewares

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize()); // a middleware that initializes passport
app.use(passport.session()); // passport session middleware
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next()
})

// app.get("/demouser",async(req,res)=>{
//    let fakeUser = new User({
//     email:"fake@gmail.com",
//     username:"delta-student"
//    })

//    let registeredUser = await User.register(fakeUser,"helloworld")
//    res.send(registeredUser)
// })

// app.get("/",(req,res)=>{
//     res.send("hi im root")
// })

//middleware to route files
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500, message="somethind went wrong"} =err;
    res.status(statusCode).render("error.ejs",{err})
})
app.listen(8080,()=>{
    console.log("server is listening to port")
})