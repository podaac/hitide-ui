//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/dom-construct", "dojo/dom-style", "dojox/xml/parser", "dojox/gfx/matrix", "../kernel", "../config", "../sniff", "../request", "../domUtils", "./layer", "./MapImage"], function(w, g, r, n, f, x, q, k, t, s, y, u, z, A) {
    var v = t.defaults.map.zoomDuration;
    return w(z, {
        declaredClass: "esri.layers.DynamicMapServiceLayer",
        _eventMap: {
            "map-image-export": ["mapImage"]
        },
        constructor: function(a, b) {
            this.useMapTime = b && b.hasOwnProperty("useMapTime") ? !!b.useMapTime : !0;
            var c = r.hitch;
            this._exportMapImageHandler =
                c(this, this._exportMapImageHandler);
            this._imgSrcFunc = c(this, this._imgSrcFunc);
            this._divAlphaImageFunc = c(this, this._divAlphaImageFunc);
            this._tileLoadHandler = c(this, this._tileLoadHandler);
            this._tileErrorHandler = c(this, this._tileErrorHandler);
            this.registerConnectEvents()
        },
        opacity: 1,
        isPNG32: !1,
        _setMap: function(a, b, c) {
            this.inherited(arguments);
            this._map = a;
            var e = this._div = n.create("div", null, b),
                d = k._css.names,
                h = {
                    position: "absolute",
                    width: a.width + "px",
                    height: a.height + "px",
                    overflow: "visible",
                    opacity: this.opacity
                },
                l = s("ie"),
                q = g.connect,
                p = a.__visibleDelta;
            l && 7 < l && delete h.opacity;
            "css-transforms" === a.navigationMode ? (h[d.transform] = k._css.translate(p.x, p.y), f.set(e, h), this._left = p.x, this._top = p.y) : (h.left = "0px", h.top = "0px", f.set(e, h), this._left = this._top = 0);
            f.set(e, h);
            this._onResizeHandler_connect = q(a, "onResize", this, "_onResizeHandler");
            this._opacityChangeHandler_connect = q(this, "onOpacityChange", this, "_opacityChangeHandler");
            this._img_loading = null;
            this._dragOrigin = {
                x: 0,
                y: 0
            };
            this.evaluateSuspension();
            if (this.suspended &&
                !a.loaded) var m = g.connect(a, "onLoad", this, function() {
                g.disconnect(m);
                m = null;
                this.evaluateSuspension()
            });
            return e
        },
        _unsetMap: function(a, b) {
            n.destroy(this._div);
            this._map = this._div = null;
            var c = g.disconnect;
            c(this._onResizeHandler_connect);
            c(this._opacityChangeHandler_connect);
            this._onResizeHandler_connect = this._opacityChangeHandler_connect = null;
            this._fireUpdateEnd();
            this._toggleTime();
            clearTimeout(this._wakeTimer);
            this._wakeTimer = null;
            this._disableDrawConnectors();
            this.inherited(arguments)
        },
        _onResizeHandler: function(a,
            b, c) {
            f.set(this._div, {
                width: b + "px",
                height: c + "px"
            });
            this._onExtentChangeHandler(a)
        },
        onSuspend: function() {
            this.inherited(arguments);
            this._fireUpdateEnd();
            this._toggleTime();
            u.hide(this._div);
            clearTimeout(this._wakeTimer);
            this._wakeTimer = null;
            this._disableDrawConnectors()
        },
        onResume: function() {
            this.inherited(arguments);
            var a = this._map;
            this._toggleTime();
            "css-transforms" === a.navigationMode && (a = a.__visibleDelta, this._left = a.x, this._top = a.y, f.set(this._div, k._css.names.transform, k._css.translate(this._left,
                this._top)));
            this._enableDrawConnectors();
            this._wakeTimer = this._wakeTimer || setTimeout(r.hitch(this, function() {
                this.suspended || this._onExtentChangeHandler(this._map.extent, null, !0)
            }), 0)
        },
        _enableDrawConnectors: function() {
            var a = g.connect,
                b = this._map;
            b && (this._onPanHandler_connect = a(b, "onPan", this, "_onPanHandler"), this._onExtentChangeHandler_connect = a(b, "onExtentChange", this, "_onExtentChangeHandler"), "css-transforms" === b.navigationMode ? this._onScaleHandler_connect = a(b, "onScale", this, this._onScaleHandler) :
                this._onZoomHandler_connect = a(b, "onZoom", this, "_onZoomHandler"))
        },
        _disableDrawConnectors: function() {
            var a = g.disconnect;
            a(this._onPanHandler_connect);
            a(this._onExtentChangeHandler_connect);
            a(this._onZoomHandler_connect);
            a(this._onScaleHandler_connect);
            this._onPanHandler_connect = this._onExtentChangeHandler_connect = this._onZoomHandler_connect = this._onScaleHandler_connect = null
        },
        _toggleTime: function() {
            var a = this._map;
            this.timeInfo && this.useMapTime && a && !this.suspended ? (this._timeConnect || (this._timeConnect =
                g.connect(a, "onTimeExtentChange", this, this._onTimeExtentChangeHandler)), this._setTime(a.timeExtent)) : (g.disconnect(this._timeConnect), this._timeConnect = null, this._setTime(null))
        },
        _setTime: function(a) {
            this._params && (this._params.time = a ? a.toJson().join(",") : null)
        },
        _onPanHandler: function(a, b) {
            this._panDx = b.x;
            this._panDy = b.y;
            var c = this._dragOrigin,
                e = this._map.__visibleDelta,
                d = this._img;
            d && ("css-transforms" === this._map.navigationMode ? (this._left = e.x + b.x, this._top = e.y + b.y, f.set(this._div, k._css.names.transform,
                k._css.translate(this._left, this._top))) : f.set(d, {
                left: c.x + b.x + "px",
                top: c.y + b.y + "px"
            }))
        },
        _onExtentChangeHandler: function(a, b, c) {
            if (!this.suspended) {
                clearTimeout(this._wakeTimer);
                this._wakeTimer = null;
                var e = this._map,
                    d = this._img,
                    h = d && d.style,
                    l = this._dragOrigin;
                if (b && !c && d && (b.x !== this._panDx || b.y !== this._panDy)) "css-transforms" === e.navigationMode ? (b = e.__visibleDelta, this._left = b.x, this._top = b.y, f.set(this._div, k._css.names.transform, k._css.translate(this._left, this._top))) : f.set(d, {
                    left: l.x + b.x + "px",
                    top: l.y + b.y + "px"
                });
                d ? (l.x = parseInt(h.left, 10), l.y = parseInt(h.top, 10)) : l.x = l.y = 0;
                "css-transforms" === e.navigationMode && (c && d) && (f.set(d, k._css.names.transition, "none"), d._multiply = d._multiply ? q.multiply(d._matrix, d._multiply) : d._matrix);
                this._fireUpdateStart();
                if (c = this._img_loading)
                    if (g.disconnect(c._onload_connect), g.disconnect(c._onerror_connect), g.disconnect(c._onabort_connect), n.destroy(c), this._img_loading = null, c = this._jsonRequest) {
                        try {
                            c.cancel()
                        } catch (r) {}
                        this._jsonRequest = null
                    }
                10 <= this.version &&
                    e.wrapAround180 && (a = a._normalize(!0));
                if (this.isPNG32) d = this._img_loading = n.create("div"), d.id = e.id + "_" + this.id + "_" + (new Date).getTime(), f.set(d, {
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: e.width + "px",
                    height: e.height + "px"
                }), d = d.appendChild(n.create("div")), f.set(d, {
                    opacity: 0,
                    width: e.width + "px",
                    height: e.height + "px"
                }), this.getImageUrl(a, e.width, e.height, this._divAlphaImageFunc);
                else {
                    c = this._img_loading = n.create("img");
                    b = k._css.names;
                    var p = s("ie"),
                        m = {
                            position: "absolute",
                            width: e.width + "px",
                            height: e.height +
                                "px"
                        };
                    p && 7 < p && (m.opacity = this.opacity);
                    "css-transforms" === e.navigationMode ? (m[b.transform] = k._css.translate(-this._left, -this._top), c._tdx = -this._left, c._tdy = -this._top, m[b.transition] = b.transformName + " " + v + "ms ease") : (m.left = "0px", m.top = "0px");
                    c.id = e.id + "_" + this.id + "_" + (new Date).getTime();
                    f.set(c, m);
                    c._onload_connect = g.connect(c, "onload", this, "_onLoadHandler");
                    c._onerror_connect = g.connect(c, "onerror", this, "_onErrorHandler");
                    c._onabort_connect = g.connect(c, "onabort", this, "_onErrorHandler");
                    this._startRect = {
                        left: l.x,
                        top: l.y,
                        width: d ? parseInt(h.width, 10) : e.width,
                        height: d ? parseInt(h.height, 10) : e.height,
                        zoom: h && h.zoom ? parseFloat(h.zoom) : 1
                    };
                    this.getImageUrl(a, e.width, e.height, this._imgSrcFunc)
                }
            }
        },
        _onTimeExtentChangeHandler: function(a) {
            this.suspended || (this._setTime(a), this.refresh(!0))
        },
        getImageUrl: function(a, b, c, e) {},
        _imgSrcFunc: function(a) {
            this._img_loading.src = a
        },
        _divAlphaImageFunc: function(a) {
            f.set(this._img_loading, "filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src\x3d'" + a + "', sizingMethod\x3d'scale')");
            this._onLoadHandler({
                currentTarget: this._img_loading
            })
        },
        _onLoadHandler: function(a) {
            a = a.currentTarget;
            var b = g.disconnect,
                c = this._map;
            b(a._onload_connect);
            b(a._onerror_connect);
            b(a._onabort_connect);
            !c || c.__panning || c.__zooming ? n.destroy(a) : (x.removeChildren(this._div), this._img = a, this._startRect = {
                    left: 0,
                    top: 0,
                    width: c.width,
                    height: c.height,
                    zoom: 1
                }, this._div.appendChild(a), this.suspended || u.show(this._div), a._onload_connect = a._onerror_connect = a._onabort_connect = this._img_loading = null, a = this._dragOrigin,
                a.x = a.y = 0, this.onUpdate());
            this._fireUpdateEnd()
        },
        _onErrorHandler: function(a) {
            a = a.currentTarget;
            var b = g.disconnect;
            f.set(a, "visibility", "hidden");
            b(a._onload_connect);
            b(a._onerror_connect);
            b(a._onabort_connect);
            a._onload_connect = a._onerror_connect = a._onabort_connect = null;
            a = Error("Unable to load image: " + a.src);
            this.onError(a);
            this._fireUpdateEnd(a)
        },
        setUseMapTime: function(a, b) {
            this.useMapTime = a;
            this._toggleTime();
            b || this.refresh(!0)
        },
        refresh: function() {
            this._map && this._onExtentChangeHandler(this._map.extent)
        },
        _onScaleHandler: function(a, b) {
            var c = {},
                e = k._css.names,
                d = this._img;
            if (d) {
                f.set(d, e.transition, b ? "none" : e.transformName + " " + v + "ms ease");
                d._matrix = a;
                a = d._multiply ? q.multiply(a, d._multiply) : a;
                if (d._tdx || d._tdy) a = q.multiply(a, {
                    xx: 1,
                    xy: 0,
                    yx: 0,
                    yy: 1,
                    dx: d._tdx,
                    dy: d._tdy
                });
                c[e.transform] = k._css.matrix(a);
                f.set(d, c)
            }
        },
        _onZoomHandler: function(a, b, c) {
            a = this._startRect;
            var e = a.width * b,
                d = a.height * b,
                h = this._img,
                g = s("ie");
            h && (g && 8 > g ? f.set(h, {
                left: a.left - (e - a.width) * (c.x - a.left) / a.width + "px",
                top: a.top - (d - a.height) *
                    (c.y - a.top) / a.height + "px",
                zoom: b * a.zoom
            }) : f.set(h, {
                left: a.left - (e - a.width) * (c.x - a.left) / a.width + "px",
                top: a.top - (d - a.height) * (c.y - a.top) / a.height + "px",
                width: e + "px",
                height: d + "px"
            }))
        },
        _exportMapImage: function(a, b, c) {
            var e = this._exportMapImageHandler;
            b.token = this._getToken();
            y({
                url: a,
                content: b,
                callbackParamName: "callback",
                load: function(a, b) {
                    e(a, b, c)
                },
                error: t.defaults.io.errorHandler
            })
        },
        _exportMapImageHandler: function(a, b, c) {
            a = new A(a);
            this.onMapImageExport(a);
            c && c(a)
        },
        onMapImageExport: function() {},
        setOpacity: function(a) {
            if (this.opacity !=
                a) this.onOpacityChange(this.opacity = a)
        },
        onOpacityChange: function() {},
        _opacityChangeHandler: function(a) {
            f.set(this._div, "opacity", a)
        }
    })
});