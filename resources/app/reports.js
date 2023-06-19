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
