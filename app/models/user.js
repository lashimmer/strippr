var mongoose     = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
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
});

mongoose.connect('mongodb://107.170.28.199:27017/strippr');
