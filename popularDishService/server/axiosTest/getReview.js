const axios = require("axios");

const reviewId = "10000035";

axios
  .get(`http://localhost:3001/review/${reviewId}`)
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error"));
