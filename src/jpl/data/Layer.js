define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * Class to store layer information.
     * @requires dojo/_base/declare
     * @class jpl.data.Layer
     */
    return declare("gov.nasa.jpl.data.Layer",[], /** @lends jpl.data.Layer.prototype */ {
        /**
         * @property {string} - ID of the layer
         * @type {string}
         * @description ID of the layer
         */
        uuid: "",
        /**
         * @property {string} - Mission name the layer belongs to
         * @type {string}
         * @description Mission name the layer belongs to
         */
        mission: "",
        /**
         * @property {string} - Instrument name the layer belongs to
         * @type {string}
         * @description Instrument name the layer belongs to
         */
        instrument: "",
        /**
         * @property {string} - Unique label for the layer, generally with a mission/resolution convention
         * @type {string}
         * @description Unique label for the layer, generally with a mission/resolution convention
         */
        productLabel: "",
        /**
         * @property {string} - Type of product the layer visualizes (Mosaic, Nomenclature, etc.)
         * @type {string}
         * @description Type of product the layer visualizes (Mosaic, Nomenclature, etc.)
         */
        productType: "",
        /**
         * @property {string} - GIS Protocol to use (ArcGIS, WMTS, etc.)
         * @type {string}
         * @description GIS Protocol to use (ArcGIS, WMTS, etc.)
         */
        serviceProtocol: "",
        /**
         * @property {string} - The URL to access the layer's main service
         * @type {string}
         * @description The URL to access the layer's main service
         */
        endPoint: "",
        /**
         * @property {string} - Optional URL to access the layer's WMS service if available
         * @type {string}
         * @description Optional URL to access the layer's WMS service if available
         */
        WMSEndPoint: "",
        /**
         * @property {string} - Layer indices if WMS is composed of more than a single layer
         * @type {string}
         * @description Layer indices if WMS is composed of more than a single layer
         */
        WMSLayers: "",
        /**
         * @property {string} - Type of ArcGIS Service (tiled, dynamic, etc.)
         * @type {string}
         * @description Type of ArcGIS Service (tiled, dynamic, etc.)
         */
        layerService: "",
        /**
         * @property {string} - The title of the layer
         * @type {string}
         * @description The title of the layer
         */
        layerTitle: "",
        /**
         * @property {string} - The subtitle of the layer
         * @type {string}
         * @description The subtitle of the layer
         */
        layerSubtitle: "",
        /**
         * @property {string} - The projection of the layer, generally IAU or EPSG
         * @type {string}
         * @description The projection of the layer, generally IAU or EPSG
         */
        layerProjection: "",
        /**
         * @property {string} - The default opacity of the layer on the map
         * @type {string}
         * @description The default opacity of the layer on the map
         */
        opacity: "1",
        /**
         * @property {string} - URL to a thumbnail image of the layer to be used in the layer panel
         * @type {string}
         * @description URL to a thumbnail image of the layer to be used in the layer panel
         */
        thumbnailImage: "",
        /**
         * @property {object} - Bounding coordinates of the layer: west, east, north, south
         * @type {object}
         * @description Bounding coordinates of the layer: west, east, north, south
         */
        boundingBox: {
            west: 0,
            east: 0,
            north: 0,
            south: 0
        },
        /**
         * @property {object} - Information for WMTS layers, tileMatrixSet, tileLayerName,
         * @type {object}
         * @description Bounding coordinates of the layer: west, east, north, south
         */
        wmts: null,
        /**
         * @property {string} - Optional URL to legend image for the layer
         * @type {string}
         * @description Optional URL to legend image for the layer
         */
        legendURL: "",
        /**
         * @property {string} - Optional URL to colorbar for the layer
         * @type {string}
         * @description Optional URL to the colorbar
         */
        colorbar: null,
        /**
         * @property {string} - Optional URL to colorbar for the layer
         * @type {string}
         * @description Optional URL to the colorbar
         */
        picasso: null,
        /**
         * @property {string} - Optional native resolution value
         * @type {string}
         * @description  Optional native resolution value
         */
        nativeResolution: null,
        /**
         * @property {boolean} - The current layer visible state as determined by the LayerControl (NOT opacity)
         * @type {boolean}
         * @description The current layer visible state as determined by the LayerControl (NOT opacity)
         */
        visible: false,
        /**
         * @property {object} - The current date and time for the layer (NOT the global, user-picked date)
         * @type {object}
         * @description The current date and time for the layer (NOT the global, user-picked date)
         */
        dateTime: null,

        constructor: function () {
        }
    });
});
