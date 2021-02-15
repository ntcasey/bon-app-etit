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

module.exports = {
  RestaurantSchema,
  ReviewSchema,
  UserSchema,
  CounterReviewsSchema,
};
