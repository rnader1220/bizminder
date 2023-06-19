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
