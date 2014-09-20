$.ajax({//ajax call 1
    type:"GET",
    url:"http://shannawang.com/api/strips",
    // data:{"date":"something"},
    success: function(data1){
        console.log(data);
        renderStrippr(data);
    }
});

var renderStrippr=function(data){
	var content="";
	for (var i = 0; i < data.length; i++) {
		content+='<div class="strip">'+
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
}