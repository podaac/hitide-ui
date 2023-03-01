define(["dojo/_base/declare", "dojo/request"],

    function(declare, request) {
        return declare(null, {
            REMOVE_DATASET: "granule-selection-event/remove-dataset",
            REMOVE_ALL_DATASETS: "granule-selection-event/remove-all-datasets",
            SWITCH_ACTIVE_GRANULES_CONTROLLER: "granule-selection-event/switch-active-dataset-controller",
            GRANULES_SEARCH_COMPLETE: "granule-selection-event/granules-search-complete",
            TOGGLE_VARIABLE_PREVIEW: "granule-selection-event/toggle-variable-preview",
            VARIABLES_FETCHED: "granule-selection-event/variables-fetched",
            ADD_GRANULE_FOOTPRINT: "granule-selection-event/add-granule-footprint",
            REMOVE_GRANULE_FOOTPRINT: "granule-selection-event/remove-granule-footprint",
            ADD_GRANULE_PREVIEW: "granule-selection-event/add-granule-preivew",
            REMOVE_GRANULE_PREVIEW: "granule-selection-event/remove-granule-preivew",

            constructor: function() {

            }
        });
    });
