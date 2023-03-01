

define(["dojo/_base/declare", "dojo/request"],

    function (declare, request) {
        return declare(null, {
            // Date selector events
            SELECT_START_DATE: "date-event/select-start-date",
            SELECT_END_DATE: "date-event/select-end-date",
            DATETIME_RANGE_UPDATED: "date-event/date-range-updated",

            constructor: function () {

            }
        });
    });