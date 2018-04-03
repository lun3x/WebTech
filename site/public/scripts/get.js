$(document).ready(function(){
    $.ajax({url: "/ajax", async: false, data: { item: "food" }, success: function(result) {
        //alert(JSON.stringify(result));
        $.each(result, function(key, value) {
            $("#foodlist").append("<br />", value.name, " x ", value.quantity, "<br />");
        });
    }});
});