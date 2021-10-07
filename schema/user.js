const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  yahooId: String,
  avatar: String,
  name: String,
  created_at: Date,
  access_token: String,
  refresh_token: String
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
