//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Deferred", "dojo/_base/array", "dojo/dom-construct", "dojo/dom-style", "dojo/Evented", "dojo/on", "dojo/uacss", "dijit/_WidgetBase", "dijit/Menu", "dijit/MenuItem", "dgrid/OnDemandGrid", "dgrid/Selection", "dgrid/Keyboard", "dgrid/extensions/DijitRegistry", "dgrid/extensions/ColumnResizer", "dgrid/extensions/ColumnHider", "dojo/store/Memory", "../kernel", "../graphic", "../InfoTemplate", "../SpatialReference", "../geometry/webMercatorUtils", "../geometry/Extent", "../geometry/Point", "../layers/GraphicsLayer", "../symbols/PictureMarkerSymbol", "../tasks/locator", "../tasks/AddressCandidate", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/i18n!../nls/jsapi", "./GeocodeMatch/Popup"],
    function(z, p, d, A, k, l, q, B, m, P, C, D, v, E, F, G, H, I, J, r, Q, n, K, R, w, x, L, M, s, t, u, N, y, e, O) {
        return p([C, B], {
            basePath: z.toUrl("./GeocodeMatch/"),
            loaded: !1,
            singleLineInput: !0,
            _mapClickPause: !1,
            _defaultLocatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
            _customLocator: !1,
            _hasCustomPoint: !1,
            _hasDefaultPoint: !1,
            constructor: function(a, c) {
                p.safeMixin(this, a);
                this.map && (this.geocoder ? (this._locator = new t(this.geocoder), this._customLocator = !0) : (this._locator = new t(this._defaultLocatorURL),
                    this._customLocator = !1), this._columns = [{
                    label: "",
                    field: "matched",
                    resizable: !1,
                    formatter: function(a) {
                        return a
                    },
                    get: d.hitch(this, function(a) {
                        return a.matched ? "\x3cimg src\x3d'" + this.basePath.toString() + "images/EsriGreenPinCircle26.png' /\x3e" : ""
                    })
                }, {
                    label: e.widgets.geocodeMatch.match.columnLabelAddress,
                    field: "address",
                    formatter: function(a) {
                        return a
                    },
                    get: d.hitch(this, function(a) {
                        var c = "",
                            c = "object" === typeof a.address ? a.Match_Addr ? a.Match_Addr : "" : a.address;
                        return "DefaultMatch" === a.Addr_type || "Custom" ===
                            a.Addr_type ? a.matched ? e.widgets.geocodeMatch.popup.matchButtonLabel : c + " (" + e.widgets.geocodeMatch.popup.matchButtonLabel + ")" : c
                    })
                }, {
                    label: e.widgets.geocodeMatch.match.columnLabelType,
                    field: "Addr_type",
                    formatter: function(a) {
                        return a
                    },
                    get: d.hitch(this, function(a) {
                        var c = a.Addr_type;
                        return "DefaultMatch" === a.Addr_type || "Custom" === a.Addr_type ? "" : c = c.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, "$1$4 $2$3$5")
                    })
                }, {
                    label: e.widgets.geocodeMatch.match.columnLabelScore,
                    field: "score",
                    hidden: !0,
                    formatter: function(a) {
                        return a
                    },
                    get: d.hitch(this, function(a) {
                        return 0 < a.score && 100 >= a.score ? a.score : " "
                    })
                }], this.suggestionGraphic || (this.suggestionGraphic = new s(this.basePath.toString() + "images/EsriBluePinCircle26.png", 26, 26), this.suggestionGraphic.setOffset(0, 12)), this.matchGraphic || (this.matchGraphic = new s(this.basePath.toString() + "images/EsriGreenPinCircle26.png", 26, 26), this.matchGraphic.setOffset(0, 12)), this.highlightGraphic || (this.highlightGraphic = new s(this.basePath.toString() + "images/EsriYellowPinCircle26.png", 26, 26), this.highlightGraphic.setOffset(0,
                    12)))
            },
            postCreate: function() {
                this.inherited(arguments);
                var a = this.map,
                    c, b, g, f, h;
                c = this.graphicsLayer = new M;
                b = this._infoTemplate = new K;
                b.setTitle(null);
                b.setContent(d.hitch(this, this._getInfoTemplateContent));
                c.setInfoTemplate(b);
                a.addLayer(c);
                this._createContainerNodes();
                this._createGridMenu();
                b = p([E, H, F, G, I, J]);
                this.store = new r({
                    data: "",
                    idProperty: e.widgets.geocodeMatch.idProperty
                });
                h = this.grid = new b({
                    store: this.store,
                    sort: "sort",
                    noDataMessage: e.widgets.geocodeMatch.match.noDataMsg,
                    selectionMode: "extended",
                    allowSelectAll: !0,
                    cellNavigation: !1,
                    columns: this._columns
                }, this._gridRef);
                this.resize();
                this._listenerHandles = [m(window, "resize", d.hitch(this, function() {
                    this.resize()
                })), m(h, "dgrid-deselect", d.hitch(this, function() {
                    this.currentSelectedRow = this.currentSelectedRowId = null
                })), m(h, "dgrid-select", d.hitch(this, function(b) {
                    k.forEach(c.graphics, d.hitch(this, function(b) {
                        b.attributes && (b.attributes.type === e.widgets.geocodeMatch.customLabel && !1 === b.attributes.matched) && (c.remove(b), a.infoWindow.hide())
                    }));
                    g =
                        b.rows[0].data.location;
                    this.currentSelectedRowId = b.rows[0].data.id;
                    this.currentSelectedRow = b.rows[0].data;
                    a.centerAt(g).then(d.hitch(this, function() {
                        a.infoWindow.setFeatures([c.graphics[this.currentSelectedRowId]]);
                        a.infoWindow.show(g)
                    }))
                })), m(a, "click", d.hitch(this, function(b) {
                    this._mapClickPause || (k.forEach(c.graphics, d.hitch(this, function(b) {
                            b.attributes && (b.attributes.type === e.widgets.geocodeMatch.customLabel && !1 === b.attributes.matched) && (c.remove(b), a.infoWindow && a.infoWindow.hide())
                        })), b.graphic ?
                        b.graphic.attributes && b.graphic.attributes.id && (h.clearSelection(), h.select(b.graphic.attributes.id)) : this.lastAddress && (h.clearSelection(), g = new L(b.mapPoint.x, b.mapPoint.y, a.spatialReference), f = new n(g, this.highlightGraphic), f.setAttributes({
                            type: e.widgets.geocodeMatch.customLabel,
                            matched: !1,
                            featureType: this.featureType
                        }), c.add(f), a.infoWindow.setFeatures([f]), a.infoWindow.show(g)))
                }))];
                this.resize()
            },
            startup: function() {
                this.inherited(arguments);
                this.grid.startup();
                this.resize();
                this.map.loaded ?
                    (this.loaded = !0, this.emit("load", {})) : m(this.map, "load", d.hitch(this, function() {
                    this.loaded = !0;
                    this.emit("load", {})
                }))
            },
            updateLocatorURL: function(a) {
                this._locator = new t(a)
            },
            geocodeAddress: function(a) {
                this._resetMapState();
                this._resetAppState();
                var c, b, g, f = this.grid,
                    h = new A;
                switch (typeof a) {
                    case "string":
                        c = a;
                        b = {
                            address: {
                                SingleLine: c
                            },
                            outFields: ["*"]
                        };
                        this.singleLineInput = !0;
                        break;
                    case "object":
                        if (a.id && (this.featureID = a.id), a.featureType && (this.featureType = a.featureType), a.address) switch (typeof a.address) {
                            case "string":
                                c =
                                    a.address;
                                b = {
                                    address: {
                                        SingleLine: c
                                    },
                                    outFields: ["*"]
                                };
                                this.singleLineInput = !0;
                                break;
                            case "object":
                                Object.keys || (Object.keys = function(a) {
                                    var b = [],
                                        c;
                                    for (c in a) a.hasOwnProperty(c) && b.push(c);
                                    return b
                                }), a.address.CountryCode && a.address.Address && 2 === Object.keys(a.address).length ? (c = a.address.Address, b = {
                                    address: {
                                        SingleLine: a.address.Address,
                                        CountryCode: a.address.CountryCode
                                    },
                                    outFields: ["*"]
                                }, this.singleLineInput = !0) : a.address.CountryCode && 2 === Object.keys(a.address).length ? (c = a.address, b = {
                                    address: {
                                        SingleLine: a.address,
                                        CountryCode: a.address.CountryCode
                                    },
                                    outFields: ["*"]
                                }, this.singleLineInput = !0) : (c = a.address, b = {
                                    address: c,
                                    outFields: ["*"]
                                }, this.singleLineInput = !1)
                        }
                }
                a.sourceCountry && (b.address.CountryCode = a.sourceCountry);
                f.noDataMessage = e.widgets.geocodeMatch.popup.loadingPH;
                f.refresh();
                this._locator.outSpatialReference = this.map.spatialReference;
                this._locator.addressToLocations(b).then(d.hitch(this, function(b) {
                    var d;
                    for (d = 0; d < b.length; d++) b[d].id = d, b[d].featureID = this.featureID, b[d].matched = !1, b[d].sort = d + 2, b[d].Addr_type =
                        b[d].attributes.Addr_type, b[d].Match_addr = b[d].attributes.Match_addr, b[d].featureType = a.featureType;
                    a.location ? (!1 === a.reviewed && (this.currentMatch = d = b.length, this._hasDefaultPoint = !0, this.defaultGeometry = a.location, this.defaultGeometry.spatialReference.wkid !== this.map.spatialReference.wkid && (this.defaultGeometry = w.geographicToWebMercator(this.defaultGeometry)), g = new u({
                        id: d,
                        address: c,
                        Addr_type: e.widgets.geocodeMatch.match.defaultMatchType,
                        location: this.defaultGeometry,
                        featureID: this.featureID,
                        featureType: a.featureType,
                        matched: !0,
                        score: -1,
                        sort: 0
                    }), b.push(g)), !0 === a.reviewed && (this.currentMatch = d = b.length, this._hasCustomPoint = !0, this.defaultGeometry = a.location, this.defaultGeometry.spatialReference.wkid !== this.map.spatialReference.wkid && (this.defaultGeometry = w.geographicToWebMercator(this.defaultGeometry)), g = new u({
                        id: d,
                        address: c,
                        Addr_type: e.widgets.geocodeMatch.customLabel,
                        location: this.defaultGeometry,
                        featureID: this.featureID,
                        featureType: a.featureType,
                        matched: !0,
                        score: -1,
                        sort: 0
                    }), b.push(g))) : this.defaultGeometry =
                        null;
                    this.store = new r({
                        data: b
                    });
                    f.set("store", this.store);
                    this._updateMapGraphics();
                    this.lastGeocodeResults = b;
                    this.lastAddress = c;
                    h.resolve(b);
                    f.noDataMessage = "No Results.";
                    f.refresh()
                }), function(a) {});
                return h.promise
            },
            pauseMapEvents: function() {
                this._mapClickPause = !0
            },
            resumeMapEvents: function() {
                this._mapClickPause = !1
            },
            refresh: function() {
                this.grid.refresh();
                this.matchWidgetBorderContainer.refresh();
                this.matchWidgetContentPane1.refresh();
                this.matchWidgetContentPane2.refresh()
            },
            resize: function() {
                this.matchWidgetBorderContainer.resize();
                this.matchWidgetContentPane1.resize();
                this.matchWidgetContentPane2.resize();
                this.grid && this.grid.resize()
            },
            destroy: function() {
                k.forEach(this._listenerHandles, function(a) {
                    a.remove()
                });
                this.Popup && (this.Popup.destroy(), this.Popup = null);
                this.grid && this.grid.destroy();
                this.store = this._columns = this.grid = null;
                this._gridMenuRef && l.empty(this._gridMenuRef);
                this.gridMenu = null;
                this.map && (this.map.infoWindow.clearFeatures(), this.map.infoWindow.hide(), this.map.removeLayer(this.graphicsLayer));
                this.map = this.graphicsLayer =
                    this._infoTemplate = this._locator = null;
                this.inherited(arguments)
            },
            reset: function() {
                this._resetAppState();
                this._resetMapState()
            },
            _matchCustomFeature: function(a) {
                var c, b;
                !0 === this._hasCustomPoint && (k.forEach(this.store.data, d.hitch(this, function(a) {
                    a.Addr_type === e.widgets.geocodeMatch.customLabel && this.store.data.splice(k.indexOf(this.store.data, a), 1)
                })), k.forEach(this.graphicsLayer.graphics, d.hitch(this, function(a) {
                    a.attributes && a.attributes.type === e.widgets.geocodeMatch.customLabel && (a.attributes.matched = !1)
                })), this.graphicsLayer.remove(this.graphicsLayer.graphics[this.currentMatch]), this.currentMatch = null);
                b = this.store.data.length;
                c = new u({
                    id: b,
                    Addr_type: e.widgets.geocodeMatch.customLabel,
                    address: this.lastAddress,
                    matched: !1,
                    location: a.geometry,
                    score: -1,
                    sort: 1,
                    graphicSymbol: a.symbol
                });
                a.attributes.id = b;
                a.attributes.matched = !0;
                this.store.data.push(c);
                this._hasCustomPoint = !0;
                this._matchFeature(b)
            },
            _matchFeature: function(a) {
                var c = this.store.data,
                    b = this.graphicsLayer.graphics,
                    d = this.currentMatch;
                null ===
                    d ? (c[a].matched = !0, !1 !== this.map && (b[a].attributes.matched = !0, b[a].attributes.id = a, b[a].setSymbol(this.matchGraphic), b[a].getDojoShape().moveToFront())) : (c[a].matched = !0, c[d].matched = !1, b[d].attributes.matched = !1, b[d].setSymbol(this.suggestionGraphic), b[a].attributes.matched = !0, b[a].attributes.id = a, b[a].setSymbol(this.matchGraphic), b[a].getDojoShape().moveToFront(), b[d].attributes.type === e.widgets.geocodeMatch.customLabel && b[a].attributes.type !== e.widgets.geocodeMatch.customLabel && (this.graphicsLayer.remove(b[d]),
                        c.splice(k.indexOf(c, c[d]), 1), this._hasCustomPoint = !1));
                this.currentMatch = a;
                this.emit("match", {
                    id: a,
                    featureID: this.featureID,
                    address: this.lastAddress,
                    oldLocation: this.defaultGeometry,
                    featureType: this.featureType,
                    newLocation: c[a].location,
                    graphicSymbol: this.matchGraphic
                });
                this.grid.refresh()
            },
            _updateMapGraphics: function() {
                var a = this.store.data,
                    c = this.suggestionGraphic,
                    b, e, f = [];
                this.graphicsLayer.clear();
                1 === a.length ? (b = !0 === a[0].matched ? new n(a[0].location, this.matchGraphic) : new n(a[0].location, c),
                    b.setAttributes({
                        id: 0,
                        matched: a[0].matched,
                        type: a[0].Addr_type
                    }), f.push(b)) : 1 < a.length && k.forEach(a, d.hitch(this, function(a) {
                    b = !0 === a.matched ? new n(a.location, this.matchGraphic) : new n(a.location, c);
                    b.setAttributes({
                        id: a.id,
                        matched: a.matched,
                        type: a.Addr_type
                    });
                    f.push(b)
                }));
                0 !== a.length && (a = this._calcGraphicsExtent(f), this.map.setExtent(a, !0).then(d.hitch(this, function() {
                    for (e = 0; e < f.length; e++) this.graphicsLayer.add(f[e])
                })));
                k.forEach(this.graphicsLayer.graphics, d.hitch(this, function(a) {
                    a.attributes &&
                        !0 === a.attributes.matched && a.getDojoShape().moveToFront()
                }))
            },
            _getInfoTemplateContent: function(a) {
                this.Popup = new O({
                    geocodeMatch: this,
                    geocodeAddress: this.lastAddress,
                    rowData: this.store.data[a.attributes.id],
                    map: this.map,
                    graphicsLayer: this.graphicsLayer,
                    graphic: a
                }, l.create("div"));
                return this.Popup.domNode
            },
            _createContainerNodes: function() {
                var a, c, b;
                q.set(this.domNode, "position", "relative");
                q.set(this.domNode, "height", "100%");
                q.set(this.domNode, "width", "100%");
                a = this.matchWidgetBorderContainer = new N({
                    "class": "esriMatchContainer",
                    style: "height: 100%; width: 100%;",
                    gutters: !1
                });
                c = this.matchWidgetContentPane1 = new y({
                    region: "top",
                    style: "width: 100%; height: 30px;",
                    "class": "esriMatchHeader"
                });
                b = this.matchWidgetContentPane2 = new y({
                    region: "center",
                    style: "width: 100%; height: 100%;"
                });
                this._gridMenuLeftSpanRef = l.create("span", {
                    "class": "esriMatchTitle",
                    innerHTML: e.widgets.geocodeMatch.gridTitle
                }, c.domNode);
                this._gridMenuRightRef = l.create("div", {
                    "class": "esriMatchOptions"
                }, c.domNode);
                this._gridMenuRightSpanRef = l.create("span", {
                        innerHTML: e.widgets.geocodeMatch.match.tableOptionsLabel
                    },
                    this._gridMenuRightRef);
                this._gridMenuRightArrowRef = l.create("div", {
                    "class": "esriSpriteArrow"
                }, this._gridMenuRightRef);
                this._gridRef = l.create("div", {}, b.domNode);
                a.addChild(c);
                a.addChild(b);
                a.placeAt(this.domNode);
                a.startup();
                this.resize()
            },
            _createGridMenu: function() {
                this.gridMenu = new D({
                    targetNodeIds: [this._gridMenuRightRef],
                    leftClickToOpen: "true"
                });
                this.gridMenu.addChild(new v({
                    label: e.widgets.geocodeMatch.match.mapAllCandidatesLabel,
                    onClick: d.hitch(this, function() {
                        this._resetMapState();
                        this._updateMapGraphics()
                    })
                }));
                this.gridMenu.addChild(new v({
                    label: e.widgets.geocodeMatch.match.defaultSortOrderLabel,
                    onClick: d.hitch(this, function() {
                        this.grid.set("sort", "sort")
                    })
                }));
                this.gridMenu.startup()
            },
            _formatGeocodeResults: function(a) {
                var c = "",
                    b;
                if ("object" === typeof a) {
                    for (b in a) a.hasOwnProperty(b) && (c += a[b] + " ");
                    a = c
                } else a = a.address && "string" === typeof a.address ? a.address : a;
                return a
            },
            _resetMapState: function() {
                this.Popup && (this.Popup.map.infoWindow.hide(), this.Popup.map.infoWindow.clearFeatures());
                this.grid.clearSelection();
                this.graphicsLayer.clear()
            },
            _resetAppState: function() {
                this.currentSelectedRow = this.lastGeocodeResults = this.lastAddress = this.currentMatch = null;
                this.store.data = null;
                this.store = new r({
                    data: ""
                });
                this.defaultGeometry = null;
                this._hasDefaultPoint = this._hasCustomPoint = !1;
                this.grid.noDataMessage = "No Results.";
                this.grid.refresh()
            },
            _calcGraphicsExtent: function(a) {
                var c = a[0].geometry,
                    b = c.getExtent(),
                    d, e, h = a.length;
                null === b && (b = new x(c.x, c.y, c.x, c.y, c.spatialReference));
                for (e = 1; e < h; e++) c = a[e].geometry, d = c.getExtent(),
                    null === d && (d = new x(c.x, c.y, c.x, c.y, c.spatialReference)), b = b.union(d);
                return b
            }
        })
    });