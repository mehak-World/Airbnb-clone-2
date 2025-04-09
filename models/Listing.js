const mongoose = require("mongoose");

const listingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
      url: String,
      filename: String
  },
  price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [{
     type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
