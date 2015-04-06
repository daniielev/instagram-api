$(document).ready(function () {

    var api_token = "1794656714.1677ed0.956c7dfe26ca48efa6c2fc44ae86029a";
    var formElem;

    setSlider($("#slider"));

    /*
    ** Smooth Scroll
    */
    $("a[href^='#']").on("click", function (e) {
        e.preventDefault();


        var target = $($(this).attr("href"));

        if (target.length) {
            $("html, body").animate({
                scrollTop : target.offset().top
            }, 1000);
        }
    });

    /*
    ** Get data on changes
    */
    $("form").submit(function (e) {
        e.preventDefault();
        formElem = $(this);
        toggleProcess(formElem);

        formData = {
            hashtag : $.trim($(this).find("#txt_hashtag").val()),
            size    : $.trim($(this).find("#txt_size").val()),
            quantity: Number($.trim($(this).find("#txt_quantity").val())),
            token   : api_token,
            output  : "#output"
        };

        init(formData);
    });

    function init (formData) {
        $.ajax({
            url     : "https://api.instagram.com/v1/tags/" + formData.hashtag + "/media/recent?access_token=" + formData.token,
            dataType: "jsonp",
            success : function (api) {
                console.log(api);
                if (api.meta.code === 200 && api.data.length > 0) {
                    getData(api);
                } else {
                    if ( api.meta.code === 200 && api.data.length <= 0) {
                        $(formData.output).text("There are no photos under the hashtag: #" + formData.hashtag)
                                          .parent()
                                          .removeClass("alert-danger alert-hide")
                                          .addClass("alert-warning alert-show");
                    } else {
                        $(formData.output).text(api.meta.error_message + ": #"+ formData.hashtag)
                                          .parent()
                                          .removeClass("alert-hide")
                                          .addClass("alert-show");
                    }
                    toggleProcess(formElem);
                }
            },
            error   : function (error) {
                console.log(error);
            }
        });

        $("#code-hashtag").text(formData.hashtag);
        $("#code-token").text(formData.token);
    }

    function getData (api) {
        var mainContainer = $("#slider"),
            inner         = mainContainer.find(".carousel-inner");

        inner.html("");

        $.each(api.data, function (i, val) {
            if (i < formData.quantity) {
                var img = $("<img class='img-responsive'>");
                var divItem = $("<div class='item'></div>");
                var divCaption = $("<div class='carousel-caption'></div>");
                var title = $("<h3></h3>");
                var titleAnchor = $("<a></a>");

                img.attr({
                    src    : api.data[i].images[formData.size].url,
                    width  : api.data[i].images[formData.size].width,
                    height : api.data[i].images[formData.size].height,
                    alt    : api.data[i].caption.text
                });

                titleAnchor.attr("href", api.data[i].link)
                           .text("by @" + api.data[i].user.username);
                title.append(titleAnchor);


                divCaption.append(title);
                divItem.append(img)
                       .append(divCaption);
                inner.append(divItem);

            } else {
                return false;
            }
        });

        inner.find(".item").first().addClass("active");
        toggleProcess(formElem);
    }

    function toggleProcess (form) {
        var btn = form.find("button[type=submit]");

        btn.prop("disabled", !btn.prop("disabled"));
    }

    function setSlider (slider) {
        var items = slider.find(".item"),
            btnPrev = slider.find(".left"),
            btnNext = slider.find(".right");

        var current = slider.find(".active");

        btnPrev.click(function () {
            current.removeClass("active");
            current.prev().addClass("active");
            current = slider.find(".active");
        });

        btnNext.click(function () {
            current.removeClass("active");
            current.next().addClass("active");
            current = slider.find(".active");
        });
    }
});