define([
    "dojo/_base/declare",
    "dojo/topic",
    "jpl/utils/MakeSingletonUtil",
    "jpl/data/LayerCollection",
    "jpl/config/Config",
    "jpl/events/LayerEvent"
], function(declare, topic, MakeSingletonUtil, LayerCollection, Config, LayerEvent) {
    /**
     * Singleton to store layer objects for all projections. Extends LayerCollection for most of the functionality.
     * @requires dojo/_base/declare
     * @requires dojo/topic
     * @requires jpl/utils/MakeSingletonUtil
     * @requires jpl/data/LayerCollection
     * @requires jpl/config/Config
     * @requires jpl/events/LayerEvent
     * @class jpl.data.Layers
     * @extends jpl.data.LayerCollection
     */
    return MakeSingletonUtil(
        declare("gov.nasa.jpl.data.Layers", [LayerCollection], /** @lends jpl.data.Layers.prototype */ {
            //dont automatically call the superclass
            "-chains-": {
                constructor: "manual"
            },
            /**
             * Constructor function to setup parameters before calling the superclass LayerCollection. Layers is a
             * Singleton object so all instances are created with getInstance() instead of new()
             * @param {string} url - The url to call to get the base map data.
             * @return {promise} A promise that will return an array of base maps.
             */
            constructor: function() {
                this.config = Config.getInstance();
                //override the collection url to get basemaps
                this.url = this.config.layersServiceURL;
                //set the topic to fire when all basemaps are loaded
                this.loadedTopic = LayerEvent.prototype.LAYERS_LOADED;
                //manually call the superclass
                this.inherited(arguments);
            }
        })
    );
});