define(["dojo/_base/declare", "dojo/request"],

    function(declare, request) {
        return declare(null, {
            LOGIN_STATUS_CHANGE: "mydata-event/login-status-change",
            GRANULE_COUNT_CHANGE: "mydata-event/granule-count-change",
            CANCEL_REQUESTS: "mydata-event/cancel-requests",
            SWITCH_ACTIVE_GRANULES_CONTROLLER: "mydata-event/switch-active-granules-controller",
            ADD_DOWNLOAD_QUERY: "mydata-event/add-download-query",
            REMOVE_DOWNLOAD_QUERY: "mydata-event/remove-download-query",
            REMOVE_DOWNLOAD_QUERY_NOTIFY: "mydata-event/remove-download-query-notify",

            constructor: function() {

            }
        });
    });
