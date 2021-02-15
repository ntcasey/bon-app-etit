const redis = require("redis");
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = "redis-cluster.lkiqyw.0001.use2.cache.amazonaws.com";
//const REDIS_HOST = "host.docker.internal";
//const client = redis.createClient(REDIS_PORT, REDIS_HOST);
const client = redis.createClient(REDIS_PORT);

client.on("connect", function () {
  console.log("connected to redis");
});

const getRestaurantCache = (req, res, next) => {
  const id = req.params.id;
  client.get(`restaurant${id}`, (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    if (data !== null) {
      res.json(data);
    } else {
      next();
    }
  });
};

const getReviewCache = (req, res, next) => {
  const id = req.params.id;
  client.get(`review${id}`, (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    if (data !== null) {
      res.json(data);
    } else {
      next();
    }
  });
};

const postReviewCache = (req, res, next) => {
  const { reviewId: id } = req.body;
  let strData = JSON.stringify(req.body);
  client.set(`review${id}`, strData, (err) => {
    console.log(err);
    if (!err) {
      console.log("entry added to cache");
      res.sendStatus(200);
    }
  });
  next();
};

const deleteReviewCache = (req, res, next) => {
  const id = req.params.id;
  req.deletedFromCache = false;
  client.del(`review${id}`, (err, response) => {
    if (response === 1) {
      console.log("entry removed cache");
      req.deletedFromCache = true;
      res.sendStatus(200);
    }
  });
  next();
};

module.exports = {
  client,
  getRestaurantCache,
  getReviewCache,
  postReviewCache,
  deleteReviewCache,
};
