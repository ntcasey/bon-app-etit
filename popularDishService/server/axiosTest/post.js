const axios = require("axios");

const id = "1";
const review = {
  reviewId: 10000002,
  userReview: "Hello World",
  userReviewDate: "11/19/2019",
  userReviewRating: 5,
  userId: 2,
  dishId: 5,
  restaurantId: 1,
};

// POST
axios
  .post(`http://localhost:3001/restaurants/${id}/review`, review)
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error review"));
