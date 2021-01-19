require("../newrelic");
const express = require("express");

const path = require("path");
const db = require("./db.js");
const compression = require("compression");
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
// app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(compression());

// Uncomment if you want to serve the bundle locally instead of S3
// app.get("/bundle.js", function (req, res) {
//   res.sendFile("../client/bundle.js", function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Sent: bundle.js");
//     }
//   });
// });
app.use(express.static(path.join(__dirname, "./loader-io")));
console.log(path.join(__dirname, "./loader-io"));

// GET RESTAURANT AND ALL DISH INFO
app.get("/restaurants/:id", function (req, res) {
  const params = req.params.id; // body has restaurantId
  db.queryRestaurant(params, (err, results) => {
    if (err) {
      console.log("error [get]: restaurant");
      res.sendStatus(404);
    } else {
      res.json(results);
    }
  });
});

// GET REVIEW
app.get("/restaurants/:id/dish/review/:id", function (req, res) {
  const params = req.params.id;
  db.queryReview(params, (err, results) => {
    if (err) {
      console.log("error [get]: review");
      res.sendStatus(404);
    } else {
      res.json(results);
    }
  });
});

app.post("/restaurants/:id/review", function (req, res) {
  let review = req.body;
  db.insertReview(review, (err) => {
    if (err) {
      console.log("error [post]: review");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete("/restaurants/:id/dish/review/:id", function (req, res) {
  let reviewId = req.params.id;
  db.deleteReview(reviewId, (err) => {
    if (err) {
      console.log("error [delete]: review");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.patch("/restaurants/:id/dish/review/:id", function (req, res) {
  let params = {
    reviewId: req.params.id,
    reviewUpdate: req.body,
  };
  db.updateReview(params, (err) => {
    if (err) {
      console.log("error [update]: review");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () => console.log("Listening on port: " + PORT));
