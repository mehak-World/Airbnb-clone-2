const express = require("express")
const router = express.Router();
const Listing = require("../models/Listing")
const Review = require("../models/Review")
const validationSchema = require("../schemaValidation")
const ExpressError = require("../errors/ExpressError")
const {isLoggedIn, isOwner} = require("../utils/middlewares");
const { newGet, newPost, show, getEdit, postEdit,  Postdelete } = require("../controllers/listings");
const multer  = require('multer')
const {storage, cloudinary} = require("../cloudConfig")
const upload = multer({ storage: storage })

const validateSchema = (req, res, next) => {
    const {result, error} = validationSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((err) => err.message).join(",")
      next(new ExpressError(400, errMsg))
    }
    
    else{
      next();
    }
  }

  

  router.get("/new", isLoggedIn, newGet)

  router.post("/",isLoggedIn, upload.single('image'), validateSchema, newPost);
  
  router.get("/:id", show)
  
  router.route("/edit/:id")
  .get(isLoggedIn, isOwner, getEdit)
  .post(isLoggedIn, isOwner, upload.single('image'), validateSchema, postEdit)

  router.post("/:id/delete", isLoggedIn, isOwner,  Postdelete)

  module.exports = router;