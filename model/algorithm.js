const mongoose = require("mongoose");

/*
type
ref
required
default
enum
*/
const tpcSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subtopic: [String],
});

const algoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    topics: {
        type: [mongoose.Types.ObjectId],
        ref: "Topic",
    },
});

const Algo = mongoose.model('Algo', algoSchema);
const Topic = mongoose.model('Topic', tpcSchema);

module.exports = {Algo, Topic};