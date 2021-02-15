const express = require("express");
const router = express.Router();
const db = require("../db.js");
const reviewRouter = require("./reviewRoute.js");
const { client, getRestaurantCache } = require("../cache/index.js");

router.use("/:restId/dish/:dishId/review", reviewRouter);

router.get("/:id", getRestaurantCache, (req, res) => {
  const id = req.params.id;
  db.queryRestaurant(id, (err, data) => {
    if (err) {
      console.log("error: get restaurant");
      res.sendStatus(404);
    } else {
      let strData = JSON.stringify(data);
      client.set(`restaurant${id}`, strData, (err) => {
        if (err) console.log("err cache: restaurant");
      });
      res.json(data);
    }
  });
});

module.exports = router;
