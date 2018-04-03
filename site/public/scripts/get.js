$(document).ready(function(){
    $.ajax({url: "/ajax", async: false, data: { action: "getFood" }, success: function(result) {
        $.each(result, function(key, value) {
            $("#foodlist").append("<br />", value.name, " x ", value.quantity, "<br />");
        });
    }});
});

$("#add").click(function() {
    $.ajax({url: "/ajax", async: false, data: { action: "addFood", foodName: "testFoodName", foodQuantity: "42" }, success: function(result) {
        $("#foodlist").append("<br />", result.name, " x ", result.quantity, "<br />");
    }});
});