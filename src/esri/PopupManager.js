//>>built
define(["./geometry/Extent", "./geometry/ScreenPoint", "./kernel", "./layerUtils", "./tasks/query", "dijit/registry", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/Deferred", "dojo/_base/lang", "dojo/has", "dojo/on", "dojo/promise/all", "dojo/Stateful", "require"], function(E, w, M, D, F, G, f, H, u, v, N, I, J, K, L) {
    var x;
    return H(K, {
        declaredClass: "esri.PopupManager",
        enabled: !1,
        map: null,
        _mapClickHandle: null,
        _featureLayersCache: {},
        constructor: function(a) {
            this._mapClickHandler = v.hitch(this, this._mapClickHandler)
        },
        setMap: function(a) {
            if (this.map)
                if (a !==
                    this.map) this.unsetMap();
                else return;
            this.map = a;
            this._setupClickHandler()
        },
        unsetMap: function() {
            this.map && (this.map = null);
            this._mapClickHandle && (this._mapClickHandle.remove(), this._mapClickHandle = null)
        },
        getMapLayer: function(a) {
            var b;
            if (a && (b = a.getLayer()))
                if (a = b.id, this._featureLayersCache[a]) {
                    var c = a.lastIndexOf("_"); - 1 < c && (a = a.substring(0, c), b = this.map.getLayer(a))
                }
            return b
        },
        _enabledSetter: function(a) {
            this.enabled = a;
            this._setupClickHandler()
        },
        _setupClickHandler: function() {
            this._mapClickHandle && (this._mapClickHandle.remove(),
                this._mapClickHandle = null);
            this.enabled && this.map && (this._mapClickHandle = this.map.on("click", this._mapClickHandler))
        },
        _mapClickHandler: function(a) {
            var b = this.map.infoWindow,
                c = a.graphic;
            b && this.map.loaded && (b.clearFeatures && b.setFeatures ? this._showPopup(a) : c && c.getInfoTemplate() && this._showInfoWindow(c, a.mapPoint))
        },
        _showPopup: function(a) {
            var b = this.map,
                c = b.infoWindow,
                e = this,
                g = [],
                r = [b.graphics].concat(f.map(b.graphicsLayerIds, b.getLayer, b));
            f.forEach(r, function(a) {
                a && (a.loaded && a.infoTemplate && !a.suspended) &&
                    g.push(a)
            });
            var n = [];
            f.forEach(b.layerIds, function(a) {
                (a = b.getLayer(a)) && (a.loaded && !a.suspended) && ("esri.layers.ArcGISImageServiceLayer" === a.declaredClass && a.infoTemplate ? g.push(a) : ("esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass || "esri.layers.ArcGISTiledMapServiceLayer" === a.declaredClass) && a.infoTemplates && n.push(a))
            });
            this._getSubLayerFeatureLayers(n).then(function(l) {
                g = g.concat(l);
                l = null;
                a.graphic && a.graphic.getInfoTemplate() && (l = a.graphic);
                if (g.length || l) {
                    var k = e._calculateClickTolerance(g),
                        r = a.screenPoint,
                        d = b.toMap(new w(r.x - k, r.y + k)),
                        k = b.toMap(new w(r.x + k, r.y - k)),
                        s = new E(d.x, d.y, k.x, k.y, b.spatialReference),
                        m = new F,
                        p = !!l,
                        n = !0,
                        d = f.map(g, function(c) {
                            var d;
                            m.timeExtent = c.useMapTime ? b.timeExtent : null;
                            if ("esri.layers.ArcGISImageServiceLayer" === c.declaredClass) m.geometry = a.mapPoint, n = !1, d = c.queryVisibleRasters(m, {
                                rasterAttributeTableFieldPrefix: "Raster.",
                                returnDomainValues: !0
                            }), d.addCallback(function() {
                                var a = c.getVisibleRasters();
                                p = p || 0 < a.length;
                                return a
                            });
                            else if (e._featureLayersCache[c.id] ||
                                "function" === typeof c.queryFeatures && 2 !== c.mode) m.geometry = s, d = c.queryFeatures(m), d.addCallback(function(a) {
                                a = a.features;
                                p = p || 0 < a.length;
                                return a
                            });
                            else {
                                d = new u;
                                var g = f.filter(c.graphics, function(a) {
                                    return a && s.intersects(a.geometry)
                                });
                                p = p || 0 < g.length;
                                d.resolve(g)
                            }
                            return d
                        });
                    l && (k = new u, k.resolve([l]), d.unshift(k));
                    !f.some(d, function(a) {
                        return !a.isFulfilled()
                    }) && !p ? (c.hide(), c.clearFeatures()) : (c.setFeatures(d), c.show(a.mapPoint, {
                        closestFirst: n
                    }))
                }
            })
        },
        _getSubLayerFeatureLayers: function(a, b) {
            var c =
                b || new u,
                e = [],
                g = a.length,
                r = Math.floor(this.map.extent.getWidth() / this.map.width),
                n = this.map.getScale(),
                l = !1,
                k = this,
                z = 0;
            a: for (; z < g; z++) {
                var d = a[z],
                    s = d.dynamicLayerInfos || d.layerInfos;
                if (s) {
                    var m = null;
                    if (d._params && (d._params.layers || d._params.dynamicLayers)) m = d.visibleLayers;
                    for (var m = D._getVisibleLayers(s, m), p = D._getLayersForScale(n, s), w = s.length, A = 0; A < w; A++) {
                        var y = s[A],
                            q = y.id,
                            t = d.infoTemplates[q];
                        if (!y.subLayerIds && t && t.infoTemplate && -1 < f.indexOf(m, q) && -1 < f.indexOf(p, q)) {
                            if (!x) {
                                l = !0;
                                break a
                            }
                            var B =
                                d.id + "_" + q,
                                h = this._featureLayersCache[B];
                            if (!h || !h.loadError) h || ((h = t.layerUrl) || (h = y.source ? this._getLayerUrl(d.url, "/dynamicLayer") : this._getLayerUrl(d.url, q)), h = new x(h, {
                                    id: B,
                                    drawMode: !1,
                                    mode: x.MODE_SELECTION,
                                    outFields: this._getOutFields(t.infoTemplate),
                                    resourceInfo: t.resourceInfo,
                                    source: y.source
                                }), this._featureLayersCache[B] = h), h.setDefinitionExpression(d.layerDefinitions && d.layerDefinitions[q]), h.setGDBVersion(d.gdbVersion), h.setInfoTemplate(t.infoTemplate), h.setMaxAllowableOffset(r), h.setUseMapTime(!!d.useMapTime),
                                d.layerDrawingOptions && (d.layerDrawingOptions[q] && d.layerDrawingOptions[q].renderer) && h.setRenderer(d.layerDrawingOptions[q].renderer), e.push(h)
                        }
                    }
                }
            }
            if (l) {
                var v = new u;
                L(["./layers/FeatureLayer"], function(a) {
                    x = a;
                    v.resolve()
                });
                v.then(function() {
                    k._getSubLayerFeatureLayers(a, c)
                })
            } else {
                var C = [];
                f.forEach(e, function(a) {
                    if (!a.loaded) {
                        var c = new u;
                        I.once(a, "load, error", function() {
                            c.resolve()
                        });
                        C.push(c.promise)
                    }
                });
                C.length ? J(C).then(function() {
                    e = f.filter(e, function(a) {
                        return !a.loadError && a.isVisibleAtScale(n)
                    });
                    c.resolve(e)
                }) : (e = f.filter(e, function(a) {
                    return a.isVisibleAtScale(n)
                }), c.resolve(e))
            }
            return c.promise
        },
        _getLayerUrl: function(a, b) {
            var c = a.indexOf("?");
            return -1 === c ? a + "/" + b : a.substring(0, c) + "/" + b + a.substring(c)
        },
        _getOutFields: function(a) {
            var b;
            a.info && "esri.dijit.PopupTemplate" === a.declaredClass ? (b = [], f.forEach(a.info.fieldInfos, function(a) {
                var e = a.fieldName && a.fieldName.toLowerCase();
                e && ("shape" !== e && 0 !== e.indexOf("relationships/")) && b.push(a.fieldName)
            })) : b = ["*"];
            return b
        },
        _calculateClickTolerance: function(a) {
            var b =
                6;
            f.forEach(a, function(a) {
                if (a = a.renderer) "esri.renderer.SimpleRenderer" === a.declaredClass ? ((a = a.symbol) && a.xoffset && (b = Math.max(b, Math.abs(a.xoffset))), a && a.yoffset && (b = Math.max(b, Math.abs(a.yoffset)))) : ("esri.renderer.UniqueValueRenderer" === a.declaredClass || "esri.renderer.ClassBreaksRenderer" === a.declaredClass) && f.forEach(a.infos, function(a) {
                    (a = a.symbol) && a.xoffset && (b = Math.max(b, Math.abs(a.xoffset)));
                    a && a.yoffset && (b = Math.max(b, Math.abs(a.yoffset)))
                })
            });
            return b
        },
        _showInfoWindow: function(a, b) {
            var c =
                this.map.infoWindow,
                e = a.geometry,
                e = e && "point" === e.type ? e : b,
                g = a.getContent();
            c.setTitle(a.getTitle());
            if (g && v.isString(g.id)) {
                var f = G.byId(g.id);
                f && (f.set && /_PopupRenderer/.test(f.declaredClass)) && f.set("showTitle", !1)
            }
            c.setContent(g);
            c.show(e)
        }
    })
});