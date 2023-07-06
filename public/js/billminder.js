var dashboard = (function ($, undefined) {

    var help_text = '';
    var accordion_divs = [
        '#account-div',
        '#category-div',
    ];
    var auxiliary_divs = [
        '#miles-div',
        '#hours-div',

    ]

    var initialize = function() {
        subscriber();
        fetchdata('entry');
    };

    var list = function(name) {
        var auxdiv = '#'+name+'-div';
        if($(auxdiv).data('open') == true) {
            $(auxdiv).slideUp(300, function() {
                $(auxdiv).html('').data('open', false);
            });
            if(name == 'miles' || name == 'hours') {
                $('#entry-div').slideDown(300);
                $('#entry-controls').slideDown(300);
            }
        } else {
            hide_others(accordion_divs);
            if(name == 'miles' || name == 'hours') {
                hide_others(auxiliary_divs);
                $('#entry-div').slideUp(300);
                $('#entry-controls').slideUp(300);
            }
            fetchdata(name);
        }

    }

    var hide_others = function(list) {
        list.forEach(function(element){
            if($(element).data('open') == true) {
                $(element).slideUp(300, function() {
                    $(element).html('').data('open', false);
                });
            }
        });
    }


    var subscriber = function() {
        $.ajax({
            url: '/profile/subscriber',
            cache: false,
            dataType: 'json'
        })
        .done(function(response) {
            if(typeof(response.help_text) == 'string') {
                help_text = response.help_text;
            }

            if(typeof(response.subscribed_at) != 'string') {
                $('.subscribe-div').show();
            } else {
                $('.reports-div').show();
                $('.hours-div').show();
                $('.miles-div').show();
            }
        })
        .fail(function(message) {
            utility.ajax_fail(message);
        });
    };


    var fetchdata = function(dtype) {

        $.ajax({
            url: '/' + dtype,
            cache: false,
            data: {
                'q': $('#q').val(),
            },
            dataType: 'json'
        })
        .done(function(response) {
            $('#' + dtype + '-div').html('');
            if(dtype == 'entry') {
                if (response.length ==0 && !$('#welcome-div').is(":visible")) {
                    $('#welcome-div').slideDown(300);
                }
                if (response.length !=0 && $('#welcome-div').is(":visible")) {
                    $('#welcome-div').slideUp(300);
                }
            }
            response.forEach(function (el) {
                $('#' + dtype + '-div').append(library.drawElement(dtype, el));
            });
            if(dtype == 'miles') {
                $('#miles-div').prepend('<h4>Travel</h4>');
                // $('#miles-div').append(library.pageRow); // might move up to forEach:, conditionally
                // setPageRow();

            }
            if(dtype == 'hours') {
                $('#hours-div').prepend('<h4>Time</h4>');
                // $('#hours-div').append(library.pageRow); // might move up to forLoop:, conditionally
                // setPageRow();
            }
            $('#' + dtype + '-div').data('open', true);
            $('#' + dtype + '-div').slideDown(300);
        })
        .fail(function(message) {
            utility.ajax_fail(message);
        });
    };

    var setPageRow = function() {
        // enable nav buttons,
        // set page_num and page_count
    };

    var add = function(type, income) {
        url = '/' + type + '/create';
        if(typeof(income) != 'undefined')
            url += '?income='+income;
        $.ajax({
            url: url,
            cache: false,
            dataType: 'json'
        })
        .done(function (resp) {
            if(type == 'miles' || type == 'hours') {
                var n = new Date();
                resp.form[0][0]['parameters']['value']= n.getFullYear() + '-' +
                    String(n.getMonth()+1).padStart(2, '0') + '-' +
                    String(n.getDate()).padStart(2, '0');  //date
                resp.form[0][1]['parameters']['value']= n.toLocaleString("en-US", {
                    'hour12': false,
                    'hour':'2-digit',
                    'minute':'2-digit',
                    });  //time
            }

            showModalForm(type, null, resp,
                function() {hideModal();},
                function() {store(type);}
                );
        })
        .fail(function (message) {
            utility.ajax_fail(message);
        });

    };

    var store = function(type) {
        $('.modal-body form').on('submit', function (e) {
            e.preventDefault();
            if (true) {
                var data = $(this).serializeArray();
                data.push({
                    name: "_token",
                    value: $("meta[name='csrf-token']").attr("content")
                });

                if ($(this).valid()) $.ajax({
                        type: "POST",
                        url: '/' + type,
                        data: $.param(data),
                        dataType: 'json'
                    })
                    .done(function (resp) {
                        utility.show_message(resp, function () {
                            hideModal();
                            fetchdata(type);
                        });
                    })
                    .fail(function (message) {
                        utility.ajax_fail(message);
                    });
            }
        }).validate(type.update_rules);
    };

    var show = function(type, id) {
        $.ajax({
            url: '/' + type + '/' + id,
            cache: false,
            dataType: 'json'
        })
        .done(function (resp) {
            showModalForm(type, id, resp,
                function() {hideModal();},
                function() {}
                );
        })
        .fail(function (message) {
            utility.ajax_fail(message);
        });
    };

    var showModalForm = function(type, id, resp, cb_cancel, cb_submit) {
        $('.modal-body').html(modal_form.js_form_build(resp));
        $('.modal-header').html('<h5 class="modal-title">'+resp.title+'</h5>');
        $('.modal-header').append(modal_form.js_panel_control(resp.controls.head));
        $('.modal-footer').html('');
        if(typeof(resp.actions) == 'object') {
            $('.modal-footer').append(modal_form.js_panel_action(resp.actions));
        }
        $('.modal-footer').append(modal_form.js_panel_control(resp.controls.foot));
        if(!$('#myModal').is(':visible')) {
            $('#genericModal').modal('show');

        }
        utility.set_dynamic_button('#control-cancel', function () {

            if(typeof(cb_cancel) == 'function') cb_cancel();
        });

        utility.set_dynamic_button('.btn-action', function() {
            actionGet(this, type, id);
        });

        utility.set_dynamic_button('#control-save', function () {
            $('.modal-body form').submit();
        });

        utility.set_dynamic_button('#control-edit', function () {
            edit(type, id);
        });

        utility.set_dynamic_button('#control-delete', function () {
            destroy(type, id);
        });

        utility.set_dynamic_button('#control-help', helpShow);


        if(typeof(cb_submit) == 'function') cb_submit();
    };

    var hideModal = function() {
        $('#genericModal').modal('hide');
        utility.reset_dynamic_button('#control-cancel');
        utility.reset_dynamic_button('#control-save');
        $('.modal-footer').html('');
        $('.modal-title').html('');
        $('.modal-header').html('');
    };




    var actionGet = function(self, type, id) {
        action = $(self).data('action');
        $.ajax({
            url: '/' + type + '/' + id + '/action?action=' + action ,
            cache: false,
            dataType: 'json'
        })
        .done(function (resp) {
            switch(resp.action) {
                case 'show':  showModalForm(type, null, resp,
                    function() {hideModal();},
                    function() {}
                ); break;
                case 'create':
                    showModalForm(type, null, resp,
                        function() {hideModal();},
                        function() {actionPost(action, type, id);}
                    );
                    break;
                case 'edit':  showModalForm(type, null, resp,
                    function() {},
                    function() {actionPatch(action, type, id);}
                ); break;
                default: utility.show_message(resp, function () {
                    fetchdata(type);
                }); break;
            }

        })
        .fail(function (message) {
            utility.ajax_fail(message);
        });
    };

    var actionPost = function(action, type, id) {
        $('.modal-body form').on('submit', function (e) {

            e.preventDefault();
            var data = $('form').serializeArray();
                    data.push({
                        name: "_token",
                        value: $("meta[name='csrf-token']").attr("content")
                    });

            $.ajax({
                url: '/' + type + '/' + id + '/action?action=' + action ,
                cache: false,
                type: "POST",
                data: $.param(data),
                dataType: 'json'
            })
            .done(function (resp) {
                hideModal();
                utility.show_message(resp, function () {
                    fetchdata(type);
                });

            })
            .fail(function (message) {
                utility.ajax_fail(message);
            });
        });
    };

    var actionPatch = function(action, type, id) {
        $('.modal-body form').on('submit', function (e) {
            e.preventDefault();
            var data = $('form').serializeArray();
            data.push({
                name: "_token",
                value: $("meta[name='csrf-token']").attr("content")
            });
            $.ajax({
                url: '/' + type + '/' + id + '/action?action=' + action,
                cache: false,
                type: "PATCH",
                data: $.param(data),
                dataType: 'json'
            })
            .done(function (resp) {
                switch(resp.action) {
                    case 'show':  show(type, id); break;
                    case 'create':
                        showModalForm(type, null, resp,
                            function() {},
                            function() {actionPost(type);}
                        );
                        break;
                    case 'edit':  edit(type, id); break;
                    default: utility.show_message(resp, function () {
                        hideModal();
                        fetchdata(type);
                    }); break;
                }

            })
            .fail(function (message) {
                utility.ajax_fail(message);
            });
        });
    };

    var edit = function(type, id) {
        $.ajax({
            url: '/' + type + '/' + id + '/edit',
            cache: false,
            dataType: 'json'
        })
        .done(function (resp) {
            showModalForm(type, id, resp,
                function() {show(type, id);},
                function() {update(type, id);}
            );
        })
        .fail(function (message) {
            utility.ajax_fail(message);
        });
    };

    var update = function(type, id) {
        $('.modal-body form').on('submit', function (e) {
            e.preventDefault();
            if (true) {
                var data = $(this).serializeArray();
                data.push({
                    name: "_token",
                    value: $("meta[name='csrf-token']").attr("content")
                });

                if ($(this).valid()) $.ajax({
                        type: "PATCH",
                        url: '/' + type + '/' + id,
                        data: $.param(data),
                        dataType: 'json'
                    })
                    .done(function (resp) {
                        utility.show_message(resp, function () {
                            hideModal();
                            fetchdata(type);
                            if(type == 'category') {
                                fetchdata('entry');
                            }
                        });
                    })
                    .fail(function (message) {
                        utility.ajax_fail(message);
                    });
            }
        }).validate(type.update_rules);
    };


    var cycle = function(type, id) {
        var data = [{
            name: "_token",
            value: $("meta[name='csrf-token']").attr("content")
        }];

        if (confirm()) $.ajax({
            type: "patch",
            url: '/' + type + '/' + id + '/cycle',
            data: $.param(data),
            dataType: 'json'
        })
        .done(function (resp) {
            utility.show_message(resp, function () {
                fetchdata(type);
            });
        })
        .fail(function (message) {
            utility.ajax_fail(message);
        });
    };


    var destroy = function(type, id) {
        var data = [{
            name: "_token",
            value: $("meta[name='csrf-token']").attr("content")
        }];

        if (confirm()) $.ajax({
            type: "DELETE",
            url: '/' + type + '/' + id,
            data: $.param(data),
            dataType: 'json'
        })
        .done(function (resp) {
            utility.show_message(resp, function () {
                hideModal();
                fetchdata(type);
                $('#genericModal').modal('hide');
            });
        })
        .fail(function (message) {
            utility.ajax_fail(message);
        });
    };


    var helpDashboard = function() {

        $('.modal-header').html('<h5 class="modal-title">Help</h5>');
        // just the close button
        $('.modal-header').append(modal_form.js_panel_control([{
            'title': 'Close', 'class': 'btn-secondary', 'id':  'control-close', 'icon': 'far fa-xmark'
        }]));
        utility.set_dynamic_button('#control-close', function() {
            hideModal();
            $('.modal-footer').show();
        });
        $('.modal-body').html(help_text);
        $('.modal-footer').hide();
        if(!$('#myModal').is(':visible')) {
            $('#genericModal').modal('show');

        }
      };

    var helpShow = function() {
        $('.help-text').slideDown(300);
        utility.set_dynamic_button('#control-help', helpHide);
    };

    var helpHide = function() {
        $('.help-text').slideUp(300);
        utility.set_dynamic_button('#control-help', helpShow);
    };

    return {
        initialize: initialize,
        list: list,
        helpDashboard: helpDashboard,
        showModalForm: showModalForm,
        hideModal: hideModal,
        add: add,
        edit: edit,
        show: show,
        destroy: destroy,
    };
})(jQuery);

