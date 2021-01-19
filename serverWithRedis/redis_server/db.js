const mongoose = require("mongoose");
//const DB_URL = "popDishUser:asdfjda;sdfmongo1245@3.12.241.156:27017";
const DB_URL = "localhost";
const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  poolSize: 1,
};
mongoose.connect(
  `mongodb://${DB_URL}/seedDB`,
  connectionOptions,
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

const queryRestaurant = async (id, callback) => {
  try {
    let rest = await Restaurants.find({ restaurantId: Number(id) }).limit(1);
    let popularDishesArr = rest[0].popularDishes;
    var popularDishesReturn = [];

    for (let i = 0; i < popularDishesArr.length; i++) {
      // get reviewId array so that we can query review table
      let currentDish = popularDishesArr[i];
      let reviews = await Reviews.find({
        dishId: currentDish.dishId,
      }).limit(8);

      // here we have the review list for the dish,
      // now we need to get the user with userId in the review
      // list.
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

const queryReview = async (id) => {
  const stat = await Reviews.find({ reviewId: Number(id) }).limit(1);

  return new Promise((resolve, reject) => {
    if (stat.length === 0) {
      reject("error");
    } else {
      resolve(stat[0]);
    }
  });
};

const insertReview = async (params) => {
  const stat = await Reviews.collection.insertOne(params);
  return new Promise((resolve, reject) => {
    if (stat.insertedCount === 0) {
      reject("error");
    } else {
      resolve(stat.ops[0]);
    }
  });
};

const deleteReview = async (id) => {
  const stat = await Reviews.deleteOne({ reviewId: Number(id) });
  return new Promise((resolve, reject) => {
    if (stat.deletedCount === 0) {
      reject("error");
    } else {
      resolve();
    }
  });
};

const updateReview = async (id, review) => {
  const newDocument = await Reviews.findOneAndUpdate(
    { reviewId: Number(id) },
    { $set: review },
    { new: true }
  );

  return new Promise((resolve, reject) => {
    if (newDocument === null) {
      reject("error");
    } else {
      resolve(newDocument);
    }
  });
};

module.exports = {
  queryRestaurant,
  queryReview,
  updateReview,
  insertReview,
  deleteReview,
};
