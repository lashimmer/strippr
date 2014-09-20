var mongoose     = require('mongoose');

var db = mongoose.connection;

var Schema       = mongoose.Schema;

var StripSchema   = new Schema({
	comic: String,
	img: String,
	date: Date,
	description: String,
	title: String,
	link: String
});

module.exports = mongoose.model('Strip', StripSchema);
