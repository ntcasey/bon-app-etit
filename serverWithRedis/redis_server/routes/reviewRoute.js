const express = require("express");
const router = express.Router();
const db = require("../db.js");
const {
  client,
  getReviewCache,
  postReviewCache,
  deleteReviewCache,
} = require("../cache/index.js");

router
  .route("/:id")
  .get(getReviewCache, (req, res) => {
    const id = req.params.id;
    db.queryReview(id)
      .then((data) => {
        let strData = JSON.stringify(data);
        client.set(`review${id}`, strData, (err) => {
          if (err) {
            console.log("err cache: review");
          } else {
            res.json(data);
          }
        });
      })
      .catch((err) => {
        console.log("error: get review");
        res.sendStatus(404);
      });
  })
  .delete(deleteReviewCache, (req, res) => {
    const id = req.params.id;
    db.deleteReview(id)
      .then(() => console.log("deleted entry from db"))
      .catch((err) => {
        console.log("error: delete review");
        res.sendStatus(404);
      });
  })
  .patch((req, res) => {
    const id = req.params.id;
    const review = req.body;
    db.updateReview(id, review)
      .then((data) => {
        let strData = JSON.stringify(data);
        client.set(`review${id}`, strData, (err) => {
          if (err) {
            console.log("error cache: update review");
          } else {
            res.sendStatus(200);
          }
        });
      })
      .catch((err) => {
        console.log("error: update review");
        res.sendStatus(404);
      });
  });

router.post("/", postReviewCache, (req, res) => {
  const review = req.body;
  db.insertReview(review)
    .then((data) => console.log("success: post to db"))
    .catch((err) => {
      console.log("error: post review");
      res.sendStatus(404);
    });
});

module.exports = router;
