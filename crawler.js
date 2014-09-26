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
	// var interval = 2000;
	// setInterval(function(){
 //    	pollAll(function(result){
 //   	 	});
	// }, interval);
	//pollAll();

	function pollAll()
	{
		pollXKCD();
	}

	function pollXKCD()
	{
		console.log("polling XKCD"); 
		var baseurl = "http://xkcd.com"
		var url = baseurl + "/archive/"
		download(url, function(data) {
			var strip = new Strip();
	  		if (data) {
	    		var $$ = cheerio.load(data);
	    		$$("a").each(function(i, e) { 
	    			if (e.attribs.title != null) {
	    				//strip.link = baseurl + e.attribs.href;
	    				//strip.date = e.attribs.title;

	    				// now scrape individual links	
				    	download(baseurl + e.attribs.href, function(data2) {
	    					//console.log("insited nested");
	  						if (data2) {
	    					var $ = cheerio.load(data2);
	    					$("img").each(function(i, e) { 
	    						if (e.attribs.title != null) {
	    							strip.img = e.attribs.src;
	    							strip.description = e.attribs.title;
	    							strip.title = e.attribs.alt;
	    							strip.likes = 0;
	    							strip.comic = "xkcd";
	    							strip.link = baseurl + e.attribs.href;


				      			Strip.find({ link: strip.link}, function(err, returnedStrip) {
									if (err) {
										console.log("err");					
									}
									if (returnedStrip != null) {
										console.log("NOT EXIST");
										console.log(strip);
										//strip.save();
										console.log("saved");
									}
									else {
										console.log("EXISTS");
									}
								});			
	    						}
	      						});
  							}
  							else console.log("error");  
						});
    				}
      			});

  			}

  			else console.log("error");  
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

}
}



