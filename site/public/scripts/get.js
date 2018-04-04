$(document).ready(function(){
    $.ajax({
        url: "/ajax", 
        async: false, 
        data: { action: "getFood" }, 
        success: function(result) {
            $.each(result, function(key, value) {
                $("#foodlist").append("<br/>", value.name, " x ", value.quantity, "<br/>");
        });
    }});
    
    $("#add").click(function() {
        let name = $('#foodName').val();
        let quan = $('#foodQuantity').val();
        $.ajax({
            url: "/ajax",
            async: false,
            data: { action: "addFood", foodName: name, foodQuantity: quan },
            success: function(result) {
                $("#foodlist").append("<br/>", result.name, " x ", result.quantity, "<br/>");
            }
        });
    });
    
    $("form").submit(function(e) {
        $.ajax({
            type: "POST",
            url: "/ajax",
            async: false,
            data: $(this).serialize(),
            success: function(result) {
                $("#foodlist").append("<br/>", result.name, " x ", result.quantity, "<br/>");
            }
        });
        
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });
});