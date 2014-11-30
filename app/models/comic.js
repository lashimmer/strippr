var mongoose     = require('mongoose');

var db = mongoose.connection;

var Schema       = mongoose.Schema;

var ComicSchema   = new Schema({
	website: String,
	trunc: String,
	name: String,
	author: String,
	description: String,
	archive: String,
});

module.exports = mongoose.model('Comic', ComicSchema);
