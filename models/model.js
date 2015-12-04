var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// For running locally
if (!(process.env.MONGO_KEY)) {
	require('../env.js');
}

mongoose.connect(process.env.MONGO_KEY);

//-- Schemas --//

var Comment = new Schema({
    date: { type: Date, default: Date.now },
    text: String,
    rating: Number,
    vote: Number,
    user: {type: String, default: 'Anonymous'}
});


var Nade = new Schema({
    type: String,
    rating: Number,
    link: String,
    team: String,
    title: String,
    box: Number
});


var Map = new Schema({
    name: String,
    tag: String,
    type: String,
    nades: [Nade]
});

//-- Methods --//


//-- Models --//

var MapModel = mongoose.model('Map', Map);

// make this available to our users in our Node applications
module.exports = MapModel;

