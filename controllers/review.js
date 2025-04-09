const Listing = require("../models/Listing")
const Review = require("../models/Review")

module.exports.createReview = async (req, res) => {
    console.log(req.body);
    const listing_id = req.params.listing_id;

    const {rating, comment} =req.body;

    const listing = await Listing.findById(listing_id);
    const newReview = new Review(req.body);
    console.log(req.user);
    newReview.author = req.user;
    const addedReview = await newReview.save();
    listing.reviews.push(addedReview._id);
    modifiedListing = await listing.save()
    console.log(addedReview);
    console.log(modifiedListing);
    req.flash("success", "New Review created")
    res.redirect("/listings/" + listing.id);
}

module.exports.deleteReview = async (req, res) => {
    const {listing_id, review_id} = req.params;
    const listing = await Listing.findById(listing_id);
    const deletedReview = await Review.findByIdAndDelete(review_id);
    console.log(deletedReview)
    listing.reviews.remove(deletedReview._id);
    const modifiedReview = await listing.save();
    req.flash("success", "Review has been deleted")
    res.redirect("/listings/" + listing_id);
  }