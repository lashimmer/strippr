module.exports = {
  execute: function () {
  	// add references to models
	var User     = require('./app/models/user');
	var Comic     = require('./app/models/comic');
	var Strip     = require('./app/models/strip');

  	var http = require('http');
	// var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
	// $.support.cors = true;
	var cheerio = require("cheerio");

    // polls the the rss feeds regularly
    // 2 hours
	//var interval = 7200000;
	// setInterval(function(){
 //    	pollAll(function(result){
 //   	 	});
	// }, interval);
	//pollAll();

	function pollAll()
	{
		pollGeneric("http://xkcd.com", "/archive/");
	}



	function pollGeneric(baseurl, archive)
	{
		var url = baseurl + archive;
		download(url, function(data) {
	    	var $$ = cheerio.load(data);
	    	$$("a").each(function(i, e) { 
	    		function innerLoop(callback, strip, saveFunction, stripSave) {
		    		if (e.attribs.title != null) {
		    			var strip = new Strip();
		    			strip.link = baseurl + e.attribs.href;
		    			strip.date = e.attribs.title;
		    			// invokes method to scrape individual links
		    			callback(strip, saveFunction, stripSave);
		    		}
	    		}
	    		function innerLoopFunction(strip, saveFunction, stripSave) {
    				download(baseurl + e.attribs.href, function(data2) {
    					var $ = cheerio.load(data2);
    					$("img").each(function(i, e) { 
    						if (e.attribs.title != null) {
    							strip.img = e.attribs.src;
    							strip.description = e.attribs.title;
    							strip.title = e.attribs.alt;
    							strip.likes = 0;
    							strip.comic = "xkcd";
    							// save if it doesn't exist already
								saveFunction(strip, stripSave);
    						}
      					});
					});
   				}
	    		
	    	innerLoop(innerLoopFunction, null, findAndSave, saveIt);
      		});
		});
    }

	function pollXKCD()
	{
		var baseurl = "http://xkcd.com";
		var url = baseurl + "/archive/";
		download(url, function(data) {
	    	var $$ = cheerio.load(data);
	    	$$("a").each(function(i, e) { 
	    		function innerLoop(callback, strip, saveFunction, stripSave) {
		    		if (e.attribs.title != null) {
		    			var strip = new Strip();
		    			strip.link = baseurl + e.attribs.href;
		    			strip.date = e.attribs.title;
		    			// invokes method to scrape individual links
		    			callback(strip, saveFunction, stripSave);
		    		}
	    		}
	    		function innerLoopFunction(strip, saveFunction, stripSave) {
    				download(baseurl + e.attribs.href, function(data2) {
    					var $ = cheerio.load(data2);
    					$("img").each(function(i, e) { 
    						if (e.attribs.title != null) {
    							strip.img = e.attribs.src;
    							strip.description = e.attribs.title;
    							strip.title = e.attribs.alt;
    							strip.likes = 0;
    							strip.comic = "xkcd";
    							// save if it doesn't exist already
								saveFunction(strip, stripSave);
    						}
      					});
					});
   				}
	    		
	    	innerLoop(innerLoopFunction, null, findAndSave, saveIt);
      		});
		});
    }

	// common helper functions
	function download(url, callback) {
		http.get(url, function(res) {
	    	var data = "";
	    	res.on('data', function (chunk) {
	     		data += chunk;
	    	});
	    	res.on("end", function() {
	      		callback(data);
	    	});
	  		}).on("error", function() {
	  			callback(null);
  		});
	}

	function findAndSave(strip, stripSave) {
		Strip.find({ link: strip.link}, function(err, returnedStrip) {
			if (err) {
				console.log("err");					
			}
			// console.log(strip);
			// console.log(returnedStrip);
			if (returnedStrip.length == 0) {
				//console.log(strip);
				console.log("NOT EXIST");
				//console.log(strip);
				stripSave(strip);
			}
			else {
				console.log("EXISTS");
			}
		});
	}

	function saveIt(strip) {
		strip.save();
	}

	}
}



