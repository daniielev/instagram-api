$(document).ready(function () {

    $("form").submit(function (e) {
        e.preventDefault();

        formData = {
            hashtag : $.trim($(this).find("#txt_hashtag").val()),
            size    : $.trim($(this).find("#txt_size").val()),
            quantity: Number($.trim($(this).find("#txt_quantity").val())),
            token   : $.trim($(this).find("#txt_token").val())
        };

        console.log(formData);
        init(formData);
    });


    function init (formData) {
        $.ajax({
            url     : "https://api.instagram.com/v1/tags/" + formData.hashtag + "/media/recent?access_token=" + formData.token,
            dataType: "jsonp",
            success : function (api) {
                // console.log(api);
                setData(api);
            },
            error   : function (error) {
                console.log(error);
            }
        });
    }

    function setData (api) {
        $.each(api.data, function (i, val) {
            if (i < formData.quantity) {
                console.log(api.data[i].images);
            } else {
                return false;
            }
        });
    }
});