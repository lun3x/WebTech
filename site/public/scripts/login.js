// login.js

$(document).ready(function() {

    // on pressing login button, send request { username: louis, password: ahmer }
    $("#login_button").click(function() {
        $.ajax({
            type: "POST",
            url: "/login",
            async: false,
            data: {
                username: "louis",
                password: "ahmer"
            }
        });
    });

});

