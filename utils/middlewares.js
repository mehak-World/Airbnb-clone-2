const Listing = require("../models/Listing")
const Review = require("../models/Review")

const isLoggedIn = (req, res, next) => {
console.log(req.isAuthenticated())
  if(req.isAuthenticated()){
      next()
  }
  else{
    req.flash("error", "You are not logged in")
    res.redirect("/user/login")
  }
}


const isAuthor = async (req, res, next) => {
    const logged_in_user = req.user;
    console.log("Logged in user: ", logged_in_user)
    const {listing_id, review_id} = req.params;
    const review = await Review.findById(review_id).populate('author');
    if(review.author){
        const author = review.author;
        console.log("Author: ", author)
        if(author.id == logged_in_user.id){
            next()
        }
    
        else{
            req.flash("error", "You do not own this review");
            res.redirect("/listings/" + listing_id);
        }
    }

    else{
        next();
    }
   
}

const isOwner = async (req, res, next) => {
    const logged_in_user = req.user;
    console.log("Logged in user: ", logged_in_user)
    const {id} = req.params;
    const listing = await Listing.findById(id).populate('owner');
    if(listing.owner){
        const owner = listing.owner;
        console.log("Owner: ", owner)
        if(owner.id == logged_in_user.id){
            next()
        }
    
        else{
            req.flash("error", "You do not own this listing");
            res.redirect("/listings/" + id);
        }
    }

    else{
        next()
    }
   
}

module.exports = {isLoggedIn, isAuthor, isOwner}
