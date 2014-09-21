
var path = window.location.pathname;
console.log(path);


$.ajax({//initial ajax call 
    type:"GET",
    url:"http://strippr.me/api/comic/",
    // data:{"date":"something"},
    success: function(data){
        console.log(data);
        renderStrip(data);
    }
});
$.ajax({//initial ajax call 
    type:"GET",
    url:"http://strippr.me/api/strips",
    // data:{"date":"something"},
    success: function(data){
        console.log(data);
        renderInfo(data);
    }
});

var renderStrip=function(data){
	var content="";
	for (var i = 0; i < data.length; i++) {
		if (data[i].title == "null") break;
		content +=
		'<div class="strip">'+
        '<div class="head">'+
       	data[i].title+
         ' <div class="likes">'+
          '  <img src="../public/img/heart.png">'+
          data[i].likes +
          '</div>'+
        '</div>'+
        '<div class="pic">'+
         ' <img src="'+data[i].img+'">'+
        '</div>'+
      '</div>'
	};
	$('#content').html("");
	$('#content').append(content);
}