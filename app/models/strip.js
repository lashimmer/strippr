var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StripSchema   = new Schema({
	website: String,
	name: String,
	img: String,
	date: Date,
	description: String,
	title: String
});

module.exports = mongoose.model('Strip', StripSchema);