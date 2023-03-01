
define(["dojo/_base/declare", "dojo/request"],

    function (declare, request) {
        return declare(null, {
            BASEMAPS_LOADED: "layer-event/basemaps-loaded",
            BASEMAP_CHANGED: "layer-event/basemap-changed",
            SHOW_BASEMAP_CONTAINER: "layer-event/show-basemap-container",
            HIDE_BASEMAP_CONTAINER: "layer-event/hide-basemap-container",
            LAYERS_LOADED: "layer-event/layers-loaded",
            LAYERS_CHANGED: "layer-event/layers-changed",
            ADD_TO_MY_DATA: "layer-event/add-to-my-data",
            SHOW_ADDED_LAYERS_CONTAINER: "layer-event/show-added-layers-container",
            HIDE_ADDED_LAYERS_CONTAINER: "layer-event/hide-added-layers-container",
            CHANGE_OPACITY: "layer-event/change-opacity",
            CHANGE_LAYER_ENDPOINT: "layer-event/change-endpoint",
            SHOW_LAYER: "layer-event/show-layer",
            HIDE_LAYER: "layer-event/hide-layer",
            REORDER_LAYERS: "layer-event/reorder-layers",
            SHOW_EXPLORE_CONTAINER: "layer-event/show-explore-container",
            HIDE_EXPLORE_CONTAINER: "layer-event/hide-explore-container",
            LAYER_GALLERY_INITIALIZED: "layer-event/layer-gallery-init",
            LAYER_CONTROL_LOADED: "layer-event/layer-control-loaded",
            LAYERS_VALUES_UPDATED: "layer-event/layers-values-updated",
            CESIUM_LAYER_LOADED: "layer-event/cesium-layer-loaded",
            LAYER_CRID_CHANGED: "layer-event/layer-crid-changed",
            LAYER_CRID_UPDATED: "layer-event/layer-crid-updated",
            CREATE_LAYER: "layer-event/create-layer",
            COLOR_PALETTE_HOVER: "layer-event/color-palette-hover",
            COLOR_PALETTE_HOVER_EXIT: "layer-event/color-palette-hover-exit",

            constructor: function () {

            }
        });
    });