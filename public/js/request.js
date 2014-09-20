$.ajax({//ajax call 1
    type:"GET",
    url:"http://shannawang.com/api/users",
    // data:{"date":"something"},
    success: function(data1){
        console.log(data1);
    }
});