module.exports = {
  execute: function () {
var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
    // polls the the rss feeds regularly
    // 2 hours
	//var interval = 7200000;
	var interval = 5000;
	setInterval(function(){
    	pollAll(function(result){
   	 	});
	}, interval);

	function pollAll()
	{
		pollXKCD();
	}



	function pollXKCD()
	{
		console.log("polling XKCD")
		$.ajax({
        	url: 'http://theresidency.libsyn.com/rss',
        	type: 'GET',
        	dataType: "xml"
    		}).done(function(xml) {
        $.each($("item", xml), function(i, e) {
            $("#results").append($("enclosure").attr("url").text() + "<br />");
        });
    });
	}
	}
}



