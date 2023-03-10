//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-construct", "dojo/dom-style", "../kernel", "../config", "../sniff", "../domUtils", "../geometry/Point", "../geometry/webMercatorUtils", "./layer"], function(u, l, v, w, n, f, k, x, m, s, t, p, y) {
    var r = u([y], {
        declaredClass: "esri.layers.MapImageLayer",
        "-chains-": {
            constructor: "manual"
        },
        constructor: function(b) {
            this.inherited(arguments, [null, b]);
            this._mapImages = [];
            var a = v.hitch;
            this._panStart = a(this, this._panStart);
            this._pan = a(this, this._pan);
            this._extentChange = a(this, this._extentChange);
            this._zoom = a(this, this._zoom);
            this._zoomStart = a(this, this._zoomStart);
            this._scale = a(this, this._scale);
            this._resize = a(this, this._resize);
            l.connect(this, "onSuspend", this, this._onSuspend);
            l.connect(this, "onResume", this, this._onResume);
            this.loaded = !0;
            this.onLoad(this)
        },
        opacity: 1,
        _transform: k._getDOMAccessor("transform"),
        addImage: function(b) {
            var a = this._mapImages.push(b),
                a = a - 1;
            b._idx = a;
            b._layer = this;
            this._div && this._createImage(b, a)
        },
        removeImage: function(b) {
            if (b) {
                var a =
                    b._idx,
                    c = this._mapImages;
                if (c[a] === b) {
                    delete c[a];
                    if (a = b._node) this._clearEvents(a), a.e_idx = a.e_bl = a.e_tr = a.e_l = a.e_t = a.e_w = a.e_h = null, a.parentNode && (a.parentNode.removeChild(a), n.destroy(a));
                    b._node = b._idx = b._layer = null
                }
            }
        },
        removeAllImages: function() {
            var b = this._mapImages,
                a, c = b.length;
            for (a = 0; a < c; a++) {
                var d = b[a];
                d && this.removeImage(d)
            }
            this._mapImages = []
        },
        getImages: function() {
            var b = this._mapImages,
                a = [],
                c, d = b.length;
            for (c = 0; c < d; c++) b[c] && a.push(b[c]);
            return a
        },
        setOpacity: function(b) {
            this.opacity != b &&
                (this._opacityChanged(this.opacity = b), this.onOpacityChange())
        },
        onOpacityChange: function() {},
        _opacityChanged: function(b) {
            var a = this._div,
                c, d;
            if (a)
                if (!m("ie") || 8 < m("ie")) f.set(a, "opacity", b);
                else {
                    d = a.childNodes;
                    c = d.length;
                    for (a = 0; a < c; a++) f.set(d[a], "opacity", b)
                }
        },
        _createImage: function(b, a) {
            var c = n.create("img");
            f.set(c, {
                position: "absolute"
            });
            8 >= m("ie") && f.set(c, "opacity", this.opacity);
            if (b.rotation) {
                var d = "rotate(" + (360 - b.rotation) + "deg)";
                9 > m("ie") || (f.set(c, this._transform, d), f.set(c, "transform", d))
            }
            b._node =
                c;
            c.e_idx = a;
            c.e_layer = this;
            c.e_load = l.connect(c, "onload", r.prototype._imageLoaded);
            c.e_error = l.connect(c, "onerror", r.prototype._imageError);
            c.e_abort = l.connect(c, "onabort", r.prototype._imageError);
            c.src = b.href
        },
        _imageLoaded: function(b, a) {
            var c = a || b.target || b.currentTarget,
                d = c.e_layer,
                e = d._mapImages[c.e_idx],
                g = d._map;
            g && (g.__zooming || g.__panning || !d._sr) ? d._standby.push(c) : (d._clearEvents(c), e && e._node === c && g && d._attach(e))
        },
        _imageError: function(b) {
            b = b.target || b.currentTarget;
            var a = b.e_layer,
                c = a._mapImages[b.e_idx];
            a._clearEvents(b);
            c && (c._node = null)
        },
        _clearEvents: function(b) {
            var a = l.disconnect;
            a(b.e_load);
            a(b.e_error);
            a(b.e_abort);
            b.e_load = b.e_error = b.e_abort = b.e_layer = null
        },
        _attach: function(b) {
            var a = b.extent,
                c = a.spatialReference,
                d = this._sr,
                e = this._div,
                g = b._node,
                f = new t({
                    x: a.xmin,
                    y: a.ymin,
                    spatialReference: c
                }),
                a = new t({
                    x: a.xmax,
                    y: a.ymax,
                    spatialReference: c
                });
            d.equals(c) || (d.isWebMercator() && 4326 === c.wkid ? (f = p.geographicToWebMercator(f), a = p.geographicToWebMercator(a)) : c.isWebMercator() && 4326 === d.wkid && (f = p.webMercatorToGeographic(f),
                a = p.webMercatorToGeographic(a)));
            g.e_bl = f;
            g.e_tr = a;
            b.visible && (this._setPos(g, e._left, e._top), (this._active || e).appendChild(g))
        },
        _setPos: function(b, a, c) {
            var d = b.e_bl,
                e = b.e_tr,
                g = this._map,
                d = g.toScreen(d),
                e = g.toScreen(e);
            a = d.x - a;
            c = e.y - c;
            var q = Math.abs(e.x - d.x),
                d = Math.abs(d.y - e.y),
                e = {
                    width: q + "px",
                    height: d + "px"
                },
                h = this._mapImages[b.e_idx];
            "css-transforms" === g.navigationMode ? e[k._css.names.transform] = k._css.translate(a, c) + (h.rotation ? " " + k._css.rotate(360 - h.rotation) : "") : (e.left = a + "px", e.top = c + "px");
            f.set(b,
                e);
            b.e_l = a;
            b.e_t = c;
            b.e_w = q;
            b.e_h = d
        },
        managedSuspension: !0,
        _setMap: function(b, a) {
            this.inherited(arguments);
            var c = this._div = n.create("div", null, a),
                d = k._css.names,
                e = {
                    position: "absolute"
                },
                g = b.__visibleDelta;
            if (!m("ie") || 8 < m("ie")) e.opacity = this.opacity;
            "css-transforms" === b.navigationMode ? (e[d.transform] = k._css.translate(g.x, g.y), f.set(c, e), c._left = g.x, c._top = g.y, e = {
                    position: "absolute",
                    width: b.width + "px",
                    height: b.height + "px",
                    overflow: "visible"
                }, this._active = n.create("div", null, c), f.set(this._active, e),
                this._passive = n.create("div", null, c), f.set(this._passive, e)) : (c._left = 0, c._top = 0, f.set(c, e));
            this._standby = [];
            d = this._mapImages;
            g = d.length;
            for (e = 0; e < g; e++) {
                var q = d[e];
                q._node || this._createImage(q, q._idx)
            }
            s.hide(c);
            return c
        },
        _unsetMap: function(b, a) {
            this._disconnect();
            var c = this._div;
            if (c) {
                var d = this._mapImages,
                    e, g = d.length;
                for (e = 0; e < g; e++) {
                    var f = d[e];
                    if (f) {
                        var h = f._node;
                        h && (this._clearEvents(h), h.e_idx = h.e_bl = h.e_tr = h.e_l = h.e_t = h.e_w = h.e_h = null);
                        f._node = null
                    }
                }
                a.removeChild(c);
                n.destroy(c)
            }
            this._map =
                this._div = this._sr = this._active = this._passive = this._standby = null;
            this.inherited(arguments)
        },
        _onSuspend: function() {
            this._disconnect();
            s.hide(this._div)
        },
        _onResume: function(b) {
            b.firstOccurrence && (this._sr = this._map.spatialReference, this._processStandbyList());
            b = this._map;
            var a = this._div,
                c = b.__visibleDelta;
            "css-transforms" === b.navigationMode && (a._left = c.x, a._top = c.y, f.set(a, k._css.names.transform, k._css.translate(a._left, a._top)));
            this._redraw("css-transforms" === b.navigationMode);
            this._connect(b);
            s.show(a)
        },
        _connect: function(b) {
            if (!this._connections) {
                var a = l.connect,
                    c = "css-transforms" === b.navigationMode;
                this._connections = [a(b, "onPanStart", this._panStart), a(b, "onPan", this._pan), a(b, "onExtentChange", this._extentChange), c && a(b, "onZoomStart", this._zoomStart), c ? a(b, "onScale", this._scale) : a(b, "onZoom", this._zoom), c && a(b, "onResize", this._resize)]
            }
        },
        _disconnect: function() {
            this._connections && (w.forEach(this._connections, l.disconnect), this._connections = null)
        },
        _panStart: function() {
            this._panL = this._div._left;
            this._panT =
                this._div._top
        },
        _pan: function(b, a) {
            var c = this._div;
            c._left = this._panL + a.x;
            c._top = this._panT + a.y;
            "css-transforms" === this._map.navigationMode ? f.set(c, k._css.names.transform, k._css.translate(c._left, c._top)) : f.set(c, {
                left: c._left + "px",
                top: c._top + "px"
            })
        },
        _extentChange: function(b, a, c) {
            c ? this._redraw("css-transforms" === this._map.navigationMode) : a && this._pan(b, a);
            this._processStandbyList()
        },
        _processStandbyList: function() {
            var b, a = this._standby;
            if (a && a.length)
                for (b = a.length - 1; 0 <= b; b--) this._imageLoaded(null,
                    a[b]), a.splice(b, 1)
        },
        _redraw: function(b) {
            if (b) {
                b = this._passive;
                var a = k._css.names;
                f.set(b, a.transition, "none");
                this._moveImages(b, this._active);
                f.set(b, a.transform, "none")
            }
            b = this._active || this._div;
            var a = this._div._left,
                c = this._div._top,
                d, e = b.childNodes.length,
                g;
            for (d = 0; d < e; d++) g = b.childNodes[d], this._setPos(g, a, c)
        },
        _zoom: function(b, a, c) {
            b = this._div;
            var d = b._left,
                e = b._top,
                g, k = b.childNodes.length,
                h;
            for (g = 0; g < k; g++) {
                h = b.childNodes[g];
                var l = h.e_w * a,
                    n = h.e_h * a,
                    m = (c.x - d - h.e_l) * (l - h.e_w) / h.e_w,
                    p = (c.y - e -
                        h.e_t) * (n - h.e_h) / h.e_h,
                    m = isNaN(m) ? 0 : m,
                    p = isNaN(p) ? 0 : p;
                f.set(h, {
                    left: h.e_l - m + "px",
                    top: h.e_t - p + "px",
                    width: l + "px",
                    height: n + "px"
                })
            }
        },
        _zoomStart: function() {
            this._moveImages(this._active, this._passive)
        },
        _moveImages: function(b, a) {
            var c = b.childNodes,
                d;
            d = c.length;
            if (0 < d)
                for (d -= 1; 0 <= d; d--) a.appendChild(c[d])
        },
        _scale: function(b, a) {
            var c = k._css.names,
                d = this._passive;
            f.set(d, c.transition, a ? "none" : c.transformName + " " + x.defaults.map.zoomDuration + "ms ease");
            k._css.matrix(b);
            f.set(d, c.transform, k._css.matrix(b))
        },
        _resize: function(b, a, c) {
            f.set(this._active, {
                width: a + "px",
                height: c + "px"
            });
            f.set(this._passive, {
                width: a + "px",
                height: c + "px"
            })
        }
    });
    return r
});