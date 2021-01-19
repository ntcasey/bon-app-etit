require("newrelic");
const express = require("express");
require("./cache/index.js");

const restaurantRoute = require("./routes/restaurantRoute.js");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, "./loader-io")));
app.use(express.json());

app.use("/restaurants", restaurantRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
