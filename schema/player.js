const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerStatsSchema = new Schema({
    'GAME':{ type: Number, default:0},
    'HIT':{ type: Number, default:0},
    'ON_ICE_HIT':{ type: Number, default:0}, 
    'HIT_AGAINST':{ type: Number, default:0},
    'ON_ICE_HIT_AGAINST':{ type: Number, default:0}, 
    '5_ON_4_HIT':{ type: Number, default:0}, 
    '5_ON_4_ON_ICE_HIT':{ type: Number, default:0},
    '5_ON_4_HIT_AGAINST':{ type: Number, default:0},
    '5_ON_4_ON_ICE_HIT_AGAINST':{ type: Number, default:0}, 
    '5_ON_3_HIT':{ type: Number, default:0},
    '5_ON_3_ON_ICE_HIT':{ type: Number, default:0}, 
    '5_ON_3_HIT_AGAINST':{ type: Number, default:0}, 
    '5_ON_3_ON_ICE_HIT_AGAINST':{ type: Number, default:0}, 
    '4_ON_5_HIT':{ type: Number, default:0},
    '4_ON_5_ON_ICE_HIT':{ type: Number, default:0},
    '4_ON_5_HIT_AGAINST':{ type: Number, default:0},
    '4_ON_5_ON_ICE_HIT_AGAINST':{ type: Number, default:0},
    '3_ON_5_HIT':{ type: Number, default:0}, 
    '3_ON_5_ON_ICE_HIT':{ type: Number, default:0},
    '3_ON_5_HIT_AGAINST':{ type: Number, default:0},
    '3_ON_5_ON_ICE_HIT_AGAINST':{ type: Number, default:0},
    'BLOCKED_SHOT':{ type: Number, default:0},
    'ON_ICE_BLOCKED_SHOT':{ type: Number, default:0},
    'SHOT_BLOCKED':{ type: Number, default:0},
    'ON_ICE_SHOT_BLOCKED':{ type: Number, default:0},
    '5_ON_4_BLOCKED_SHOT':{ type: Number, default:0},
    '5_ON_4_ON_ICE_BLOCKED_SHOT':{ type: Number, default:0},
    '5_ON_4_SHOT_BLOCKED':{ type: Number, default:0},
    '5_ON_4_ON_ICE_SHOT_BLOCKED':{ type: Number, default:0},
    '5_ON_3_BLOCKED_SHOT':{ type: Number, default:0},
    '5_ON_3_ON_ICE_BLOCKED_SHOT':{ type: Number, default:0},
    '5_ON_3_SHOT_BLOCKED':{ type: Number, default:0},
    '5_ON_3_ON_ICE_SHOT_BLOCKED':{ type: Number, default:0},
    '4_ON_5_BLOCKED_SHOT':{ type: Number, default:0},
    '4_ON_5_ON_ICE_BLOCKED_SHOT':{ type: Number, default:0},
    '4_ON_5_SHOT_BLOCKED':{ type: Number, default:0},
    '4_ON_5_ON_ICE_SHOT_BLOCKED':{ type: Number, default:0},
    '3_ON_5_BLOCKED_SHOT':{ type: Number, default:0},
    '3_ON_5_ON_ICE_BLOCKED_SHOT':{ type: Number, default:0},
    '3_ON_5_SHOT_BLOCKED':{ type: Number, default:0},
    '3_ON_5_ON_ICE_SHOT_BLOCKED':{ type: Number, default:0},
    'SHOT':{ type: Number, default:0},
    'SHOT_MISSED':{ type: Number, default:0},
    'ON_ICE_SHOT_MISSED':{ type: Number, default:0},
    'ON_ICE_MISSED_SHOT':{ type: Number, default:0},
    '5_ON_4_SHOT':{ type: Number, default:0},
    '5_ON_4_SHOT_MISSED':{ type: Number, default:0},
    '5_ON_4_ON_ICE_SHOT_MISSED':{ type: Number, default:0},
    '5_ON_4_ON_ICE_MISSED_SHOT':{ type: Number, default:0},
    '5_ON_3_SHOT':{ type: Number, default:0},
    '5_ON_3_SHOT_MISSED':{ type: Number, default:0},
    '5_ON_3_ON_ICE_SHOT_MISSED':{ type: Number, default:0},
    '5_ON_3_ON_ICE_MISSED_SHOT':{ type: Number, default:0},
    '4_ON_5_SHOT':{ type: Number, default:0},
    '4_ON_5_SHOT_MISSED':{ type: Number, default:0},
    '4_ON_5_ON_ICE_SHOT_MISSED':{ type: Number, default:0},
    '4_ON_5_ON_ICE_MISSED_SHOT':{ type: Number, default:0},
    '3_ON_5_SHOT':{ type: Number, default:0},
    '3_ON_5_SHOT_MISSED':{ type: Number, default:0},
    '3_ON_5_ON_ICE_SHOT_MISSED':{ type: Number, default:0},
    '3_ON_5_ON_ICE_MISSED_SHOT':{ type: Number, default:0},
    'ON_ICE_SHOT':{ type: Number, default:0},
    '5_ON_4_ON_ICE_SHOT':{ type: Number, default:0},
    '5_ON_3_ON_ICE_SHOT':{ type: Number, default:0},
    '4_ON_5_ON_ICE_SHOT':{ type: Number, default:0},
    '3_ON_5_ON_ICE_SHOT':{ type: Number, default:0},
    'SAVE':{ type: Number, default:0},
    '5_ON_4_SAVE':{ type: Number, default:0},
    '5_ON_3_SAVE':{ type: Number, default:0},
    '4_ON_5_SAVE':{ type: Number, default:0},
    '3_ON_5_SAVE':{ type: Number, default:0},
    'ON_ICE_SAVE':{ type: Number, default:0},
    '5_ON_4_ON_ICE_SAVE':{ type: Number, default:0},
    '5_ON_3_ON_ICE_SAVE':{ type: Number, default:0},
    '4_ON_5_ON_ICE_SAVE':{ type: Number, default:0},
    '3_ON_5_ON_ICE_SAVE':{ type: Number, default:0},
    'FACEOFF_WIN':{ type: Number, default:0},
    'ON_ICE_FACEOFF_WIN':{ type: Number, default:0},
    'FACEOFF_LOSS':{ type: Number, default:0},
    'ON_ICE_FACEOFF_LOSS':{ type: Number, default:0},
    '5_ON_4_FACEOFF_WIN':{ type: Number, default:0},
    '5_ON_4_ON_ICE_FACEOFF_WIN':{ type: Number, default:0},
    '5_ON_4_FACEOFF_LOSS':{ type: Number, default:0},
    '5_ON_4_ON_ICE_FACEOFF_LOSS':{ type: Number, default:0},
    '5_ON_3_FACEOFF_WIN':{ type: Number, default:0},
    '5_ON_3_ON_ICE_FACEOFF_WIN':{ type: Number, default:0},
    '5_ON_3_FACEOFF_LOSS':{ type: Number, default:0},
    '5_ON_3_ON_ICE_FACEOFF_LOSS':{ type: Number, default:0},
    '4_ON_5_FACEOFF_WIN':{ type: Number, default:0},
    '4_ON_5_ON_ICE_FACEOFF_WIN':{ type: Number, default:0},
    '4_ON_5_FACEOFF_LOSS':{ type: Number, default:0},
    '4_ON_5_ON_ICE_FACEOFF_LOSS':{ type: Number, default:0},
    '3_ON_5_FACEOFF_WIN':{ type: Number, default:0},
    '3_ON_5_ON_ICE_FACEOFF_WIN':{ type: Number, default:0},
    '3_ON_5_FACEOFF_LOSS':{ type: Number, default:0},
    '3_ON_5_ON_ICE_FACEOFF_LOSS':{ type: Number, default:0},
    'PENALTY_AGAINST':{ type: Number, default:0},
    'ON_ICE_PENALTY_AGAINST':{ type: Number, default:0},
    'PENALTY_FOR':{ type: Number, default:0},
    'ON_ICE_PENALTY_FOR':{ type: Number, default:0},
    '5_ON_4_PENALTY_AGAINST':{ type: Number, default:0},
    '5_ON_4_ON_ICE_PENALTY_AGAINST':{ type: Number, default:0},
    '5_ON_4_PENALTY_FOR':{ type: Number, default:0},
    '5_ON_4_ON_ICE_PENALTY_FOR':{ type: Number, default:0},
    '5_ON_3_PENALTY_AGAINST':{ type: Number, default:0},
    '5_ON_3_ON_ICE_PENALTY_AGAINST':{ type: Number, default:0},
    '5_ON_3_PENALTY_FOR':{ type: Number, default:0},
    '5_ON_3_ON_ICE_PENALTY_FOR':{ type: Number, default:0},
    'GOAL':{ type: Number, default:0},
    '5_ON_4_GOAL':{ type: Number, default:0},
    '5_ON_3_GOAL':{ type: Number, default:0},
    '4_ON_5_GOAL':{ type: Number, default:0},
    '3_ON_5_GOAL':{ type: Number, default:0},
    'ASSIST':{ type: Number, default:0},
    '5_ON_4_ASSIST':{ type: Number, default:0},
    'ASSIST':{ type: Number, default:0},
    'ASSIST':{ type: Number, default:0},
    'ASSIST':{ type: Number, default:0},
    'ASSIST_2':{ type: Number, default:0},
    '5_ON_4_ASSIST_2':{ type: Number, default:0},
    'ASSIST_2':{ type: Number, default:0},
    'ASSIST_2':{ type: Number, default:0},
    'ON_ICE_GOAL':{ type: Number, default:0},
    'GOAL_ALLOWED':{ type: Number, default:0},
    'ON_ICE_GOAL_ALLOWED':{ type: Number, default:0},
    '5_ON_4_ON_ICE_GOAL':{ type: Number, default:0},
    '5_ON_4_GOAL_ALLOWED':{ type: Number, default:0},
    '5_ON_4_ON_ICE_GOAL_ALLOWED':{ type: Number, default:0},
    '5_ON_3_ON_ICE_GOAL':{ type: Number, default:0},
    '5_ON_3_GOAL_ALLOWED':{ type: Number, default:0},
    '5_ON_3_ON_ICE_GOAL_ALLOWED':{ type: Number, default:0},
    '4_ON_5_ON_ICE_GOAL':{ type: Number, default:0},
    '4_ON_5_GOAL_ALLOWED':{ type: Number, default:0},
    '4_ON_5_ON_ICE_GOAL_ALLOWED':{ type: Number, default:0},
    '3_ON_5_ON_ICE_GOAL':{ type: Number, default:0},
    '3_ON_5_GOAL_ALLOWED':{ type: Number, default:0},
    '3_ON_5_ON_ICE_GOAL_ALLOWED':{ type: Number, default:0},
    'TAKEAWAY':{ type: Number, default:0},
    'ON_ICE_TAKEAWAY':{ type: Number, default:0},
    '5_ON_4_TAKEAWAY':{ type: Number, default:0},
    '5_ON_4_ON_ICE_TAKEAWAY':{ type: Number, default:0},
    '5_ON_3_TAKEAWAY':{ type: Number, default:0},
    '5_ON_3_ON_ICE_TAKEAWAY':{ type: Number, default:0},
    '4_ON_5_TAKEAWAY':{ type: Number, default:0},
    '4_ON_5_ON_ICE_TAKEAWAY':{ type: Number, default:0},
    '3_ON_5_TAKEAWAY':{ type: Number, default:0},
    '3_ON_5_ON_ICE_TAKEAWAY':{ type: Number, default:0},
    'GIVEAWAY':{ type: Number, default:0},
    'ON_ICE_GIVEAWAY':{ type: Number, default:0},
    '5_ON_4_GIVEAWAY':{ type: Number, default:0},
    '5_ON_4_ON_ICE_GIVEAWAY':{ type: Number, default:0},
    '5_ON_3_GIVEAWAY':{ type: Number, default:0},
    '5_ON_3_ON_ICE_GIVEAWAY':{ type: Number, default:0},
    '4_ON_5_GIVEAWAY':{ type: Number, default:0},
    '4_ON_5_ON_ICE_GIVEAWAY':{ type: Number, default:0},
    '3_ON_5_GIVEAWAY':{ type: Number, default:0},
    '3_ON_5_ON_ICE_GIVEAWAY':{ type: Number, default:0},
    'ON_ICE_OFFSIDE':{ type: Number, default:0},
    'ON_ICE_ICING':{ type: Number, default:0},
    'ON_ICE_PUCK_OUT_OF_PLAY':{ type: Number, default:0},
    '5_ON_4_ON_ICE_OFFSIDE':{ type: Number, default:0},
    '5_ON_4_ON_ICE_ICING':{ type: Number, default:0},
    '5_ON_4_ON_ICE_PUCK_OUT_OF_PLAY':{ type: Number, default:0},
    '5_ON_3_ON_ICE_OFFSIDE':{ type: Number, default:0},
    '5_ON_3_ON_ICE_ICING':{ type: Number, default:0},
    '5_ON_3_ON_ICE_PUCK_OUT_OF_PLAY':{ type: Number, default:0},
    '4_ON_5_ON_ICE_OFFSIDE':{ type: Number, default:0},
    '4_ON_5_ON_ICE_ICING':{ type: Number, default:0},
    '4_ON_5_ON_ICE_PUCK_OUT_OF_PLAY':{ type: Number, default:0},
    '3_ON_5_ON_ICE_OFFSIDE':{ type: Number, default:0},
    '3_ON_5_ON_ICE_ICING':{ type: Number, default:0},
    '3_ON_5_ON_ICE_PUCK_OUT_OF_PLAY':{ type: Number, default:0},
    'SHOOTOUT_GOAL':{ type: Number, default:0},
    'SHOOTOUT_GOAL_ALLOWED':{ type: Number, default:0},
    'SHOOTOUT_SHOT':{ type: Number, default:0},
    'SHOOTOUT_SAVE':{ type: Number, default:0},
    'SHOOTOUT_MISS':{ type: Number, default:0},
    'SHOOTOUT_ON_ICE_MISS':{ type: Number, default:0},
    'CORSI_FOR': { type: Number, default:0},
    'CORSI_AGAINST': { type: Number, default:0},
    'PLUS_MINUS': { type: Number, default:0},
    'GAME_SCORE': { type: Number, default:0},
    'TOI': String
})

const PlayerSchema = new Schema({
    active: Boolean,
    currentTeamId: Number,
    eligible_positions: [{
        type: String
    }],
    fantasyTeamId: String,
    firstName: String,
    fullName: String,
    image: String,
    lastName: String,
    league_abbr: String,
    nhl_player_id: Number,
    position_type: String,
    rookie: Boolean,
    stats: [{
        coverage_type: String, //Season
        coverage_value: Number, // 20202021
        stats: PlayerStatsSchema,
    }],
    team_name: String,
    team_name_abbr: String,
    uniform_number: String,
    y_player_id: String
}, {timestamps: true});
const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;
