

define(["dojo/_base/declare", "dojo/request"],

    function (declare, request) {
        return declare(null, {
            SHOW_PICASSO_HISTOGRAM_PLOT: "tool-event/show-picasso-histogram-plot",
            UPDATE_PICASSO_HISTOGRAM_PLOT: "tool-event/update-picasso-histogram-plot",
            SHOW_ELEVATION_PLOT: "tool-event/show-elevation-plot",
            MINIMIZE_ELEVATION_PANE: "tool-event/minimize-elevation-plot",
            EXPAND_ELEVATION_PANE: "tool-event/expand-elevation-plot",
            SHOW_SUN_ANGLE_PLOT: "tool-event/show-sun-angle-plot",
            SHOW_LINE_POSITION_GRAPHIC: "tool-event/show-line-position-graphic",
            REMOVE_LAST_POLYLINE_GRAPHIC: "tool-event/remove-last_polyline-graphic",
            MOUSE_MOVED_OFF_ELEVATION_PLOT: "tool-event/mouse-moved-off-elevation-plot",
            SUN_ANGLE_DIALOG_RESPONSE: "tool-event/sun-angle-dialog-response",
            PLOT_DISTRIBUTION: "tool-event/plot-distribution",
            PLOT_STATISTICS: "tool-event/plot-statistics",
            START_SST_JOB: "tool-event/start-sst-job",
            SUBSET_DATA: "tool-event/subset-data",
            BOUNDING_CHANGED: "tool-event/bounding-changed",
            DOWNLOAD_IMAGE: "tool-event/download-image",

            constructor: function () {
            }
        });
    });
