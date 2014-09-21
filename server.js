// server.js

// BASE SETUP
// =============================================================================
var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

var rss = require('./rss');
rss.execute();

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
	next(); // make sure we go to the next routes and don't stop here
});

app.use(express.favicon(__dirname + '/public/images/favicon.ico')); 


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	console.log("in index");
    res.sendfile(__dirname + '/views/index.html');
});

router.get('/signup', function(req, res) {
	console.log("in signup");
    res.sendfile(__dirname + '/views/signup.html');
});

router.get('/login', function(req, res) {
	console.log("in login");
    res.sendfile(__dirname + '/views/login.html');
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

router.route('/api/authenticate')
.post(function(req, res) {
	User.find({ username: req.query.username}, function(err, bear) {
		if (err)
			res.send(err);
		if (bear[0].password == req.query.password) {
			res.send(bear);
		}
		else {
			res.json({success : false});
		}
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

router.route('/api/likestrip')
	.get(function(req, res) {
		User.find( { username: req.query.username }, function(err, user) {
			if (err)
				res.send(err);
			user[0].favourites.push(req.query.strip_id);

			user[0].save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});		
		Strip.findById(req.query.strip_id, function(err, strip) {
			if (err)
				res.send(err);

			strip.likes = strip.likes + 1; 	// increment like

			// save the bear
			strip.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Strip updated!' });
			});

		});
});

router.route('/api/unlikestrip')
	.get(function(req, res) {
		User.find( { username: req.query.username }, function(err, user) {
			if (err)
				res.send(err);
			for (i = 0; i < user[0].favourites.length; i++){
				if (user[0].favourites[i] == req.query.strip_id) {
					user[0].favourites.splice(i, 1);
				}
			}

			user[0].save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});		
		Strip.findById(req.query.strip_id, function(err, strip) {
			if (err)
				res.send(err);

			strip.likes = strip.likes - 1; 	// increment like

			// save the bear
			strip.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Strip updated!' });
			});

		});
});


router.route('/api/getstripsbydate')
	.get(function(req, res){
		var toReturn = [];
		var minDate = new Date("January 1, 1970 00:00:00");
		// if called without username parameter, display all comics
		if (req.query.username == null) {
			Strip.find({ date: {$gt: minDate, $lt: req.query.date} }).sort({date: -1}).exec(function(err, docs) {
				for(i = 0; i < req.query.number; i++){
				toReturn[i] = docs[i];
				}
				res.json(toReturn);

			});
		}
		// if called with username, display only user's subs
		else {
			var userSubs;
			User.find({ username : req.query.username}, function (err, user) {
				userSubs = user[0].subscriptions;
				Strip.find({ 
					date: {$gt: minDate, $lt: req.query.date}
					, comic : { $in : [userSubs] }
					}).sort({date: -1}).exec(function(err, docs) {
						console.log("docs :" +docs);
						for(i = 0; i < req.query.number; i++){
						toReturn[i] = docs[i];
						}
						res.json(toReturn);
					});
			});


		}

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



router.route('/api/subtocomic')
	.get(function(req, res) {
		User.find( { username: req.query.username }, function(err, user) {
			if (err)
				res.send(err);
			user[0].subscriptions.push(req.query.comicwebsite);

			user[0].save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});		
});

router.route('/api/unsubfromcomic')
	.get(function(req, res) {
		User.find( { username: req.query.username }, function(err, user) {
			if (err)
				res.send(err);
			for (i = 0; i < user[0].subscriptions.length; i++){
				if (user[0].subscriptions[i] == req.query.comicwebsite) {
					user[0].subscriptions.splice(i, 1);
				}
			}
			user[0].save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});		
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);
app.use('/public', express.static(__dirname+'/public'));
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);