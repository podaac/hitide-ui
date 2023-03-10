//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Color", "dojo/sniff", "dojo/number", "dojo/dom-style", "dojo/dom-construct", "dojox/gfx", "dijit/_Widget", "dijit/_Templated", "dijit/registry", "dijit/Menu", "dijit/MenuItem", "../SpatialReference", "../symbols/PictureMarkerSymbol", "../symbols/SimpleLineSymbol", "../symbols/SimpleFillSymbol", "../symbols/jsonUtils", "../geometry/jsonUtils", "../geometry/geodesicUtils", "../geometry/webMercatorUtils", "../geometry/Point", "../geometry/Polyline", "../geometry/Polygon", "../graphic", "../tasks/AreasAndLengthsParameters", "../tasks/LengthsParameters", "../tasks/GeometryService", "../kernel", "../config", "../domUtils", "../lang", "../units", "../WKIDUnitConversion", "./_EventedWidget", "dojo/text!./templates/Measurement.html", "dojo/i18n!../nls/jsapi", "dijit/form/ToggleButton", "dijit/form/DropDownButton", "dijit/layout/ContentPane"],
    function(B, E, f, m, e, v, w, x, s, y, F, G, H, d, z, A, C, I, r, J, K, L, t, n, D, k, u, h, M, N, O, U, P, p, Q, q, R, S, T, g) {
        return E([S, G, H], {
            declaredClass: "esri.dijit.Measurement",
            widgetsInTemplate: !0,
            templateString: T,
            unitDictionary: [],
            result: null,
            inputPoints: [],
            measureGraphics: [],
            currentPoint: null,
            numberPattern: "#,###,###,##0.0",
            _eventMap: {
                "measure-end": ["toolName", "geometry"]
            },
            constructor: function(a, b) {
                a = a || {};
                if (a.map) {
                    this._map = a.map;
                    if (this._map.loaded) this._map.cs = this._checkCS(this._map.spatialReference), this._interpolatedMap = !("Web Mercator" === this._map.cs || "PCS" === this._map.cs);
                    else var c = e.connect(this._map, "onLoad", this, function() {
                        e.disconnect(c);
                        c = null;
                        this._map.cs = this._checkCS(this._map.spatialReference);
                        this._interpolatedMap = !("Web Mercator" === this._map.cs || "PCS" === this._map.cs)
                    });
                    this._geometryService = P.defaults.geometryService;
                    this._mouseImgURL = B.toUrl("./images/cursor16x24.png");
                    this._defaultPinURL = B.toUrl("./images/esriGreenPin16x26.png");
                    this._defaultLineSymbol = new r(r.STYLE_SOLID, new v([0, 128, 255]), 3);
                    this._defaultFillSymbol =
                        new J(r.STYLE_SOLID, new r(r.STYLE_SOLID, new v([0, 128, 255]), 3), new v([0, 0, 0, 0.5]));
                    a.pointSymbol ? (this._pointSymbol = a.pointSymbol, this._useDefaultPointSymbol = !1) : (this._pointSymbol = new I(this._defaultPinURL, 16, 26), this._pointSymbol.setOffset(0, 12), this._useDefaultPointSymbol = !0);
                    var l = a.fillSymbol || this._defaultFillSymbol;
                    this._fillSymbol = l;
                    this._areaLineSymbol = l.outline || this._defaultLineSymbol;
                    this._borderlessFillSymbol = K.fromJson(l.toJson());
                    this._borderlessFillSymbol.setOutline(null);
                    this._lineSymbol =
                        a.lineSymbol ? a.lineSymbol : this._defaultLineSymbol;
                    this._defaultLengthUnit = a.defaultLengthUnit ? a.defaultLengthUnit : q.MILES;
                    this._defaultAreaUnit = a.defaultAreaUnit ? a.defaultAreaUnit : q.ACRES;
                    this._defaultLocationUnit = a.defaultLocationUnit ? a.defaultLocationUnit : q.DECIMAL_DEGREES;
                    this._snappingCallback = f.hitch(this, this._snappingCallback);
                    a.geometry && (this._userGeometry = a.geometry);
                    this._calcTimer = null;
                    this.advancedLocationUnits = a.advancedLocationUnits;
                    this.NLS_Lon = g.widgets.measurement.NLS_longitude;
                    this.NLS_Lat = g.widgets.measurement.NLS_latitude;
                    this._gsErrorMsg = g.widgets.measurement.NLS_geometry_service_error;
                    this._calculatingMsg = g.widgets.measurement.NLS_calculating
                } else console.log("dijit.MeasureTool: unable to find the 'map' property in parameters")
            },
            startup: function() {
                var a = g.widgets.measurement;
                this.unitDictionary[a.NLS_length_miles] = 1;
                this.unitDictionary[a.NLS_length_kilometers] = 1.609344;
                this.unitDictionary[a.NLS_length_feet] = 5280;
                this.unitDictionary[a.NLS_length_meters] = 1609.34;
                this.unitDictionary[a.NLS_length_yards] =
                    1760;
                this.unitDictionary[a.NLS_length_nautical_miles] = 0.869;
                this.unitDictionary[a.NLS_area_acres] = 1;
                this.unitDictionary[a.NLS_area_sq_kilometers] = 0.004047;
                this.unitDictionary[a.NLS_area_sq_miles] = 0.0015625;
                this.unitDictionary[a.NLS_area_sq_feet] = 43560;
                this.unitDictionary[a.NLS_area_sq_meters] = 4046.87;
                this.unitDictionary[a.NLS_area_hectares] = 0.4047;
                this.unitDictionary[a.NLS_area_sq_yards] = 4840;
                this.unitDictionary[a.NLS_area_sq_nautical_miles] = 0.001179874545293396;
                this.units = {
                    esriMiles: a.NLS_length_miles,
                    esriKilometers: a.NLS_length_kilometers,
                    esriFeet: a.NLS_length_feet,
                    esriMeters: a.NLS_length_meters,
                    esriYards: a.NLS_length_yards,
                    esriNauticalMiles: a.NLS_length_nautical_miles,
                    esriAcres: a.NLS_area_acres,
                    esriSquareKilometers: a.NLS_area_sq_kilometers,
                    esriSquareMiles: a.NLS_area_sq_miles,
                    esriSquareFeet: a.NLS_area_sq_feet,
                    esriSquareMeters: a.NLS_area_sq_meters,
                    esriHectares: a.NLS_area_hectares,
                    esriSquareYards: a.NLS_area_sq_yards,
                    esriSquareNauticalMiles: a.NLS_area_sq_nautical_miles,
                    esriDecimalDegrees: a.NLS_decimal_degrees,
                    esriDegreeMinuteSeconds: a.NLS_deg_min_sec,
                    esriMGRS: a.NLS_MGRS,
                    esriUSNG: a.NLS_USNG,
                    esriUTM: a.NLS_UTM,
                    esriDDM: a.NLS_DDM,
                    esriDD: a.NLS_DD,
                    esriGARS: a.NLS_GARS,
                    esriGeoRef: a.NLS_GeoRef
                };
                d.byNode(this.distance.domNode).setLabel(g.widgets.measurement.NLS_distance);
                d.byNode(this.area.domNode).setLabel(g.widgets.measurement.NLS_area);
                d.byNode(this.location.domNode).setLabel(g.widgets.measurement.NLS_location);
                d.byNode(this.resultLabel.domNode).setContent(g.widgets.measurement.NLS_resultLabel);
                y.create("img", {
                    src: this._mouseImgURL,
                    style: "vertical-align:middle"
                }, this.mouseCell);
                this._useDefaultPointSymbol ? y.create("img", {
                    src: this._defaultPinURL,
                    style: "vertical-align:middle"
                }, this.pinCell) : this._drawPointGraphic();
                if (this._userGeometry)
                    if (this._map.loaded) this._measureCustomGeometry();
                    else var b = e.connect(this._map, "onLoad", this, function() {
                        e.disconnect(b);
                        b = null;
                        this._measureCustomGeometry()
                    })
            },
            measureArea: function() {
                this._map.navigationManager.setImmediateClick(!0);
                this._createAreaUnitList();
                this.inputPoints = [];
                this.tempGraphic = new h;
                this.tempGraphic.setSymbol(this._areaLineSymbol);
                this.tempGraphic.setGeometry(new k(this._map.spatialReference));
                this._map.graphics.add(this.tempGraphic);
                "PCS" === this._map.cs && (this._geometryAreaHandler = e.connect(this._geometryService, "onAreasAndLengthsComplete", this, "_outputArea"));
                this.mouseClickMapHandler = e.connect(this._map, "onClick", this, "_measureAreaMouseClickHandler");
                this.doubleClickMapHandler = e.connect(this._map, "onDblClick", this, "_measureAreaDblClickHandler")
            },
            measureDistance: function() {
                this._map.navigationManager.setImmediateClick(!0);
                "PCS" === this._map.cs && (this._projectMapExtent(this._map.extent), this._mapExtentChangeHandler = e.connect(this._map, "onExtentChange", this, "_projectMapExtent"));
                this.inputPoints = [];
                this._createLengthUnitList();
                this.mouseClickMapHandler = e.connect(this._map, "onClick", this, "_measureDistanceMouseClickHandler");
                this.doubleClickMapHandler = e.connect(this._map, "onDblClick", this, "_measureDistanceDblClickHandler")
            },
            measureLocation: function() {
                this._map.navigationManager.setImmediateClick(!0);
                this.measureGraphics = [];
                this._createLocationUnitList();
                this._map.graphics.remove(this.locationGraphic);
                "PCS" === this._map.cs && (this._projectMapExtent(this._map.extent), this._mapExtentChangeHandler = e.connect(this._map, "onExtentChange", f.hitch(this, this._projectMapExtent)));
                this._clickMapHandler = e.connect(this._map, "onClick", this, "_measureLocationClickHandler");
                this.mouseMoveMapHandler = e.connect(this._map, "onMouseMove", this, "_showCoordinates");
                this.mouseDragMapHandler = e.connect(this._map, "onMouseDrag",
                    f.hitch(this, function() {
                        d.byNode(this.resultValue.domNode).set("disabled", !0)
                    }))
            },
            setTool: function(a, b) {
                this._polylineGraphics = [];
                this.polylinePaths = [];
                this.closeTool();
                this.markerLocationY = this.markerLocationX = this.mouseLocationY = this.mouseLocationX = null;
                this.polygonGraphic && (this._map.graphics.remove(this.polygonGraphic), this.polygonGraphic = null);
                var c = d.byNode(this[a].domNode).checked;
                s.set(this.unit.domNode, "visibility", "visible");
                d.byNode(this.area.domNode).set("checked", !1);
                d.byNode(this.distance.domNode).set("checked", !1);
                d.byNode(this.location.domNode).set("checked", !1);
                if (!0 === b || !1 === b) c = b;
                d.byNode(this[a].domNode).set("checked", c);
                this._toggleStaticLocationTable(!1, !0);
                c ? (this.activeTool = a, (this._dblClickZoom = this._map.isDoubleClickZoom) && this._map.disableDoubleClickZoom(), "area" === a ? this.measureArea() : "distance" === a ? this.measureDistance() : "location" === a && this.measureLocation(), this._map.snappingManager && (this._map.snappingManager._startSelectionLayerQuery(), this._map.snappingManager._setUpSnapping())) : (this.activeTool =
                    "", s.set(this.unit.domNode, "visibility", "hidden"))
            },
            areaToggleButton: function() {
                this.clearResult();
                this.setTool("area")
            },
            distanceToggleButton: function() {
                this.clearResult();
                this.setTool("distance")
            },
            locationToggleButton: function() {
                this.clearResult();
                this.setTool("location")
            },
            closeTool: function() {
                var a = this._map;
                a.navigationManager.setImmediateClick(!1);
                this._dblClickZoom && a.enableDoubleClickZoom();
                this.inputPoints = [];
                a.snappingManager && a.snappingManager._snappingGraphic && a.graphics.remove(a.snappingManager._snappingGraphic);
                e.disconnect(this.mouseClickMapHandler);
                e.disconnect(this.mouseMoveMapHandler);
                e.disconnect(this.doubleClickMapHandler);
                e.disconnect(this.mouseDragMapHandler);
                e.disconnect(this._clickMapHandler);
                e.disconnect(this._mapExtentChangeHandler);
                e.disconnect(this._geometryAreaHandler);
                this.mouseClickMapHandler = this.mouseMoveMapHandler = this.doubleClickMapHandler = this.mouseDragMapHandler = this._clickMapHandler = this._mapExtentChangeHandler = this._geometryAreaHandler = null;
                this._map.snappingManager && (this._map.snappingManager._stopSelectionLayerQuery(),
                    this._map.snappingManager._killOffSnapping())
            },
            clearResult: function() {
                var a = this._map;
                this.result = 0;
                d.byNode(this.resultValue.domNode).set("content", "");
                var b;
                for (b = 0; b < this.measureGraphics.length; b++) a.graphics.remove(this.measureGraphics[b]);
                this.measureGraphics = [];
                a.graphics.remove(this.tempGraphic)
            },
            show: function() {
                p.show(this.domNode)
            },
            hide: function() {
                p.hide(this.domNode)
            },
            showTool: function(a) {
                this[a].domNode.style.display = "inline"
            },
            hideTool: function(a) {
                this[a].domNode.style.display = "none"
            },
            destroy: function() {
                this.closeTool();
                this.clearResult();
                this.inherited(arguments);
                this._map = this._geometryService = this.measureGraphic = this.measureGraphic = this.tempGraphic = null
            },
            onMeasureEnd: function() {},
            measure: function(a) {
                a && (this._userGeometry = L.fromJson(a.toJson()), this._measureCustomGeometry())
            },
            _measureCustomGeometry: function() {
                this.clearResult();
                switch (this._userGeometry.type) {
                    case "point":
                        this.setTool("location", !0);
                        "Web Mercator" === this._map.cs && this._userGeometry.spatialReference !== this._map.spatialReference &&
                            (this._userGeometry = n.geographicToWebMercator(this._userGeometry));
                        this.measureGraphic = new h;
                        this.measureGraphic.setSymbol(this._pointSymbol);
                        this.measureGraphic.setGeometry(this._userGeometry);
                        this.measureGraphics.push(this.measureGraphic);
                        this._map.graphics.add(this.measureGraphic);
                        this._measurePoint(this._userGeometry);
                        break;
                    case "polyline":
                        1 < this._userGeometry.paths[0].length && (this.setTool("distance", !0), this.inputPoints = [], m.forEach(this._userGeometry.paths[0], f.hitch(this, function(a, c) {
                                this.inputPoints.push(a);
                                var l = new h(new D(a[0], a[1], this._userGeometry.spatialReference), this._pointSymbol);
                                this.measureGraphics.push(l);
                                this._map.graphics.add(l);
                                0 !== c && (this.result += this._geodesicDistance(a, this._userGeometry.paths[0][c - 1]))
                            })), this.measureGraphic = new h, this.measureGraphic.setSymbol(this._lineSymbol), this.measureGraphics.push(this.measureGraphic), this._userGeometry = this._densifyGeometry(this._userGeometry), this.measureGraphic.setGeometry(this._userGeometry), this._map.graphics.add(this.measureGraphic),
                            this._showDistance(this.result), this.inputPoints = [], this.onMeasureEnd(this.activeTool, this._userGeometry));
                        break;
                    case "polygon":
                        this.setTool("area", !0);
                        this.inputPoints = [];
                        var a = this._densifyGeometry(this._userGeometry);
                        this.measureGraphic = new h;
                        this.measureGraphic.setGeometry(a);
                        this.measureGraphic.setSymbol(this._fillSymbol);
                        this.measureGraphics.push(this.measureGraphic);
                        this._map.graphics.add(this.measureGraphic);
                        this._getArea(a);
                        this.inputPoints = []
                }
            },
            _densifyGeometry: function(a) {
                "Web Mercator" ===
                    this._map.cs && (a = n.webMercatorToGeographic(a));
                a = "PCS" === this._map.cs ? a : t.geodesicDensify(a, 5E5);
                "Web Mercator" === this._map.cs && (a = n.geographicToWebMercator(a));
                return a
            },
            _measureAreaMouseClickHandler: function(a) {
                var b;
                this._map.snappingManager && (b = this._map.snappingManager._snappingPoint);
                b = b || a.mapPoint;
                this.inputPoints.push(b);
                this._currentStartPt = b;
                if (1 === this.inputPoints.length) {
                    this.tempGraphic.setGeometry(new k(this._map.spatialReference));
                    for (a = 0; a < this.measureGraphics.length; a++) this._map.graphics.remove(this.measureGraphics[a]);
                    this.measureGraphics = [];
                    this.result = 0;
                    this._outputResult(this.result, g.widgets.measurement.NLS_area_acres);
                    this.mouseMoveMapHandler = e.connect(this._map, "onMouseMove", this, "_measureAreaMouseMoveHandler")
                }
                this.measureGraphic = new h;
                this.measureGraphic.setSymbol(this._areaLineSymbol);
                this.measureGraphics.push(this.measureGraphic);
                if (1 < this.inputPoints.length) {
                    var c = new k(this._map.spatialReference);
                    c.addPath([this.inputPoints[this.inputPoints.length - 2], b]);
                    a = new k(this._map.spatialReference);
                    a.addPath([this.inputPoints[0],
                        b
                    ]);
                    b = this._densifyGeometry(c);
                    a = this._densifyGeometry(a);
                    this.tempGraphic.setGeometry(a);
                    this.measureGraphic.setGeometry(b);
                    this._polylineGraphics.push(this.measureGraphic);
                    this._map.graphics.add(this.measureGraphic);
                    if (2 < this.inputPoints.length) {
                        b = new u(this._map.spatialReference);
                        c = [];
                        for (a = 0; a < this.inputPoints.length; a++) c.push([this.inputPoints[a].x, this.inputPoints[a].y]);
                        c.push([this.inputPoints[0].x, this.inputPoints[0].y]);
                        b.addRing(c);
                        this._getArea(b);
                        this.polygonGraphic ? (this._map.graphics.remove(this.polygonGraphic),
                            this._polylineGraphics.push(this.tempGraphic), this.polygonGraphic = this._generatePolygonFromPaths(), this._map.graphics.add(this.polygonGraphic), this._polylineGraphics.pop()) : (this.polygonGraphic = this._generatePolygonFromPaths(), this._map.graphics.add(this.polygonGraphic))
                    }
                } else this.polygonGraphic && (this._map.graphics.remove(this.polygonGraphic), this.polygonGraphic = null)
            },
            _measureAreaMouseMoveHandler: function(a) {
                var b;
                if (0 < this.inputPoints.length) {
                    var c = new k(this._map.spatialReference),
                        l;
                    this._map.snappingManager &&
                        (l = this._map.snappingManager._snappingPoint);
                    b = l || a.mapPoint;
                    c.addPath([this._currentStartPt, b]);
                    a = this._densifyGeometry(c);
                    this.tempGraphic.setGeometry(a)
                }
                1 < this.inputPoints.length && (a = new k(this._map.spatialReference), a.addPath([b, this.inputPoints[0]]), b = this._densifyGeometry(a), this.tempGraphic.setGeometry(this.tempGraphic.geometry.addPath(b.paths[0])))
            },
            _measureAreaDblClickHandler: function(a) {
                e.disconnect(this.mouseMoveMapHandler);
                this.mouseMoveMapHandler = null;
                "touch" === this._map.navigationManager.eventModel &&
                    w("ios") && this._measureAreaMouseClickHandler(a);
                a = new u(this._map.spatialReference);
                var b = [],
                    c;
                for (c = 0; c < this.inputPoints.length; c++) b.push([this.inputPoints[c].x, this.inputPoints[c].y]);
                b.push([this.inputPoints[0].x, this.inputPoints[0].y]);
                a.addRing(b);
                this.inputPoints = [];
                this.measurementGeometry = this._densifyGeometry(a);
                this._getArea(a);
                this.polygonGraphic && (this._map.graphics.remove(this.polygonGraphic), this._polylineGraphics.push(this.tempGraphic), this.polygonGraphic = this._generatePolygonFromPaths(),
                    this._map.graphics.add(this.polygonGraphic));
                this._polylineGraphics = [];
                this.polylinePaths = []
            },
            _generatePolygonFromPaths: function() {
                var a = [];
                m.forEach(this._polylineGraphics, f.hitch(this, function(b) {
                    m.forEach(b.geometry.paths, f.hitch(this, function(b) {
                        m.forEach(b, f.hitch(this, function(b) {
                            a.push(b)
                        }))
                    }))
                }));
                a.push(a[0]);
                var b = new u(this._map.spatialReference);
                b.addRing(a);
                var b = this._densifyGeometry(b),
                    c = new h;
                c.setGeometry(b);
                c.setSymbol(this._borderlessFillSymbol);
                this.measureGraphic = c;
                this.measureGraphics.push(c);
                return c
            },
            _getArea: function(a) {
                var b = [],
                    c = new M;
                c.areaUnit = O.UNIT_ACRES;
                c.calculationType = "geodesic";
                u.prototype.isSelfIntersecting(a) ? this._geometryService.simplify([a], f.hitch(this, function(a) {
                    m.forEach(a, f.hitch(this, function(d) {
                        "PCS" === this._map.cs ? (c.polygons = a, this._geometryService.areasAndLengths(c)) : ("Web Mercator" === this._map.cs && (d = n.webMercatorToGeographic(d)), b.push(d))
                    }));
                    var d = t.geodesicAreas(b, q.ACRES);
                    this._showArea(d[0])
                })) : ("Web Mercator" === this._map.cs && (a = n.webMercatorToGeographic(a)),
                    b.push(a), "PCS" === this._map.cs ? (c.polygons = b, this._geometryService.areasAndLengths(c)) : (a = t.geodesicAreas(b, q.ACRES), this._showArea(Math.abs(a[0]))))
            },
            _outputArea: function(a) {
                this._showArea(Math.abs(a.areas[0]))
            },
            _showArea: function(a) {
                a && (this.result = a, a = d.byNode(this.unit.domNode).label, this._outputResult(this.result, a));
                this.onMeasureEnd(this.activeTool, this.measureGraphic.geometry)
            },
            _measureDistanceDblClickHandler: function(a) {
                e.disconnect(this.mouseMoveMapHandler);
                this.mouseMoveMapHandler = null;
                "touch" === this._map.navigationManager.eventModel && w("ios") && this._measureDistanceMouseClickHandler(a);
                a = new k(this._map.spatialReference);
                a.addPath(this.inputPoints);
                a = this._densifyGeometry(a);
                if ("PCS" === this._map.cs) {
                    var b = new N;
                    b.polylines = [a];
                    b.lengthUnit = 9093;
                    b.calculationType = "geodesic";
                    this._geometryService.lengths(b, f.hitch(this, function(a) {
                        this.result = a.lengths[0];
                        this._showDistance(this.result)
                    }))
                }
                this.inputPoints = [];
                this.onMeasureEnd(this.activeTool, a)
            },
            _measureDistanceMouseClickHandler: function(a) {
                var b;
                this._map.snappingManager && (b = this._map.snappingManager._snappingPoint);
                a = b || a.mapPoint;
                this.inputPoints.push(a);
                this._currentStartPt = a;
                if (1 === this.inputPoints.length) {
                    for (b = 0; b < this.measureGraphics.length; b++) this._map.graphics.remove(this.measureGraphics[b]);
                    this._map.graphics.remove(this.tempGraphic);
                    this.measureGraphics = [];
                    this.result = 0;
                    this._outputResult(this.result, g.widgets.measurement.NLS_length_miles);
                    this.tempGraphic = new h;
                    this.tempGraphic.setSymbol(this._lineSymbol);
                    this._map.graphics.add(this.tempGraphic);
                    this.mouseMoveMapHandler = e.connect(this._map, "onMouseMove", this, "_measureDistanceMouseMoveHandler")
                }
                this.tempGraphic.setGeometry(new k(this._map.spatialReference));
                this.flagGraphic = new h;
                this.flagGraphic.setSymbol(this._pointSymbol);
                this.flagGraphic.setGeometry(a);
                this.measureGraphics.push(this.flagGraphic);
                this._map.graphics.add(this.flagGraphic);
                1 < this.inputPoints.length && (this.measureGraphic = new h, this.measureGraphic.setSymbol(this._lineSymbol), this.measureGraphics.push(this.measureGraphic), b =
                    new k(this._map.spatialReference), b.addPath([this.inputPoints[this.inputPoints.length - 2], a]), b = this._densifyGeometry(b), this.measureGraphic.setGeometry(b), this._map.graphics.add(this.measureGraphic), this.result += this._geodesicDistance(this.inputPoints[this.inputPoints.length - 2], a), this._showDistance(this.result))
            },
            _measureDistanceMouseMoveHandler: function(a) {
                if (0 < this.inputPoints.length) {
                    var b = new k(this._map.spatialReference),
                        c;
                    this._map.snappingManager && (c = this._map.snappingManager._snappingPoint);
                    a = c || a.mapPoint;
                    b.addPath([this._currentStartPt, a]);
                    b = this._densifyGeometry(b);
                    this.tempGraphic.setGeometry(b);
                    b = this._geodesicDistance(this._currentStartPt, a);
                    this._showDistance(b + this.result)
                }
            },
            _geodesicDistance: function(a, b) {
                var c = new k(this._map.spatialReference);
                "PCS" === this._map.cs && (a = this._getGCSLocation(a), b = this._getGCSLocation(b));
                c.addPath([a, b]);
                "Web Mercator" === this._map.cs && (c = n.webMercatorToGeographic(c));
                return t.geodesicLengths([c], q.MILES)[0]
            },
            _showDistance: function(a) {
                a && this._outputResult(a,
                    d.byNode(this.unit.domNode).label)
            },
            _measureLocationClickHandler: function(a) {
                var b;
                this._map.snappingManager && (b = this._map.snappingManager._snappingPoint);
                a = b || a.mapPoint;
                this.locationToggleButton();
                this.locationGraphic = new h;
                this.locationGraphic.setGeometry(a);
                this.locationGraphic.setSymbol(this._pointSymbol);
                this._map.graphics.add(this.locationGraphic);
                this.measureGraphics.push(this.locationGraphic);
                this._measurePoint(a)
            },
            _measurePoint: function(a) {
                if ("esriDegreeMinuteSeconds" === this.currentLocationUnit ||
                    "esriDecimalDegrees" === this.currentLocationUnit) this._showStaticCoordinates({
                    mapPoint: a
                }), this.onMeasureEnd(this.activeTool, a);
                else {
                    var b = this._calculateXY({
                        mapPoint: a
                    });
                    this.markerLocationX = this.mouseLocationX = b[0];
                    this.markerLocationY = this.mouseLocationY = b[1];
                    this._toGeoCoordinateString({
                        coordinates: [
                            [this.markerLocationX, this.markerLocationY]
                        ],
                        sr: {
                            wkid: 4326
                        },
                        conversionType: this.units[this.currentLocationUnit]
                    }, a)
                }
            },
            _toGeoCoordinateString: function(a, b) {
                this.resultValue.domNode.innerHTML = "\x26nbsp";
                this._geometryService.toGeoCoordinateString(a, f.hitch(this, function(a) {
                    clearTimeout(this._calcTimer);
                    a ? (this.resultValue.domNode.innerHTML = a, this.onMeasureEnd(this.activeTool, b)) : (this.resultValue.domNode.innerHTML = this._gsErrorMsg, this.onMeasureEnd(this.activeTool, ""))
                }));
                clearTimeout(this._calcTimer);
                this._calcTimer = setTimeout(function() {
                    this.resultValue.domNode.innerHTML = this._calculatingMsg
                }, 1E3)
            },
            _getGCSLocation: function(a) {
                if ("Web Mercator" === this._map.cs) a = n.webMercatorToGeographic(a);
                else if ("PCS" ===
                    this._map.cs && this._map._newExtent) {
                    var b = Math.abs((this._map._newExtent.xmax - this._map._newExtent.xmin) / (this._map.extent.xmax - this._map.extent.xmin)),
                        c = Math.abs((this._map._newExtent.ymax - this._map._newExtent.ymin) / (this._map.extent.ymax - this._map.extent.ymin));
                    a = new D((a.x - this._map.extent.xmin) * b + this._map._newExtent.xmin, (a.y - this._map.extent.ymin) * c + this._map._newExtent.ymin, this._map.spatialReference)
                }
                return a
            },
            _projectMapExtent: function(a) {
                a = new h(a);
                var b = new C({
                    wkid: 4326
                });
                this._geometryService.project([a.geometry],
                    b, f.hitch(this, function(a) {
                        !this.mouseMoveMapHandler && "location" === this.activeTool && (this.mouseMoveMapHandler = e.connect(this._map, "onMouseMove", f.hitch(this, this._showCoordinates)), this.mouseDragMapHandler = e.connect(this._map, "onMouseDrag", f.hitch(this, function() {
                            d.byNode(this.resultValue.domNode).set("disabled", !0)
                        })));
                        this._map._newExtent = a[0]
                    }))
            },
            _calculateXY: function(a) {
                var b, c, d, e;
                this._map.snappingManager && (d = this._map.snappingManager._snappingPoint);
                a = d || a.mapPoint;
                this._interpolatedMap ? (d =
                    new C({
                        wkid: 4326
                    }), this._geometryService.project([a], d, f.hitch(this, function(a) {
                        e = a[0];
                        b = e.x;
                        c = e.y
                    }))) : (e = this._getGCSLocation(a), b = e.x, c = e.y);
                return [b, c]
            },
            _showStaticCoordinates: function(a) {
                this._toggleStaticLocationTable(!0, !1);
                a = this._calculateXY(a);
                this.markerLocationX = this.mouseLocationX = a[0];
                this.markerLocationY = this.mouseLocationY = a[1];
                a = this._calculateValueToDisplay(this.markerLocationX, this.markerLocationY, this.units[this.currentLocationUnit]);
                this.markerLongitude.innerHTML = this.mouseLongitude.innerHTML =
                    a[0];
                this.markerLatitude.innerHTML = this.mouseLatitude.innerHTML = a[1]
            },
            _showCoordinates: function(a) {
                a = this._calculateXY(a);
                this.mouseLocationX = a[0];
                this.mouseLocationY = a[1];
                this._outputLocationResult(this.mouseLocationX, this.mouseLocationY, d.byNode(this.unit.domNode).label)
            },
            _checkCS: function(a) {
                if (a.wkid) return 3857 === a.wkid || 102100 === a.wkid || 102113 === a.wkid ? "Web Mercator" : Q.isDefined(R[a.wkid]) ? "PCS" : "GCS";
                if (a.wkt) return -1 !== a.wkt.indexOf("WGS_1984_Web_Mercator") ? "Web Mercator" : 0 === a.wkt.indexOf("PROJCS") ?
                    "PCS" : "GCS"
            },
            _switchUnit: function(a) {
                "distance" === this.activeTool ? this.currentLengthUnit = a : "area" === this.activeTool ? this.currentAreaUnit = a : "location" === this.activeTool && (this.currentLocationUnit = a);
                d.byNode(this.unit.domNode).set("label", this.units[a]);
                if (null !== this.result && (this._outputResult(this.result, this.units[a]), this.measureGraphic)) this.onMeasureEnd(this.activeTool, this.measureGraphic.geometry)
            },
            _outputResult: function(a, b) {
                var c = a * this.unitDictionary[b];
                0 === c ? d.byNode(this.resultValue.domNode).set("content",
                    "") : 1E6 < c ? d.byNode(this.resultValue.domNode).set("content", x.format(c.toPrecision(9), {
                    pattern: this.numberPattern
                }) + " " + b) : 10 > c ? d.byNode(this.resultValue.domNode).set("content", x.format(c.toFixed(2), {
                    pattern: this.numberPattern + "0"
                }) + " " + b) : d.byNode(this.resultValue.domNode).set("content", x.format(c.toFixed(2), {
                    pattern: this.numberPattern
                }) + " " + b)
            },
            _switchLocationUnit: function(a) {
                var b, c;
                b = [];
                d.byNode(this.unit.domNode).set("label", this.units[a]);
                this.currentLocationUnit = a;
                "esriDegreeMinuteSeconds" ===
                    a || "esriDecimalDegrees" === a ? (this.mouseMoveMapHandler = e.connect(this._map, "onMouseMove", this, "_showCoordinates"), this._toggleStaticLocationTable(!0, !1), null === this.result || (null === this.mouseLocationX || null === this.mouseLocationY || "---" === this.mouseLongitude.innerHTML || null === this.mouseLongitude.innerHTML) || (this._outputLocationResult(this.mouseLocationX, this.mouseLocationY, this.units[a]), this.markerLocationX && this.markerLocationY && (b = this._calculateValueToDisplay(this.markerLocationX, this.markerLocationY,
                        this.units[a]), this.markerLongitude.innerHTML = b[0], this.markerLatitude.innerHTML = b[1]), this.onMeasureEnd(this.activeTool, this.locationGraphic.geometry))) : (e.disconnect(this.mouseMoveMapHandler), this._toggleStaticLocationTable(!1, !1), null === this.result || (null === this.mouseLocationX || null === this.mouseLocationY) || (b = this.markerLocationX || this.mouseLocationX, c = this.markerLocationY || this.mouseLocationY, a = {
                        coordinates: [
                            [b, c]
                        ],
                        sr: {
                            wkid: 4326
                        },
                        conversionType: this.units[a]
                    }, this._toGeoCoordinateString(a, this.locationGraphic.geometry)))
            },
            _toggleStaticLocationTable: function(a, b) {
                b && (this.resultValue.innerHTML = "", this.markerLongitude.innerHTML = "---", this.markerLatitude.innerHTML = "---", this.mouseLongitude.innerHTML = "---", this.mouseLatitude.innerHTML = "---");
                a ? (p.show(this.resultTable.domNode), p.hide(this.resultValue.domNode)) : (p.hide(this.resultTable.domNode), p.show(this.resultValue.domNode))
            },
            _calculateValueToDisplay: function(a, b, c) {
                var d, e, f = g.widgets.measurement;
                c === f.NLS_decimal_degrees ? (d = a.toFixed(6), e = b.toFixed(6)) : c === f.NLS_deg_min_sec &&
                    (f = c = !1, 0 > a && (c = !0, a = Math.abs(a)), 0 > b && (f = !0, b = Math.abs(b)), d = Math.floor(a) + "\u00b0" + Math.floor(60 * (a - Math.floor(a))) + "'" + Math.floor(60 * (60 * (a - Math.floor(a)) - Math.floor(60 * (a - Math.floor(a))))) + '"', e = Math.floor(b) + "\u00b0" + Math.floor(60 * (b - Math.floor(b))) + "'" + Math.floor(60 * (60 * (b - Math.floor(b)) - Math.floor(60 * (b - Math.floor(b))))) + '"', c && (d = "-" + d), f && (e = "-" + e));
                return [d, e]
            },
            _outputLocationResult: function(a, b, c) {
                a = this._calculateValueToDisplay(a, b, c);
                this.mouseLongitude.innerHTML = a[0];
                this.mouseLatitude.innerHTML =
                    a[1]
            },
            _createLengthUnitList: function() {
                var a, b = new z({
                    style: "display: none;"
                });
                a = g.widgets.measurement;
                var c = "esriMiles esriKilometers esriFeet esriMeters esriYards esriNauticalMiles".split(" ");
                m.forEach([a.NLS_length_miles, a.NLS_length_kilometers, a.NLS_length_feet, a.NLS_length_meters, a.NLS_length_yards, a.NLS_length_nautical_miles], f.hitch(this, function(a, d) {
                    var e = new A({
                        label: a,
                        onClick: f.hitch(this, function() {
                            this._switchUnit(c[d])
                        })
                    });
                    e.set("class", "unitDropDown");
                    b.addChild(e)
                }));
                d.byNode(this.unit.domNode).set("dropDown",
                    b);
                this.currentLengthUnit ? (a = this.units[this.currentLengthUnit], d.byNode(this.unit.domNode).set("label", a)) : (a = this.units[this._defaultLengthUnit], d.byNode(this.unit.domNode).set("label", a), this.currentLengthUnit = this._defaultLengthUnit)
            },
            _createAreaUnitList: function() {
                var a, b = new z({
                    style: "display: none;"
                });
                a = g.widgets.measurement;
                var c = "esriAcres esriSquareMiles esriSquareKilometers esriHectares esriSquareYards esriSquareFeet esriSquareMeters".split(" ");
                m.forEach([a.NLS_area_acres, a.NLS_area_sq_miles,
                    a.NLS_area_sq_kilometers, a.NLS_area_hectares, a.NLS_area_sq_yards, a.NLS_area_sq_feet, a.NLS_area_sq_meters
                ], f.hitch(this, function(a, d) {
                    var e = new A({
                        label: a,
                        onClick: f.hitch(this, function() {
                            this._switchUnit(c[d])
                        })
                    });
                    e.set("class", "unitDropDown");
                    b.addChild(e)
                }));
                d.byNode(this.unit.domNode).set("dropDown", b);
                this.currentAreaUnit ? (a = this.units[this.currentAreaUnit], d.byNode(this.unit.domNode).set("label", a)) : (a = this.units[this._defaultAreaUnit], d.byNode(this.unit.domNode).set("label", a), this.currentAreaUnit =
                    this._defaultAreaUnit)
            },
            _createLocationUnitList: function() {
                var a;
                a = g.widgets.measurement;
                var b = [];
                a = [a.NLS_decimal_degrees, a.NLS_deg_min_sec, a.NLS_MGRS, a.NLS_USNG, a.NLS_UTM, a.NLS_GeoRef, a.NLS_GARS];
                var c = "esriDecimalDegrees esriDegreeMinuteSeconds esriMGRS esriUSNG esriUTM esriGeoRef esriGARS".split(" "),
                    e = new z({
                        style: "display: none;"
                    }),
                    b = this._geometryService && this.advancedLocationUnits ? a : [a[0], a[1]];
                m.forEach(b, f.hitch(this, function(a, b) {
                    var d = new A({
                        label: a,
                        onClick: f.hitch(this, function() {
                            this._switchLocationUnit(c[b])
                        })
                    });
                    d.set("class", "unitDropDown");
                    e.addChild(d)
                }));
                d.byNode(this.unit.domNode).set("dropDown", e);
                this.currentLocationUnit ? (a = this.units[this.currentLocationUnit], d.byNode(this.unit.domNode).set("label", a)) : (a = this.units[this._defaultLocationUnit], d.byNode(this.unit.domNode).set("label", a), this.currentLocationUnit = this._defaultLocationUnit);
                ("esriDegreeMinuteSeconds" === this.currentLocationUnit || "esriDecimalDegrees" === this.currentLocationUnit) && this._toggleStaticLocationTable(!0, !1)
            },
            _drawPointGraphic: function() {
                var a,
                    b, c, d;
                c = this._pointSymbol;
                b = y.create("div", {
                    "class": "esriLocationResultSymbol"
                }, this.pinCell);
                b = F.createSurface(b, 10, 10);
                9 > w("ie") && (a = b.getEventSource(), s.set(a, "position", "relative"), s.set(a.parentNode, "position", "relative"));
                c = c.getShapeDescriptors();
                try {
                    d = b.createShape(c.defaultShape).setFill(c.fill).setStroke(c.stroke)
                } catch (e) {
                    b.clear();
                    b.destroy();
                    return
                }
                var g = d.getBoundingBox();
                c = g.width;
                a = g.height;
                var h = -(g.x + c / 2),
                    g = -(g.y + a / 2);
                b = b.getDimensions();
                b = {
                    dx: h + b.width / 2,
                    dy: g + b.height / 2
                };
                if (10 <
                    c || 10 < a) c = 5 / (c / 10 > a / 10 ? c : a), f.mixin(b, {
                    xx: c,
                    yy: c
                });
                d.applyTransform(b)
            }
        })
    });