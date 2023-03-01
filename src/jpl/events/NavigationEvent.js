define(["dojo/_base/declare", "dojo/request"],

    function(declare, request) {
        return declare(null, {
            OPEN_SIDEBAR: "navigation-event/open-sidebar",
            CLOSE_SIDEBAR: "navigation-event/close-sidebar",
            CHECK_SIDEBAR: "navigation-event/check-sidebar",
            SHRINK_SIDEBAR: "navigation-event/shrink-sidebar",
            EXPAND_SIDEBAR: "navigation-event/expand-sidebar",
            SELECT_PAGE: "navigation-event/select-page",
            SIDEBAR_READY: "navigation-event/sidebar-ready",
            SWITCH_TAB: "navigation-event/switch-tab",

            constructor: function() {

            }
        });
    });
