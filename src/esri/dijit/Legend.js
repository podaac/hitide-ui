//>>built
define(["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/Color", "dojo/has", "dojo/sniff", "dojo/DeferredList", "dojo/json", "dojo/number", "dojo/dom", "dojo/dom-construct", "dojo/dom-style", "dijit/_Widget", "dojox/gfx", "dojox/gfx/matrix", "dojox/html/entities", "../kernel", "../config", "../request", "../lang", "../renderers/SimpleRenderer", "../renderers/UniqueValueRenderer", "../renderers/ClassBreaksRenderer", "../renderers/ScaleDependentRenderer", "../renderers/DotDensityRenderer", "../symbols/SimpleMarkerSymbol", "../symbols/PictureFillSymbol", "../symbols/jsonUtils", "./_EventedWidget", "dojo/i18n!../nls/jsapi", "dojo/i18n!dojo/cldr/nls/number"],
    function(w, I, s, n, g, J, x, t, W, K, L, A, p, e, m, M, B, N, O, X, C, D, z, E, F, G, P, Q, R, S, y, T, U, V) {
        var v = I([T, M], {
            declaredClass: "esri.dijit.Legend",
            widgetsInTemplate: !1,
            layers: null,
            alignRight: !1,
            hoverLabelShowing: !1,
            dotDensitySwatchSize: 26,
            dotCoverage: 75,
            reZeros: RegExp("\\" + V.decimal + "0+$", "g"),
            reZerosFractional: RegExp("(\\d)0*$", "g"),
            _ieTimer: 100,
            _isRightToLeft: !1,
            _align: null,
            _legendAlign: null,
            constructor: function(a, b) {
                s.mixin(this, U.widgets.legend);
                a = a || {};
                a.map ? b ? (this.map = a.map, this.layerInfos = a.layerInfos, this._respectCurrentMapScale = !1 === a.respectCurrentMapScale ? !1 : !0, this.arrangement = a.arrangement === v.ALIGN_RIGHT ? v.ALIGN_RIGHT : v.ALIGN_LEFT, this.arrangement === v.ALIGN_RIGHT && (this.alignRight = !0), this.autoUpdate = !1 === a.autoUpdate ? !1 : !0, this._surfaceItems = []) : console.error("esri.dijit.Legend: must specify a container for the legend") : console.error("esri.dijit.Legend: unable to find the 'map' property in parameters")
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                var a = ["ar", "he"],
                    b, c;
                for (b = 0; b < a.length; b += 1) c = a[b], w.locale &&
                    -1 !== w.locale.indexOf(c) && (-1 !== w.locale.indexOf("-") ? -1 !== w.locale.indexOf(c + "-") && (this._isRightToLeft = !0) : this._isRightToLeft = !0);
                this._isRightToLeft ? (this._align = this.alignRight ? "left" : "right", this._legendAlign = this.alignRight ? "esriLegendLeft" : "esriLegendRight") : (this._align = this.alignRight ? "right" : "left", this._legendAlign = this.alignRight ? "esriLegendRight" : "esriLegendLeft")
            },
            startup: function() {
                this.inherited(arguments);
                this._initialize();
                t("ie") && (this._repaintItems = s.hitch(this, this._repaintItems),
                    setTimeout(this._repaintItems, this._ieTimer))
            },
            destroy: function() {
                this._deactivate();
                this._removeHoverHandlers();
                this.inherited(arguments)
            },
            refresh: function(a) {
                if (this.domNode) {
                    a ? (this.layerInfos = a, this.layers = [], n.forEach(this.layerInfos, function(a) {
                        this._isSupportedLayerType(a.layer) && (a.title && (a.layer._titleForLegend = a.title), a.layer._hideDefaultSymbol = !1 === a.defaultSymbol ? !0 : !1, a.hideLayers ? (a.layer._hideLayersInLegend = a.hideLayers, this._addSubLayersToHide(a)) : a.layer._hideLayersInLegend = [],
                            a.hoverLabel && (a.layer._hoverLabel = a.hoverLabel), a.hoverLabels && (a.layer._hoverLabels = a.hoverLabels), this.layers.push(a.layer))
                    }, this)) : this.useAllMapLayers && (this.layers = this.layerInfos = null);
                    for (a = this.domNode.children.length - 1; 0 <= a; a--) e.destroy(this.domNode.children[a]);
                    this._removeHoverHandlers();
                    this.startup()
                }
            },
            _legendUrl: "http://utility.arcgis.com/sharing/tools/legend",
            _initialize: function() {
                this.layerInfos && (this.layers = [], n.forEach(this.layerInfos, function(a) {
                    this._isSupportedLayerType(a.layer) &&
                        (a.title && (a.layer._titleForLegend = a.title), a.layer._hideDefaultSymbol = !1 === a.defaultSymbol ? !0 : !1, a.hideLayers ? (a.layer._hideLayersInLegend = a.hideLayers, this._addSubLayersToHide(a)) : a.layer._hideLayersInLegend = [], a.hoverLabel && (a.layer._hoverLabel = a.hoverLabel), a.hoverLabels && (a.layer._hoverLabels = a.hoverLabels), this.layers.push(a.layer))
                }, this));
                this.useAllMapLayers = !1;
                if (!this.layers) {
                    this.useAllMapLayers = !0;
                    this.layers = [];
                    var a = [],
                        b = [];
                    n.forEach(this.map.layerIds, function(c) {
                        c = this.map.getLayer(c);
                        var d;
                        this._isSupportedLayerType(c) && (c.arcgisProps && c.arcgisProps.title && (c._titleForLegend = c.arcgisProps.title), this.layers.push(c));
                        "esri.layers.KMLLayer" == c.declaredClass && (d = c.getLayers(), n.forEach(d, function(b) {
                            a.push(b.id)
                        }, this));
                        "esri.layers.GeoRSSLayer" == c.declaredClass && (d = c.getFeatureLayers(), n.forEach(d, function(a) {
                            b.push(a.id)
                        }, this))
                    }, this);
                    n.forEach(this.map.graphicsLayerIds, function(c) {
                        var d = this.map.getLayer(c); - 1 == n.indexOf(a, c) && -1 == n.indexOf(b, c) && (this._isSupportedLayerType(d) &&
                            d._params && d._params.drawMode) && (d.arcgisProps && d.arcgisProps.title && (d._titleForLegend = d.arcgisProps.title), this.layers.push(d))
                    }, this)
                }
                this._createLegend()
            },
            _activate: function() {
                this._deactivate();
                this.autoUpdate && (this._respectCurrentMapScale && (this._ozeConnect = g.connect(this.map, "onZoomEnd", this, "_refreshLayers")), this.useAllMapLayers && (this._olaConnect = g.connect(this.map, "onLayerAdd", this, "_updateAllMapLayers"), this._olrConnect = g.connect(this.map, "onLayerRemove", this, "_updateAllMapLayers"), this._olroConnect =
                    g.connect(this.map, "onLayersReordered", this, "_updateAllMapLayers")), n.forEach(this.layers, function(a) {
                    a.ovcConnect = g.connect(a, "onVisibilityChange", this, "_refreshLayers");
                    a.oscConnect = g.connect(a, "onScaleRangeChange", this, "_refreshLayers");
                    "esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass && a.supportsDynamicLayers && (a.odcConnect = g.connect(a, "_onDynamicLayersChange", s.hitch(this, "_updateDynamicLayers", a)));
                    "esri.layers.ArcGISImageServiceLayer" === a.declaredClass && (a.oirConnect = g.connect(a,
                        "onRenderingChange", s.partial(this._updateImageServiceLayers, this, a)))
                }, this))
            },
            _deactivate: function() {
                this._ozeConnect && g.disconnect(this._ozeConnect);
                this._olaConnect && g.disconnect(this._olaConnect);
                this._olroConnect && g.disconnect(this._olroConnect);
                this._olrConnect && g.disconnect(this._olrConnect);
                n.forEach(this.layers, function(a) {
                    a.ovcConnect && g.disconnect(a.ovcConnect);
                    a.oscConnect && g.disconnect(a.oscConnect);
                    a.odcConnect && g.disconnect(a.odcConnect);
                    a.oirConnect && g.disconnect(a.oirConnect)
                }, this)
            },
            _updateDynamicLayers: function(a) {
                delete a.legendResponse;
                this._refreshLayers()
            },
            _updateImageServiceLayers: function(a, b) {
                delete b.legendResponse;
                a._refreshLayers()
            },
            _refreshLayers: function() {
                this.refresh()
            },
            _updateAllMapLayers: function() {
                this.layers = [];
                n.forEach(this.map.layerIds, function(a) {
                    a = this.map.getLayer(a);
                    this._isSupportedLayerType(a) && this.layers.push(a)
                }, this);
                n.forEach(this.map.graphicsLayerIds, function(a) {
                    a = this.map.getLayer(a);
                    this._isSupportedLayerType(a) && (a._params && a._params.drawMode) &&
                        this.layers.push(a)
                }, this);
                this.refresh()
            },
            _createLegend: function() {
                var a = !1;
                m.set(this.domNode, "position", "relative");
                e.create("div", {
                    id: this.id + "_msg",
                    innerHTML: this.NLS_creatingLegend + "..."
                }, this.domNode);
                var b = [];
                n.forEach(this.layers, function(c) {
                    if ("esri.layers.KMLLayer" == c.declaredClass || "esri.layers.GeoRSSLayer" == c.declaredClass) {
                        var f;
                        c.loaded ? ("esri.layers.KMLLayer" == c.declaredClass ? f = c.getLayers() : "esri.layers.GeoRSSLayer" == c.declaredClass && (f = c.getFeatureLayers(), c._hideLayersInLegend &&
                            (f = n.filter(f, function(a) {
                                return -1 == n.indexOf(c._hideLayersInLegend, a.id)
                            }))), n.forEach(f, function(a) {
                            "esri.layers.FeatureLayer" == a.declaredClass && c._titleForLegend && (a._titleForLegend = c._titleForLegend + " - ", "esriGeometryPoint" == a.geometryType ? a._titleForLegend += this.NLS_points : "esriGeometryPolyline" == a.geometryType ? a._titleForLegend += this.NLS_lines : "esriGeometryPolygon" == a.geometryType && (a._titleForLegend += this.NLS_polygons), b.push(a))
                        }, this)) : g.connect(c, "onLoad", s.hitch(this, function() {
                            this.refresh(this.layerInfos)
                        }))
                    } else "esri.layers.WMSLayer" ===
                        c.declaredClass ? c.loaded ? c.visible && (0 < c.layerInfos.length && n.some(c.layerInfos, function(a) {
                            return a.legendURL
                        })) && (e.create("div", {
                            innerHTML: "\x3cspan class\x3d'esriLegendServiceLabel'\x3e" + (c._titleForLegend || c.name || c.id) + "\x3c/span\x3e"
                        }, this.domNode), n.forEach(c.layerInfos, function(b) {
                            -1 < n.indexOf(c.visibleLayers, b.name) && (e.create("div", {
                                innerHTML: "\x3cimg src\x3d'" + b.legendURL + "'/\x3e"
                            }, this.domNode), a = !0)
                        }, this)) : g.connect(c, "onLoad", s.hitch(this, function() {
                            this.refresh(this.layerInfos)
                        })) :
                        b.push(c)
                }, this);
                var c = [];
                n.forEach(b, function(a) {
                    if (a.loaded) {
                        if (!0 === a.visible && (a.layerInfos || a.renderer || "esri.layers.ArcGISImageServiceLayer" == a.declaredClass)) {
                            var b = e.create("div", {
                                id: this.id + "_" + a.id,
                                style: "display: none;",
                                "class": "esriLegendService"
                            });
                            e.create("span", {
                                innerHTML: this._getServiceTitle(a),
                                "class": "esriLegendServiceLabel"
                            }, e.create("td", {
                                align: this._align
                            }, e.create("tr", {}, e.create("tbody", {}, e.create("table", {
                                width: "95%"
                            }, b)))));
                            e.place(b, this.id, "first");
                            t("ie") && m.set(p.byId(this.id +
                                "_" + a.id), "display", "none");
                            a.legendResponse || a.renderer ? this._createLegendForLayer(a) : c.push(this._legendRequest(a))
                        }
                    } else var k = g.connect(a, "onLoad", this, function(a) {
                        g.disconnect(k);
                        k = null;
                        this.refresh()
                    })
                }, this);
                0 === c.length && !a ? (p.byId(this.id + "_msg").innerHTML = this.NLS_noLegend, this._activate()) : (new K(c)).addCallback(s.hitch(this, function(b) {
                    a ? p.byId(this.id + "_msg").innerHTML = "" : p.byId(this.id + "_msg").innerHTML = this.NLS_noLegend;
                    this._activate()
                }))
            },
            _createLegendForLayer: function(a) {
                if (a.legendResponse ||
                    a.renderer) {
                    var b = !1;
                    if (a.legendResponse) {
                        var c = a.dynamicLayerInfos || a.layerInfos;
                        c && c.length ? n.forEach(c, function(c, f) {
                            if (!a._hideLayersInLegend || -1 == n.indexOf(a._hideLayersInLegend, c.id)) {
                                var k = this._buildLegendItems(a, c, f);
                                b = b || k
                            }
                        }, this) : "esri.layers.ArcGISImageServiceLayer" == a.declaredClass && (b = this._buildLegendItems(a, {
                            id: 0,
                            name: null,
                            title: a.name,
                            subLayerIds: null,
                            parentLayerId: -1
                        }, 0))
                    } else a.renderer && (c = a.url ? a.url.substring(a.url.lastIndexOf("/") + 1, a.url.length) : "fc_" + a.id, b = this._buildLegendItems(a, {
                        id: c,
                        name: null,
                        subLayerIds: null,
                        parentLayerId: -1
                    }, 0));
                    b && (m.set(p.byId(this.id + "_" + a.id), "display", "block"), m.set(p.byId(this.id + "_msg"), "display", "none"))
                }
            },
            _legendRequest: function(a) {
                if (a.loaded) return 10.01 <= a.version ? this._legendRequestServer(a) : this._legendRequestTools(a);
                g.connect(a, "onLoad", s.hitch(this, "_legendRequest"))
            },
            _legendRequestServer: function(a) {
                var b = a.url,
                    c = b.indexOf("?"),
                    b = -1 < c ? b.substring(0, c) + "/legend" + b.substring(c) : b + "/legend";
                (c = a._getToken()) && (b += "?token\x3d" + c);
                var d =
                    s.hitch(this, "_processLegendResponse"),
                    c = {
                        f: "json"
                    };
                a._params.dynamicLayers && (c.dynamicLayers = L.stringify(this._createDynamicLayers(a)), "[{}]" === c.dynamicLayers && (c.dynamicLayers = "[]"));
                a._params.bandIds && (c.bandIds = a._params.bandIds);
                a._params.renderingRule && (c.renderingRule = a._params.renderingRule);
                return D({
                    url: b,
                    content: c,
                    callbackParamName: "callback",
                    load: function(b, c) {
                        d(a, b, c)
                    },
                    error: C.defaults.io.errorHandler
                })
            },
            _legendRequestTools: function(a) {
                var b = a.url.toLowerCase().indexOf("/rest/"),
                    b = a.url.substring(0,
                        b) + a.url.substring(b + 5, a.url.length),
                    b = this._legendUrl + "?soapUrl\x3d" + window.escape(b);
                if (!t("ie") || 8 < t("ie")) b += "\x26returnbytes\x3dtrue";
                var c = s.hitch(this, "_processLegendResponse");
                return D({
                    url: b,
                    content: {
                        f: "json"
                    },
                    callbackParamName: "callback",
                    load: function(b, f) {
                        c(a, b, f)
                    },
                    error: C.defaults.io.errorHandler
                })
            },
            _processLegendResponse: function(a, b) {
                b && b.layers ? (a.legendResponse = b, p.byId(this.id + "_" + a.id) && e.empty(p.byId(this.id + "_" + a.id)), e.create("span", {
                        innerHTML: this._getServiceTitle(a),
                        "class": "esriLegendServiceLabel"
                    },
                    e.create("td", {
                        align: this._align
                    }, e.create("tr", {}, e.create("tbody", {}, e.create("table", {
                        width: "95%"
                    }, p.byId(this.id + "_" + a.id)))))), this._createLegendForLayer(a)) : console.log("Legend could not get generated for " + a.url + ": " + J.toJson(b))
            },
            _buildLegendItems: function(a, b, c) {
                var d = !1,
                    f = p.byId(this.id + "_" + a.id),
                    k = b.parentLayerId;
                if (b.subLayerIds) c = e.create("div", {
                    id: this.id + "_" + a.id + "_" + b.id + "_group",
                    style: "display: none;",
                    "class": -1 == k ? 0 < c ? "esriLegendGroupLayer" : "" : this._legendAlign
                }, -1 == k ? f : p.byId(this.id +
                    "_" + a.id + "_" + k + "_group")), t("ie") && m.set(p.byId(this.id + "_" + a.id + "_" + b.id + "_group"), "display", "none"), e.create("td", {
                    innerHTML: b.name,
                    align: this._align
                }, e.create("tr", {}, e.create("tbody", {}, e.create("table", {
                    width: "95%",
                    "class": "esriLegendLayerLabel"
                }, c))));
                else {
                    if (a.visibleLayers && -1 == ("," + a.visibleLayers + ",").indexOf("," + b.id + ",")) return d;
                    c = e.create("div", {
                        id: this.id + "_" + a.id + "_" + b.id,
                        style: "display:none;",
                        "class": -1 < k ? this._legendAlign : ""
                    }, -1 == k ? f : p.byId(this.id + "_" + a.id + "_" + k + "_group"));
                    t("ie") &&
                        m.set(p.byId(this.id + "_" + a.id + "_" + b.id), "display", "none");
                    e.create("td", {
                        innerHTML: b.name ? b.name : "",
                        align: this._align
                    }, e.create("tr", {}, e.create("tbody", {}, e.create("table", {
                        width: "95%",
                        "class": "esriLegendLayerLabel"
                    }, c))));
                    a.legendResponse ? d = d || this._buildLegendItems_Tools(a, b, c) : a.renderer && (d = d || this._buildLegendItems_Renderer(a, b, c))
                }
                return d
            },
            _buildLegendItems_Tools: function(a, b, c) {
                var d = b.parentLayerId,
                    f = this.map.getScale(),
                    k = !1,
                    q = function(a, b) {
                        var c, d;
                        for (c = 0; c < a.length; c++)
                            if (b.dynamicLayerInfos)
                                for (d =
                                    0; d < b.dynamicLayerInfos[d].length; d++) {
                                    if (b.dynamicLayerInfos[d].mapLayerId == a[c].layerId) return a[c]
                                } else if (b.id == a[c].layerId) return a[c];
                        return {}
                    };
                if (!this._respectCurrentMapScale || this._respectCurrentMapScale && this._isLayerInScale(a, b, f)) {
                    var l = !0;
                    if ("esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass || "esri.layers.ArcGISMapServiceLayer" === a.declaredClass) {
                        var h = this._getEffectiveScale(a, b);
                        if (h.minScale && h.minScale < f || h.maxScale && h.maxScale > f) l = !1
                    }
                    if (l) {
                        var r = q(a.legendResponse.layers,
                            b).legend;
                        if (r) {
                            c = e.create("table", {
                                cellpadding: 0,
                                cellspacing: 0,
                                width: "95%",
                                "class": "esriLegendLayer"
                            }, c);
                            var g = e.create("tbody", {}, c);
                            (a._hoverLabel || a._hoverLabels) && this._createHoverAction(c, a, b);
                            n.forEach(r, function(c) {
                                if (!(10.1 <= a.version && !c.values && 1 < r.length && (a._hideDefaultSymbol || "\x3call other values\x3e" === c.label || !c.label)))
                                    if (c.url && 0 === c.url.indexOf("http") || c.imageData && 0 < c.imageData.length) k = !0, this._buildRow_Tools(c, g, a, b.id)
                            }, this)
                        }
                    }
                }
                k && (m.set(p.byId(this.id + "_" + a.id + "_" + b.id),
                    "display", "block"), -1 < d && (m.set(p.byId(this.id + "_" + a.id + "_" + d + "_group"), "display", "block"), this._findParentGroup(a.id, a, d)));
                return k
            },
            _buildRow_Tools: function(a, b, c, d) {
                var f = e.create("tr", {}, b),
                    k;
                this.alignRight ? (b = e.create("td", {
                    align: this._isRightToLeft ? "left" : "right"
                }, f), k = e.create("td", {
                    align: this._isRightToLeft ? "left" : "right",
                    width: 35
                }, f)) : (k = e.create("td", {
                    width: 35
                }, f), b = e.create("td", {}, f));
                f = a.url;
                (!t("ie") || 9 <= t("ie") || 9 > t("ie") && "esri.layers.ArcGISImageServiceLayer" === c.declaredClass) &&
                    a.imageData && 0 < a.imageData.length ? f = "data:image/png;base64," + a.imageData : 0 !== a.url.indexOf("http") && (f = c.url + "/" + d + "/images/" + a.url, (d = c._getToken()) && (f += "?token\x3d" + d));
                d = e.create("img", {
                    src: f,
                    border: 0,
                    style: "opacity:" + c.opacity
                }, k);
                e.create("td", {
                    innerHTML: a.label,
                    align: this._align
                }, e.create("tr", {}, e.create("tbody", {}, e.create("table", {
                    width: "95%",
                    dir: "ltr"
                }, b))));
                9 > t("ie") && (d.style.filter = "alpha(opacity\x3d" + 100 * c.opacity + ")")
            },
            _buildLegendItems_Renderer: function(a, b, c) {
                var d = b.parentLayerId,
                    f = this.map,
                    k = f.getScale(),
                    q = !1;
                if (!this._respectCurrentMapScale || this._isLayerInScale(a, b, k)) {
                    var l, h = a.renderer,
                        r, g, u;
                    if (h instanceof P && (h = (h = "zoom" === h.rangeType ? h.getRendererInfoByZoom(f.getZoom()) : h.getRendererInfoByScale(k)) && h.renderer, !h)) return !1;
                    h.colorInfo && (r = this._getMedianColor(h), g = s.isFunction(h.colorInfo.field) ? null : a._getField(h.colorInfo.field, !0));
                    h.proportionalSymbolInfo && (u = s.isFunction(h.proportionalSymbolInfo.field) ? null : a._getField(h.proportionalSymbolInfo.field, !0));
                    if (h instanceof Q) q = !0, this._showDotDensityLegend(a, b, h, c);
                    else if (h instanceof F) {
                        if (h.infos && 0 < h.infos.length) {
                            q = !0;
                            f = e.create("table", {
                                cellpadding: 0,
                                cellspacing: 0,
                                width: "95%",
                                "class": "esriLegendLayer"
                            }, c);
                            l = e.create("tbody", {}, f);
                            (a._hoverLabel || a._hoverLabels) && this._createHoverAction(f, a, b);
                            var H = [];
                            n.forEach(h.infos, function(b) {
                                var c = null;
                                a._editable && a.types && (c = this._getTemplateFromTypes(a.types, b.value));
                                var d = b.label;
                                null == d && (d = b.value); - 1 === dojo.indexOf(H, d) && (H.push(d), this._buildRow_Renderer(a, b.symbol,
                                    r, d, c, l))
                            }, this)
                        }
                    } else h instanceof G ? h.infos && 0 < h.infos.length && (q = !0, f = e.create("table", {
                        cellpadding: 0,
                        cellspacing: 0,
                        width: "95%",
                        "class": "esriLegendLayer"
                    }, c), l = e.create("tbody", {}, f), (a._hoverLabel || a._hoverLabels) && this._createHoverAction(f, a, b), n.forEach(h.infos, function(b) {
                        var c = b.label;
                        null == c && (c = b.minValue + " - " + b.maxValue);
                        this._buildRow_Renderer(a, b.symbol, r, c, null, l)
                    }, this)) : h instanceof E && (q = !0, f = e.create("table", {
                            cellpadding: 0,
                            cellspacing: 0,
                            width: "95%",
                            "class": "esriLegendLayer"
                        }, c),
                        l = e.create("tbody", {}, f), (a._hoverLabel || a._hoverLabels) && this._createHoverAction(f, a, b), k = null, a._editable && (a.templates && 0 < a.templates.length) && (k = a.templates[0]), f = g && u ? null : g || u, this._buildRow_Renderer(a, h.symbol, r, f ? f.alias || f.name : h.label, k, l), f && (g = u = null));
                    q && (h.colorInfo && this._showColorRamp(a, b, h, c, g), h.proportionalSymbolInfo && this._showProportionalLegend(a, b, h, r, c, u));
                    !a._hideDefaultSymbol && h.defaultSymbol && (q = !0, this._buildRow_Renderer(a, h.defaultSymbol, null, h.defaultLabel || "others", null,
                        l))
                }
                q && (m.set(p.byId(this.id + "_" + a.id + "_" + b.id), "display", "block"), -1 < d && (m.set(p.byId(this.id + "_" + a.id + "_" + d + "_group"), "display", "block"), this._findParentGroup(a.id, d)));
                return q
            },
            _showColorRamp: function(a, b, c, d, f) {
                var k;
                k = e.create("table", {
                    cellpadding: 0,
                    cellspacing: 0,
                    width: "95%",
                    "class": "esriLegendLayer"
                }, d);
                d = e.create("tbody", {}, k);
                (a._hoverLabel || a._hoverLabels) && this._createHoverAction(k, a, b);
                f && this._addSubHeader(d, f.alias || f.name);
                b = this._getRampStops(c);
                b.length && this._drawColorRamp(d, b, a)
            },
            _getMedianColor: function(a) {
                var b = a.colorInfo,
                    c, d;
                b.colors ? (c = b.minDataValue, d = b.maxDataValue) : b.stops && (c = b.stops[0].value, d = b.stops[b.stops.length - 1].value);
                return a.getColor(c + (d - c) / 2)
            },
            _getRampStops: function(a) {
                var b, c, d = a.colorInfo,
                    f;
                d.colors ? (c = d.maxDataValue - d.minDataValue, b = n.map([0, 0.25, 0.5, 0.75, 1], function(a) {
                    f = d.minDataValue + a * c;
                    return Number(f.toFixed(6))
                }), this._checkPrecision(0, 4, b)) : d.stops && (b = n.map(d.stops, function(a) {
                    return a.value
                }));
                var k = b[0];
                c = b[b.length - 1] - k;
                return n.map(b,
                    function(b) {
                        return {
                            value: b,
                            color: a.getColor(b),
                            offset: 1 - (b - k) / c,
                            label: A.format(b, {
                                places: 20,
                                round: -1
                            }).replace(this.reZerosFractional, "$1").replace(this.reZeros, "")
                        }
                    }, this).reverse()
            },
            _checkPrecision: function(a, b, c) {
                var d = a + (b - a) / 2,
                    f = c[a],
                    k = c[d],
                    e = c[b],
                    l = Math.floor(f),
                    h = Math.floor(k),
                    r = Math.floor(e);
                l === f && (r === e && h !== k && l !== h && r !== h) && (c[d] = h);
                a + 1 !== d && this._checkPrecision(a, d, c);
                d + 1 !== b && this._checkPrecision(d, b, c)
            },
            _drawColorRamp: function(a, b, c) {
                var d = e.create("tr", {}, a),
                    f, k, q, l, h, r, g;
                this.alignRight ?
                    (a = e.create("td", {
                    align: this._isRightToLeft ? "left" : "right"
                }, d), f = e.create("td", {
                    align: this._isRightToLeft ? "left" : "right",
                    width: 34
                }, d)) : (f = e.create("td", {
                    width: 34,
                    align: "center"
                }, d), a = e.create("td", {}, d));
                k = e.create("div", {
                    style: "position: relative; width:34px;"
                }, f);
                q = e.create("div", {
                    "class": "esriLegendColorRamp"
                }, k);
                d = m.get(q, "width");
                f = m.get(q, "height");
                m.set(k, "height", f + "px");
                q = B.createSurface(q, d, f);
                9 > t("ie") && (h = q.getEventSource(), m.set(h, "position", "relative"), m.set(h.parentNode, "position",
                    "relative"));
                try {
                    r = q.createRect({
                        width: d,
                        height: f
                    }), r.setFill({
                        type: "linear",
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: f,
                        colors: b
                    }).setStroke(null), q.createRect({
                        width: d,
                        height: f
                    }).setFill(new x([255, 255, 255, 1 - c.opacity])).setStroke(null), this._surfaceItems.push(q)
                } catch (u) {
                    q.clear(), q.destroy()
                }
                l = e.create("div", {
                    "class": "esriLegendColorRampLabels"
                }, a);
                n.forEach(b, function(a, c) {
                    g = "top:" + 100 * a.offset + "%;";
                    e.create("div", {
                        "class": "esriLegendColorRampTick" + (c === b.length - 1 ? " esriLegendColorRampTickLast" : ""),
                        innerHTML: "\x26nbsp;",
                        style: g
                    }, k);
                    e.create("div", {
                        "class": "esriLegendColorRampLabel",
                        innerHTML: a.label,
                        style: g
                    }, l)
                })
            },
            _showDotDensityLegend: function(a, b, c, d) {
                var f = c.legendOptions,
                    k, q, l, h, r, g, u, p = this.dotDensitySwatchSize,
                    m = Math.round(p / 2);
                f && (q = f.backgroundColor, l = f.outline, h = f.valueUnit, r = f.dotCoverage);
                r = (r || this.dotCoverage) / 100;
                u = Math.round(p * p / Math.pow(c.dotSize, 2) * r);
                d = e.create("table", {
                    cellpadding: 0,
                    cellspacing: 0,
                    width: "95%",
                    "class": "esriLegendLayer"
                }, d);
                g = e.create("tbody", {}, d);
                (a._hoverLabel || a._hoverLabels) &&
                    this._createHoverAction(d, a, b);
                this._addSubHeader(g, z.substitute({
                    value: c.dotValue,
                    unit: h || ""
                }, this.NLS_dotValue));
                n.forEach(c.fields, function(b) {
                    b = s.mixin({}, b);
                    b.numPoints = u;
                    k = new S(c._generateImageSrc(p, p, [b], {
                        x: 0,
                        y: 0
                    }, {
                        x: p,
                        y: p
                    }, q), l || c.outline, p, p);
                    b = a._getField(b.name, !0) || b;
                    this._buildRow_Renderer(a, k, null, b.alias || b.name, null, g, {
                        type: "path",
                        path: "M " + -m + "," + -m + " L " + m + "," + -m + " L " + m + "," + m + " L " + -m + "," + m + " L " + -m + "," + -m + " E"
                    })
                }, this)
            },
            _showProportionalLegend: function(a, b, c, d, f, k) {
                var q = c.proportionalSymbolInfo,
                    l = q.legendOptions,
                    l = l && l.customValues,
                    h, r = q.minDataValue,
                    g = q.maxDataValue,
                    m = this._getProportionalSymbol(c, d);
                "unknown" !== q.valueUnit || (!m || !l && (null == r || null == g)) || (d = e.create("table", {
                    cellpadding: 0,
                    cellspacing: 0,
                    width: "95%",
                    "class": "esriLegendLayer"
                }, f), h = e.create("tbody", {}, d), (a._hoverLabel || a._hoverLabels) && this._createHoverAction(d, a, b), k && this._addSubHeader(h, k.alias || k.name), b = l || this._getDataValues(r, g), n.forEach(b, function(b) {
                    m = y.fromJson(m.toJson());
                    this._applySize(m, c, b);
                    b = A.format(b, {
                        places: 20,
                        round: -1
                    }).replace(this.reZerosFractional, "$1").replace(this.reZeros, "");
                    this._buildRow_Renderer(a, m, null, b, null, h)
                }, this))
            },
            _getProportionalSymbol: function(a, b) {
                var c, d;
                if (a instanceof E) d = !0, c = a.symbol;
                else if (a instanceof F || a instanceof G) c = a.infos[0].symbol;
                if (c = -1 !== c.type.indexOf("fillsymbol") ? null : c)!d && "picturemarkersymbol" === c.type ? (c = new R, c.setStyle("square"), c.outline.setWidth(1)) : c = y.fromJson(c.toJson()), b ? c.setColor(new x(b.toRgba())) : d || c.setColor(new x([127, 127, 127]));
                return c
            },
            _applySize: function(a,
                b, c) {
                var d = a.type;
                b = b.getSize(c, -1 !== d.indexOf("markersymbol") ? {
                    shape: a.style
                } : null);
                switch (d) {
                    case "simplemarkersymbol":
                        a.setSize(b);
                        break;
                    case "picturemarkersymbol":
                        a.setWidth(b);
                        a.setHeight(b);
                        break;
                    case "simplelinesymbol":
                    case "cartographiclinesymbol":
                        a.setWidth(b)
                }
            },
            _getDataValues: function(a, b) {
                var c = [a, b],
                    d = Math.LN10,
                    f = Math.log(a),
                    k = Math.log(b),
                    e, l, h, g, m;
                n.forEach([1, 2.5, 5], function(a) {
                    g = Math.log(a);
                    e = Math.ceil((f - g) / d);
                    l = Math.floor((k - g) / d);
                    if (!(Infinity === Math.abs(e) || Infinity === Math.abs(l)))
                        for (h =
                            e; h < l + 1; h++) m = a * Math.pow(10, h), -1 === n.indexOf(c, m) && c.push(m)
                });
                c.sort(this._sorter);
                return c.reverse()
            },
            _sorter: function(a, b) {
                return a - b
            },
            _buildRow_Renderer: function(a, b, c, d, f, k, q) {
                var l = e.create("tr", {}, k),
                    h;
                this.alignRight ? (k = e.create("td", {
                    align: this._isRightToLeft ? "left" : "right"
                }, l), h = e.create("td", {
                    align: this._isRightToLeft ? "left" : "right",
                    width: 35
                }, l)) : (h = e.create("td", {
                    width: 35,
                    align: "center"
                }, l), k = e.create("td", {}, l));
                var g = l = 30;
                "simplemarkersymbol" == b.type ? (l = Math.min(Math.max(l, b.size + 12),
                    125), g = Math.min(Math.max(g, b.size + 12), 125)) : "picturemarkersymbol" == b.type && (l = Math.min(Math.max(l, b.width), 125), g = Math.min(b.height || g, 125));
                h = e.create("div", {
                    style: "width:" + l + "px;height:" + g + "px;"
                }, h);
                z.isDefined(d) && "number" === typeof d && (d = "" + d);
                e.create("td", {
                    innerHTML: d ? d : "",
                    align: this._align
                }, e.create("tr", {}, e.create("tbody", {}, e.create("table", {
                    width: "95%"
                }, k))));
                a = this._drawSymbol(h, b, c, l, g, f, a, q);
                this._surfaceItems.push(a)
            },
            _addSubHeader: function(a, b) {
                var c = e.create("tr", {}, a),
                    c = e.create("td", {
                        align: this._align,
                        colspan: 2
                    }, c);
                e.create("td", {
                    innerHTML: b ? b : "",
                    align: this._align
                }, e.create("tr", {}, e.create("tbody", {}, e.create("table", {
                    width: "95%"
                }, c))))
            },
            _drawSymbol: function(a, b, c, d, f, k, e, l) {
                b = y.fromJson(b.toJson());
                var h = e.opacity;
                c && b.setColor(new x(c.toRgba()));
                if ("simplelinesymbol" === b.type || "cartographiclinesymbol" === b.type || "textsymbol" === b.type) {
                    if (!b.color) return;
                    c = b.color.toRgba();
                    c[3] *= h;
                    b.color.setColor(c)
                } else if ("simplemarkersymbol" === b.type || "simplefillsymbol" === b.type) {
                    if (!b.color) return;
                    c = b.color.toRgba();
                    c[3] *= h;
                    b.color.setColor(c);
                    b.outline && b.outline.color && (c = b.outline.color.toRgba(), c[3] *= h, b.outline.color.setColor(c))
                } else "picturemarkersymbol" === b.type && (a.style.opacity = h, a.style.filter = "alpha(opacity\x3d(" + 100 * h + "))");
                a = B.createSurface(a, d, f);
                t("ie") && (c = a.getEventSource(), m.set(c, "position", "relative"), m.set(c.parentNode, "position", "relative"));
                k = this._getDrawingToolShape(b, k) || y.getShapeDescriptors(b);
                var g;
                try {
                    g = a.createShape(l || k.defaultShape).setFill(k.fill).setStroke(k.stroke)
                } catch (n) {
                    a.clear();
                    a.destroy();
                    return
                }
                var p = g.getBoundingBox();
                l = p.width;
                k = p.height;
                var h = -(p.x + l / 2),
                    v = -(p.y + k / 2);
                c = a.getDimensions();
                h = {
                    dx: h + c.width / 2,
                    dy: v + c.height / 2
                };
                if ("simplemarkersymbol" === b.type && "path" === b.style) d = e._getScaleMatrix(p, b.size), g.applyTransform(N.scaleAt(d.xx, d.yy, {
                    x: c.width / 2,
                    y: c.height / 2
                }));
                else if (l > d || k > f) e = l / d > k / f, d = ((e ? d : f) - 5) / (e ? l : k), s.mixin(h, {
                    xx: d,
                    yy: d
                });
                g.applyTransform(h);
                return a
            },
            _getDrawingToolShape: function(a, b) {
                var c;
                switch (b ? b.drawingTool || null : null) {
                    case "esriFeatureEditToolArrow":
                        c = {
                            type: "path",
                            path: "M 10,1 L 3,8 L 3,5 L -15,5 L -15,-2 L 3,-2 L 3,-5 L 10,1 E"
                        };
                        break;
                    case "esriFeatureEditToolTriangle":
                        c = {
                            type: "path",
                            path: "M -10,14 L 2,-10 L 14,14 L -10,14 E"
                        };
                        break;
                    case "esriFeatureEditToolRectangle":
                        c = {
                            type: "path",
                            path: "M -10,-10 L 10,-10 L 10,10 L -10,10 L -10,-10 E"
                        };
                        break;
                    case "esriFeatureEditToolCircle":
                        c = {
                            type: "circle",
                            cx: 0,
                            cy: 0,
                            r: 10
                        };
                        break;
                    case "esriFeatureEditToolEllipse":
                        c = {
                            type: "ellipse",
                            cx: 0,
                            cy: 0,
                            rx: 10,
                            ry: 5
                        };
                        break;
                    default:
                        return null
                }
                return {
                    defaultShape: c,
                    fill: a.getFill(),
                    stroke: a.getStroke()
                }
            },
            _repaintItems: function() {
                n.forEach(this._surfaceItems, function(a) {
                    this._repaint(a)
                }, this)
            },
            _repaint: function(a) {
                if (a) {
                    a.getStroke && a.setStroke && a.setStroke(a.getStroke());
                    try {
                        a.getFill && a.setFill && a.setFill(a.getFill())
                    } catch (b) {}
                    a.children && s.isArray(a.children) && n.forEach(a.children, this._repaint, this)
                }
            },
            _createHoverAction: function(a, b, c) {
                var d = b._hoverLabel || b._hoverLabels[c.id];
                d && (b.mouseMoveHandler = b.mouseMoveHandler || {}, b.mouseMoveHandler[c.id] = g.connect(a, "onmousemove",
                    s.hitch(this, function(a, b) {
                        this.mouseX = b.clientX;
                        this.mouseY = b.clientY;
                        this.hoverLabelShowing && (this.hoverLabelShowing = !1, m.set(p.byId(this.id + "_hoverLabel"), "display", "none"));
                        setTimeout(s.hitch(this, function(a, b, c) {
                            if (a == this.mouseX && b == this.mouseY && !this.hoverLabelShowing)
                                if (this.hoverLabelShowing = !0, p.byId(this.id + "_hoverLabel")) {
                                    var d = p.byId(this.id + "_hoverLabel");
                                    d.innerHTML = "\x3cspan\x3e" + c + "\x3c/span\x3e";
                                    m.set(d, "top", b + "px");
                                    m.set(d, "left", a + 15 + "px");
                                    m.set(d, "display", "")
                                } else e.create("div", {
                                    innerHTML: "\x3cspan\x3e" + c + "\x3c/span\x3e",
                                    id: this.id + "_hoverLabel",
                                    "class": "esriLegendHoverLabel",
                                    style: {
                                        top: b + "px",
                                        left: a + 15 + "px"
                                    }
                                }, document.body)
                        }, b.clientX, b.clientY, a), 500)
                    }, d)), b.mouseOutHandler = b.mouseOutHandler || {}, b.mouseOutHandler[c.id] = g.connect(a, "onmouseout", s.hitch(this, function(a) {
                    this.mouseY = this.mouseX = -1;
                    this.hoverLabelShowing && (this.hoverLabelShowing = !1, m.set(p.byId(this.id + "_hoverLabel"), "display", "none"))
                })))
            },
            _removeHoverHandlers: function() {
                var a;
                n.forEach(this.layers, function(b) {
                    if (b.mouseMoveHandler)
                        for (a in b.mouseMoveHandler) g.disconnect(b.mouseMoveHandler[a]);
                    if (b.mouseOutHandler)
                        for (a in b.mouseOutHandler) g.disconnect(b.mouseOutHandler[a])
                })
            },
            _createDynamicLayers: function(a) {
                var b = [],
                    c;
                n.forEach(a.dynamicLayerInfos || a.layerInfos, function(d) {
                    c = {
                        id: d.id
                    };
                    c.source = d.source && d.source.toJson();
                    var f;
                    a.layerDefinitions && a.layerDefinitions[d.id] && (f = a.layerDefinitions[d.id]);
                    f && (c.definitionExpression = f);
                    var e;
                    a.layerDrawingOptions && a.layerDrawingOptions[d.id] && (e = a.layerDrawingOptions[d.id]);
                    e && (c.drawingInfo = e.toJson());
                    c.minScale = d.minScale || 0;
                    c.maxScale =
                        d.maxScale || 0;
                    b.push(c)
                });
                return b
            },
            _getTemplateFromTypes: function(a, b) {
                var c;
                for (c = 0; c < a.length; c++)
                    if (a[c].id == b && a[c].templates && 0 < a[c].templates.length) return a[c].templates[0];
                return null
            },
            _findParentGroup: function(a, b, c) {
                var d, f = b.dynamicLayerInfos || b.layerInfos;
                for (d = 0; d < f.length; d++)
                    if (c == f[d].id) {
                        -1 < f[d].parentLayerId && (m.set(p.byId(this.id + "_" + a + "_" + f[d].parentLayerId + "_group"), "display", "block"), this._findParentGroup(a, b, f[d].parentLayerId));
                        break
                    }
            },
            _addSubLayersToHide: function(a) {
                function b(c,
                    d) {
                    var f = a.layer.dynamicLayerInfos || a.layer.layerInfos,
                        e, g;
                    for (e = 0; e < f.length; e++)
                        if (f[e].id === c && f[e].subLayerIds)
                            for (g = 0; g < f[e].subLayerIds.length; g++) {
                                var l = f[e].subLayerIds[g]; - 1 === n.indexOf(d, l) && (d.push(l), b(l, d))
                            }
                }
                a.layer.layerInfos && n.forEach(a.layer._hideLayersInLegend, function(c) {
                    b(c, a.layer._hideLayersInLegend)
                })
            },
            _isLayerInScale: function(a, b, c) {
                var d, f = !0;
                if (a.legendResponse && a.legendResponse.layers)
                    for (d = 0; d < a.legendResponse.layers.length; d++) {
                        var e = a.legendResponse.layers[d];
                        if (b.id ==
                            e.layerId) {
                            var g, l;
                            !a.minScale && 0 !== a.minScale || !a.maxScale && 0 !== a.maxScale ? (0 == e.minScale && a.tileInfo && (g = a.tileInfo.lods[0].scale), 0 == e.maxScale && a.tileInfo && (l = a.tileInfo.lods[a.tileInfo.lods.length - 1].scale)) : (g = Math.min(a.minScale, e.minScale) || a.minScale || e.minScale, l = Math.max(a.maxScale, e.maxScale));
                            if (0 < g && g < c || l > c) f = !1;
                            break
                        }
                    } else if (a.minScale || a.maxScale)
                        if (a.minScale && a.minScale < c || a.maxScale && a.maxScale > c) f = !1;
                return f
            },
            _getServiceTitle: function(a) {
                var b = a._titleForLegend;
                b || ((b = a.url) ?
                    -1 < a.url.indexOf("/MapServer") ? (b = a.url.substring(0, a.url.indexOf("/MapServer")), b = b.substring(b.lastIndexOf("/") + 1, b.length)) : -1 < a.url.indexOf("/ImageServer") ? (b = a.url.substring(0, a.url.indexOf("/ImageServer")), b = b.substring(b.lastIndexOf("/") + 1, b.length)) : -1 < a.url.indexOf("/FeatureServer") && (b = a.url.substring(0, a.url.indexOf("/FeatureServer")), b = b.substring(b.lastIndexOf("/") + 1, b.length)) : b = "", a.name && (b = 0 < b.length ? b + (" - " + a.name) : a.name));
                return O.encode(b)
            },
            _getEffectiveScale: function(a, b) {
                var c =
                    b.minScale,
                    d = b.maxScale;
                if (z.isDefined(b.parentLayerId))
                    for (var f = a.layerInfos, e = b.parentLayerId, g = f.length - 1; 0 <= g; g--)
                        if (f[g].id == e)
                            if (0 == c && 0 < f[g].minScale ? c = f[g].minScale : 0 < c && 0 == f[g].minScale || 0 < c && 0 < f[g].minScale && (c = Math.min(c, f[g].minScale)), d = Math.max(d || 0, f[g].maxScale || 0), -1 < f[g].parentLayerId) e = f[g].parentLayerId;
                            else break;
                return {
                    minScale: c,
                    maxScale: d
                }
            },
            _isSupportedLayerType: function(a) {
                return a && ("esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass || "esri.layers.ArcGISImageServiceLayer" ===
                    a.declaredClass && 10.2 <= a.version || "esri.layers.ArcGISTiledMapServiceLayer" === a.declaredClass || "esri.layers.FeatureLayer" === a.declaredClass || "esri.layers.KMLLayer" === a.declaredClass || "esri.layers.GeoRSSLayer" === a.declaredClass || "esri.layers.WMSLayer" === a.declaredClass || "esri.layers.CSVLayer" === a.declaredClass) ? !0 : !1
            }
        });
        s.mixin(v, {
            ALIGN_LEFT: 0,
            ALIGN_RIGHT: 1
        });
        return v
    });