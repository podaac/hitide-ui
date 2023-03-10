//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Color", "dojo/_base/Deferred", "dojo/has", "./kernel", "./graphic", "./geometry/Point", "./geometry/jsonUtils", "./geometry/mathUtils", "./geometry/webMercatorUtils", "./symbols/SimpleMarkerSymbol", "./symbols/SimpleLineSymbol", "./symbols/CartographicLineSymbol", "./symbols/SimpleFillSymbol", "./tasks/query", "./Evented", "require"], function(v, n, e, p, w, D, E, x, y, z, A, s, t, q, r, u, B, C) {
    return v(C, {
        declaredClass: "esri.PopupBase",
        _featureLayers: {},
        _updateEndHandles: [],
        _evtMap: {
            "set-features": !0,
            "clear-features": !0,
            "selection-change": !0,
            "dfd-complete": !0
        },
        onSetFeatures: function() {},
        onClearFeatures: function() {},
        onSelectionChange: function() {},
        onDfdComplete: function() {},
        initialize: function() {
            this.count = 0;
            this.selectedIndex = -1;
            this.on("clear-features", n.hitch(this, this._resetUpdateEndListeners));
            this.on("dfd-complete", n.hitch(this, this._processFeatures));
            this.on("set-features", n.hitch(this, this._processFeatures))
        },
        cleanup: function() {
            this.features = this.deferreds = null;
            this._resetUpdateEndListeners()
        },
        setFeatures: function(a) {
            if (a && a.length) {
                this.clearFeatures();
                var b, c;
                a[0] instanceof w ? c = a : b = a;
                b ? this._updateFeatures(null, b) : (this.deferreds = c, c = c.slice(0), e.forEach(c, function(a) {
                    a.addBoth(n.hitch(this, this._updateFeatures, a))
                }, this))
            }
        },
        clearFeatures: function() {
            this.features = this.deferreds = this._marked = null;
            this.count = 0;
            var a = this.selectedIndex;
            this.selectedIndex = -1;
            if (-1 < a) this.onSelectionChange();
            this.onClearFeatures()
        },
        getSelectedFeature: function() {
            var a = this.features;
            if (a) return a[this.selectedIndex]
        },
        select: function(a) {
            0 > a || a >= this.count || (this.selectedIndex = a, this.onSelectionChange())
        },
        enableHighlight: function(a) {
            this._highlighted = a.graphics.add(new x(new y(0, 0, a.spatialReference)));
            this._highlighted.hide();
            this.markerSymbol || (a = this.markerSymbol = new t, a.setStyle(t.STYLE_TARGET), a._setDim(16, 16, 7), a.setOutline(new r(q.STYLE_SOLID, new p([0, 255, 255]), 2, r.CAP_ROUND, r.JOIN_ROUND)), a.setColor(new p([0, 0, 0, 0])));
            this.lineSymbol || (this.lineSymbol = new q(q.STYLE_SOLID, new p([0, 255, 255]), 2));
            this.fillSymbol ||
                (this.fillSymbol = new u(u.STYLE_NULL, new q(q.STYLE_SOLID, new p([0, 255, 255]), 2), new p([0, 0, 0, 0])))
        },
        disableHighlight: function(a) {
            var b = this._highlighted;
            b && (b.hide(), a.graphics.remove(b), delete this._highlighted);
            this.markerSymbol = this.lineSymbol = this.fillSymbol = null
        },
        showHighlight: function() {
            var a = this.features && this.features[this.selectedIndex];
            this._highlighted && (a && a.geometry) && this._highlighted.show()
        },
        hideHighlight: function() {
            this._highlighted && this._highlighted.hide()
        },
        updateHighlight: function(a,
            b) {
            var c = b.geometry,
                f = this._highlighted;
            if (!c || !f) f && f.hide();
            else {
                f.hide();
                !f._graphicsLayer && a && a.graphics.add(f);
                f.setGeometry(z.fromJson(c.toJson()));
                var d;
                switch (c.type) {
                    case "point":
                    case "multipoint":
                        d = this.markerSymbol;
                        d.setOffset(0, 0);
                        d.setAngle(0);
                        var g = b.getLayer();
                        if (g) {
                            var c = g._getSymbol(b),
                                l, h, e = 0,
                                m = 0,
                                k = 0;
                            if (c) {
                                if ((g = !b.symbol ? g._getRenderer(b) : null) && g.proportionalSymbolInfo) l = h = g.getSize(b, {
                                    shape: c.style
                                });
                                else switch (c.type) {
                                    case "simplemarkersymbol":
                                        l = h = c.size || 0;
                                        break;
                                    case "picturemarkersymbol":
                                        l =
                                            c.width || 0, h = c.height || 0
                                }
                                e = c.xoffset || 0;
                                m = c.yoffset || 0;
                                k = c.angle || 0
                            }
                            l && h && d._setDim(l + 1, h + 1, 7);
                            d.setOffset(e, m);
                            d.setAngle(k)
                        }
                        break;
                    case "polyline":
                        d = this.lineSymbol;
                        break;
                    case "polygon":
                        d = this.fillSymbol
                }
                f.setSymbol(d)
            }
        },
        showClosestFirst: function(a) {
            var b = this.features;
            if (b && b.length) {
                if (1 < b.length) {
                    var c, f = Infinity,
                        d = -1,
                        g, l = A.getLength,
                        h, e = a.spatialReference,
                        m, k;
                    a = a.normalize();
                    for (c = b.length - 1; 0 <= c; c--)
                        if (g = b[c].geometry) {
                            m = g.spatialReference;
                            h = 0;
                            try {
                                k = "point" === g.type ? g : g.getExtent().getCenter(),
                                k = k.normalize(), e && (m && !e.equals(m) && e._canProject(m)) && (k = e.isWebMercator() ? s.geographicToWebMercator(k) : s.webMercatorToGeographic(k)), h = l(a, k)
                            } catch (n) {}
                            0 < h && h < f && (f = h, d = c)
                        }
                    0 < d && (b.splice(0, 0, b.splice(d, 1)[0]), this.select(0))
                }
            } else this.deferreds && (this._marked = a)
        },
        _unbind: function(a) {
            a = e.indexOf(this.deferreds, a);
            if (-1 !== a) return this.deferreds.splice(a, 1), !this.deferreds.length ? (this.deferreds = null, 2) : 1
        },
        _fireComplete: function(a) {
            var b = this._marked;
            b && (this._marked = null, this.showClosestFirst(b));
            this.onDfdComplete(a)
        },
        _updateFeatures: function(a, b) {
            if (a) {
                if (this.deferreds) {
                    var c = this._unbind(a);
                    if (c)
                        if (b && b instanceof Error) {
                            if (this._fireComplete(b), 2 === c) this.onSetFeatures()
                        } else if (b && b.length)
                        if (this.features) {
                            var f = e.filter(b, function(a) {
                                return -1 === e.indexOf(this.features, a)
                            }, this);
                            this.features = this.features.concat(f);
                            this.count = this.features.length;
                            this._fireComplete();
                            if (2 === c) this.onSetFeatures()
                        } else {
                            this.features = b;
                            this.count = b.length;
                            this.selectedIndex = 0;
                            this._fireComplete();
                            if (2 ===
                                c) this.onSetFeatures();
                            this.select(0)
                        } else if (this._fireComplete(), 2 === c) this.onSetFeatures()
                }
            } else this.features = b, this.count = b.length, this.selectedIndex = 0, this.onSetFeatures(), this.select(0)
        },
        _resetUpdateEndListeners: function() {
            this._featureLayers = {};
            e.forEach(this._updateEndHandles, function(a) {
                a.remove()
            });
            this._updateEndHandles = []
        },
        _processFeatures: function() {
            e.forEach(this.features, function(a) {
                if ((a = a.getLayer()) && !this._featureLayers[a.id] && 1 === a.currentMode && a.objectIdField && a.hasXYFootprint &&
                    a.queryFeatures && ("esriGeometryPolygon" === a.geometryType || "esriGeometryPolyline" === a.geometryType || a.hasXYFootprint())) this._featureLayers[a.id] = a, a = a.on("update-end", n.hitch(this, this._fLyrUpdateEndHandler)), this._updateEndHandles.push(a)
            }, this)
        },
        _fLyrUpdateEndHandler: function(a) {
            if (!a.error) {
                var b = this,
                    c = a.target,
                    f = {},
                    d = [];
                e.forEach(this.features, function(a) {
                    if (a.getLayer() === c) {
                        var b = a.attributes[c.objectIdField];
                        f[b] = a;
                        d.push(b)
                    }
                });
                d.length && (a = new B, a.objectIds = d, c.queryFeatures(a, function(a) {
                    e.forEach(a.features,
                        function(a) {
                            var b = f[a.attributes[c.objectIdField]];
                            b.geometry !== a.geometry && (b.setGeometry(a.geometry), this._highlighted && b === this.getSelectedFeature() && this._highlighted.setGeometry(a.geometry))
                        }, b)
                }))
            }
        }
    })
});