const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: String,
  name_abbv: String,
  teamName: String,
  locationName: String,
  division: Object,
  conference: Object,
  franchise: Object,
  league: {type:String, default: 'NHL'},
  id: String,
  y_id: String,
  franchiseId: Number,
  active: Boolean
}, { timestamps: true });
const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
