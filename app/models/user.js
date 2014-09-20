var mongoose     = require('mongoose');

var db = mongoose.Connection;

// db.on('error', console.error);
// db.once('open', function() {
// 	var Schema       = mongoose.Schema;
// 	var UserSchema   = new Schema({
// 		username: String,
// 		password: String,
// 		email: String,
// 		description: String,
// 		Subscription: Array,
// 		Favourites: Array
// 	});

// 	module.exports = mongoose.model('User', UserSchema);
// });

// mongoose.connect('mongodb://');
