define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/dom",
    "dojo/on",
    "dojo/mouse",
    "dojo/topic",
    "dojo/query",
    "dojo/dom-style",
    "dojo/dom-class",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/SearchMap.html',
    "xstyle/css!./css/SearchMap.css",
    "jpl/config/Config",
    "jpl/utils/ConfigManager",
    "jpl/utils/MapUtil",
    "jpl/utils/DOMUtil",
    "jpl/events/MapEvent",
    "jpl/events/LayerEvent",
    "jpl/data/BaseMaps",
    "jpl/data/Layers",
    "esri/config",
    "esri/dijit/OverviewMap",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/Color",
    "esri/symbols/TextSymbol",
    "esri/layers/LabelLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/Font",
    "esri/symbols/SimpleMarkerSymbol"
], function (declare, lang, event, dom, on, mouse, topic, query, domStyle, domClass, _WidgetBase, _TemplatedMixin, template, css,
             Config, ConfigManager, MapUtil, DOMUtil, MapEvent, LayerEvent, BaseMaps, Layers, esriConfig, OverviewMap) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        visible: true,
        basemapsLoaded: false,
        layerGalleryInit: false,
        globeInit: false,
        mapInit: false,
        layersLoaded: false,

        constructor: function () {
        },

        postCreate: function () {
        },

        startup: function () {
            //initialize footer variables
            this.basemapSingleton = BaseMaps.getInstance();
            this.layerSingleton = Layers.getInstance();
            this.config = Config.getInstance();
            this.configManager = ConfigManager.getInstance();
            this.currentMapProjection = this.config.projection.EQUIRECT;

            topic.subscribe(LayerEvent.prototype.BASEMAPS_LOADED, lang.hitch(this, this.basemapsComplete));
            topic.subscribe(LayerEvent.prototype.LAYERS_LOADED, lang.hitch(this, this.layersComplete));
            topic.subscribe(LayerEvent.prototype.LAYER_GALLERY_INITIALIZED, lang.hitch(this, this.layerGalleryLoaded));
            topic.subscribe(MapEvent.prototype.GLOBE_INITIALIZED, lang.hitch(this, this.layerGalleryLoaded));
            topic.subscribe(MapEvent.prototype.GLOBE_MOUSE_MOVED, lang.hitch(this, this.mapMouseMoved));
            topic.subscribe(MapEvent.prototype.CENTER_MAP_AT, lang.hitch(this, this.centerMap));
            topic.subscribe(MapEvent.prototype.CENTER_ZOOM_MAP_AT, lang.hitch(this, this.centerAndZoomMap));
            topic.subscribe(MapEvent.prototype.PROJECTION_CHANGED, lang.hitch(this, this.projectionChanged));
            topic.subscribe(MapEvent.prototype.SET_EXTENT, lang.hitch(this, this.setMapExtent));
            topic.subscribe(MapEvent.prototype.TERRAIN_VIEW, lang.hitch(this, this.disableMap));
            topic.subscribe(MapEvent.prototype.MAP_VIEW, lang.hitch(this, this.enableMap));
            topic.subscribe(MapEvent.prototype.ZOOM_IN, lang.hitch(this, this.mapZoomInEvent));
            topic.subscribe(MapEvent.prototype.ZOOM_OUT, lang.hitch(this, this.mapZoomOutEvent));
            topic.subscribe(MapEvent.prototype.RELOAD_TILES, lang.hitch(this, this.reloadTiles));

            //disable the right click context menu on the map
            on(this, "contextmenu", function(evt){evt.preventDefault(); evt.stopPropagation();return false;});
        },

        projectionChanged: function(evt) {
            var extent;

            if(evt.projection === this.config.projection.EQUIRECT) {
                this.visible = true;
                this.currentMapProjection = this.config.projection.EQUIRECT;
                //domClass.remove("3dGlobeView", "containerVisible");
                //domClass.add("3dGlobeView", "containerHidden");
                domClass.remove("mainSearchMap", "containerHidden");
                domClass.add("mainSearchMap", "containerVisible");
                domStyle.set("cubeSpinner", "transform", "translateY(0)");
                domStyle.set("cubeSpinner", "-webkit-transform", "translateY(0)");
                extent = this.equirectMap.extent;
            } else if(evt.projection === this.config.projection.N_POLE) {
                this.visible = true;
                this.currentMapProjection = this.config.projection.N_POLE;
                //domClass.remove("3dGlobeView", "containerVisible");
                //domClass.add("3dGlobeView", "containerHidden");
                domClass.remove("mainSearchMap", "containerHidden");
                domClass.add("mainSearchMap", "containerVisible");
                domStyle.set("cubeSpinner", "transform", "translateY(100%)");
                domStyle.set("cubeSpinner", "-webkit-transform", "translateY(100%)");
                extent = this.northPoleMap.extent;
            } else if(evt.projection === this.config.projection.S_POLE) {
                this.currentMapProjection = this.config.projection.S_POLE;
                this.visible = true;
                //domClass.remove("3dGlobeView", "containerVisible");
                //domClass.add("3dGlobeView", "containerHidden");
                domClass.remove("mainSearchMap", "containerHidden");
                domClass.add("mainSearchMap", "containerVisible");
                domStyle.set("cubeSpinner", "transform", "translateY(-100%)");
                domStyle.set("cubeSpinner", "-webkit-transform", "translateY(-100%)");
                domStyle.set("cubeSpinner", "transform-origin", "-100% -100%");
                extent = this.southPoleMap.extent;
            } else if(evt.projection === this.config.projection.GLOBE_3D) {
                this.currentMapProjection = this.config.projection.GLOBE_3D;
                this.visible = false;
            }

            MapUtil.prototype.resizeFix();

            topic.publish(MapEvent.prototype.MAP_MOVED, {
                extent: this.currentMap().extent,
                projection: this.currentMapProjection,
                zoom: this.currentMap().getZoom()
            });
        },

        currentMap: function() {
            var map = null;
            if(this.currentMapProjection === this.config.projection.EQUIRECT) {
                map = this.equirectMap;
            } else if(this.currentMapProjection === this.config.projection.N_POLE) {
                map = this.northPoleMap;
            } else if(this.currentMapProjection === this.config.projection.S_POLE) {
                map = this.southPoleMap;
            }
            return map;
        },

        terrainViewClicked: function(evt) {
            topic.publish(MapEvent.prototype.TERRAIN_VIEW, null);
            //topic.publish(MapEvent.prototype.PROJECTION_CHANGED, {"projection": Projection.prototype.GLOBE_3D});
        },

        /***
         * Function to handle mouse moved events on the map
         * @evt {object} - mouse moved event object
         */
        mapMouseMoved: function (evt) {
            if (evt.mapPoint.x !== undefined && evt.mapPoint.y !== undefined) {

                var x=0, y=0;

                if(this.currentMapProjection === this.config.projection.N_POLE) {
                    var degObj = MapUtil.prototype.convertToDegrees(evt.mapPoint.x, evt.mapPoint.y, this.config.projection.SPATIAL_REFERENCES.N_POLE.proj4, this.config.projection.EXTENTS.N_POLE);
                    x = degObj.x;
                    y = degObj.y;
                } else if(this.currentMapProjection === this.config.projection.S_POLE) {
                    var degObj = MapUtil.prototype.convertToDegrees(evt.mapPoint.x, evt.mapPoint.y, this.config.projection.SPATIAL_REFERENCES.S_POLE.proj4, this.config.projection.EXTENTS.S_POLE);
                    x = degObj.x;
                    y = degObj.y;
                } else {
                    var degObj = MapUtil.prototype.convertToDegrees(evt.mapPoint.x, evt.mapPoint.y, this.config.projection.SPATIAL_REFERENCES.EQUIRECT.proj4, this.config.projection.EXTENTS.EQUIRECT);
                    x = degObj.x;
                    y = degObj.y;
                }

                topic.publish(MapEvent.prototype.MOUSE_COORDINATE_CHANGE, {
                    "x": x,
                    "y": y
                });

                // var picassoPngLayers = PicassoPngLayers.getInstance();
                // var values = picassoPngLayers.getValuesAt(evt.mapPoint.x, evt.mapPoint.y, this.currentMapProjection);
                // topic.publish(LayerEvent.prototype.LAYERS_VALUES_UPDATED, {
                //     values: values
                // });
            }
        },

        /***
         * Function to handle zoom events on the map
         * @evt {object} - Zoom event object
         */
        mapZoomed: function (evt) {
            /*if (evt.level !== undefined) {
                this.zoomVal.innerHTML = "1:" + this.equirectMap.getScale().toLocaleString();
            }*/
            if(this.visible) {
                topic.publish(MapEvent.prototype.MAP_MOVED, {
                    extent: this.currentMap().extent,
                    projection: this.currentMapProjection,
                    zoom: this.currentMap().getZoom()
                });
            }
        },

        mapPanEnd: function(evt) {
            if(this.visible) {
                topic.publish(MapEvent.prototype.MAP_MOVED, {
                    extent: this.currentMap().extent,
                    projection: this.currentMapProjection,
                    zoom: this.currentMap().getZoom()
                });
            }
        },

        extentChanged: function(evt) {
            if(this.visible) {
                topic.publish(MapEvent.prototype.LOD_UPDATE, {
                    lod: evt.lod
                });
            }
        },

        basemapsComplete: function() {
            this.basemapsLoaded = true;
            this.initializeMaps();
        },

        layersComplete: function() {
            this.layersLoaded = true;
            this.initializeMaps();
        },

        initializeMaps: function() {
            if(this.basemapsLoaded && this.layersLoaded) {
                this.equirectMap = MapUtil.prototype.createMap(this.mapContainer, 2, this.config.projection.EQUIRECT);
                //Initialization of the map event handlers
                on(this.equirectMap, MapEvent.prototype.MOUSE_MOVED, lang.hitch(this, this.mapMouseMoved));
                on(this.equirectMap, MapEvent.prototype.ZOOM_END, lang.hitch(this, this.mapZoomed));
                on(this.equirectMap, MapEvent.prototype.PAN_END, lang.hitch(this, this.mapPanEnd));
                on(this.equirectMap, MapEvent.prototype.BASEMAP_LOADED, lang.hitch(this, this.equirectBasemapLoaded));
                on(this.equirectMap, MapEvent.prototype.EXTENT_CHANGED, lang.hitch(this, this.extentChanged));

                //add the first basemap automatically
                MapUtil.prototype.addLayerToMap(this.basemapSingleton.centerLayerList[0], this.equirectMap, true);

                if(this.basemapSingleton.northLayerList.length > 0) {
                    this.northPoleMap = MapUtil.prototype.createMap(this.northPoleMapContainer, 1, this.config.projection.N_POLE);
                    on(this.northPoleMap, MapEvent.prototype.MOUSE_MOVED, lang.hitch(this, this.mapMouseMoved));
                    on(this.northPoleMap, MapEvent.prototype.ZOOM_END, lang.hitch(this, this.mapZoomed));
                    on(this.northPoleMap, MapEvent.prototype.PAN_END, lang.hitch(this, this.mapPanEnd));
                    on(this.northPoleMap, MapEvent.prototype.BASEMAP_LOADED, lang.hitch(this, this.northPoleBasemapLoaded));
                    on(this.northPoleMap, MapEvent.prototype.EXTENT_CHANGED, lang.hitch(this, this.extentChanged));
                    MapUtil.prototype.addLayerToMap(this.basemapSingleton.northLayerList[0], this.northPoleMap);
                }

                if(this.basemapSingleton.southLayerList.length > 0) {
                    this.southPoleMap = MapUtil.prototype.createMap(this.southPoleMapContainer, 1, this.config.projection.S_POLE);
                    on(this.southPoleMap, MapEvent.prototype.MOUSE_MOVED, lang.hitch(this, this.mapMouseMoved));
                    on(this.southPoleMap, MapEvent.prototype.ZOOM_END, lang.hitch(this, this.mapZoomed));
                    on(this.southPoleMap, MapEvent.prototype.PAN_END, lang.hitch(this, this.mapPanEnd));
                    on(this.southPoleMap, MapEvent.prototype.BASEMAP_LOADED, lang.hitch(this, this.southPoleBasemapLoaded));
                    on(this.southPoleMap, MapEvent.prototype.EXTENT_CHANGED, lang.hitch(this, this.extentChanged));
                    MapUtil.prototype.addLayerToMap(this.basemapSingleton.southLayerList[0], this.southPoleMap);
                }

                
            }
        },

        mapZoomInEvent: function() {
            var currentMap;

            if(this.currentMapProjection === this.config.projection.EQUIRECT) {
                currentMap = this.equirectMap;
            } else if(this.currentMapProjection === this.config.projection.N_POLE) {
                currentMap = this.northPoleMap;
            } else if(this.currentMapProjection === this.config.projection.S_POLE) {
                currentMap = this.southPoleMap;
            }

            MapUtil.prototype.mapZoomIn(currentMap);
        },

        mapZoomOutEvent: function() {
            var currentMap;

            if(this.currentMapProjection === this.config.projection.EQUIRECT) {
                currentMap = this.equirectMap;
            } else if(this.currentMapProjection === this.config.projection.N_POLE) {
                currentMap = this.northPoleMap;
            } else if(this.currentMapProjection === this.config.projection.S_POLE) {
                currentMap = this.southPoleMap;
            }

            MapUtil.prototype.mapZoomOut(currentMap);
        },

        equirectBasemapLoaded: function(evt) {

            topic.publish(LayerEvent.prototype.BASEMAP_CHANGED, {
                "productLabel": this.basemapSingleton.centerLayerList[0].productLabel,
                "projection": this.config.projection.EQUIRECT,
                "type": "basemap"
            });

            if(this.basemapSingleton.centerLayerList[0].serviceProtocol.toLowerCase() === 'arcgis') {
                this.setupMinimap(this.equirectMap);
            }

            topic.publish(MapEvent.prototype.MAP_INITIALIZED, null);
            topic.publish(MapEvent.prototype.INITIALIZE_SCALEBARS, {
                maps: {
                    equirect: this.equirectMap,
                    southPole: this.southPoleMap,
                    northPole: this.northPoleMap
                }
            });

            // console.log('map initialized');

            this.layerGalleryLoaded({eType: MapEvent.prototype.MAP_INITIALIZED});


                
            MapUtil.prototype.centerMapAt(this.equirectMap,0,0);
            MapUtil.prototype.resizeFix();
            topic.publish(MapEvent.prototype.MAP_READY, {map: this.equirectMap, projection: this.config.projection.EQUIRECT});
        },

        northPoleBasemapLoaded: function(evt) {
            MapUtil.prototype.centerMapAt(this.northPoleMap,0,0);
            MapUtil.prototype.resizeFix();
            topic.publish(MapEvent.prototype.MAP_READY, {map: this.northPoleMap, projection: this.config.projection.N_POLE});
        },

        southPoleBasemapLoaded: function(evt) {
            MapUtil.prototype.centerMapAt(this.southPoleMap,0,0);
            MapUtil.prototype.resizeFix();
            topic.publish(MapEvent.prototype.MAP_READY, {map: this.southPoleMap, projection: this.config.projection.S_POLE});
        },

        layerGalleryLoaded: function(evt) {
            if(evt.eType === LayerEvent.prototype.LAYER_GALLERY_INITIALIZED) {
                this.layerGalleryInit = true;
            } else if(evt.eType === MapEvent.prototype.GLOBE_INITIALIZED) {
                this.globeInit = true;
            } else if(evt.eType === MapEvent.prototype.MAP_INITIALIZED) {
                this.mapInit = true;
            }

            if(this.globeInit && this.mapInit && this.layersLoaded) {
                for (var l = 0; l < this.layerSingleton.northLayerList.length; l++) {
                    var lyr = this.layerSingleton.northLayerList[l];
                    topic.publish(LayerEvent.prototype.ADD_TO_MY_DATA, {
                        productLabel: lyr.productLabel,
                        projection: lyr.layerProjection,
                        thumbnailURL: lyr.thumbnailImage
                    });
                }


                for (var l = 0; l < this.layerSingleton.southLayerList.length; l++) {
                    var lyr = this.layerSingleton.southLayerList[l];
                    topic.publish(LayerEvent.prototype.ADD_TO_MY_DATA, {
                        productLabel: lyr.productLabel,
                        projection: lyr.layerProjection,
                        thumbnailURL: lyr.thumbnailImage
                    });
                }


                //Add the equirect last so we start on this map
                for (var l = 0; l < this.layerSingleton.centerLayerList.length; l++) {
                    var lyr = this.layerSingleton.centerLayerList[l];
                    topic.publish(LayerEvent.prototype.ADD_TO_MY_DATA, {
                        productLabel: lyr.productLabel,
                        projection: lyr.layerProjection,
                        thumbnailURL: lyr.thumbnailImage
                    });
                }
            }


        },

        setupMinimap: function(map) {
            this.overviewMapDijit = new OverviewMap({
                id: "minimapEqui",
                map: map,
                color: "#FF0000",
                //baseLayer: bmlayer,
                expandFactor: 20,
                width: 300,
                height: 150
            }, "overviewMapContainer");
            this.overviewMapDijit.startup();
            this.overviewMapDijit.show();
            this.overviewMapDijit.resize({"h":150, "w":300});
            domStyle.set("minimapEqui", "display", "none");
        },

        minimapClicked: function() {
            domStyle.set("minimapEqui", "display", "none");
            topic.publish(MapEvent.prototype.MINIMAP_CLICKED, null);
        },

        centerMap: function(evt) {
            MapUtil.prototype.centerMapAt(this.equirectMap, evt.x, evt.y);
        },

        centerAndZoomMap: function(evt) {
            var map;

            if(evt.projection === this.config.projection.EQUIRECT) {
                map = this.equirectMap;
            } else if(evt.projection === this.config.projection.N_POLE) {
                map = this.northPoleMap;
            } else if(evt.projection === this.config.projection.S_POLE) {
                map = this.southPoleMap;
            }

            MapUtil.prototype.centerAndZoomMapAt(map, evt.x, evt.y, evt.zoom);
        },

        setMapExtent: function(evt) {
            MapUtil.prototype.setMapExtent(evt.extent.xmin, evt.extent.ymin, evt.extent.xmax, evt.extent.ymax, this.equirectMap);
        },

        disableMap: function() {
            if(!this.overviewMapDijit) {
                return;
            }

            this.visible = false;
            this.overviewMapDijit.resize({"h":150, "w":300});
            domStyle.set("minimapEqui", "display", "block");
            domStyle.set('overviewMapClickContainer', "display", "block" );
        },

        enableMap: function() {
            if(!this.overviewMapDijit) {
                return;
            }
            this.visible = true;
            this.overviewMapDijit.resize({"h":150, "w":300});
            domStyle.set("minimapEqui", "display", "none");
            domStyle.set('overviewMapClickContainer', "display", "none" );
        },

        reloadTiles: function(evt) {
            var currentMap;
            if (this.currentMapProjection === this.config.projection.EQUIRECT) {
                currentMap = this.equirectMap;
            } else if (this.currentMapProjection === this.config.projection.N_POLE) {
                currentMap = this.northPoleMap;
            } else if (this.currentMapProjection === this.config.projection.S_POLE) {
                currentMap = this.southPoleMap;
            }

            var layers = currentMap.getLayersVisibleAtScale(currentMap.getScale());
            for (var i = 0; i < layers.length; i++) {
                layers[i].refresh();
            }
        }
    });
});
