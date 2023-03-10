//>>built
define(["dojo/_base/declare", "dojo/_base/config", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/Deferred", "dojo/_base/json", "dojo/has", "../Evented", "../kernel", "../lang", "../request", "../deferredUtils", "../urlUtils", "../SpatialReference", "../geometry/Extent"], function(m, n, d, f, p, q, w, r, h, c, s, t, u, k, v) {
    var l = m([r], {
        declaredClass: "esri.layers.Layer",
        _eventMap: {
            error: ["error"],
            load: ["layer"],
            "opacity-change": ["opacity"],
            "update-end": ["error"],
            "visibility-change": ["visible"]
        },
        constructor: function(a, b) {
            a && f.isString(a) ?
                this._url = u.urlToObject(this.url = a) : (this.url = this._url = null, (b = b || a) && b.layerDefinition && (b = null));
            this.spatialReference = new k(4326);
            this.initialExtent = new v(-180, -90, 180, 90, new k(4326));
            this._map = this._div = null;
            this.normalization = !0;
            b && (b.id && (this.id = b.id), !1 === b.visible && (this.visible = !1), c.isDefined(b.opacity) && (this.opacity = b.opacity), c.isDefined(b.minScale) && this.setMinScale(b.minScale), c.isDefined(b.maxScale) && this.setMaxScale(b.maxScale), this.attributionDataUrl = b.attributionDataUrl || "", this.hasAttributionData = !!this.attributionDataUrl, c.isDefined(b.showAttribution) && (this.showAttribution = b.showAttribution), this.className = b.className, this.refreshInterval = b.refreshInterval || 0);
            this._errorHandler = f.hitch(this, this._errorHandler);
            this.refresh = f.hitch(this, this.refresh);
            if (this.managedSuspension) {
                var e = this._setMap;
                this._setMap = function(a) {
                    var b = e.apply(this, arguments);
                    this.evaluateSuspension();
                    if (this.suspended && !a.loaded) var c = d.connect(a, "onLoad", this, function() {
                        d.disconnect(c);
                        c = null;
                        this.evaluateSuspension()
                    });
                    return b
                }
            }
            this.registerConnectEvents()
        },
        id: null,
        visible: !0,
        opacity: 1,
        loaded: !1,
        loadError: null,
        minScale: 0,
        maxScale: 0,
        visibleAtMapScale: !1,
        suspended: !0,
        attributionDataUrl: "",
        hasAttributionData: !1,
        showAttribution: !0,
        refreshInterval: 0,
        _errorHandler: function(a) {
            this.loaded || (this.loadError = a);
            this.onError(a)
        },
        _setMap: function(a, b, e, g) {
            this._map = a;
            this._lyrZEHandle = d.connect(a, "onZoomEnd", this, this._processMapScale);
            if (a.loaded) this.visibleAtMapScale = this._isMapAtVisibleScale();
            else var c = d.connect(a, "onLoad",
                this, function() {
                    d.disconnect(c);
                    c = null;
                    this._processMapScale()
                })
        },
        _unsetMap: function(a, b) {
            d.disconnect(this._lyrZEHandle);
            this._toggleRT();
            this._map = this._lyrZEHandle = null;
            this.suspended = !0
        },
        _cleanUp: function() {
            this._map = this._div = null
        },
        _fireUpdateStart: function() {
            this.updating || (this.updating = !0, this.attr("data-updating", ""), this._toggleRT(), this.onUpdateStart(), this._map && this._map._incr())
        },
        _fireUpdateEnd: function(a, b) {
            this.updating && (this.updating = !1, this.attr("data-updating"), this._toggleRT(!0),
                this.onUpdateEnd(a, b), this._map && this._map._decr())
        },
        _getToken: function() {
            var a = this._url,
                b = this.credential;
            return a && a.query && a.query.token || b && b.token || void 0
        },
        _findCredential: function() {
            this.credential = h.id && this._url && h.id.findCredential(this._url.path)
        },
        _useSSL: function() {
            var a = this._url,
                b = /^http:/i;
            this.url && (this.url = this.url.replace(b, "https:"));
            a && a.path && (a.path = a.path.replace(b, "https:"))
        },
        refresh: function() {},
        show: function() {
            this.setVisibility(!0)
        },
        hide: function() {
            this.setVisibility(!1)
        },
        setMinScale: function(a) {
            this.setScaleRange(a)
        },
        setMaxScale: function(a) {
            this.setScaleRange(null, a)
        },
        setScaleRange: function(a, b) {
            var e = c.isDefined(a),
                g = c.isDefined(b);
            this.loaded || (this._hasMin = this._hasMin || e, this._hasMax = this._hasMax || g);
            var d = this.minScale,
                f = this.maxScale;
            this.minScale = (e ? a : this.minScale) || 0;
            this.maxScale = (g ? b : this.maxScale) || 0;
            if (d !== this.minScale || f !== this.maxScale) this.onScaleRangeChange(), this._processMapScale()
        },
        suspend: function() {
            this._suspended = !0;
            this.evaluateSuspension()
        },
        resume: function() {
            this._suspended = !1;
            this.evaluateSuspension()
        },
        canResume: function() {
            return this.loaded && this._map && this._map.loaded && this.visible && this.visibleAtMapScale && !this._suspended
        },
        evaluateSuspension: function() {
            this.canResume() ? this.suspended && this._resume() : this.suspended || this._suspend()
        },
        _suspend: function() {
            this.suspended = !0;
            this.attr("data-suspended", "");
            this._toggleRT();
            this.onSuspend();
            if (this._map) this._map.onLayerSuspend(this)
        },
        _resume: function() {
            this.suspended = !1;
            this.attr("data-suspended");
            var a = void 0 === this._resumedOnce,
                b = this.className,
                e = this.getNode();
            if (a && (this._resumedOnce = !0, b && e)) {
                var c = e.getAttribute("class") || "";
                RegExp("(^|\\s)" + b + "(\\s|$)", "i").test(c) || e.setAttribute("class", c + ((c ? " " : "") + b))
            }
            this._toggleRT(!0);
            this.onResume({
                firstOccurrence: a
            });
            if (this._map) this._map.onLayerResume(this)
        },
        _processMapScale: function() {
            var a = this.visibleAtMapScale;
            this.visibleAtMapScale = this._isMapAtVisibleScale();
            a !== this.visibleAtMapScale && (this.onScaleVisibilityChange(), this.evaluateSuspension())
        },
        isVisibleAtScale: function(a) {
            return a ? l.prototype._isMapAtVisibleScale.apply(this, arguments) : !1
        },
        _isMapAtVisibleScale: function(a) {
            if (!a && (!this._map || !this._map.loaded)) return !1;
            a = a || this._map.getScale();
            var b = this.minScale,
                e = this.maxScale,
                c = !b,
                d = !e;
            !c && a <= b && (c = !0);
            !d && a >= e && (d = !0);
            return c && d
        },
        getAttributionData: function() {
            var a = this.attributionDataUrl,
                b = new p(t._dfdCanceller);
            this.hasAttributionData && a ? (b._pendingDfd = s({
                url: a,
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback"
            }), b._pendingDfd.then(function(a) {
                    b.callback(a)
                },
                function(a) {
                    b.errback(a)
                })) : (a = Error("Layer does not have attribution data"), a.log = n.isDebug, b.errback(a));
            return b
        },
        getResourceInfo: function() {
            var a = this.resourceInfo;
            return f.isString(a) ? q.fromJson(a) : f.clone(a)
        },
        getMap: function() {
            return this._map
        },
        getNode: function() {
            return this._div
        },
        attr: function(a, b) {
            var c = this.getNode();
            c && (null == b ? c.removeAttribute(a) : c.setAttribute(a, b));
            return this
        },
        setRefreshInterval: function(a) {
            var b = this.refreshInterval;
            this.refreshInterval = a;
            this._toggleRT();
            a && !this.updating &&
                !this.suspended && this._toggleRT(!0);
            if (b !== a) this.onRefreshIntervalChange();
            return this
        },
        _toggleRT: function(a) {
            a && this.refreshInterval ? (clearTimeout(this._refreshT), this._refreshT = setTimeout(this.refresh, 6E4 * this.refreshInterval)) : this._refreshT && (clearTimeout(this._refreshT), this._refreshT = null)
        },
        setNormalization: function(a) {
            this.normalization = a
        },
        setVisibility: function(a) {
            this.visible !== a && (this.visible = a, this.onVisibilityChange(this.visible), this.evaluateSuspension());
            this.attr("data-hidden", a ?
                null : "")
        },
        onLoad: function() {},
        onVisibilityChange: function() {},
        onScaleRangeChange: function() {},
        onScaleVisibilityChange: function() {},
        onSuspend: function() {},
        onResume: function() {},
        onUpdate: function() {},
        onUpdateStart: function() {},
        onUpdateEnd: function() {},
        onRefreshIntervalChange: function() {},
        onError: function() {}
    });
    return l
});