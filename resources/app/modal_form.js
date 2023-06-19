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
