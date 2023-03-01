define(["dojo/_base/declare", "dojo/request"],

    function(declare, request) {
        return declare(null, {
            ADD_FACET: "search-event/facet-add",
            REMOVE_FACET: "search-event/facet-remove",
            REMOVE_FACET_REQUEST: "search-event/remove-facet-request",
            // DESTROY_ALL_FACETS: "search-event/destroy-all-facets",
            DATE_CHANGE: "search-event/date-change",
            START_DATE_CHANGE: "search-event/start-date-change",
            END_DATE_CHANGE: "search-event/end-date-change",
            BBOX_UPDATE: "search-event/bbox-update",
            BBOX_CHANGE: "search-event/bbox-change",
            CANCEL_MAP_DRAW: "search-event/cancel-map-draw",
            CONFIRM_MAP_DRAW: "search-event/confirm-map-draw",
            // VIEW_METADATA: "search-event/view-metadata",
            ADD_DATASET: "search-event/add-dataset",
            REMOVE_DATASET: "search-event/remove-dataset",
            CANCEL_REQUESTS: "search-event/cancel-requests",
            SEARCH_LOADED: "search-event/search-loaded",
            DATASET_COUNT_CHANGE: "search-event/dataset-count-change",
            TRIGGER_SEARCH: "search-event/trigger-search",
            SET_DATASETS_TO_LOAD: "search-event/set-datasets-to-load",

            constructor: function() {

            }
        });
    });
