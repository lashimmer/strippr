var load=function(date, number, username) {
  $.ajax({//initial ajax call 
    type:"GET",
    url:"./api/getstripsbydate",
    data:{"date": date, "number":number, "username":username},
    success: function(data){
        console.log(data);
        renderStrip(data);
    }
  });
}


var renderStrip=function(data){
	var content="";
	for (var i = 0; i < data.length; i++) {
		if (data[i] == null) {
      break;
    }
    else {
      content +=
        '<div class="strip">'+
          '<div class="head">'+
          data[i].title+
           ' <div class="likes">'+
            '  <img src="../public/img/heart.png">'+
            data[i].likes +
            '</div>'+
          '</div>'+
          '<a href="'+
          data[i].link+
          '"><div class="pic">'+
           ' <img src="'+data[i].img+'">'+
          '</div></a>'+
          '<a href="/'+
          data[i].comic+
          '"><div class="more">'+
          data[i].comic+
          '</div></a>'
        '</div>'
      };
      $('#content').html("");
      $('#content').append(content);
    }
		
}
