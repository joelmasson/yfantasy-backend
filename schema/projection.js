const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectionSchema = new Schema({
    y_player_id: String,
    name: String,
    projection: {
        name: String,
        value: String
    }
}, {timestamps: true});
const Projection = mongoose.model("Projection", ProjectionSchema);

module.exports = Projection;