var subscription = (function ($, undefined) {

    var showOffer = function() {
        $('.modal-header').html('<h5 class="modal-title">Subscribe Today</h5>');
        $('.modal-header').append(modal_form.js_panel_control([
            {'title': 'Close', 'class': 'btn-secondary', 'id': 'control-cancel', 'icon':'far fa-times'},
        ]));
        $('.modal-body').html(offer_text);
        $('.modal-footer').html(modal_form.js_panel_action([
            {
                'label': 'Subscribe Now',
                'title': 'Subscribe Now',
                'button_class': 'btn-success m-1',
                'icon': 'fas fa-piggy-bank fa-shake',
                'id': 'utility-advance',
                'action': 'collect_payment',
            }

        ]));
        if(!$('#myModal').is(':visible')) {
            $('#genericModal').modal('show');
        }

        utility.set_dynamic_button('#utility-advance', collectPayment);
        utility.set_dynamic_button('#control-cancel', hideModal);
    };

    var collectPayment = function() {
        $('.modal-body').html(payment_form);
        $('.modal-footer').html(modal_form.js_panel_action([
            {
                'label': 'Start My Subscription',
                'title': 'Start My Subscription',
                'button_class': 'btn-primary m-1',
                'icon': 'fas fa-credit-card fa-flip',
                'id': 'utility-advance',
                'action': 'post_payment',
            }

        ]));
        initPaymentForm();
        utility.reset_dynamic_button('#utility-advance');
        utility.set_dynamic_button('#utility-advance', function() {
            $('.modal-body form').submit();
        });
    };

    var initPaymentForm = function() {
        $('.modal-body form').on('submit', function (e) {
            e.preventDefault();
            var data = $('form').serializeArray();
                    data.push({
                        name: "_token",
                        value: $("meta[name='csrf-token']").attr("content")
                    });

            $.ajax({
                url: '/subscription/new',
                cache: false,
                type: "POST",
                data: $.param(data),
                dataType: 'json'
            })
            .done(function (resp) {
                showThanks();
            })
            .fail(function (message) {
                utility.ajax_fail(message);
            });
        });
    };

    var showThanks = function() {
        $('.modal-body').html(complete_text);
        $('.modal-footer').html(modal_form.js_panel_action([
            {
                'label': 'Thank You',
                'title': 'Thank You',
                'button_class': 'btn-primary m-1',
                'icon': 'fas fa-hearts-face fa-bounce',
                'id': 'utility-advance',
                'action': 'reload-page',
            }

        ]));
        utility.reset_dynamic_button('#utility-advance');
        utility.set_dynamic_button('#utility-advance', hideModal);
    };

    var hideModal = function() {
        $('#genericModal').modal('hide');
        utility.reset_dynamic_button('#control-cancel');
        utility.reset_dynamic_button('#utility-advance');
        $('.modal-footer').html('');
        $('.modal-title').html('');
        $('.modal-header').html('');
    };


    var complete_text = "<p>Thanks for supporting Billminder, and safe,secure internet applications development. " +
    "Remember, our subscribers always get new features first, and some features remain exclusives!</p>";

    var offer_text = "<p>A subscription helps to fund continued development of Billminder.</p>" +
        "<p>We never have advertisers, and we don't allow user data access to anyone!</p>" +
        "<p>Subscribers always get new features first.</p>" +
        "<p>Some features will always be exclusive to subscribers</p>" +
        "<p>Upcoming Subscriber-Only Features include: <ul>" +
        "<li>downloadable reports</li>" +
        "<li>changable encryption keys for your personal data</li>" +
        "<li>access to your bank accounts for balance and autopay checks</li>" +
        "</ul></p>" +

        "<p>Currently, Subscription is only $30 US per year, and your subscription fee is guaranteed never to increase as long as you are are a subscriber.</p>" +
        "<p>Subscribe today!  Your subscription will be added to your billminder list, as well!</p>"
    ;

    var payment_form =  "<p>Billminder subscription is $30 per year.  This will be added to your billminder list, as well.</p>" +
    "<form id = 'payment-form'>" +
        "<div class='row'>" +
        "<div class='col-12 col-lg-6 offset-lg-3'>" +
        "<label>Name on Card *</label>" +
        "<input class='form-control' name='cardname' placeholder='Name on Card' required>" +
        "</div>" +
        "<div class='col-12 col-lg-6 offset-lg-3'>" +
        "<label>Card Number*</label>" +
        "<input class='form-control' name='cardnum' placeholder='Card Number' required>" +
        "</div>" +
        "<div class='col-lg-2 offset-lg-3 col-sm-12'>" +
        "<label>Month*</label>" +
        "<select class='form-control' name='exp_month' required>" +
        "<option value = '01'>01-January</option><option value = '02'>02-February</option>" +
        "<option value = '03'>03-March</option><option value = '04'>04-April</option>" +
        "<option value = '05'>05-May</option><option value = '06'>06-June</option>" +
        "<option value = '07'>07-July</option><option value = '08'>08-August</option>" +
        "<option value = '09'>09-September</option><option value = '10'>10-October</option>" +
        "<option value = '11'>11-November</option><option value = '12'>12-December</option>" +
        "</select>" +
        "</div>" +
        "<div class='col-lg-2 col-sm-12'>" +
        "<label>Year*</label>" +
        "<input class='form-control' name='exp_year' placeholder='YYYY' required>" +
        "</div>" +
        "<div class='col-lg-2 col-sm-12'>" +
        "<label>Security Code*</label>" +
        "<input class='form-control' name='cvc' placeholder='***' required >" +
        "</div>" +
        "</div>" +
        "</form>";
    return {
        showOffer: showOffer,
    };
})(jQuery);

