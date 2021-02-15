//require("newrelic");
const express = require("express");
require("./cache/index.js");

const restaurantRoute = require("./routes/restaurantRoute.js");
// added t
const reviewRoute = require("./routes/reviewRoute.js");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, "./loader-io")));
app.use(express.json());

app.use("/restaurants", restaurantRoute);

// added t
app.use("/review", reviewRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
