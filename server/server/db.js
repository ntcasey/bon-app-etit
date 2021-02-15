const mongoose = require("mongoose");
//const DB_URL = "popDishUser:asdfjda;sdfmongo1245@3.12.241.156:27017";
const DB_URL = "localhost";
mongoose.connect(
  `mongodb://${DB_URL}/seedDB`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  function (err) {
    if (err) {
      console.log("unable to connect to db: " + err);
    } else {
      console.log("connected to db");
    }
  }
);
const db = mongoose.connection;

const RestaurantSchema = new mongoose.Schema({
  restaurantname: String,
  popularDishes: Array,
});

const ReviewSchema = new mongoose.Schema({
  reviewId: Number,
  userReview: String,
  userReviewDate: Date,
  userReviewRating: Number,
  userId: Number,
  dishId: Number,
  restaurantId: Number,
});

const UserSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  usernamePhotoURL: String,
  userFriendsCount: Number,
  userReviewsCount: Number,
});

const CounterReviewsSchema = new mongoose.Schema({
  size: Number,
});

const Restaurants = mongoose.model("Restaurants", RestaurantSchema);
const Reviews = mongoose.model("Reviews", ReviewSchema);
const Users = mongoose.model("Users", UserSchema, "users");
const CounterReviews = mongoose.model(
  "CounterReviews",
  CounterReviewsSchema,
  "sizeReviews"
);

/**
 * Queries Restaurant's Popular Dishes & Reviews
 * @param {object} params : {Restaurant's ID}
 * @param {Function} callback
 */
const queryRestaurant = async (params, callback) => {
  try {
    let rest = await Restaurants.find({ restaurantId: Number(params) }).limit(
      1
    );
    let popularDishesArr = rest[0].popularDishes;
    var popularDishesReturn = [];

    for (let i = 0; i < popularDishesArr.length; i++) {
      let currentDish = popularDishesArr[i];
      let reviews = await Reviews.find({
        dishId: currentDish.dishId,
      }).limit(8);

      delete currentDish.reviewsId;

      let tempPopularDishObj = {};
      tempPopularDishObj.dishInfo = currentDish;
      let users = [];

      let currentUser;
      for (let i = 0; i < reviews.length; i++) {
        currentUser = await Users.find({
          userId: reviews[i].userId,
        }).limit(1);

        users.push(currentUser[0]);
      }
      tempPopularDishObj.users = users;
      tempPopularDishObj.reviews = reviews;
      popularDishesReturn.push(tempPopularDishObj);
    }
  } catch (err) {
    callback("ERROR: Get Restaurant From Database");
  }

  callback(null, popularDishesReturn);
};

/**
 * Get Review of Restaurant given Review ID
 * @param {object} params : Review ID
 * @param {Function} callback
 */
const queryReview = async (id, callback) => {
  const stat = await Reviews.find({ reviewId: Number(id) }).limit(1);
  if (stat.length === 0) {
    callback("ERROR: Get Review To Database");
  } else {
    callback(null, stat[0]);
  }
};

/**
 * Insert Review of Restaurant into Mongo Database
 * @param {object} data : { User ID, Review ID }
 * @param {Function} callback
 */
const insertReview = async (data, callback) => {
  const { userId, review } = data;
  try {
    await Users.findOneAndUpdate(
      { userId: userId },
      { $inc: { userReviewsCount: 1 } }
    );
    const counter = await CounterReviews.findOneAndUpdate(
      {},
      { $inc: { size: 1 } },
      { new: true }
    );
    review.reviewId = counter.size;
    const stat = await Reviews.collection.insertOne(review);
    if (stat.insertedCount === 0) {
      callback("ERROR: Insert To Database");
    } else {
      callback(null);
    }
  } catch (e) {
    callback("ERROR: Increment User Review Count or Increment Counter");
  }
};

/**
 * Delete Review of Restaurant in Mongo Database
 * @param {object} data : { User ID, Review ID }
 * @param {Function} callback
 */
const deleteReview = async (data, callback) => {
  const { userId, reviewId } = data;
  try {
    await Users.findOneAndUpdate(
      { userId: userId },
      { $inc: { userReviewsCount: -1 } }
    );

    const stat = await Reviews.deleteOne({ reviewId: Number(reviewId) });
    if (stat.deletedCount === 0) {
      callback("ERROR: Delete Review From Database");
    } else {
      callback(null);
    }
  } catch (e) {
    callback("ERROR: Decrement User Review Count");
  }
};

/**
 * Update Review of Restaurant in Mongo Database
 * @param {object} data : { Review ID, New Review Message }
 * @param {Function} callback
 */
const updateReview = async (data, callback) => {
  const { reviewId, reviewUpdate } = data;
  const stat = await Reviews.update(
    { reviewId: Number(reviewId) },
    { $set: reviewUpdate }
  );

  if (stat.nModified === 0) {
    callback("ERROR: Update Review In Database");
  } else {
    callback(null);
  }
};

module.exports = {
  queryRestaurant,
  queryReview,
  updateReview,
  insertReview,
  deleteReview,
};
