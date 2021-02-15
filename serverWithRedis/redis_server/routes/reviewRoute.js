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
  .route("/:revId")
  .all((req, res, next) => {
    const { method, params, body } = req;
    req.data = configureData(method, params, body);
    next();
  })
  .get(getReviewCache, (req, res) => {
    const id = req.params.revId;
    db.queryReview(id)
      .then((data) => {
        console.log("datta ", data);
        let strData = JSON.stringify(data);
        client.set(`review${data.reviewId}`, strData, (err) => {
          if (err) {
            console.log("err cache: review");
          } else {
            res.json(data);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(404);
      });
  })
  .delete(deleteReviewCache, (req, res) => {
    const { data } = req;
    db.deleteReview(data)
      .then(() => {
        console.log("deleted entry from db");
        if (!req.deletedFromCache) {
          req.sendStatus(200);
        }
      })
      .catch((err) => {
        console.log("error: delete review");
        res.sendStatus(404);
      });
  })
  .patch((req, res) => {
    const { data } = req;
    db.updateReview(data)
      .then((updateData) => {
        //console.log("dddata: ", data);
        let strData = JSON.stringify(updateData);
        client.set(`review${updateData.reviewId}`, strData, (err) => {
          if (err) {
            console.log("error cache: update review");
          } else {
            console.log("success: update review");
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
  const { method, params, body } = req;
  const data = configureData(method, params, body);
  db.insertReview(data)
    .then(() => console.log("success: post to db"))
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

function configureData(operation, params, body) {
  const { restId, dishId, revId } = params;
  let review, data;

  switch (operation) {
    case "POST":
      review = {
        ...body,
        restaurantId: Number(restId),
        dishId: Number(dishId),
      };
      data = {
        review,
        userId: body.userId,
      };
      break;
    case "DELETE":
      data = {
        userId: body.userId,
        reviewId: revId,
      };
      break;
    case "PATCH":
      data = {
        reviewId: Number(revId),
        reviewUpdate: body,
      };
      break;
    default:
      data = {};
  }
  return data;
}

module.exports = router;
