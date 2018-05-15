function addItemToList(value) {
    let plusB = "<button type='button' id='plusB' value='" + value.itemID + "'>+</button>";
    let minusB = "<button type='button' id='minusB' value='" + value.itemID + "'>-</button>";
    $('#foodlist').append('<br/>', value.name, ' x ', value.quantity, plusB, minusB, '<br/>');
}

$(document).ready(() => {
    $.ajax({
        url: '/ajax',
        async: false,
        data: { action: 'getFood' },
        success(result) {
            $.each(result, (key, value) => {
                addItemToList(value);
            });
        },
    });

    $('form').submit(function (e) {
        $.ajax({
            type: 'POST',
            url: '/ajax',
            async: false,
            data: $(this).serialize(),
            success() {
                location.reload();
            },
        });

        e.preventDefault(); // avoid to execute the actual submit of the form.
    });

    $('button, input[type=button]').click(function () {
        $.ajax({
            type: 'POST',
            url: '/ajax',
            async: false,
            data: {
                action: $(this).attr('id'),
                itemID: $(this).attr('value'),
            },
            success() {
                location.reload();
            },
        });
    });
});
