var utility = (function ($, undefined) {
    var initialize = function () {
        //var dark_toggle = $("#cb-dark-theme");

        var prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        if (prefersDarkScheme.matches) {
            $("body").addClass("dark-theme");
            //$(dark_toggle).prop('checked', true);
        } else {
            $("body").removeClass("dark-theme");
            //$(dark_toggle).prop('checked', false);
        }

        var currentTheme = localStorage.getItem("theme");
        if (currentTheme == "dark") {
            $("body").addClass("dark-theme");
            //$(dark_toggle).prop('checked', true);
        }

        /* $(dark_toggle).on("change", function () {
            $("body").toggleClass("dark-theme");
            var theme = "light";
            if ($("body").containsClass("dark-theme")) {
                theme = "dark";
            }
            localStorage.setItem("theme", theme);
        }); */
        //mainmenu();
    };

    var mainmenu = function () {
        $.ajax({
            type: "GET",
            url: "console/mainmenu",
            data: null,
            success: function (msg) {
                $("#mainmenu").html(msg);
                load();
            },
        });
    };

    var load = function () {
        utility.pre_load();

        var endpoint = "dashboard";
        $.ajax({
            url: endpoint,
            cache: false,
        })
            .done(function (html) {
                $("#dashboard").html(html);
                init();
                setTimeout(function () {
                    $("#dashboard").fadeIn(300);
                }, 300);
            })
            .fail(function (message) {
                ajax_fail(message);
            });
    };

    var init = function () {
        //init_profile();
        //init_switchers();
        //init_admin();
        //init_console();
        //init_features();
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
        feature_chatrooms.set_config({ current_chatroom_id: null });
    };

    var show_dash = function () {
        pre_load();
        setTimeout(function () {
            $("#dashboard").slideDown(300);
        }, 300);
        feature_chatrooms.set_config({ current_chatroom_id: null });
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
                "<div class='alert alert-danger message-element' style='text-align:center; width:100%'>" +
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

        //alert('subscriber '+ subscriber_id + ' profile modal popup here');
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

/*
var dashboard = (function($, undefined) {


    var reload = function() {
        var sel = $('#mm_current_account').val();

        $('#content').fadeOut(300);
        $('#dialog').fadeOut(300);

        var endpoint = "console/dashboard";
        if(sel == 0)
            endpoint = "console/dashboard";
        $.ajax({
            url: endpoint,
            cache: false
        })
        .done(function(html) {
            $('#dashboard').html(html);
//            init();
            setTimeout(function () {
                $('#dashboard').fadeIn(300);
            }, 300);
        })
        .fail(function(message) {
            utility.ajax_fail(message);
        });

    };

   var set_module = function(selected_module) {
        $.ajax({
            type: "POST",
            url: 'console/profile/setmodule',
            data: {
                "_token": $("meta[name='csrf-token']").attr("content"),
                "module_id": selected_module
            },
            cache: false
        })
        .done(function(html) {
            mainmenu();
        })
        .fail(function(message) {
            utility.ajax_fail(message);
        });
    };

    var init = function() {
        var sel = $('#mm_current_account').val();

        init_profile();
        init_switchers();

        init_admin();
        init_console();
        init_features();
    };

    var init_console = function() {

        $("#profile-list #profile-account").off('click').on('click', accounts.myload);

    };

    var set_account = function(selected_account) {
        $.ajax({
            type: "POST",
            url: 'console/profile/setaccount',
            data: {
                "_token": $("meta[name='csrf-token']").attr("content"),
                "account_id": selected_account
            },

            cache: false
        })
        .done(function(html) {
            mainmenu();
        })
        .fail(function(message) {
            utility.ajax_fail(message);
        });
    };

    var init_admin = function() {

        $("#admin-list #categories-item").off('click').on('click', function () {
            categories.set_config({
                arguments: '?admin=1',
            });
            categories.load();
        });

        $("#admin-list #admins-item").off('click').on('click', function () {
            users.set_config({
                parent_id: null,
                caller_name: 'administrators',
                target_div: '',
                endpoint: 'admin/users'
            });
            users.load();
        });

        $("#admin-list #subscribers-item").off('click').on('click', function () {
            users.set_config({
                parent_id: null,
                caller_name: 'subscribers',
                target_div: '',
                endpoint: 'admin/users',
            });
            users.load();
        });

        $("#admin-list #accounts-item").off('click').on('click', accounts.load);

        $("#admin-list #packages-item").off('click').on('click', packages.load);

        $("#admin-list #referrals-item").off('click').on('click', referrals.load);

        $("#admin-list #inquiries-item").off('click').on('click', inquiries.load);

        $("#cms-list #pages-item").off('click').on('click', cms_pages.load);
        $("#cms-list #media-item").off('click').on('click', cms_media.load);

        $("#cms-list #menus-list #menu-top-item").off('click').on('click', function () {
            cms_menus.set_config({
                title: 'Top Navigation Menu',
                arguments: '?location=top_menu',
            });
            cms_menus.load();
        });

        $("#cms-list #menus-list #menu-cart-item").off('click').on('click', function () {
            cms_menus.set_config({
                title: 'Cart Menu',
                arguments: '?location=cart_menu',
            });
            cms_menus.load();
        });

        $("#cms-list #menus-list #menu-promo-item").off('click').on('click', function () {
            cms_menus.set_config({
                title: 'Promo Menu',
                arguments: '?location=promo_menu',
            });
            cms_menus.load();
        });

        $("#cms-list #menus-list #menu-foot-item").off('click').on('click', function () {
            cms_menus.set_config({
                title: 'Footer Menu',
                arguments: '?location=foot_menu',
            });
            cms_menus.load();
        });

        $("#cms-list #menus-list #menu-bottom-item").off('click').on('click', function () {
            cms_menus.set_config({
                title: 'Bottom Menu',
                arguments: '?location=bottom_menu',
            });
            cms_menus.load();
        });

        $("#cms-list #menus-list #menu-social-item").off('click').on('click', function () {
            cms_menus.set_config({
                title: 'Social Menu',
                arguments: '?location=social_menu',
            });
            cms_menus.load();
        });

        $("#fadmin-list #news-item").off('click').on('click', admin_newsfeeds.load);
        $("#fadmin-list #chat-item").off('click').on('click', admin_chatrooms.load);
        $("#fadmin-list #journal-item").off('click').on('click', admin_journals.load);

    };

    var init_switchers = function() {

        // change accounts
        $('#accounts-list a').off('click').on('click', function() {
            set_account($(this).data('account'));
        });

        // change modules
        $('#modules-list a').off('click').on('click', function() {
            set_module($(this).data('module'));
        });

        $('#categories-list a').off('click').on('click', function() {
            categories.show_category($(this).data('category'));
        });

        $('#dashboard-item').off('click').on('click', load);
    };
    var init_features = function() {
        $("#feature-list #chat-item").off('click').on('click', feature_chatrooms.load);
        $("#feature-list #news-item").off('click').on('click', feature_newsfeeds.load);
        $("#feature-list #journal-item").off('click').on('click', feature_journals.load);

        $("#feature-list #msgs-item").off('click').on('click', function () {
            feature_messages.set_config({
                arguments: '',
            });
            feature_messages.load();
        });
    };


    var init_profile = function() {

        $("#profile-list #profile-item").off('click').on('click', profile.load);
        $("#profile-list #account-item").off('click').on('click', profile_account.load);
        $("#profile-list #connections-item").off('click').on('click', profile_connections.load);
        $("#profile-list #referrals-item").off('click').on('click', profile_referrals.load);

        // improve/standardize logout here
        //$("#profile-list #password-item").off('click').on('click', profile.password_load);
        //$("#profile-list #twofactor-item").off('click').on('click', profile.twofactor_load);

    };

    return {
        load: load,
        set_account: set_account,
        set_module: set_module,
        mainmenu: mainmenu
    };
})(jQuery);
*/

