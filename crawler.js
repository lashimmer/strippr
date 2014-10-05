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
	//pollXKCD();

	function pollAll()
	{
		Comic.find(function(err, comics) {
			if (err) {
				console.log("err");					
			}
			else {
				comics.forEach(function(comic) {
					if (comic.trunc == "harkavagrant"){
					pollGeneric(comic);	
				}
				});
			}
		});
	}

	function pollGeneric(comic)
	{
		var url = comic.website + comic.archive;
		download(url, function(data) {
	    	var $$ = cheerio.load(data);
	    	$$("a").each(function(i, e) { 
	    		function innerLoop(callback, strip, saveFunction, stripSave) {
		    		var strip = new Strip();
		    		if (e.attribs != null) {
		    			if (e.attribs.href != null) {
		    				// deals with absolute and relative paths
		    				if (e.attribs.href.toString().indexOf(comic.trunc) > -1) {
			    				strip.link = e.attribs.href;
			    			}
			    			else {
				    			strip.link = comic.website + e.attribs.href;
			    			}
			    			// try to pull date: at least xkcd has it in the title
			    			if (e.attribs.title != null) {
			    				strip.date = e.attribs.title;
			    			}
			    			else {

			    			}
				    		// invokes method to scrape individual links
				    		//console.log(strip.link);
			    			callback(strip, saveFunction, stripSave);
		    			}
		    		}
	    		}
	    		function innerLoopFunction(strip, saveFunction, stripSave) {
	    			// TODO: use less try catch statements
	    			try { // this one catches the mailto illegal actions
	    				download(strip.link, function(data2) {
		    				try { // this one catches the parent null errors
			    				var $ = cheerio.load(data2);
			    				$("img").each(function(i, e) { 
			    					if (e.attribs != null) {
			    						// try looking for images with titles first
			    						if (e.attribs.title != null) {
					    					strip.img = e.attribs.src;
					    					strip.description = e.attribs.title;
					    					strip.title = e.attribs.alt;
					    					strip.likes = 0;
					    					strip.comic = comic.trunc;
					    					console.log(strip);
					    					// save goes inside if/else loop to avoid saving things that don't match
											//saveFunction(strip, stripSave);
			    						}
			    					}
			      				});	    						
		    				}
		    				catch (err) {
		    					//console.log(err);
		    				}
						});
	    			}
	    			catch (error) {
	    			}	    			
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
    							// pass to save function to check if it already exists
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
			if (returnedStrip.length == 0) {
				console.log("NOT EXIST");
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



