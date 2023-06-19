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
