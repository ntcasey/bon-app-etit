const axios = require("axios");

const id = "1";
const reviewId = "10000002";

// DELETE
axios
  .delete(`http://localhost:3001/restaurants/${id}/dish/review/${reviewId}`)
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error delete"));
