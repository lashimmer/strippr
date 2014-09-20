$.ajax({//ajax call 1
    type:"GET",
    url:"http://shannawang.com/api/strips",
    // data:{"date":"something"},
    success: function(data){
        console.log(data);
        renderStrip(data);
    }
});

var renderStrip=function(data){
	var content="";
	for (var i = 0; i < data.length; i++) {
		content +=
		'<div class="strip">'+
        '<div class="head">'+
       	data[i].title+
         ' <div class="likes">'+
          '  <img src="http://i.imgur.com/Y5zq7m0.png">'+
          '  100'+
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