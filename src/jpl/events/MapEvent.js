define([
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        BASEMAP_LOADED: "load",
        CENTER_MAP_AT: "map-event/center-map-at",
        CENTER_ZOOM_MAP_AT: "map-event/center-zoom-map-at",
        CHANGE_BASEMAP: "map-event/change-basemap",
        CHANGE_PROJECTION: "map-event/change-projection",
        CHANGE_SCALEBAR: "map-event/change-scalebar",
        EXPLORE_COMPLETE: "map-event/explore-complete",
        EXTENT_CHANGED: "extent-change",
        FLY_TO_TERRAIN: "map-event/fly-to-terrain",
        GLOBE_MOUSE_MOVED: "map-event/globe-mouse-moved",
        INITIALIZE_SCALEBARS: "map-event/init-scalebars",
        MAP_INITIALIZED: "map-event/map-initialized",
        MAP_MOVED: "map-event/map-moved",
        MAP_READY: "map-event/map-ready", // This event is fired when a single map is ready for use. May be fired multiple times, once for each map (2D or 3D)
        MAP_VIEW: "map-event/map-view",
        MINIMAP_CLICKED: "map-event/minimap-clicked",
        MOUSE_COORDINATE_CHANGE: "map-event/mouse-coordinate-change",
        MOUSE_MOVED: "mouse-move",
        PAN_END: "pan-end",
        PAN_START: "pan-start",
        PREVENT_ELEVATION_PLOT_SCROLL: "map-prevent-elevation-plot-scroll",
        PROJECTION_CHANGED: "map-event/projection-changed",
        SET_EXTENT: "map-event/set-extent",
        TERRAIN_VIEW: "map-event/terrain-view",
        TOOL_SELECTED: "map-event/tool-selected",
        ZOOM_IN: "map-event/map-zoom-in",
        ZOOM_OUT: "map-event/map-zoom-out",
        ZOOM_END: "zoom-end",
        GLOBE_INITIALIZED: "map-event/globe-initialized",
        GLOBE_ZOOM_IN_START: "map-event/globe-zoom-in-start",
        GLOBE_ZOOM_IN_END: "map-event/globe-zoom-in-end",
        GLOBE_ZOOM_OUT_START: "map-event/globe-zoom-out-start",
        GLOBE_ZOOM_OUT_END: "map-event/globe-zoom-out-end",
        TOGGLE_GAME_CONTROLS: "map-event/toggle-game-controls",
        MINIMIZE_3D_CONTAINER: "map-event/minimize-3d-container",
        MAXIMIZE_3D_CONTAINER: "map-event/maximize-3d-container",
        VIEW_3D: "map-event/view-3d",
        VIEW_2D: "map-event/view-2d",
        RELOAD_TILES: "map-event/reload-tiles",
        LOD_UPDATE: "map-event/lod-update",
        MAPLINK_LOADED: "map-event/maplink-updated",
        SPATIAL_FACET_MAP_READY: "map-event/spatial-facet-map-ready",

        constructor: function() {

        }
    });
});
