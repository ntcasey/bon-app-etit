const axios = require("axios");

const id = "1";
const reviewId = "1";

// GET
axios
  .get(`http://localhost:5000/restaurants/${id}/dish/review/${reviewId}`)
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error"));
