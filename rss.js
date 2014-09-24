module.exports = {
  execute: function () {

  	// add references to models
	var User     = require('./app/models/user');
	var Comic     = require('./app/models/comic');
	var Strip     = require('./app/models/strip');
  	var http = require('http');
	var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
	$.support.cors = true;

	var DOMParser = require('xmldom').DOMParser;
    // polls the the rss feeds regularly
    // 2 hours
	//var interval = 7200000;
	var interval = 2000;
	setInterval(function(){
    	pollAll(function(result){
   	 	});
	}, interval);

	function pollAll()
	{
		//pollXKCD();
	}

	function pollXKCD()
	{
		console.log("polling XKCD");
		var url = "http://xkcd.com/rss.xml"
		var req = http.get(url, function(res) {
		  // save the data
		  var xml = '';
		  res.on('data', function(chunk) {
		    xml += chunk;
		  });

		  res.on('end', function() {
		    // parse xml: remove xml version first
		    //xml = xml.substr(xml.indexOf('>') + 1, xml.length);
		    xml = xml.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		    xml = xml.replace('&lt;', '<').replace('&gt;', '>');
		    //console.log(xml);
		    var strips = [];
		    var doc = new DOMParser().parseFromString(xml);
			items = doc.getElementsByTagName('item');
			for (i = 0; i < items.length; i++)
		  	{
		  		var strip = new Strip();
		  		strip.comic = "541dd2a6aac2b8d818000002";
		  		strip.likes = 0;
		  		var subitems = items[i].childNodes;
		  		for (j = 0; j < subitems.length; j++){
		  			var key = subitems[j].nodeName;
		  			var value = subitems[j].childNodes[0].nodeValue;
					switch (key) {
						case "title":
							strip.title = value;
							break;
						case "link":
							strip.link = value;
							break;
						case "description":
							strip.img = subitems[j].childNodes[0].attributes[0].nodeValue;
							console.log(strip.img);
							strip.description = subitems[j].childNodes[0].attributes[1].nodeValue;
							break;
						case "pubDate":
							strip.date = value;
							break;
					}
		  		}
		  		strips.push(strip);
		  	}
		  	var stripExists = false;
		  	Strip.find({ img: strip.img}, function(err, strip) {
				if (err) {
					console.log(err);					
				}
				if (strip != null) {
					stripExists = true;
				}
			});
			console.log(stripExists);
		  	if (stripExists == false) {
		  		// strip doesn't already exist in database, insert
		  		console.log("doesn't exist!");
		  		//strip.save();
		  	}
		    //console.log(items);    
		  });
		});

		req.on('error', function(err) {
		  // debug error
		});	
    }
}
}



