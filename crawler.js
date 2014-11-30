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

    // polls the comics regularly
    // 12 hours
	var interval = 86400000/2;
	setInterval(function(){
    	pollAll(function(result){
   	 	});
	}, interval);
	//pollAllPast();

	function pollAll()
	{
		Comic.find(function(err, comics) {
			if (err) {
				console.log("err");					
			}
			else {
				comics.forEach(function(comic) {
					if (comic.trunc == "nedroid" || comic.trunc == "xkcd"){
					pollGeneric(comic);	
				}
				});
			}
		});
	}

	function pollAllPast()
	{
		Comic.find(function(err, comics) {
			if (err) {
				console.log("err");					
			}
			else {
				comics.forEach(function(comic) {
					if (comic.trunc == "nedroid" || comic.trunc =="xkcd"){
					pollGenericPast(comic);	
				}
				});
			}
		});
	}
// uses today's date
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
			    				// uses the date & time right now if it cannot find date
			    				strip.date = new Date();
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
											saveFunction(strip, stripSave);
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
// makes up a date that enforce the rough chronological ordering
    function pollGenericPast(comic)
	{
		// arbitrary start date
		var start = new Date(2007, 6, 1, 0, 0, 0, 0);
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
			    				strip.date = start;
			    				// to add, subtract negative number(WHY DOES ADDITION NOT WORK?!)
			    				// to subtract, proceed like a sane person would
			    				start = start - (-345600000);
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
											saveFunction(strip, stripSave);
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



