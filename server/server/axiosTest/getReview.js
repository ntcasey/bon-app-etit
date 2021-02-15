const axios = require("axios");

const reviewId = "10000041";

axios
  .get(`http://localhost:3001/review/${reviewId}`)
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error"));