var reports = (function ($, undefined) {

    var show = function () {
        add();
    };

    var add = function () {
        url = '/reports/create';
        $.ajax({
                url: url,
                cache: false,
                dataType: 'json'
            })
            .done(function (resp) {
                dashboard.showModalForm('reports', null, resp,
                    function () {
                        dashboard.hideModal();
                    },
                    function () {
                        store();
                    }
                );
                $('#beg_date_div').hide();
                $('#end_date_div').hide();
                $('#category_id_div').hide();
                $('#account_id_div').hide();
                $('#payee_id_div').hide();
                $('#payor_id_div').hide();
                $("input[name='type']").off().on('click', function() {set_options(this);});
            })
            .fail(function (message) {
                utility.ajax_fail(message);
            });
    };

    var set_options = function (obj) {
        $('#category_id_div').show();
        switch($(obj).attr('id')) {
            case 'type-register-income':
                $('#beg_date_div').show();
                $('#end_date_div').show();
                $('#account_id_div').show();
                $('#payor_id_div').show();
                $('#payee_id_div').hide();
                break;
            case 'type-entry-income':
                $('#beg_date_div').hide();
                $('#end_date_div').hide();
                $('#account_id_div').show();
                $('#payor_id_div').show();
                $('#payee_id_div').hide();
            break;
            case 'type-register-expense':
                $('#beg_date_div').show();
                $('#end_date_div').show();
                $('#account_id_div').show();
                $('#payor_id_div').hide();
                $('#payee_id_div').show();
            break;
            case 'type-entry-expense':
                $('#beg_date_div').hide();
                $('#end_date_div').hide();
                $('#account_id_div').show();
                $('#payor_id_div').hide();
                $('#payee_id_div').show();
            break;
            default:
                $('#beg_date_div').show();
                $('#end_date_div').show();
                $('#account_id_div').hide();
                $('#payee_id_div').hide();
                $('#payor_id_div').hide();
                break;
        }
    };

    var store = function () {

        $('.modal-body form').on('submit', function (e) {
            e.preventDefault();
            if (true) {
                var data = $(this).serializeArray();
                data.push({
                    name: "_token",
                    value: $("meta[name='csrf-token']").attr("content")
                });

                if ($(this).valid()) $.ajax({
                        type: "POST",
                        url: '/reports/immediate',
                        data: $.param(data)
                    })

                    .done(function (resp) {
                        url = '/reports/immediate';
                        var ifrm = document.createElement('iframe');
                        ifrm.id ='retriever_frame';
                        ifrm.setAttribute('src', url);
                        ifrm.style.width='0px';
                        ifrm.style.height='0px';
                        ifrm.style.border='0px';
                        document.body.appendChild(ifrm);
                        dashboard.hideModal();
                        return false;
                    })
                    .fail(function (message) {
                        utility.ajax_fail(message);
                    });
            }
        }).validate(update_rules);
    };

    var update_rules = [];

    return {
        show: show,
    };
})(jQuery);

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

