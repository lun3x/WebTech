$(document).ready(function(){
    $.ajax({url: "/ajax", async: false, data: { name: "John", location: "Boston" }, success: function(result) {
        //alert(JSON.stringify(result));
        $("#namep").html(JSON.stringify(result));
    }});
});