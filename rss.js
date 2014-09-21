module.exports = {
  execute: function () {
	var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
	$.support.cors = true;
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
        	url: 'http://xkcd.com/rss.xml',
        	type: 'GET',
        	contentType: 'text/xml',
        	dataType: 'xml',
        	success : function(data) {
       		console.log("SUCCESS");
   			},
   			error : function(data) {
       		console.log(data);
   			}
    	});	
    }
}
}



