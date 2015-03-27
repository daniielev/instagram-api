$(document).ready(function () {

    var api_token = "1794656714.1677ed0.956c7dfe26ca48efa6c2fc44ae86029a";

    $("form").submit(function (e) {
        e.preventDefault();

        formData = {
            hashtag : $.trim($(this).find("#txt_hashtag").val()),
            size    : $.trim($(this).find("#txt_size").val()),
            quantity: Number($.trim($(this).find("#txt_quantity").val())),
            token   : api_token,
            output  : "#output"
        };

        // console.log(formData);
        disableForm();
        init(formData);
    });

    function init (formData) {
        $.ajax({
            url     : "https://api.instagram.com/v1/tags/" + formData.hashtag + "/media/recent?access_token=" + formData.token,
            dataType: "jsonp",
            success : function (api) {
                console.log(api);
                if (api.meta.code === 200) {
                    getData(api);
                } else {
                    $(formData.output).text(api.meta.error_message);
                    activateForm();
                }
            },
            error   : function (error) {
                console.log(error);
            }
        });
    }

    function getData (api) {
        var container = $("#slider");

        container.html("");

        $.each(api.data, function (i, val) {
            if (i < formData.quantity) {
                // console.log(api.data[i].images);
                var a = $("<a></a>");
                var img = $("<img class='img-responsive'>");

                // console.log(api.data[i].images[formData.size]);

                a.attr({
                    href   : api.data[i].link,
                    target : "_blank"
                });

                img.attr({
                    src    : api.data[i].images[formData.size].url,
                    width  : api.data[i].images[formData.size].width,
                    height : api.data[i].images[formData.size].height,
                    alt    : api.data[i].caption.text,
                    title  : "by @" + api.data[i].user.username
                });

                a.append(img);
                container.append(a);
                // container.append(img);
            } else {
                return false;
            }
        });

        activateForm();
    }

    function disableForm () {
        $("form").find("button[type=submit]")
                 .addClass("")
                 .prop("disabled", true);
    }

    function activateForm () {
        $("form").find("button[type=submit]").prop("disabled", false);
    }
});