var library = (function ($, undefined) {

    var drawEntry = function(el) {
        html = "<div class='row'><div class='col-12 mb-2'><div class='app-draw-row entry-"+ el.status+"' onclick=\"dashboard.show('entry', "+el.id+");\">";
        html += "<div class='row'>";
        html += "<div class='col-3 col-lg-1 text-start'>" + entryIcon(el.status);
        html += (el.autopay == 1?"<i class='fa fa-solid fa-robot' title='Autopay'></i>":"");
        html += "</div>";
        html += "<div class='col-4 col-lg-2 text-end'>";
        html += (el.estimated_date == 1?"<i class='fa fa-solid fa-circle-question' title='Estimated'></i>&nbsp;":"");
        html += (typeof(el.next_due_date) == 'string'?dateFormat(el.next_due_date):"<i class='fa fa-solid fa-circle-exclamation' title='Date Not Set'></i>");
        html += "</div>";
        html += "<div class='col-5 col-lg-2 text-end'>" +
            (el.estimated_amount == 1?"<i class='fa fa-solid fa-circle-question' title='Estimated'></i>&nbsp;":"") +
            (el.amount == '0.00'?"<i class='fa fa-solid fa-circle-exclamation' title='Amount Not Set'></i>":el.amount) + "</div>";
        html += "<div class='col-12 col-lg-4 text-start'>"+ el.name + "</div>";
        html += "<div class='d-none d-lg-inline col-lg-3 text-start'>"+ (typeof(el.category) != 'string'?'Unassigned':el.category) + "</div>";
        html += '</div></div></div>';
        return html;
    };

    var entryIcon = function(status) {
        switch (status) {
            case 'income': return '<i class="fa-solid fa-badge-dollar fa-fw" title="Income"></i>';
            case 'late': return '<i class="fa-solid fa-triangle-exclamation fa-fw" title="Late"></i>';
            case 'due': return '<i class="fa-solid fa-alarm-clock fa-fw" title="Due"></i>';
            case 'expense': return '<i class="fa-solid fa-file-invoice-dollar fa-fw" title="Expense"></i>';
            case 'open': return '<i class="fa-solid fa-door-open fa-fw" title="Open"></i>';
            case 'closed': return '<i class="fa-solid fa-thumbs-up fa-fw" title="Closed"></i>';
        }
    };

    var drawSecondary = function(type, el) {
        html = "<div class='row'><div class='col-12 offset-lg-2 col-lg-8'>" +
        "<div class='app-draw-row category ml-2 mr-4 px-2' onclick=\"dashboard.show('"+type+"', "+el.id+");\">";
        html += el.label;
        html += '</div></div></div>';
        return html;
    };

    var drawAuxiliary = function(type, el) {

        html = "<div class='row'><div class='col-12 mb-2'><div class='app-draw-row ";
        html +=  (typeof(el.interval) == 'string'?'category':"open-record");
        html += "' onclick=\"dashboard.show('"+type+"', "+el.id+");\">";
        html += "<div class='row'>";
        html += "<div class='col-5 col-lg-2 text-end'>" + el.activity_date + "</div>";
        html += "<div class='col-5 col-lg-2 text-end'>" + el.beg_value + "</div>";
        html += "<div class='col-5 col-lg-2 text-end'>" +
            (typeof(el.interval) == 'string'?el.interval:"<i class='fa fa-solid fa-folder-open' title='End Value Not Set Not Set'></i>&nbsp;&nbsp;Open Record") + "</div>";
        html += "<div class='col-12 col-lg-3 text-start'>"+ el.name + "</div>";
        html += "<div class='d-none d-lg-inline col-lg-3 text-start'>"+ (typeof(el.category) != 'string'?'Unassigned':el.category) + "</div>";
        html += '</div>' + '</div></div>';
        return html;
    };

    var dateFormat = function(value) {
        var dateval = new Date(value);
        return dateval.toDateString().substring(4,10);
    };

    var drawButton = function(attr) {
        htmlString = "<button title='" + attr.title + "' type='button' ";
        htmlString += "class='btn btn-primary btn-utility' id='" + attr.btn_id + "'>";
        if (attr.hasOwnProperty('icon')) {
            htmlString += "<span class='" + attr.icon + "'></span>";
        }
        if (attr.hasOwnProperty('label')) {
            htmlString += "<span>&nbsp;" + attr.label + "</span>";
        }
        htmlString += '</button>';
    };

    var drawElement = function(type, el) {
        switch(type) {
            case('entry'):
                return drawEntry(el);
            case('hours'):
            case('miles'):
                return drawAuxiliary(type, el);
            default:
                return drawSecondary(type, el);
        }
        return '';
    };

    var pageRow = function() {
        var htmlString = "<div class='row'>" +
        "<div class='col-2'><div id='page_frst' class='btn btn-app-primary centered' role='button' title = 'first'><i class='fa-regular fa-person-to-door'></i></div></div>"+
        "<div class='col-2'><div id='page_prev' class='btn btn-app-primary centered' role='button' title = 'previous'><i class='fa-regular fa-person-to-door'></i></div></div>"+
        "<div class='col-4 centered'><span id='page_num'>1</span> of <span id='page_count'>1</span></div>"+
        "<div class='col-2'><div id='page_next' class='btn btn-app-primary centered' role='button' title = 'next'><i class='fa-regular fa-person-to-door'></i></div></div>"+
        "<div class='col-2'><div id='page_last' class='btn btn-app-primary centered' role='button' title = 'last'><i class='fa-regular fa-person-to-door'></i></div></div>"+
        "</div>"
        return htmlString;
    };

    return {
        drawElement: drawElement,
        drawButton: drawButton,
        pageRow: pageRow,
    };
})(jQuery);

