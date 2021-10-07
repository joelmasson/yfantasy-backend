const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: String,
  game_keys: [{
    type: String
}]
}, {timestamps: true});
const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
