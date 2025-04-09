const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    rating: {
        type: String,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String
    },

   created_at:{
    type: Date,
    default: Date.now()
   },

   author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }
})

module.exports=mongoose.model("Review" , reviewSchema)