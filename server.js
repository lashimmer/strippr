// server.js

// BASE SETUP
// =============================================================================

// add references to models
var User     = require('./app/models/user');
var Comic     = require('./app/models/comic');
var Strip     = require('./app/models/strip');

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 80; 		// set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	console.log("it works");
  res.sendfile(__dirname + '/views/index.html');
});

// more routes for our API will happen here

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


router.route('/api/strips/getallbycomic')
	.get(function(req, res){

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


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);