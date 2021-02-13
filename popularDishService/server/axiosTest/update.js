const axios = require("axios");

const revId = "10000035";
const updateReview = {
  userReview: "Hello & Goodbye",
};

axios
  .patch(`http://localhost:3001/review/${revId}`, updateReview)
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error updating"));
