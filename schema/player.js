const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    active: Boolean,
    currentTeamId: Number,
    eligible_positions: [{
        type: String
    }],
    firstName: String,
    fullName: String,
    image: String,
    lastName: String,
    league_abbr: String,
    nhl_player_id: Number,
    position_type: String,
    rookie: Number,
    team_name: String,
    team_name_abbr: String,
    uniform_number: String,
    y_player_id: String
}, {timestamps: true});
const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;
