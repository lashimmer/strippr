$.ajax({//ajax call 1
    url:page1.php,
    dataType:json,
    data:{"date":"something"},
    success: function(data1){
        console.log("success");
    }
});