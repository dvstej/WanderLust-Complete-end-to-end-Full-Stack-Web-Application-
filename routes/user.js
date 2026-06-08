const express= require("express");
const router = express.Router();
const User= require("../models/user.js")
const wrapAsync= require("../utils/wrapAsync")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")

const userController=require("../controllers/users.js")

router.route("/signup")
   //signup form
   .get(userController.renderSignupForm)
   //signup post
   .post(wrapAsync(userController.signup))


router.route("/login")
    //login form
    .get(userController.renderLoginForm)
    //login post to db 
    .post(saveRedirectUrl ,
       passport.authenticate("local",
        {failureRedirect: "/login",
          failureFlash:true}),
          wrapAsync(userController.login)
        )

//logout
router.get("/logout",userController.logout)

module.exports=router;