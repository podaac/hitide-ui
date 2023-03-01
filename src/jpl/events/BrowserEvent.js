define(["dojo/_base/declare", "dojo/request"],
    function(declare, request) {
        return declare(null, {
            WINDOW_RESIZED: "browser-event/window-resized",
            FINISHED_RESIZING: "browser-event/finished-resizing",
            CONFIG_LOADED: "browser-event/config-loaded",
            CONFIG_READY: "browser-event/config-ready",
            CONFIG_UPDATED: "browser-event/config-updated",
            SAVE_CONFIG: "browser-event/save-config",
            FEAT_DETECT_COMPLETE: "browser-event/feature-detect-complete",
            SHOW_ALERT: "browser-event/show-alert",
            TOGGLE_LOAD_DIALOG: "browser-event/toggle-load-dialog",
            PREFERENCES_CHANGED: "browser-event/preferences-changed",

            constructor: function() {

            }
        });
    });
