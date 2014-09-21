var mongoose     = require('mongoose');

var db = mongoose.connection;

mongoose.connect('mongodb://107.170.28.199:27017/strippr');

var Schema       = mongoose.Schema;
var UserSchema   = new Schema({
	username: String,
	password: String,
	email: String,
	description: String,
	subscriptions: Array,
	favourites: Array
});

module.exports = mongoose.model('User', UserSchema);



