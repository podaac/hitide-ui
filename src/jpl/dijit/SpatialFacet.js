define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/topic",
    "dojo/query",
    "dojo/mouse",
    "dojo/keys",
    "dojo/fx",
    "dojo/fx/Toggler",
    "dojo/store/Memory",
    "dijit/form/Select",
    "dijit/form/TextBox",
    "dijit/registry",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    "dijit/form/DateTextBox",
    'dojo/text!./templates/SpatialFacet.html',
    "xstyle/css!./css/SpatialFacet.css",
    "jpl/events/MapEvent",
    "jpl/events/SearchEvent",
    "jpl/events/NavigationEvent",
    "jpl/events/BrowserEvent",
    "jpl/utils/MapUtil",
    "jpl/config/Config",
    "jpl/dijit/ui/AlertDialog",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/config",
    "bootstrap/Modal",
    "dojo/_base/window",
    "jpl/data/BaseMaps",
    "esri/map",
    "esri/toolbars/draw",
    "esri/toolbars/edit",
    "esri/geometry/Extent"
], function(declare, lang, on, domConstruct, domClass, domAttr, domStyle, topic, query, mouse, keys, coreFx, Toggler, Memory, Select, TextBox, registry,
    _WidgetBase, _TemplatedMixin, DateTextBox, template, css, MapEvent, SearchEvent, NavigationEvent, BrowserEvent, MapUtil,
    Config, AlertDialog, Graphic, Point, Polygon, SimpleFillSymbol, SimpleLineSymbol, Color, esriConfig, Modal, win, BaseMaps, Map, Draw, Edit, Extent) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        widgetsInTemplate: true,
        isCollapsed: true,
        open: false,
        defaultBbox: [-180, -90, 180, 90],
        bbox: [-180, -90, 180, 90],
        currentBbox: [-180, -90, 180, 90],
        bboxGraphic: null,
        presetWidget: null,
        bboxInputWidget: null,
        bboxDrawWidget: null,

        constructor: function() {},

        postCreate: function() {},

        createContainer: function() {
            this.placeAt(win.body());
        },

        startup: function() {
            this._isFirstLoad = true;
            this.isValid = true;
            this.test_limitBbox();
            this.test_normalizeBbox();

            topic.subscribe(MapEvent.prototype.MAP_INITIALIZED, lang.hitch(this, this.searchMapInitialized));

            topic.subscribe(SearchEvent.prototype.BBOX_UPDATE, lang.hitch(this, function(message) {
                this.isValid = this.bboxUpdate(message);
            }));

            this.granuleSelection = registry.byId("GranuleSelection").content;

            on(this.spatialFacetClear, "click", lang.hitch(this, function() { this.clear() }));
            on(this.spatialFacetCancel, "click", lang.hitch(this, this.hide));
            on(this.spatialFacetApply, "click", lang.hitch(this, function() {
                this.apply();
            }));
            on(this.regionDialogModal, "scroll", lang.hitch(this, function() { this.map.resize(); }))
        },
        searchMapInitialized: function() {
            this.mapDijit = registry.byId("mainSearchMap");
            this.searchMap = this.mapDijit.equirectMap;
            this.basemapSingleton = BaseMaps.getInstance();

            // Create facet items
            this.createSpatialItems();
            this.createContainer();
            this.modalObject = query(this.regionDialogModal);
            this.show();
            this.initializeDrawMap();
            this.hide();

            domClass.add(this.regionDialogModal, "fade");

        },
        initializeDrawMap: function() {
            var extent = new Extent(-290, -90, 70, 90);
            this.map = new Map(this.drawMapContainer, {
                spatialReference: this.searchMap.spatialReference,
                extent: extent,
                zoom: 1,
                logo: false,
                autoResize: false,
                slider: false,
                sliderPosition: "bottom-right",
                smartNavigation: false,
                wrapAround180: true,
                showAttribution: false,
                showLabels: true
            });

            on(this.map, "load", function() {
                topic.publish(MapEvent.prototype.SPATIAL_FACET_MAP_READY);
            })

            //add basemap to map
            MapUtil.prototype.addLayerToMap(this.basemapSingleton.centerLayerList[0], this.map, true);

            // Init draw and edit map functions
            this.toolbar = new Draw(this.map);
            this.editToolbar = new Edit(this.map);
            this.fillSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.9]), 2),
                new Color([255, 0, 0, 0.1])
            );
            this.toolbar.fillSymbol = this.fillSymbol;

            // Listen for draw, graphic move and scale events
            on(this.toolbar, "draw-end", lang.hitch(this, this.onDrawEnd));
            on(this.editToolbar, "graphic-move-stop", lang.hitch(this, this.onEditChange));
            on(this.editToolbar, "scale-stop", lang.hitch(this, this.onEditChange));
            this.enableEditMode();
        },

        enableDrawMode: function() {
            // Deactivate Edit Mode
            this.editToolbar.deactivate();
            // Reset and activate draw mode
            this.toolbar.deactivate();
            this.toolbar.activate(Draw["RECTANGLE"]);
            this.map.setMapCursor("crosshair");
        },

        enableEditMode: function() {
            // Disable and redirect to draw mode if there's nothing to edit
            this.map.setMapCursor("default");
            if (!this.bboxGraphic) {
                return;
            }
            this.toolbar.deactivate();
            this.editToolbar.activate(Edit.SCALE | Edit.MOVE, this.bboxGraphic);
        },

        onEditChange: function(evt) {
            topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                bbox: this.bboxGraphic,
                origin: "mapDraw"
            });
        },

        onDrawEnd: function(evt) {
            this.toolbar.deactivate();
            if (!this.bboxGraphic) {
                this.bboxGraphic = new Graphic(evt.geometry, this.fillSymbol);
                this.map.graphics.add(this.bboxGraphic);
            } else {
                this.bboxGraphic.setGeometry(evt.geometry);
            }
            // Jump to edit mode
            topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                bbox: this.bboxGraphic,
                origin: "mapDraw"
            });
            this.enableEditMode();
        },

        show: function() {
            this.modalObject.modal();

            // Fix for silly esri problem
            if (this._bboxGraphicHack) {
                this.map.graphics.add(this._bboxGraphicHack);
                this.enableEditMode();
                this._bboxGraphicHack = null;
            }
        },

        hide: function() {
            this.modalObject.modal("hide");
        },

        createSpatialItems: function() {
            // Create presets Select
            var _context = this;
            var options = [{
                label: "Select a Region",
                value: "",
                disabled: true
            }, {
                label: "Atlantic Ocean",
                value: [-100, -55, 30, 80]
            }, {
                label: "Arctic Ocean",
                value: [-180, 60, 180, 90]
            }, {
                label: "Indian Ocean",
                value: [20, -35, 130, 30]
            }, {
                label: "North Atlantic",
                value: [-100, 0, 30, 80]
            }, {
                label: "North Pacific",
                value: [108, 0, -64, 66]
            }, {
                label: "Pacific Ocean",
                value: [108, -45, -64, 66]
            }, {
                label: "South Atlantic",
                value: [-70, -55, 30, 0]
            }, {
                label: "South Pacific",
                value: [108, -45, -64, 0]
            }, {
                label: "Southern Ocean",
                value: [-180, -90, 180, -35]
            }];

            var presetSelect = new Select({
                name: "Presets",
                value: "",
                options: options,
                className: "spatialFacetPresets",
                style: "width:120px;margin-top:4px;margin-right:20px;float:right;"
            }, this.spatialFacetPresets);
            presetSelect.startup();
            presetSelect.on("change", function() {
                topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                    bbox: this.get("value"),
                    origin: "preset"
                });
            });
            this.presetWidget = presetSelect;

            // Create bbox input
            var bboxTextBox = new TextBox({
                name: "bbox",
                value: "",
                style: "width:260px;",
                placeHolder: "e.g. -180, -90, 180, 90"
            }, this.spatialFacetBbox);
            bboxTextBox.on("blur", function(evt) {
                lang.hitch(_context, _context.handleBboxTextBoxChange(bboxTextBox.value));
            });
            bboxTextBox.on("keyup", function(evt) {
                // Only accept ENTER submit
                if (evt.keyCode === keys.ENTER) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    lang.hitch(_context, _context.handleBboxTextBoxChange(this.get("value")));
                    // If box is empty, set to ""
                    // if (!this.get("value")) {
                    //     _context.hideError();
                    //     topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                    //         bbox: "",
                    //         origin: "input"
                    //     });
                    //     return;
                    // }

                    // // Else, parse the result
                    // var parseResult = _context.validateBboxString(this.get("value"));

                    // // If invalid string, display error
                    // if (!parseResult[0]) {
                    //     _context.isValid = false;
                    //     _context.displayError(parseResult[1]);
                    //     return;
                    // } else {
                    //     _context.hideError();
                    // }
                    // var rounded = _context.roundBbox(parseResult[1]);
                    // topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                    //     bbox: rounded,
                    //     origin: "input",
                    //     refreshBboxInput: parseResult[2]

                    // });
                }
            });

            this.bboxInputWidget = bboxTextBox;

            // Initialize bbox drawing btn
            on(this.spatialFacetDrawBtn, "click", lang.hitch(this, this.enableDrawMode));
        },

        handleBboxTextBoxChange: function(value) {
            // If box is empty, set to ""
            if (!value) {
                this.hideError();
                topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                    bbox: "",
                    origin: "input"
                });
                return;
            }

            // Else, parse the result
            var parseResult = this.validateBboxString(value);

            // If invalid string, display error
            if (!parseResult[0]) {
                this.isValid = false;
                this.displayError(parseResult[1]);
                return;
            } else {
                this.hideError();
            }
            var rounded = this.roundBbox(parseResult[1]);
            topic.publish(SearchEvent.prototype.BBOX_UPDATE, {
                bbox: rounded,
                origin: "input",
                refreshBboxInput: parseResult[2]

            });
        },

        displayError: function(msg) {
            domAttr.set(this.spatialFacetBboxError, "innerHTML", msg);
        },

        hideError: function() {
            domAttr.set(this.spatialFacetBboxError, "innerHTML", "&nbsp;");
        },

        validateBboxString: function(bboxStr) {
            // Validates a bbox string. Returns [true, bbox, refreshBboxInput] if valid, 
            // [false,errmsg, refreshBboxInput] if invalid.
            var refreshBboxInput = true;

            // Strip whitespace
            var bboxStrTrim = bboxStr.trim();

            // Ensure there are 4 elements
            var splits = bboxStrTrim.split(",");
            if (splits.length !== 4) {
                return [false, "Invalid: Four numbers required", refreshBboxInput];
            }
            // Ensure all entries are numbers
            var values = [];
            for (var i = 0; i < splits.length; i++) {
                var s = splits[i];
                // If num === "", will be parsed as 0 but don't want to refresh here
                if (!s) {
                    refreshBboxInput = false;
                }
                // If num ends in '.' then flag this bbox 
                // to not be updated in bbox input
                if (s.substring(s.length - 1) === ".") {
                    refreshBboxInput = false;
                }
                var parsed = Number(s);
                if (isNaN(parsed)) {
                    return [false, "Invalid: Value " + (i + 1) + " is not a number", refreshBboxInput];
                }
                values.push(parsed);
            }
            return [true, values, refreshBboxInput]
        },

        roundBbox: function(bbox) {
            var _context = this;
            return bbox.map(function(x) {
                return _context.roundTo(x, 3)
            });

        },

        getRoundedBbox: function() {
            return this.roundBbox(this.currentBbox);
        },

        validateBboxBoundsAndRound: function(bbox) {
            // Round to 3 decimal places
            var _context = this;
            bbox = bbox.map(function(x) {
                return _context.roundTo(x, 3)
            });
            return [true, bbox];
        },

        roundTo: function(num, place) {
            // http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
            return +(Math.round(num + "e+" + place) + "e-" + place);
        },

        silentSetPresetWidget: function(value) {
            this.presetWidget.set('_onChangeActive', false); // setting the flag to false
            this.presetWidget.set("value", value);
            this.presetWidget.set('_onChangeActive', true); // setting the flag to false
        },
        silentSetBboxInputWidget: function(value) {
            this.bboxInputWidget.set('_onChangeActive', false); // setting the flag to false
            this.bboxInputWidget.set("value", value.map(function(x) {
                return x.toFixed(3)
            }).join(",  "));
            this.bboxInputWidget.set('_onChangeActive', true); // setting the flag to false
        },

        bboxUpdate: function(message) {
            var newBbox;
            var newExtent;

            if (!message.bbox && message.origin === "config") {
                this.clear(true);
                this.applyFromConfig(true)
                return true;
            }
            if (message.origin === "input") {
                this.silentSetPresetWidget("");
                // Update the text in the bounding box to reflect rounded bbox
                if (message.refreshBboxInput) {
                    this.silentSetBboxInputWidget(message.bbox);
                }
                newBbox = MapUtil.prototype.convert180CoordsToInf(message.bbox);
                newExtent = newBbox.slice(0);
            } else if (message.origin === "preset") {
                this.silentSetBboxInputWidget(message.bbox);
                newBbox = MapUtil.prototype.convert180CoordsToInf(message.bbox);
                newExtent = newBbox.slice(0);
                this.hideError();
            } else if (message.origin === "config") {
                this.silentSetPresetWidget("");

                // Validate bbox
                var parseResult = this.validateBboxString(message.bbox.toString());

                // If invalid string, display error
                if (!parseResult[0]) {
                    this.displayError(parseResult[1]);
                    new AlertDialog({
                        alertTitle: "Error",
                        alertMessage: "Unable to load bounding box from configuration."
                    }).startup();
                    return false;
                }
                var rounded = this.roundBbox(parseResult[1]);
                newBbox = MapUtil.prototype.convert180CoordsToInf(rounded);
                newExtent = newBbox.slice(0);
            } else if (message.origin === "mapDraw") {
                // Get lat lng from message bbox
                var extent = message.bbox.geometry.getExtent();
                var westSouth = MapUtil.prototype.convertXYToLatLng(extent.xmin, extent.ymin, extent);
                var eastNorth = MapUtil.prototype.convertXYToLatLng(extent.xmax, extent.ymax, extent);
                newBbox = [westSouth.lon, westSouth.lat, eastNorth.lon, eastNorth.lat];
                newExtent = newBbox.slice(0);
                this.hideError();
            } else {
                console.warn("ERROR: Unknown message origin", message.origin);
                this.clear();
                return false;
            }
            var limitedBbox = this.limitBbox(newBbox);
            if (!limitedBbox) {
                // Remove the bbox and clear
                this.clear(true);
                return false;
            }

            var normBbox = this.normalizeBbox(limitedBbox);

            if (!normBbox) {
                // Remove the bbox and clear
                this.clear(true);
                return false;
            }

            var constrained180Bbox = MapUtil.prototype.convertInfCoordsTo180(normBbox);
            if (!constrained180Bbox) {
                // Remove the bbox and clear
                this.clear(true);
                return false;
            }

            if (message.refreshBboxInput || message.origin === "config" || message.origin === "mapDraw") {
                this.silentSetBboxInputWidget(this.roundBbox(constrained180Bbox));
            }

            if (message.origin !== "preset") {
                this.silentSetPresetWidget("");
            }

            // Update the map
            normBbox = this.roundBbox(normBbox);
            constrained180Bbox = this.roundBbox(constrained180Bbox);

            var xy1 = MapUtil.prototype.convertLatLngToXY(normBbox[0], normBbox[3]);
            var xy2 = MapUtil.prototype.convertLatLngToXY(normBbox[2], normBbox[3]);
            var xy3 = MapUtil.prototype.convertLatLngToXY(normBbox[2], normBbox[1]);
            var xy4 = MapUtil.prototype.convertLatLngToXY(normBbox[0], normBbox[1]);
            var points = [
                new Point(xy1.x, xy1.y, this.map.spatialReference),
                new Point(xy2.x, xy2.y, this.map.spatialReference),
                new Point(xy3.x, xy3.y, this.map.spatialReference),
                new Point(xy4.x, xy4.y, this.map.spatialReference),
                new Point(xy1.x, xy1.y, this.map.spatialReference)
            ];
            var polygon = new Polygon();
            polygon.addRing(points);
            polygon.spatialReference = this.map.spatialReference;

            if (!this.bboxGraphic) {
                this.bboxGraphic = new Graphic(polygon, this.fillSymbol);
                // REALLY ANNOYING HACK BECAUSE ESRI IS ANNOYING AND THINK THIS IS A BUG... 
                // // GRAPHICS JUST DOESN'T SEEM TO BE HERE WHEN YOU LOAD A CONFIG.......
                if (this.map.graphics) {
                    this.map.graphics.add(this.bboxGraphic);
                } else {
                    this._bboxGraphicHack = this.bboxGraphic;
                }
            } else {
                this.bboxGraphic.setGeometry(polygon);
            }

            this.enableEditMode();
            this.bbox = constrained180Bbox;

            // Set map extent if needed
            if (newExtent[0] < -180 || newExtent[2] > 180 || message.origin === "preset") {
                var t1 = esriConfig.defaults.map.panDuration; // time in milliseconds, default panDuration: 350
                var t2 = esriConfig.defaults.map.panRate; //
                var t3 = esriConfig.defaults.map.zoomDuration; // default zoomDuration: 500
                var t4 = esriConfig.defaults.map.zoomRate; // default zoomRate: 25
                esriConfig.defaults.map.panDuration = 1; // time in milliseconds, default panDuration: 350
                esriConfig.defaults.map.panRate = 1; //
                esriConfig.defaults.map.zoomDuration = 1; // default zoomDuration: 500
                esriConfig.defaults.map.zoomRate = 1; // default zoomRate: 25

                var targetLon = (normBbox[2] + normBbox[0]) / 2;
                MapUtil.prototype.centerMapAt(this.map, targetLon, 0);

                esriConfig.defaults.map.panDuration = t1; // time in milliseconds, default panDuration: 350
                esriConfig.defaults.map.panRate = t2; //
                esriConfig.defaults.map.zoomDuration = t3; // default zoomDuration: 500
                esriConfig.defaults.map.zoomRate = t4;
            }
            if (message.origin === "config") {
                this.applyFromConfig(false);
            }
            // console.log(normBbox, constrained180Bbox, "norm, constrained")
            return true;
        },

        // MapUtil.prototype.convert180CoordsToInf: function(bbox) {
        //             // If any mins are greater than their maxes, subtract 360. 
        //             // ASSUMES bbox coords are within -180,-90,180,90
        //             var xyBbox = bbox.slice(0);
        //             if (bbox[0] > bbox[2]) {
        //                 xyBbox[0] -= 360;
        //             }
        //             if (bbox[1] > bbox[3]) {
        //                 xyBbox[1] -= 360;
        //             }
        //             return xyBbox;
        //         },

        // MapUtil.prototype.convertInfCoordsTo180: function(bbox) {
        //             // ASSUMES bbox coords follow 360/180 constraints
        //             var xyBbox = bbox.slice(0);
        //             if (bbox[0] < -180) {
        //                 xyBbox[0] += 360;
        //             }
        //             // if (bbox[1] > bbox[3]) {
        //             //     xyBbox[1] -= 360;
        //             // }
        //             return xyBbox;
        //         },

        limitBbox: function(origBbox) {
            //// Limits bbox lon size to 360, lat to 180. Clips the bbox to fit.
            if (!origBbox) {
                return null;
            }
            var bbox = origBbox.slice(0);

            // Check if bbox intersects with map at all.
            // Does not assume that South < North
            if ((bbox[1] < -90 && bbox[3] < -90) || (bbox[1] > 90 && bbox[3] > 90)) {
                return null;
            }

            //// Lat check
            // If South > North, flip them
            if (bbox[1] > bbox[3]) {
                var tmp = bbox[1];
                bbox[1] = bbox[3];
                bbox[3] = tmp;
            }

            var clippedBbox = bbox.slice(0);

            // Lat check
            if (bbox[1] < -90) {
                clippedBbox[1] = -90;
            }
            if (bbox[3] > 90) {
                clippedBbox[3] = 90;
            }

            //// Lon check
            if (Math.abs(bbox[0] - bbox[2]) > 360) {
                // Case where West > East AND the difference is > 360, like 
                // [780, -90, 380, 90] or [-780, -90, -380, 90]
                if (bbox[0] > bbox[2]) {
                    // Becomes [780, -90, 420, 90] or [-780, -90, -420, 90]
                    clippedBbox[2] = (bbox[0] > 0 ? bbox[0] - 360 : bbox[0] + 360);
                } else {
                    // Case where West <= East and diff > 360
                    // [380, -90, 780, 90] or [-780, -90, -380, 90]
                    clippedBbox[2] = bbox[0] + 360;
                    // Becomes [380, -90, 740, 90] or [-740, -90, -380, 90]
                }
            }
            return clippedBbox;
        },

        normalizeBbox: function(bbox) {
            // console.log(bbox, "bbox to normalize")
                // Normalize the lon values to [-180, 180]
                // Assumes bbox is within 360/180 size constraints for lon/lat
                // Assumes West < East
            if (!bbox) {
                return null;
            }
            var normBbox = bbox.slice(0);
            normBbox[0] = normBbox[0] % 360;
            normBbox[2] = normBbox[2] % 360;

            // Dateline case ex: [138.867,-18.369,278.789,55.459]
            // should be [-221.133, -18.369, -81.21100000000001, 55.459]
            // So check if East is > 180.
            if (normBbox[2] > 180) {
                normBbox[0] -= 360;
                normBbox[2] -= 360;
            }

            // Negative case ex: [-340.977, -35.859, -222.148, 46.406]
            // should be [19.023000000000025, -35.859, 137.852, 46.406]
            // So check if East is > 180.
            if (normBbox[2] < -180) {
                normBbox[0] += 360;
                normBbox[2] += 360;
            }

            // West greater than East case: [322, -29, 132, 39]
            // should be [-37, -29, 132, 39] where West has 360 subtracted
            if (normBbox[0] > 180 && normBbox[2] <= 180) {
                normBbox[0] -= 360;
            }
            return normBbox;
        },

        test_limitBbox: function(bbox) {
            // Tests limitBbox
            var testcases = [
                [
                    null,
                    null
                ], // Null
                [
                    [-180, -90, 180, 90],
                    [-180, -90, 180, 90]
                ], // Edges
                [
                    [-180, -90.0000001, 180, 90],
                    [-180, -90, 180, 90]
                ], // Slightly below
                [
                    [-180, -100, 180, 100],
                    [-180, -90, 180, 90]
                ], // below and above
                [
                    [-180, -600, 180, 600],
                    [-180, -90, 180, 90]
                ], // below and above a lot
                [
                    [-180, -600, 180, -800],
                    null
                ], // below completely case 1
                [
                    [-180, -800, 180, -600],
                    null
                ], // below completely case 2
                [
                    [-180, 600, 180, 800],
                    null
                ], // above completely case 1
                [
                    [-180, 800, 180, 600],
                    null
                ], // above completely case 2
                [
                    [-180, 600, 180, -800],
                    [-180, -90, 180, 90]
                ],
                [
                    [-180, -600, 180, 300],
                    [-180, -90, 180, 90]
                ],
                [
                    [-180, -90, 180, -88],
                    [-180, -90, 180, -88]
                ],
                [
                    [-180, 90, 180, 88],
                    [-180, 88, 180, 90]
                ],
                [
                    [-280, -90, 380, -90],
                    [-280, -90, 80, -90]
                ],
                [
                    [280, -90, 380, 90],
                    [280, -90, 380, 90]
                ],
                [
                    [780, -90, 380, 90],
                    [780, -90, 420, 90]
                ],
                [
                    [-780, -90, -380, 90],
                    [-780, -90, -420, 90]
                ],
                [
                    [380, -90, 780, 90],
                    [380, -90, 740, 90]
                ],
                [
                    [-780, -90, -380, 90],
                    [-780, -90, -420, 90]
                ],
                [
                    [-980, -90, 1380, 90],
                    [-980, -90, -620, 90]
                ]
            ]

            // Test
            var failedCount = 0;
            for (var i = 0; i < testcases.length; i++) {
                var result = this.limitBbox(testcases[i][0]);
                if (!this.compareArray(result, testcases[i][1])) {
                    failedCount += 1;
                    // console.log("FAILED TEST:" + i);
                    // console.log("INPUT: " + testcases[i][0]);
                    // console.log("EXPECTED: " + testcases[i][1]);
                    // console.log("GOT: " + result);
                    // console.log("\n");
                }
            }
            if (failedCount === 0) {
                // console.log("PASSED ALL " + testcases.length + " TESTS");
                return true;
            } else {
                // console.log("PASSED " + (testcases.length - failedCount) + " TESTS");
                // console.log("FAILED " + failedCount + " TESTS FOR: LIMIT BBOX");
                return false;
            }
        },

        test_normalizeBbox: function(bbox) {
            // Tests normalizeBbox
            var testcases = [
                [
                    null,
                    null
                ], // Null
                [
                    [-180, -90, 180, 90],
                    [-180, -90, 180, 90]
                ], // Edges
                [
                    [-596.116, -31.452, -451.975, 43.079],
                    [-236.11599999999999, -31.452, -91.97500000000002, 43.079]
                ], // South Pacific Example Case
                [
                    [-956.116, -31.452, -811.975, 43.079],
                    [-236.11599999999999, -31.452, -91.97500000000002, 43.079]
                ], // South Pacific Example Case
                [
                    [-28.239, 5.07, 70.902, 28.976],
                    [-28.239, 5.07, 70.902, 28.976]
                ], // Normal case
                [
                    [-440.28, 8.952, -399.499, 28.64],
                    [-80.27999999999997, 8.952, -39.499000000000024, 28.64]
                ], // Normal case
                [
                    [458.942, -17.15, 617.848, 46.834],
                    [-261.058, -17.15, -102.15200000000004, 46.834]
                ], // Positive Pacific
                [
                    [-280.898, -13.711, -226, 27.422],
                    [79.10199999999998, -13.711, 134, 27.422]
                ], // All negative, below 180 case
                [
                    [322.661, -29.114, 132.089, 39.089],
                    [-37.339, -29.114, 132.089, 39.089]
                ] // All positive, west above 180 case

            ]

            // Test
            var failedCount = 0;
            for (var i = 0; i < testcases.length; i++) {
                var result = this.normalizeBbox(testcases[i][0]);
                if (!this.compareArray(result, testcases[i][1])) {
                    failedCount += 1;
                    // console.log("FAILED TEST:" + i);
                    // console.log("INPUT: " + testcases[i][0]);
                    // console.log("EXPECTED: " + testcases[i][1]);
                    // console.log("GOT: " + result);
                    // console.log("\n");
                }
            }
            if (failedCount === 0) {
                // console.log("PASSED ALL " + testcases.length + " TESTS");
                return true;
            } else {
                // console.log("PASSED " + (testcases.length - failedCount) + " TESTS");
                // console.log("FAILED " + failedCount + " TESTS FOR: NORMALIZE BBOX");
                return false;
            }
        },

        compareArray: function(xs, ys) {
            // if one array is falsy, return false
            if ((!xs && ys) || (xs && !ys)) {
                return false;
            }
            if (!xs && !ys) {
                return true;
            }

            // compare lengths - can save a lot of time 
            if (xs.length != ys.length)
                return false;

            for (var i = 0, l = xs.length; i < l; i++) {
                // Check if we have nested arrays
                if (xs[i] instanceof Array && ys[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!compareArray(xs[i], ys[i])) {
                        return false;
                    }
                } else if (xs[i] != ys[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        },

        applyFromConfig: function(wasUndefined) {
            this.currentBbox = this.bbox.slice(0);
            topic.publish(SearchEvent.prototype.BBOX_CHANGE, {
                bbox: this.getRoundedBbox(),
                resetDatasets: true,
                noSearch: true,
                bboxWasUndefined: wasUndefined
            });
        },

        apply: function() {
            // Validate bbox input in case it hasn't been checked yet
            if (!this.isValid) {
                return;
            }
            // If there are any datasets in granule selection
            if (this.granuleSelection.datasetController.datasetStore.query().length > 0) {
                this.hide();
                new AlertDialog({
                    alertTitle: "Warning",
                    alertMessage: "Applying your new region: <b>" +
                        this.bbox.join(", ") + "</b> will reset your datasets in GRANULE SELECTION." +
                        " All footprints and previews will be cleared. <br><i>Note, this will not affect anything currently in your downloads.</i>",
                    cancelAction: lang.hitch(this, function() {
                        this.show()
                    }),
                    confirmAction: lang.hitch(this, function() {
                        // Publish bbox change
                        this.currentBbox = this.bbox.slice(0);
                        topic.publish(SearchEvent.prototype.BBOX_CHANGE, {
                            bbox: this.getRoundedBbox(),
                            resetDatasets: true
                        });
                    })
                }).startup();
            } else {
                this.currentBbox = this.bbox.slice(0);
                topic.publish(SearchEvent.prototype.BBOX_CHANGE, {
                    bbox: this.getRoundedBbox()
                });
                this.hide();
            }
        },

        clear: function(silent) {
            this.bbox = this.defaultBbox;
            this.editToolbar.deactivate();
            this.toolbar.deactivate();
            if (this.map.graphics) {
                this.map.graphics.remove(this.bboxGraphic);
            }
            this.bboxGraphic = null;
            this.presetWidget.reset();
            this.bboxInputWidget.reset();
            this.hideError();
            this.isValid = true;
            if (!silent) {
                this.apply();
            }
        }
    });
});
