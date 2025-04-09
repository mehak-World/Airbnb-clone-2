const Listing = require("../models/Listing.js");
const ExpressError = require("../errors/ExpressError.js")

module.exports.newGet = async (req, res) => {
    res.render("listings/new")
  }

module.exports.newPost = async (req, res, next) => {
    try {
      const {name, price, city, country} = req.body;
      console.log(req.body);
      const listing = new Listing({name, price, city, country, image: {url: req.file.path, filename: req.file.filename}});
      listing.owner = req.user._id;
      await listing.save();
      req.flash("success", "New Listing has been created");
      res.redirect("/");
     } catch (err) {
        req.flash("Error", "New Listing not created");
        next(err);
     }

 
  }

module.exports.show = async (req, res, next) => {
    const id = req.params.id;
    try{
      const listing = await Listing.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author', // Populate the 'author' field in each review
        },
    }).populate("owner")

    console.log("Listing: " , listing)
    const city = listing.city;
    const country = listing.country;

    const data = await fetch("https://nominatim.openstreetmap.org/search?q=" + city + "," + country + "&format=json");
    const coord_data = await data.json();
    let lat, lon;
    if (coord_data.length > 0) {
        lat = coord_data[0].lat;
        lon = coord_data[0].lon;
        console.log({ lat, lon });
    } else {
        throw new Error("Coordinates not found for the given location.");
    }
    

      if(!listing){
        req.flash("error", "Listing you requested does not exist")
        res.redirect("/")
      }
      console.log(listing);
      console.log(lat)
      console.log(lon)
      res.render("listings/show.ejs", {listing, lat, lon})
    }
  
    catch(err){
      next(err)
      // next(new ExpressError(400, "Bad Request"))
    }
    
  }

  module.exports.getEdit = async (req, res, next) => {
    try{
      const id = req.params.id;
      const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error", "Listing you requested does not exist")
        res.redirect("/")
      }
      res.render("listings/edit.ejs", {listing})
    }
  
    catch(err){
      next(new ExpressError(err.status, err.message))
    }
   
  }

  // module.exports.postEdit = async (req, res, next) => {
  
  //   try{
  //     const id = req.params.id;
  //     const {name, price, city, country} = req.body;
  //     console.log(req.file);
  //     if(req.file == undefined){
  //       const newDoc = await Listing.findByIdAndUpdate(id, {name, price, city, country}, {new: true, runValidators: true});
  //     }
  //     else{
  //       const newDoc = await Listing.findByIdAndUpdate(id, {name, price, city, country, image: {url: req.file.path, filename: req.file.filename}}, {new: true, runValidators: true});
  //     }
      
  //     req.flash("success", "Listing has been edited");
  //     res.redirect("/listings/" + id);
  //   }
  
  //   catch(err){
  //       req.flash("error", "Listing could not be edited");
  //     next(new ExpressError(err.status, err.message))
  //   }
   
  
  // }


  const cloudinary = require("cloudinary").v2;

module.exports.postEdit = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, price, city, country } = req.body;

    // Find the existing listing
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/");
    }

    console.log("req.file: ", req.file);
    // Handle image update if a new file is uploaded
    if (req.file) {
      // Delete the old image from Cloudinary
      if (listing.image && listing.image.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename);
        } catch (err) {
          console.error("Error deleting old image on Cloudinary:", err);
        }
      }

      // Update the image field with the new image details
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    // Update other fields
    listing.name = name;
    listing.price = price;
    listing.city = city;
    listing.country = country;

    // Save the updated listing
    await listing.save();

    req.flash("success", "Listing has been updated");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Listing could not be updated");
    next(new ExpressError(err.status || 500, err.message || "Internal Server Error"));
  }
};


  module.exports.Postdelete = async (req, res, next) => {
    try{
      const id = req.params.id;
      const deletedListing = await Listing.findByIdAndDelete(id).populate('reviews');
      console.log(deletedListing);
      for(let review of deletedListing.reviews){
        let deletedReview = await Review.findByIdAndDelete(review._id);
        console.log(deletedReview);
      }
      req.flash("success", "Listing has been deleted");
      res.redirect("/");
    }
  
    catch(err){
        req.flash("Error", "Listing could not br deleted");
      next(new ExpressError(err.status, err.message))
    }
   
  }