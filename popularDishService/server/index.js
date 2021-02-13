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

// GET RESTAURANT AND ALL DISH INFO
app.get("/restaurants/:id", function (req, res) {
  const data = req.params.id; // body has restaurantId
  db.queryRestaurant(data, (err, results) => {
    if (err) {
      console.log("error [get]: restaurant");
      res.sendStatus(404);
    } else {
      res.json(results);
    }
  });
});

app.get("/review/:revId", function (req, res) {
  const data = req.params.revId;
  db.queryReview(data, (err, results) => {
    if (err) {
      console.log("error [get]: review");
      res.sendStatus(404);
    } else {
      res.json(results);
    }
  });
});

app.post("/restaurants/:restId/dish/:dishId/review", function (req, res) {
  const { params, body } = req;
  const data = configureData("post", params, body);

  db.insertReview(data, (err) => {
    if (err) {
      console.log("error [post]: review");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete("/review/:revId", function (req, res) {
  const { params, body } = req;
  const data = configureData("delete", params, body);
  console.log(data);

  db.deleteReview(data, (err) => {
    if (err) {
      console.log("error [delete]: review");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

app.patch("/review/:revId", function (req, res) {
  const { params, body } = req;
  const data = configureData("patch", params, body);

  db.updateReview(data, (err) => {
    if (err) {
      console.log("error [update]: review");
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

function configureData(operation, params, body) {
  const { restId, dishId, revId } = params;
  let review, data;

  switch (operation) {
    case "post":
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
    case "delete":
      data = {
        userId: body.userId,
        reviewId: revId,
      };
      break;
    case "patch":
      data = {
        reviewId: Number(revId),
        reviewUpdate: body,
      };
      break;
  }
  return data;
}

app.listen(PORT, () => console.log("Listening on port: " + PORT));
