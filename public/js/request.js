$.ajax({//ajax call 1
    type:"GET",
    url:"api/strips",
    data:{"date":"something"},
    success: function(data1){
        console.log("success");
    }
});