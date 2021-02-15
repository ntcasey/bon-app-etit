const axios = require("axios");

const restId = "1";
const dishId = 5;
const review = {
  userReview: "Hello World",
  userReviewDate: "11/19/2019",
  userReviewRating: 5,
  userId: 69012,
};

axios
  .post(
    `http://localhost:3001/restaurants/${restId}/dish/${dishId}/review`,
    review
  )
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error review"));
