
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Event = new Schema({
    gamePk: Number, // unique id provided by nhl apis
    gameType: String, // indicating regular, playoff, allstar or pre-season
    idx: Number, // the underlying event idx provided by the nhl apis
    playTime: Number, // an integer value representing the seconds elapsed since the start of the game, starting at 0
    type: String, // The type of event occuring. See below for full list of event types
    playerId: Number, // unique id provided by nhl apis
    playerType: String,
    playerHandedness: String,
    isHome: Boolean,
    teamId: Number, // unique id provided by nhl apis
    opposingTeamId: Number,  // unique id provided by nhl apis
    teamScore: Number, // score when event occured
    opposingTeamScore: Number, // score when event occured
    teamStrength: Number, // strength of play when event occured
    opposingStrength: Number, // strength of play when event occured
    players: [Number], // ids of teammates on ice when event occured
    opposingPlayers: [Number], // ids of opposing players on ice when event occured
    zone: String,
    x: Number, // x coordinate on ice where event occured
    y: Number, // y coordinate on ice  where event occured
    secondaryType: String, // additional info about event
})

const PlayByPlaySchema = new Schema({
    game_key: String,
    timestamp: String,
    gamePk: String,
    homeId: Boolean,
    awayId: Number,
    homeScore: Number,
    awayScore: Number,
    goalieDecisionId: Number, // the unique id of the goalie who recieved the decision
    homeGoalieStartId: Number, // the unique id of the goalie who recieved the start
    awayGoalieStartId: Number, // the unique id of the goalie who recieved the start
    homePlayers: [Number],
    awayPlayers: [Number],
    events:[{
        type: Event
    }]
}, { timestamps: true })
const PlayByPlay = mongoose.model('PlayByPlay', PlayByPlaySchema)

module.exports = PlayByPlay
