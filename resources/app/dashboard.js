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
