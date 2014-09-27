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
  console.log("rendering");
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
            '  <img src="../public/img/heart.png")"><span id="num_likes">'+
            data[i].likes +
            '</span></div>'+
          '</div>'+
          '<a target="_blank" href="'+
          data[i].link+
          '"><div class="pic">'+
           ' <img src="'+data[i].img+'">'+
          '</div></a>'+
          '<div class="more"><a href="/'+
          data[i].comic+
          '">By: '+
          data[i].comic+
          '</a></div>'+
        '</div>'
      };

      $('#content').append(content);
    }
		
}

var likeStrip=function(strip, username) {
  $.ajax({//initial ajax call 
    type:"POST",
    url:"./api/likestrip",
    data:{"strip_link":strip, "username":user.username},
    success: function(data){
        console.log(data);
        incrementLike(true);
    }
  });
}
var incrementLike=function(like) {
  if (like) {
    console.log($('#num_likes').html);
  } else {

  }
}