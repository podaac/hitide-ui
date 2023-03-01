var showCloudMigrationDialog = !!window.hitideConfig.showCloudMigrationDialog;

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/query",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/ControlBar.html',
    "xstyle/css!./css/ControlBar.css",
    "jpl/config/Config",
    "jpl/dijit/ScaleBar",
    "jpl/events/MapEvent",
    "jpl/events/BrowserEvent",
    "jpl/events/NavigationEvent",
    "jpl/utils/MapUtil",
    "jpl/utils/FeatureDetector",
    "jpl/utils/DOMUtil",
    "jpl/dijit/LegendsAndOpacity",
    "jpl/dijit/ui/CloudMigrationDialog",
    "dojo/NodeList-traverse",
    "dojo/NodeList-dom",
    "bootstrap/Tooltip"
], function(declare, lang, has, on, topic, domStyle, domConstruct, domAttr, domClass, query, registry, _WidgetBase, _TemplatedMixin,
    template, css, Config, ScaleBar, MapEvent, BrowserEvent, NavigationEvent, MapUtil,
    FeatureDetector, DOMUtil, LegendsAndOpacity, CloudMigrationDialog) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        activeControlOption: "",
        currentView: "map",
        gameControlsEnabled: false,
        configReady: false,
        enableMapResolution: false,

        constructor: function() {},

        postCreate: function() {},

        startup: function() {
            this.detectedFeatures = FeatureDetector.getInstance();
            this.config = Config.getInstance();
            this.setSubscriptions();
            this.setEventHandlers();
            this.checkConfiguration();
            this.initLegendsAndOpacityController();
            if(showCloudMigrationDialog)
                new CloudMigrationDialog().startup();
        },

        setSubscriptions: function() {
            topic.subscribe(MapEvent.prototype.INITIALIZE_SCALEBARS, lang.hitch(this, this.initScalebars));
            topic.subscribe(MapEvent.prototype.PROJECTION_CHANGED, lang.hitch(this, this.projectionChanged));
            topic.subscribe(MapEvent.prototype.LOD_UPDATE, lang.hitch(this, this.resolutionChanged));
            topic.subscribe(BrowserEvent.prototype.CONFIG_READY, lang.hitch(this, function(evt) {
                this.configReady = true;
            }));

            if (!this.detectedFeatures.mobileDevice) {
                topic.subscribe(MapEvent.prototype.MOUSE_COORDINATE_CHANGE, lang.hitch(this, this.updatePositionLabel));
            }

            if (this.detectedFeatures.webGL) {
                topic.subscribe(MapEvent.prototype.MAP_VIEW, lang.hitch(this, this.mapViewEnabled));
                topic.subscribe(MapEvent.prototype.TERRAIN_VIEW, lang.hitch(this, this.terrainViewEnabled));
                topic.subscribe(MapEvent.prototype.VIEW_2D, lang.hitch(this, this.view2DEnabled));
                topic.subscribe(MapEvent.prototype.VIEW_3D, lang.hitch(this, this.view3DEnabled));
            }
        },

        setEventHandlers: function() {
            on(this.mapZoomInBtn, "click", lang.hitch(this, this.mapZoomInClicked));
            on(this.mapZoomOutBtn, "click", lang.hitch(this, this.mapZoomOutClicked));
            on(this.mapZoomInBtn, "mousedown", lang.hitch(this, this.mapZoomInHold));
            on(this.mapZoomOutBtn, "mousedown", lang.hitch(this, this.mapZoomOutHold));
            on(this.mapZoomInBtn, "mouseup", lang.hitch(this, this.mapZoomInRelease));
            on(this.mapZoomOutBtn, "mouseup", lang.hitch(this, this.mapZoomOutRelease));
            on(this.view3DBtn, "click", lang.hitch(this, this.view3DClicked));

            if (!this.detectedFeatures.mobileDevice) {
                on(this.overviewBtn, "click", lang.hitch(this, this.overviewClicked));
                on(this.fullscreenBtn, "click", lang.hitch(this, this.fullscreenClicked));
            }

            if (this.detectedFeatures.webGL && !this.detectedFeatures.mobileDevice) {
                on(this.view2DBtn, "click", lang.hitch(this, this.view2DClicked));
            }

            if (!this.detectedFeatures.mobileDevice && this.detectedFeatures.webGL) {
                on(this.gameControlsBtn, "click", lang.hitch(this, this.gameControlsClicked));
            }

        },

        checkConfiguration: function() {
            if (!this.config.controls.search) {
                this.controlItemSearch = domConstruct.destroy(this.controlItemSearch);
            }
            if (!this.config.controls.login) {
                this.controlItemLogin = domConstruct.destroy(this.controlItemLogin);
            }
            if (!this.config.controls.help) {
                this.controlItemHelp = domConstruct.destroy(this.controlItemHelp);
            }
            if (!this.config.controls.layers) {
                this.controlItemLayers = domConstruct.destroy(this.controlItemLayers);
            }
            if (!this.config.controls.explore) {
                this.controlItemExplore = domConstruct.destroy(this.controlItemExplore);
            }
            if (!this.config.controls.mydata) {
                this.controlItemMyData = domConstruct.destroy(this.controlItemMyData);
            }
            if (!this.config.controls.tools) {
                this.controlItemTools = domConstruct.destroy(this.controlItemTools);
            }
            if (!this.config.controls.projection) {
                this.controlItemProjection = domConstruct.destroy(this.controlItemProjection);
            }
            if (!this.config.controls.basemaps) {
                this.controlItemBasemaps = domConstruct.destroy(this.controlItemBasemaps);
            }
            if (!this.config.controls.dateselector) {
                this.controlItemDateSelector = domConstruct.destroy(this.controlItemDateSelector);
            }
            if (!this.config.controls.mappermalink) {
                this.controlItemMapPermalink = domConstruct.destroy(this.controlItemMapPermalink);
            }
            if (!this.config.controls.downloads) {
                this.controlItemDownloads = domConstruct.destroy(this.controlItemDownloads);
            }
            if (!this.config.controls.preferences) {
                this.controlItemPreferences = domConstruct.destroy(this.controlItemPreferences);
            }
            if (!this.config.controls.saveConfiguration) {
                this.itemSaveConfiguration = domConstruct.destroy(this.itemSaveConfiguration);
            }

            if (!this.config.controls.shareConfiguration) {
                this.itemShareConfiguration = domConstruct.destroy(this.itemShareConfiguration);
            }

            if (this.detectedFeatures.mobileDevice) {
                this.overviewBtn = domConstruct.destroy(this.overviewBtn);
                this.fullscreenBtn = domConstruct.destroy(this.fullscreenBtn);
                this.gameControlsContainer = domConstruct.destroy(this.gameControlsContainer);
                this.mapDetailsContainer = domConstruct.destroy(this.mapDetailsContainer);
            } else if (!this.config.controls.threedee) {
                this.overviewBtn = domConstruct.destroy(this.overviewBtn);
                this.gameControlsContainer = domConstruct.destroy(this.gameControlsContainer);
                this.view3DContainer = domConstruct.destroy(this.view3DContainer);
            }
        },

        updateSelectedControl: function(evt) {
            if (evt.selectedOption !== this.activeControlOption) {
                this.clearSelectedControls();
                var controlNode = query(".controls-link[rel=" + evt.selectedOption + "]", this.domNode).parent()[0];
                domClass.add(controlNode, "control-selected");
                this.activeControlOption = evt.selectedOption;
                topic.publish(NavigationEvent.prototype.OPEN_SIDEBAR, {
                    "selectedOption": evt.selectedOption
                });
            } else {
                topic.publish(NavigationEvent.prototype.CLOSE_SIDEBAR, null);
            }
        },

        clearSelectedControls: function() {
            query("#controlBarList li", this.domNode).forEach(function(node) {
                domClass.remove(node, "control-selected");
            });

            this.activeControlOption = "";
        },

        updatePositionLabel: function(evt) {
            var xCoordinate = MapUtil.prototype.formatCoordinate(evt.x, "x");
            var yCoordinate = MapUtil.prototype.formatCoordinate(evt.y, "y");
            var label = "";

            if (xCoordinate !== '-' && yCoordinate !== '-') {
                // Determine N/S E/W
                var ns = yCoordinate > 0 ? "N" : "S";
                var ew = xCoordinate > 0 ? "E" : "W";
                label = Math.abs(yCoordinate).toFixed(2) + "&deg;" + ns + ", " + Math.abs(xCoordinate).toFixed(2) + "&deg;" + ew;
            }

            this.mapMousePosition.innerHTML = label;
        },

        controlLinkClicked: function(evt) {
            var option = domAttr.get(this, "rel");
            topic.publish(NavigationEvent.prototype.CHECK_SIDEBAR, {
                "selectedOption": option
            });
        },

        fullscreenClicked: function(evt) {
            if (this.currentView === "map") {
                DOMUtil.prototype.launchFullScreen(document.documentElement);
            } else if (this.currentView === "globe") {
                DOMUtil.prototype.launchFullScreen(document.documentElement);
            }

        },

        overviewClicked: function(evt) {
            if (this.detectedFeatures.webGL) {
                if (this.currentView === "map") {
                    if (domStyle.get("3dContainer", "visibility") === "hidden") {
                        domStyle.set("3dContainer", "opacity", "1");
                        domStyle.set("3dContainer", "visibility", "visible");
                    } else {
                        domStyle.set("3dContainer", "opacity", "0");
                        domStyle.set("3dContainer", "visibility", "hidden");
                    }
                } else if (this.currentView === "globe") {
                    if (domStyle.get("mainSearchMapOverview", "visibility") === "hidden") {
                        domStyle.set("mainSearchMapOverview", "opacity", "1");
                        domStyle.set("mainSearchMapOverview", "visibility", "visible");
                        domStyle.set("minimize3DContainerBtn", "opacity", "1");
                        domStyle.set("minimize3DContainerBtn", "visibility", "visible");

                    } else {
                        domStyle.set("mainSearchMapOverview", "opacity", "0");
                        domStyle.set("mainSearchMapOverview", "visibility", "hidden");
                        domStyle.set("minimize3DContainerBtn", "opacity", "0");
                        domStyle.set("minimize3DContainerBtn", "visibility", "hidden");
                    }
                }
            } else {
                topic.publish(BrowserEvent.prototype.SHOW_ALERT, {
                    title: "Your Browser Is Not Supported",
                    content: "Your browser does not support viewing in 3D. A web browser with WebGL is required to " +
                        "experience the 3D visualization. The following browsers are known to support WebGL:" +
                        "<ul><li>Google Chrome 18+</li><li>Mozilla Firefox 4.0+</li><li>Apple Safari 8+</li>" +
                        "</ul>",
                    size: "sm"
                });
            }
        },

        gameControlsClicked: function(evt) {
            if (this.gameControlsEnabled) {
                domClass.remove(this.gameControlsBtn, "controlSelected");
                this.gameControlsEnabled = false;
            } else {
                domClass.add(this.gameControlsBtn, "controlSelected");
                this.gameControlsEnabled = true;
            }

            topic.publish(MapEvent.prototype.TOGGLE_GAME_CONTROLS);
        },

        view2DClicked: function(evt) {
            topic.publish(MapEvent.prototype.VIEW_2D);
        },

        view2DEnabled: function(evt) {
            if (this.enableMapResolution) {
                domStyle.set(this.mapResolutionLabel, "visibility", "visible");
            }
            domClass.add("view2DContainer", "hidden");
            domClass.remove("view3DContainer", "hidden");
            topic.publish(MapEvent.prototype.MINIMIZE_3D_CONTAINER);
            domStyle.set("3dContainer", "opacity", "0");
            domStyle.set("3dContainer", "visibility", "hidden");

            domClass.remove(this.mapScalebarsContainer, "hidden");

            //reset the game controls if they were enabled
            if (this.gameControlsEnabled) {
                domClass.remove(this.gameControlsBtn, "controlSelected");
                this.gameControlsEnabled = false;
                topic.publish(MapEvent.prototype.TOGGLE_GAME_CONTROLS);
            }

            topic.publish(MapEvent.prototype.CHANGE_PROJECTION, {
                projectionLabel: "Global"
            });
        },

        view3DClicked: function(evt) {
            if (this.detectedFeatures.webGL && !this.detectedFeatures.mobileDevice) {
                topic.publish(MapEvent.prototype.VIEW_3D);
                if (this.enableMapResolution) {
                    domStyle.set(this.mapResolutionLabel, "visibility", "hidden");
                }
            } else {
                topic.publish(BrowserEvent.prototype.SHOW_ALERT, {
                    title: "Your Browser Is Not Supported",
                    content: "Your browser does not support viewing in 3D. A desktop web browser with WebGL is required to " +
                        "experience the 3D visualization. The following browsers are known to support WebGL:" +
                        "<ul><li>Google Chrome 18+</li><li>Mozilla Firefox 4.0+</li><li>Apple Safari 8+</li>" +
                        "</ul>",
                    size: "sm"
                });
            }
        },

        view3DEnabled: function(evt) {
            domClass.add("view3DContainer", "hidden");
            domClass.remove("view2DContainer", "hidden");
            domStyle.set("3dContainer", "opacity", "1");
            domStyle.set("3dContainer", "visibility", "visible");
            domClass.add(this.mapScalebarsContainer, "hidden");
            topic.publish(MapEvent.prototype.MAXIMIZE_3D_CONTAINER);
        },

        mapZoomInClicked: function(evt) {
            topic.publish(MapEvent.prototype.ZOOM_IN);
        },

        mapZoomOutClicked: function(evt) {
            topic.publish(MapEvent.prototype.ZOOM_OUT);
        },

        mapZoomInHold: function(evt) {
            topic.publish(MapEvent.prototype.GLOBE_ZOOM_IN_START);
        },

        mapZoomOutHold: function(evt) {
            topic.publish(MapEvent.prototype.GLOBE_ZOOM_OUT_START);
        },

        mapZoomInRelease: function(evt) {
            topic.publish(MapEvent.prototype.GLOBE_ZOOM_IN_END);
        },

        mapZoomOutRelease: function(evt) {
            topic.publish(MapEvent.prototype.GLOBE_ZOOM_OUT_END);
        },
        datasetCountChange: function(evt) {
            this.updateAndHighlightBadge(this.myDataBadgeCount, evt.count);
        },
        exploreComplete: function(evt) {
            this.updateAndHighlightBadge(this.exploreBadgeCount, evt.count);
        },

        layersChangedComplete: function(evt) {
            this.updateAndHighlightBadge(this.layersBadgeCount, evt.layerCount);
        },

        mapViewEnabled: function(evt) {
            this.currentView = "map";

            //disable the game controls when going back to 2D
            if (this.gameControlsEnabled) {
                this.gameControlsClicked();
            }
        },

        terrainViewEnabled: function(evt) {
            this.currentView = "globe";
        },

        projectionChanged: function(evt) {
            domClass.add(this.equiMapScalebar, "hidden");
            domClass.add(this.northPoleMapScalebar, "hidden");
            domClass.add(this.southPoleMapScalebar, "hidden");

            domClass.remove(this.controlsProjectionIcon, "icon-global-projection");
            domClass.remove(this.controlsProjectionIcon, "icon-sp-projection");
            domClass.remove(this.controlsProjectionIcon, "icon-np-projection");


            if (evt.projection === this.config.projection.EQUIRECT) {
                domClass.remove(this.equiMapScalebar, "hidden");

                if (!this.detectedFeatures.mobileDevice) {
                    domClass.remove(this.view3DContainer, "hidden");
                }
                domClass.add(this.controlsProjectionIcon, "icon-global-projection");
            } else if (evt.projection === this.config.projection.N_POLE) {
                domClass.remove(this.northPoleMapScalebar, "hidden");
                domClass.add(this.controlsProjectionIcon, "icon-np-projection");
                this.polarViewSetup();
            } else if (evt.projection === this.config.projection.S_POLE) {
                domClass.add(this.controlsProjectionIcon, "icon-sp-projection");
                domClass.remove(this.southPoleMapScalebar, "hidden");
                this.polarViewSetup();
            }
        },

        resolutionChanged: function(evt) {
            var mapResolution = Number(evt.lod.resolution.toPrecision(2));
            var mapUnit = "km";

            if (mapResolution < 1000) {
                mapUnit = "m";
            } else {
                mapResolution = mapResolution / 1000;
            }
            if (this.enableMapResolution) {
                domAttr.set(this.mapResolutionLabel, "innerHTML", "Map Scale: " + mapResolution + " " + mapUnit);
            }
        },

        polarViewSetup: function(evt) {
            if (!this.detectedFeatures.mobileDevice) {
                domClass.add("view2DContainer", "hidden");
                domClass.add(this.overviewBtn, "hidden");
                domClass.add(this.view3DContainer, "hidden");
                if (this.detectedFeatures.webGL && !this.detectedFeatures.mobileDevice) {
                    domStyle.set("3dContainer", "opacity", "0");
                    domStyle.set("3dContainer", "visibility", "hidden");
                }
            }
        },

        initLegendsAndOpacityController: function(evt) {
            var el = new LegendsAndOpacity();
            el.startup();
            domConstruct.place(el.domNode, this.legendsAndOpacityContainer);
        },

        initScalebars: function(evt) {
            //equi scalebar
            new ScaleBar({
                map: evt.maps.equirect,
                scalebarUnit: "metric",
                scalebarStyle: "line"
            }, this.equiMapScalebar).startup();
            if (evt.maps.northPole) {
                //north pole scalebar
                new ScaleBar({
                    map: evt.maps.northPole,
                    scalebarUnit: "metric",
                    scalebarStyle: "line"
                }, this.northPoleMapScalebar).startup();
            }
            if (evt.maps.southPole) {
                //south pole scalebar
                new ScaleBar({
                    map: evt.maps.southPole,
                    scalebarUnit: "metric",
                    scalebarStyle: "line"
                }, this.southPoleMapScalebar).startup();
            }
        }
    });
});
