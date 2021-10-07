const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeasonSchema = new Schema({
    name: String,
    game_key: String,
    dates: [{
        date: String,
        games: [
            {
                gamePk: Number,
                gameDate: Number
            }
        ]
    }],
    lastGameDayPlayed: String,
    startDate: String,
    playbyplays: [String]
}, { timestamps: true });
const Season = mongoose.model('Season', SeasonSchema);

module.exports = Season;