var modal_form = (function ($, undefined) {
    var mode = 'show';
    var library = {
        input_checkbox: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div' ";

            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }

            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label><br>";
            }
            htmlString += "<label class='cb3switch' ><input type='checkbox' name='" + attr.datapoint + "' id='is_" + attr.datapoint + "' ";
            if (attr.hasOwnProperty('cbvalue')) {
                htmlString += " value='" + attr.cbvalue + "' ";
            } else {
                htmlString += " value='1' ";
            }
            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                htmlString += " disabled='disabled' ";
            }

            if (attr.hasOwnProperty('checked') || attr.value == 1 || attr.value) {
                htmlString += " checked ";
            } else if (attr.hasOwnProperty('value') && (attr.value == 1 || attr.value == attr.cbvalue)) {
                htmlString += " checked ";
            }
            htmlString += "><span class='cb3slider' for='is_" + attr.datapoint + "'></span></label>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div>";
            htmlString += "</div>";
            return htmlString;
        },

        input_date: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div'";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }
            htmlString += "<div class='input-group'><input class='form-control' type='date' " +
                "id='" + attr.datapoint + "' name='" + attr.datapoint + "' ";
            if (attr.hasOwnProperty('placeholder')) {
                htmlString += " placeholder='" + attr.placeholder + "'";
            }
            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                htmlString += " disabled='disabled' ";
            }

            if (attr.hasOwnProperty('value')) {
                htmlString += " value='" + attr.value + "' ";
            }
            htmlString += " ></div>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";
            return htmlString;
        },


        input_time: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div'";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }
            htmlString += "<div class='input-group'><input class='form-control' type='time' " +
                "id='" + attr.datapoint + "' name='" + attr.datapoint + "' ";
            if (attr.hasOwnProperty('placeholder')) {
                htmlString += " placeholder='" + attr.placeholder + "'";
            }
            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                htmlString += " disabled='disabled' ";
            }

            if (attr.hasOwnProperty('value')) {
                htmlString += " value='" + attr.value + "' ";
            }
            htmlString += " ></div>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";
            return htmlString;
        },


        input_hidden: function (attr) {
            htmlString = "<input type='hidden' " +
                "id='" + attr.datapoint + "' name='" + attr.datapoint + "' ";
            if (attr.hasOwnProperty('value')) {
                htmlString += " value='" + attr.value + "' ";
            }
            htmlString += " >";
            return htmlString;
        },

        input_radio: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div'";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }

            if (attr.hasOwnProperty('vertical')) {
                htmlString += "<div class='btn-group-vertical btn-group-toggle w-100 text-center' ";
            } else {
                htmlString += "<div class='btn-group-toggle w-100 text-center' ";

            }
            htmlString += " data-toggle='buttons'>";

            attr.list.forEach(function (element) {
                htmlString += "<label class='btn btn-radio' for='" + attr.datapoint + "-" + element.value + "' >" +
                    "<input type='radio' id='" + attr.datapoint + "-" + element.value + "' ";
                if (attr.hasOwnProperty('value') && attr.value == element.value) {
                    htmlString += " checked ";
                }
                if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                    htmlString += " disabled='disabled' ";
                }

                htmlString += "name='" + attr.datapoint + "' value='" + element.value + "'> " +
                    element.label + "</label>";
            });
            htmlString += "</div>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";
            return htmlString;
        },

        input_text: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div' ";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }

            htmlString += "<div class='input-group'><input type='text' " +
                "id='" + attr.datapoint + "' name='" + attr.datapoint + "' ";

            if (attr.hasOwnProperty('numeric')) {
                htmlString += " class='form-control text-end' ";
            } else {
                htmlString += " class='form-control' ";
            }

            if (attr.hasOwnProperty('placeholder')) {
                htmlString += " placeholder='" + attr.placeholder + "'";
            }

            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                htmlString += " disabled='disabled' ";
            }

            if (attr.hasOwnProperty('value')) {
                htmlString += " value='" + attr.value + "' ";
            }

            htmlString += " ></div>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";
            return htmlString;
        },


        input_url: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "' id='" + attr.datapoint + "_div' ";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }

            htmlString += "<div class='input-group'>";
            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                if(typeof(attr.value) == 'string') {
                    htmlString += "<a target='_new' href='" + attr.value + "'>" + attr.value + "</a>";
                }
            } else {
                htmlString += "<input type='text' id='" + attr.datapoint + "' name='" + attr.datapoint + "' ";

                if (attr.hasOwnProperty('placeholder')) {
                    htmlString += " placeholder='" + attr.placeholder + "'";
                }

                if (attr.hasOwnProperty('value')) {
                    htmlString += " value='" + attr.value + "' ";
                }
                htmlString += " class='form-control' >";
            }
            htmlString += "</div>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";
            return htmlString;
        },


        input_password: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div' ";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }
            htmlString += "<div class='input-group'><input type='password' " +
                "id='" + attr.datapoint + "' name='" + attr.datapoint + "' ";
            if (attr.hasOwnProperty('placeholder')) {
                htmlString += " placeholder='" + attr.placeholder + "'";
            }
            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                htmlString += " disabled='disabled' ";
            }
            if (attr.hasOwnProperty('value')) {
                htmlString += " value='" + attr.value + "' ";
            }
            if (attr.hasOwnProperty('numeric')) {
                htmlString += " class='form-control text-end' ";
            } else {
                htmlString += " class='form-control' ";
            }
            htmlString += " ></div>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";
            return htmlString;
        },

        download: function (attr) {
            return "<div class='" + attr.grid_class + "'><a href='" + attr.value + "' target='_new' class='media'> VIEW FILE</a></div>";
        },


        image: function (attr) {
            return "<div class='" + attr.grid_class + "'><img src='" + attr.value + "' class='media' / ></div>";
        },

        audio: function (attr) {
            return "<audio class='" + attr.grid_class + "' controls><source src='" + attr.value + "' class='media' / ></audio>";
        },

        video: function (attr) {
            return "<video class='" + attr.grid_class + "' controls><source src='" + attr.value + "'  class='media' / ></video>";
        },


        select: function (attr) {
            temp = [];
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div' ";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }

            htmlString += "<select data-live-search='true' class='form-control selectpicker'  id='sel_" + attr.datapoint + "' ";
            if(attr.hasOwnProperty('allow_new')) {
                htmlString += " onChange = 'modal_form.check_new(\"" + attr.datapoint + " \");' ";
            }

            if (attr.hasOwnProperty('multiple') && attr.multiple == true) {
                htmlString += "  name='" + attr.datapoint + "[]' multiple='multiple' ";
            } else {
                htmlString += "  name='" + attr.datapoint + "'";
            }

            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                htmlString += " disabled='disabled' ";
            }

            htmlString += ">";

            if(attr.hasOwnProperty('allow_null')) {
                htmlString += "<option ";
                if (!attr.hasOwnProperty('value') || attr.value == '-99') {
                    htmlString += "selected ";
                }
                if( typeof attr.allow_null == 'boolean' ) {
                    htmlString += "value = '-99'>- not selected -</option>\n";
                } else {
                    htmlString += "value = '-99'>" + attr.allow_null + "</option>\n";

                }

            }

            attr.list.forEach(function (element) {
                htmlString += "<option ";
                if (attr.hasOwnProperty('value') && attr.value == element.value) {
                    htmlString += " selected ";
                }

                htmlString += "value='" + element.value + "'>";
                htmlString += element.label;
                htmlString += "</option>\n";
            });
            if(attr.hasOwnProperty('allow_new')) {
                htmlString += "<option value = '_new'>New "+ attr.label + "</option>\n";
            }

            htmlString += "</select>";

            if(attr.hasOwnProperty('allow_new')) {
                htmlString += "<input class='form-control app-hidden' type='text' " +
                "id='new_" + attr.datapoint + "' name='new_" + attr.datapoint + "' >";
            }

            attr.list.forEach(function (element) {
                if (attr.hasOwnProperty('value') && attr.value == element.value) {
                    if(element.hasOwnProperty('website') && element.website != '' && typeof(element.website) == 'string') {
                        htmlString += "<a target='_new' href='"+element.website+"'>"+element.label+"</a>";
                    }
                }
            });
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";


            return htmlString;
        },

        textarea: function (attr) {
            htmlString = "<div class='" + attr.grid_class + "'  id='" + attr.datapoint + "_div' ";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += ">" +
                "<div class='form-group'>";
            if (attr.hasOwnProperty('label')) {
                htmlString += "<label for='" + attr.datapoint + "' class='control-label'>" + attr.label + "</label>";
            }
            htmlString += "<textarea class='form-control' ";

            if ((attr.hasOwnProperty('disabled') && attr.disabled == true) || mode == 'show') {
                htmlString += " disabled='disabled' ";
            }
            if (attr.hasOwnProperty('rows')) {
                htmlString += " rows='" + attr.rows + "' ";
            }
            if (attr.hasOwnProperty('placeholder')) {
                htmlString += " placeholder='" + attr.placeholder + "' ";
            }
            htmlString += " id='" + attr.datapoint + "' name='" + attr.datapoint + "' >";
            if (attr.hasOwnProperty('value')) {
                htmlString += attr.value;
            }
            htmlString += "</textarea>";
            if(attr.hasOwnProperty('title')) {
                htmlString += "<div class='help-text app-hidden' >" + attr.title + "</div>";
            }
            htmlString += "</div></div>";
            return htmlString;
        },

        spacer: function (attr) {
            return "<div class='" + attr.grid_class + "'>&nbsp;</div>";
        },

        help_text: function (attr) {
            return "<div id='" + attr.datapoint + "' class='" + attr.grid_class + " help-text app-hidden' ><p>" + attr.text + "</p></div>";
        },

        static_text: function (attr) {
            return "<div class='" + attr.grid_class + "'><p>" + attr.text + "</p></div>";
        },

        divider: function (attr) {
            return "<div class='" + attr.grid_class + "'><hr></div>";
        },

        button_control: function (attr) {
            htmlString = "<button title='" + attr.title + " ' type='button' " +
                "class='btn " + attr.class + " btn-control app-hidden' id='" + attr.id + "' ";
                if(attr.hasOwnProperty('title')) {
                    htmlString += " title='" + attr.title + "' ";
                }
                htmlString += ">";
            if (attr.hasOwnProperty('icon')) {
                htmlString += "<span class='" + attr.icon + "'></span>";
            }
            if (attr.hasOwnProperty('caption')) {
                htmlString += "<span>&nbsp;" + attr.caption + "</span>";
            }
            htmlString += "</button>";
            return htmlString;
        },

        button_action: function (attr) {
            htmlString = "<button title='" + attr.title + "' type='button' ";
            if(attr.hasOwnProperty('title')) {
                htmlString += " title='" + attr.title + "' ";
            }
            htmlString += "";
            if (attr.hasOwnProperty('disabled')) {
                htmlString += ' disabled';
            }
            if (attr.hasOwnProperty('action')) {
                htmlString += " data-action='" + attr.action + "'";
            }
            if (attr.hasOwnProperty('data')) {
                htmlString += ' ' + attr.data;
            }
            htmlString += " class='btn " + attr.button_class + " btn-action app-hidden' id='" + attr.id + "'>";
            if (attr.hasOwnProperty('icon')) {
                htmlString += " <span class='" + attr.icon + "'></span>";
            }
            if (attr.hasOwnProperty('label')) {
                htmlString += " <span>&nbsp;" + attr.label + "</span>";
            }
            htmlString += ' </button>';

            if (attr.hasOwnProperty('grid_class')) {
                htmlString = "<div class='" + attr.grid_class + "'>" + htmlString + "</div>";
            }
            return htmlString;
        }

    };

    var panel_control = function (list) {
        htmlString = '';
        htmlString += "<div class='modal-control-panel'>";
        htmlString += button_control(list);
        htmlString += "</div>";
        return htmlString;
    };

    var button_control = function (list) {
        htmlString = '';
        htmlString += "<div class='btn-group'>";
        list.forEach(function (element) {
            htmlString += library.button_control(element);
        });
        htmlString += "</div>";
        return htmlString;
    };

    var panel_action = function (list) {
        htmlString = '';
        htmlString += "<div data='yes' class='modal-action-panel'>";
        list.forEach(function (element) {
            htmlString += library.button_action(element);
        });
        htmlString += "</div class='modal-action-panel'>";
        return htmlString;
    };

    var button_action = function (element) {
        htmlString = '';
        htmlString += library.button_action(element);
        return htmlString;
    };

    var table_build = function (content) {
        /* card body -- table here */
        htmlString += "<div class='index-table col-lg-12'>";
        htmlString += "<table id='" + content.table_name + "' class='hover display-table w-100'>";
        htmlString += "<tbody></tbody><tfoot></tfoot></table></div>";
        return htmlString;
    };

    var form_element = function(element) {
        return library[element.type](element.parameters);
    };

    var form_build = function (content) {
        mode = content.mode;
        htmlString = "<form id='" + content.form_name + "_form' class='form' data-mode='" + content.mode + "' ";
        if (content.hasOwnProperty('upload_form')) {
            htmlString += "enctype='multipart/form-data'> ";
        } else {
            htmlString += "accept-charset='UTF-8'> ";
        }
        if (content.hasOwnProperty('csrf')) { // may not do this at all. but rely on client-side csrf meta value for protection.
            htmlString += "<input type='hidden' name='_token' value='" + attr.csrf + "'>";
        }
        htmlString += "<div class='edit-body container'>";
        content.form.forEach(function (row) {
            htmlString += "<div class='row'>";
            row.forEach(function (element, content) {
                // untested: watch for action working properly
                if(content.mode == 'create') {
                    if(typeof(element.parameters.create != 'undefined') && element.parameters.create === false ) {
                        element.parameters.disabled = true;
                    }
                } else if(content.mode == 'edit') {
                    if(typeof(element.parameters.edit != 'undefined') && element.parameters.edit === false ) {
                        element.parameters.disabled = true;
                    }
                }
                htmlString += form_element(element);
            });
            htmlString += "</div>";
        });
        htmlString += "</div>";
        htmlString += "</form>";

        return htmlString;
    };

    var check_new = function(datapoint) {
        if($('#sel_'+datapoint).val() == '_new') {
            $('#new_'+datapoint).show();
        } else {
            $('#new_'+datapoint).hide();
        }
    };

    return {
        js_form_element: form_element,
        js_panel_control: panel_control,
        js_panel_action: panel_action,
        js_button_control: button_control,
        js_button_action: button_action,
        js_table_build: table_build,
        js_form_build: form_build,
        check_new: check_new,
    };
})(jQuery);
