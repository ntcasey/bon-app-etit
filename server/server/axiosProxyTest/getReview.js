const path = require("path");
const axios = require("axios");

const id = '1';
const reviewId = '5000000';
const patchId = '10000005'
var review = {
  reviewId: 10000005,
  userReview: "Hello World",
  userReviewDate: "11/19/2019",
  userReviewRating: 5,
  userId: 2,
  dishId: 5,
  restaurantId: 1
};

var updateReview = {
  userReview: "Hello & Goodbye",
};

// GET
axios
  .get(`http://localhost:3000/restaurants/${id}/dish/review/${reviewId}`)
  .then(response => {
    console.log('responses: ', response.data);
  })
  .catch(err => console.log('error'));

