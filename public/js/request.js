$.ajax({//ajax call 1
    url:"api/strips",
    dataType:json,
    data:{"date":"something"},
    success: function(data1){
        console.log("success");
    }
});