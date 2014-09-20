var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	username: String,
	password: String,
	email: String,
	description: String,
	Subscription: Array,
	Favourites: Array
});


module.exports = mongoose.model('User', UserSchema);