// login.js

$(document).ready(() => {
    // on pressing login button, send request { username: louis, password: ahmer }
    $('#login_button').click(() => {
        $.ajax({
            type: 'POST',
            url: '/login',
            async: false,
            data: {
                username: 'louis',
                password: 'ahmer',
            },
        });
    });
});

