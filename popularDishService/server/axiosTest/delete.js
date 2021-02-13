const axios = require("axios");

const reviewId = "10000000";
const data = {
  userId: 69012,
};

axios
  .delete(`http://localhost:3001/review/${reviewId}`, { data })
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error delete"));
