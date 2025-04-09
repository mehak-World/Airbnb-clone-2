const express = require("express")
const router = express.Router({mergeParams: true});
const Review = require("../models/Review")
const {isLoggedIn, isAuthor} = require("../utils/middlewares");
const { createReview, deleteReview } = require("../controllers/review");


router.post("/", isLoggedIn, createReview)

router.post("/:review_id/delete", isLoggedIn, isAuthor, deleteReview)

module.exports =  router;