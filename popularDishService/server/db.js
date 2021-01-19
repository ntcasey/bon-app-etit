const mongoose = require("mongoose");
//const DB_URL = "18.216.103.71:27017";
const DB_URL = "popDishUser:asdfjda;sdfmongo1245@3.12.241.156:27017";
mongoose.connect(
  `mongodb://${DB_URL}/seedDB`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
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

const Restaurants = mongoose.model("Restaurants", RestaurantSchema);
const Reviews = mongoose.model("Reviews", ReviewSchema);
const Users = mongoose.model("Users", UserSchema);

const queryRestaurant = async (params, callback) => {
  try {
    let rest = await Restaurants.find({ restaurantId: Number(params) }).limit(
      1
    );
    let popularDishesArr = rest[0].popularDishes;
    var popularDishesReturn = [];

    for (let i = 0; i < popularDishesArr.length; i++) {
      // get reviewId array to can query review table
      let currentDish = popularDishesArr[i];
      let reviews = await Reviews.find({
        dishId: currentDish.dishId,
      }).limit(8);

      // have review list for the dish,
      // get the user with userId in the review list.
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
    console.log("Error Reading DB", err);
    callback(err);
  }

  callback(null, popularDishesReturn);
};

const queryReview = async (id, callback) => {
  const stat = await Reviews.find({ reviewId: Number(id) }).limit(1);
  if (stat.length === 0) {
    callback("error");
  } else {
    callback(null, stat[0]);
  }
};

const insertReview = async (params, callback) => {
  const stat = await Reviews.collection.insertOne(params);
  if (stat.insertedCount === 0) {
    callback("error");
  } else {
    callback(null);
  }
};

const deleteReview = async (params, callback) => {
  const stat = await Reviews.deleteOne({ reviewId: Number(params) });
  console.log("count delete:", stat);
  if (stat.deletedCount === 0) {
    callback("error");
  } else {
    callback(null);
  }
};

const updateReview = async (params, callback) => {
  console.log("params ", params);

  const stat = await Reviews.update(
    { reviewId: Number(params.reviewId) },
    { $set: params.reviewUpdate }
  );

  if (stat.nModified === 0) {
    callback("error");
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
