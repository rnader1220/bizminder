var utility = (function ($, undefined) {
    var initialize = function () {
        var prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        if (prefersDarkScheme.matches) {
            $("body").addClass("dark-theme");
        } else {
            $("body").removeClass("dark-theme");
        }

        var currentTheme = localStorage.getItem("theme");
        if (currentTheme == "dark") {
            $("body").addClass("dark-theme");
        }
    };


    /**
     * @param resp          Information about the object.
     * @param resp.msg   html alert message
     * @param resp.success   true/false on success.
     * @param resp.id   id of affected object.
     * @param onSuccess callback if success = true;
     */
    var show_message = function (resp, onSuccess) {
        if (resp.success) {
            show_pass_message(resp.msg);
            if (resp.username) $("#username").html(resp.username);
            if (onSuccess !== undefined) onSuccess(resp);
        } else {
            show_fail_message(resp.msg);
        }
    };
    var show_pass_message = function (msg) {
        d = document.createElement("div");
        $(d)
            .html(msg)
            .addClass("message-popup")
            .addClass("animated flipInX")
            .appendTo($("#message"))
            .click(function () {
                $(this).remove();
            })
            .delay(2500)
            .queue(function () {
                $(this).remove();
            });
    };

    var show_fail_message = function (msg) {
        d = document.createElement("div");
        $(d)
            .html(msg)
            .addClass("message-popup")
            .addClass("animated flipInX")
            .appendTo($("#message"))
            .click(function () {
                $(this).remove();
            });
    };

    var show_help = function (msg) {
        $(".overlay").addClass("active");
        d = document.createElement("div");
        $(d)
            .html(msg)
            .addClass("help-popup")
            .addClass("animated flipInX")
            .appendTo($("#message"))
            .click(function () {
                $(this).remove();
                $(".overlay").removeClass("active");
            });
    };

    var show_tab = function (selected, animate) {
        $(".active").removeClass("active");
        if (animate) {
            $("[id^='tabdiv_']").slideUp(300);
            $("#tabdiv_" + selected).slideDown(300);
        } else {
            $("[id^='tabdiv_']").hide();
            $("#tabdiv_" + selected).show();
        }
        $("#tab_" + selected).addClass("active");
    };

    var display_name = function () {
        $.ajax({
            type: "GET",
            url: "profile/username",
            data: null,
            success: function (msg) {
                $("#username").html(msg);
            },
        });
    };

    var pre_load = function () {
        $(window).off("resize");
        $("#dashboard").slideUp(300);
        $(".titleFixed").fadeOut(100, function () {
            $(".titleFixed").html("");
        });
        $("#content").fadeOut(100, function () {
            $("#content").html("");
        });
        $("#dialog").fadeOut(100, function () {
            $("#dialog").html("");
        });
        $("#details").fadeOut(100, function () {
            $("#details").html("");
        });

        $(".page-wrapper").removeClass("toggled");
        $(".overlay").removeClass("active");
    };

    var show_dash = function () {
        pre_load();
        setTimeout(function () {
            $("#dashboard").slideDown(300);
        }, 300);
    };

    var set_dynamic_button = function (btn_name, callback) {
        $(btn_name).show().off("click").on("click", callback);
    };

    var reset_dynamic_button = function (btn_name) {
        $(btn_name).hide().off("click");
    };

    var ajax_fail = function (msgobj) {
        var status = msgobj.status;
        if (status == 401 || status == 419) {
            document.location = "/login";
        } else {
            show_fail_message(
                "<div class='alert alert-danger message-element w-100 text-center'>" +
                    "<strong>Something Went Wrong!</strong><br>The requested action failed." +
                    "<br>Contact technical support.<br>" +
                    "<button class='button-error alert-danger'><span class='far fa-times'></span> Click to Close</button>" +
                    "</div>"
            );
        }
    };

    var action_fail = function (msgobj) {
        ajax_fail(msgobj);
    };

    var logout = function () {
        $.ajax({
            type: "POST",
            url: "/logout",
            data: { _token: $("meta[name='csrf-token']").attr("content") },
        })
            .done(function (msg) {
                document.location = "/login";
            })
            .fail(function (message) {
                utility.ajax_fail(message);
            });
    };

    var show_subscriber = function (subscriber_id) {
        profile_public.set_config({ subscriber_id: subscriber_id });
        profile_public.load();

    };

    return {
        show_subscriber: show_subscriber,
        show_message: show_message,
        initialize: initialize,
        display_name: display_name,
        show_tab: show_tab,
        pre_load: pre_load,
        show_dash: show_dash,
        ajax_fail: ajax_fail,
        action_fail: action_fail,
        set_dynamic_button: set_dynamic_button,
        reset_dynamic_button: reset_dynamic_button,
        show_help: show_help,
        logout: logout,
    };
})(jQuery);
