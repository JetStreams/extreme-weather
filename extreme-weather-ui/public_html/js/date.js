var DateInfo = (function () {
    var incrementDate = function (increment) {
        var date = new Date(2010, 0, 0);
        date.setDate(date.getDate() + increment);
        return date;
    }

    var format = function (date) {
        return $.format.date(date, 'dd MMM yyyy');
    }

    /** public visible */
    return {
        refresh: function (increment) {
            $('#date').text(format(incrementDate(increment)));
        }
    };

})($);