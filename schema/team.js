const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: String,
  updated_at: Date,
  created_at: Date,
  players: Array
});
const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
