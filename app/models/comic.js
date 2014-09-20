var mongoose     = require('mongoose');

var db = mongoose.connection;

var Schema       = mongoose.Schema;

var ComicSchema   = new Schema({
	website: String,
	name: String,
	author: String,
	description: String,
});

module.exports = mongoose.model('Comic', ComicSchema);
