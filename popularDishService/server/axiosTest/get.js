const axios = require("axios");

const id = "1";
// GET
axios
  .get(`http://localhost:3001/restaurants/${id}`)
  .then((response) => {
    console.log("responses: ", response.data);
  })
  .catch((err) => console.log("error"));
