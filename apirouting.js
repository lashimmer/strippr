
// add references to models
var User     = require('./app/models/user');
var Comic     = require('./app/models/comic');
var Strip     = require('./app/models/strip');

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

var router = express.Router();
// routing to users
router.route('/api/users')

	// create users
	.post(function(req, res) {
		console.dir(req);	
		var user = new User(); 		// create a new instance of the Bear model
		user.username = req.body.username;  // set the bears name (comes from the request)
		user.password = req.body.password;
		user.email = req.body.email;
		user.description = req.body.description;
		user.subscriptions = req.body.subscriptions;
		user.favourites = req.body.favourites;


		//save the bear and check for errors
		user.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'User created!' });
		})
		
	 })

	// get users
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);
			res.json(users);
		});
	});

router.route('/api/users/:username')
	.get(function(req, res) {
		User.find( { username: req.params.username }, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
	});
});

router.route('/api/strips')

	// create users
	.post(function(req, res) {
		console.dir(req);	
		var strip = new Strip(); 		// create a new instance of the Bear model
		strip.link = req.body.link;
		strip.img = req.body.img;
		strip.date = req.body.date;
		strip.description = req.body.description;
		strip.title = req.body.title;
		strip.comic = req.body.comic
		strip.likes = 0;
		//save the bear and check for errors
		strip.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Strip created!' });
		})
		
	 })

	// get users
	.get(function(req, res) {
		Strip.find(function(err, users) {
			if (err)
				res.send(err);
			res.json(users);
		});
	});

router.route('/api/strips/:strip_id')
	.get(function(req, res) {
		Strip.findById(req.params.strip_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
	});
});


router.route('/api/getstripsbydate')
	.get(function(req, res){
		var toReturn = [];
		var minDate = new Date("January 1, 1970 00:00:00");
		var strips = Strip.find({ date: {$gt: minDate, $lt: req.query.date} }).sort({date: -1}).exec(function(err, docs) {
			for(i = 0; i < req.query.number; i++){
			toReturn[i] = docs[i];
			}
			res.json(toReturn);

		});

});

router.route('/api/comics')


	// create users
	.post(function(req, res) {
		console.dir(req);	
		var comic = new Comic(); 		// create a new instance of the Bear model
		comic.name = req.body.name;
		comic.website = req.body.website;
		comic.description = req.body.description;
		comic.author = req.body.author;

		//save the bear and check for errors
		comic.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Comic created!' });
		})
		
	 })

	// get users
	.get(function(req, res) {
		Comic.find(function(err, users) {
			if (err)
				res.send(err);
			res.json(users);
		});
	});
