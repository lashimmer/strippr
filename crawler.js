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
	var interval = 2000;
	setInterval(function(){
    	pollAll(function(result){
   	 	});
	}, interval);

	function pollAll()
	{
		//pollComic("http://xkcd.com/archive");
	}

	function pollComic(url)
	{
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
		console.log("polling XKCD"); 

		download(url, function(data) {
  		if (data) {
    	console.log(data);
  		}
  		else console.log("error");  
		});
    }
}
}



