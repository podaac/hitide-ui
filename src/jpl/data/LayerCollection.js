define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/request",
    "dojo/on",
    "dojo/_base/array",
    "jpl/config/Config",
    "dojo/request/xhr",
    "jpl/data/Layer",
    "jpl/events/LayerEvent",
    "jpl/events/MapEvent"
], function(declare, lang, topic, request, on, array, Config, xhr, Layer, LayerEvent, MapEvent) {
        /**
         * Retrieves and stores map layers for all defined projections.
         * @module jpl/data/LayerCollection
         * @requires dojo/_base/declare
         * @requires dojo/_base/lang
         * @requires dojo/topic
         * @requires dojo/request
         * @requires dojo/on
         * @requires jpl/config/Config
         * @requires dojo/request/xhr
         * @requires jpl/data/Layer
         * @requires jpl/events/LayerEvent
         * @requires jpl/events/MapEvent
         * @class jpl.data.LayerCollection
         */

        return declare(null, /** @lends jpl.data.LayerCollection.prototype */ {
            /**
             * @property {string} - URL to retrieve the layers from. Should be set in the class that extends LayerCollection,
             * otherwise will default to the configuration layer service URL.
             * @type {string}
             * @description URL to retrieve the layers from. Should be set in the class that extends LayerCollection,
             * otherwise will default to the configuration layer service URL.
             */
            url: "",
            /**
             * @property {boolean} - Value to determine if base maps have been loaded previously
             * @type {boolean}
             * @description Value to determine if base maps have been loaded previously
             */
            mapsLoaded: false,
            /**
             * @property {string} - The active map projection, used as a reference from other modules
             * @type {string}
             * @description The active map projection, used as a reference from other modules
             */
            currentMapProjection: null,
            /**
             * @property {array} - Collection for all equirectangular projection base map layers
             * @type {array}
             * @description Collection for all equirectangular projection base map layers
             */
            centerLayerList: [],
            /**
             * @property {array} - Collection for all north pole projection base map layers
             * @type {array}
             * @description Collection for all north pole projection base map layers
             */
            northLayerList: [],
            /**
             * @property {array} - Collection for all south pole projection base map layers
             * @type {array}
             * @description Collection for all south pole projection base map layers
             */
            southLayerList: [],
            /**
             * @property {string} - The topic name to publish when all items have finished loading
             * @type {string}
             * @description The topic name to publish when all items have finished loading
             */
            loadedTopic: "",

            /**
             * Constructor function that is used once to setup, and is destroyed immediately after. Since this is a
             * Singleton, you do not use the new() operator, but instead use getInstance(). URL property should be overridden
             * before the constructor is called, otherwise the Layer Service URL is used by default. All layers will be
             * loaded into a corresponding projection collection.
             * @return {null}
             */
            constructor: function() {
                if(!this.mapsLoaded) {
                    this.config = Config.getInstance();

                    if(this.url === "") {
                       //if url has not been set, default to layers service
                       this.url = this.config.layersServiceURL;
                    }

                    var self = this;
                    //get and set the layers
                    this.getAllLayers(this.url).then(function(dataList){
                        self.setAllLayers(dataList, self.config.projection);
                    });

                    //default to equirect projection
                    this.currentMapProjection = this.config.projection.EQUIRECT;

                    //when projection is changed, update the current projection here
                    topic.subscribe(MapEvent.prototype.PROJECTION_CHANGED, lang.hitch(this, function(evt) {
                        this.currentMapProjection = evt.projection;
                    }));

                    //when layer is shown or hidden, update visible property of that layer
                    topic.subscribe(LayerEvent.prototype.SHOW_LAYER, function(evt) {
                        evt.layer.visible = true;
                    });

                    topic.subscribe(LayerEvent.prototype.HIDE_LAYER, function(evt) {
                        evt.layer.visible = false;
                    });
                }
            },

            /**
             * Retrieves all layers and returns a promise containing an array of base maps.
             * @param {string} url - The url to call to get the base map data.
             * @return {promise} A promise that will return an array of base maps.
             */
            getAllLayers: function(url) {
                //return the promise
                return xhr(url, {
                    handleAs: "json"
                }).then(function(data) {
                    //return the actual data once the call is done
                    return data.Layers.Layer;
                }, function(err) {
                    throw new Error("Could not retrieve layers from (" + url + ") - " + err);
                });
            },

            /**
             * Stores all base maps into their corresponding collection to be used throughout the application.
             * @param {array} layers - The array of layers to be stored.
             * @param {object} projections - A projection object, generally copied from the config before passed.
             * @return {null}
             */
            setAllLayers: function(layers, projections) {
                for(var i=0; i < layers.length; i++) {
                    //create the layer
                    var layer = this.createLayer(layers[i]);
                    //determine the projectin of the layer and store in that collection
                    if (layer.layerProjection === projections.N_POLE) {
                        this.northLayerList.push(layer);
                    } else if (layer.layerProjection === projections.S_POLE) {
                        this.southLayerList.push(layer);
                    } else if (layer.layerProjection === projections.EQUIRECT) {
                        this.centerLayerList.push(layer);
                    }
                }

                //set the flag that all layers have been loaded and fire off an event for anyone listening
                this.mapsLoaded = true;
                //if a topic was passed in, fire it off to signify completion
                if(this.loadedTopic !== "") {
                    topic.publish(this.loadedTopic, null);
                }
            },

            /**
             * Creates a layer object to be stored into a collection
             * @param {object} attributes - The layer attributes from the retrieved data
             * @return {layer} A Layer object with all attributes set
             */
            createLayer: function(attributes) {
                var layer = new Layer();
                layer.uuid = attributes.UUID;
                layer.mission = attributes.Mission;
                layer.instrument = attributes.Instrument;
                layer.productLabel = attributes.ProductLabel;
                layer.productType = attributes.ProductType;
                layer.serviceProtocol = attributes.ServiceProtocol;
                layer.layerService = attributes.LayerService;
                layer.endPoint = attributes.EndPoint;
                layer.WMSEndPoint = attributes.WMSEndPoint;
                layer.WMSLayers = attributes.WMSLayer;
                layer.layerTitle = attributes.LayerTitle;
                layer.layerSubtitle = attributes.LayerSubtitle;
                layer.description = attributes.description;
                layer.thumbnailImage = attributes.ThumbnailImage;
                layer.layerProjection = attributes.LayerProjection;
                layer.boundingBox.west = attributes.bounding.westbc;
                layer.boundingBox.east = attributes.bounding.eastbc;
                layer.boundingBox.north = attributes.bounding.northbc;
                layer.boundingBox.south = attributes.bounding.southbc;
                layer.legendURL = attributes.legend;
                if(attributes.wmts) {
                    layer.wmts = {
                        "tileMatrixSet": attributes.wmts.tileMatrixSet,
                        "tileLayerName": attributes.wmts.tileLayerName,
                        "tileFormat": attributes.wmts.tileFormat,
                        "dateTime": attributes.wmts.dateTime,
                        "granule": (attributes.wmts.granule ? attributes.wmts.granule : false)
                    }
                }
                layer.colorbar = attributes.colorbar;
                if(attributes.picasso) {
                    layer.picasso = {
                        "units": attributes.picasso.units,
                        "min": attributes.picasso.min,
                        "max": attributes.picasso.max
                    }
                }
                layer.nativeResolution = attributes.nativeResolution;

                return layer;
            },

            /**
             * Searches and retrieves a base map from a collection. If projection and projections are not passed, it will search
             * all collections for a match.
             * @param {string} productLabel - The product label for the layer to be retrieved
             * @param {string} projection - Optional, The projection of the product to determine the collection to search in
             * @param {object} projections - Optional, A projection object, generally copied from the config before passed
             * @return {layer} A Layer object
             */
            getLayerByProductLabel: function(productLabel, projection, projections) {
                if(projection && projections) {
                    var layerCollection;
                    //get the collection to use from the projection passed in
                    if (projection === projections.N_POLE) {
                        layerCollection = this.northLayerList;
                    } else if (projection === projections.S_POLE) {
                        layerCollection = this.southLayerList;
                    } else if (projection === projections.EQUIRECT) {
                        layerCollection = this.centerLayerList;
                    }

                    //cycle through the collection to find the match
                    for(var i=0; i < layerCollection.length; i++) {
                        if(layerCollection[i].productLabel === productLabel) {
                            return layerCollection[i];
                            break;
                        }
                    }
                } else {
                    //search equirect layers
                    for(var cidx=0; cidx < this.centerLayerList.length; cidx++) {
                        if(this.centerLayerList[cidx].productLabel === productLabel) {
                            return this.centerLayerList[cidx];
                        }
                    }

                    //search north pole layers
                    for(var nidx=0; nidx < this.northLayerList.length; nidx++) {
                        if(this.northLayerList[nidx].productLabel === productLabel) {
                            return this.northLayerList[nidx];
                        }
                    }

                    //search south pole layers
                    for(var sidx=0; sidx < this.southLayerList.length; sidx++) {
                        if(this.southLayerList[sidx].productLabel === productLabel) {
                            return this.southLayerList[sidx];
                        }
                    }
                }

                return null;
            },

            getAllCurrentVisibleLayers: function() {
                var layerCollection;
                var visibleLayers;
                if (this.currentMapProjection === this.config.projection.N_POLE) {
                    layerCollection = this.northLayerList;
                } else if (this.currentMapProjection === this.config.projection.S_POLE) {
                    layerCollection = this.southLayerList;
                } else if (this.currentMapProjection === this.config.projection.EQUIRECT) {
                    layerCollection = this.centerLayerList;
                }
                visibleLayers = array.filter(layerCollection, function(layer) {
                    return layer.visible;
                });
                return visibleLayers;
            }
        }
    );
});
