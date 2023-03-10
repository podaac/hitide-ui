//>>built
define(["require", "dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../config", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on", "dojo/Deferred", "dojo/text!./templates/LocateButton.html", "dojo/i18n!../nls/jsapi", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "../geometry/Point", "../SpatialReference", "../graphic", "../symbols/PictureMarkerSymbol"], function(n, p, q, d, A, B, k, r, s, t, l, g, u, v, e, m, h, w, x, y, z) {
    return q("esri.dijit.LocateButton", [r, t, p], {
        templateString: u,
        options: {
            theme: "LocateButton",
            map: null,
            visible: !0,
            highlightLocation: !0,
            symbol: new z(n.toUrl(".") + "/images/sdk_gps_location.png", 28, 28),
            infoTemplate: null,
            scale: null,
            useTracking: !1,
            setScale: !0,
            centerAt: !0,
            timeout: 15E3,
            graphicsLayer: null,
            geolocationOptions: {
                maximumAge: 0,
                timeout: 15E3,
                enableHighAccuracy: !0
            }
        },
        constructor: function(c, b) {
            var a = d.mixin({}, this.options, c);
            this.domNode = b;
            this._i18n = v;
            navigator.geolocation || (a.visible = !1, console.log("LocateButton::navigator.geolocation unsupported."));
            this.set("map", a.map);
            this.set("theme",
                a.theme);
            this.set("visible", a.visible);
            this.set("scale", a.scale);
            this.set("highlightLocation", a.highlightLocation);
            this.set("symbol", a.symbol);
            this.set("infoTemplate", a.infoTemplate);
            this.set("geolocationOptions", a.geolocationOptions);
            this.set("useTracking", a.useTracking);
            this.set("setScale", a.setScale);
            this.set("centerAt", a.centerAt);
            this.set("timeout", a.timeout);
            this.set("graphicsLayer", a.graphicsLayer);
            this.watch("theme", this._updateThemeWatch);
            this.watch("visible", this._visible);
            this.watch("tracking",
                this._locate);
            this.watch("useTracking", d.hitch(this, function() {
                this.get("tracking") && !this.get("useTracking") && this._stopTracking();
                this._setTitle()
            }));
            this._css = {
                container: "locateContainer",
                locate: "zoomLocateButton",
                loading: "loading",
                tracking: "tracking"
            }
        },
        postCreate: function() {
            this.inherited(arguments);
            this.own(l(this._locateNode, s, d.hitch(this, this.locate)))
        },
        startup: function() {
            this.get("map") || (this.destroy(), console.log("LocateButton::map required"));
            if (this.get("map").loaded) this._init();
            else l.once(this.get("map"),
                "load", d.hitch(this, function() {
                    this._init()
                }))
        },
        destroy: function() {
            this._graphicsEvent && this._graphicsEvent.remove();
            this._removeWatchPosition();
            this.inherited(arguments)
        },
        clear: function() {
            var c = this.get("highlightGraphic"),
                b = this.get("graphicsLayer");
            c && (b ? b.remove(c) : this.get("map").graphics.remove(c), this.set("highlightGraphic", null))
        },
        locate: function() {
            this.get("useTracking") && this.set("tracking", !this.get("tracking"));
            return this._locate()
        },
        show: function() {
            this.set("visible", !0)
        },
        hide: function() {
            this.set("visible", !1)
        },
        _setTitle: function() {
            this.get("useTracking") ? this.get("tracking") ? h.set(this._locateNode, "title", this._i18n.widgets.locateButton.locate.stopTracking) : h.set(this._locateNode, "title", this._i18n.widgets.locateButton.locate.tracking) : h.set(this._locateNode, "title", this._i18n.widgets.locateButton.locate.title)
        },
        _removeWatchPosition: function() {
            this.get("watchId") && (navigator.geolocation.clearWatch(this.get("watchId")), this.set("watchId", null))
        },
        _stopTracking: function() {
            e.remove(this._locateNode, this._css.tracking);
            this._removeWatchPosition();
            this._hideLoading()
        },
        _startTracking: function() {
            e.add(this._locateNode, this._css.tracking);
            this._removeWatchPosition();
            var c = navigator.geolocation.watchPosition(d.hitch(this, function(b) {
                    this._setPosition(b).then(d.hitch(this, function(a) {
                        this._locateEvent(a)
                    }), d.hitch(this, function(a) {
                        a || (a = Error("LocateButton::Error setting the position."));
                        this._locateError(a)
                    }))
                }), d.hitch(this, function(b) {
                    b || (b = Error("LocateButton::Could not get tracking position."));
                    this._locateError(b)
                }),
                this.get("geolocationOptions"));
            this.set("watchId", c)
        },
        _getCurrentPosition: function() {
            var c = new g,
                b = setTimeout(d.hitch(this, function() {
                    clearTimeout(b);
                    c.reject(Error("LocateButton::time expired for getting location."))
                }), this.get("timeout"));
            navigator.geolocation.getCurrentPosition(d.hitch(this, function(a) {
                clearTimeout(b);
                this._setPosition(a).then(d.hitch(this, function(a) {
                    c.resolve(a)
                }), d.hitch(this, function(a) {
                    a || (a = Error("LocateButton::Error setting map position."));
                    c.reject(a)
                }))
            }), d.hitch(this,
                function(a) {
                    a || (a = Error("LocateButton::Could not get current position."));
                    c.reject(a)
                }), this.get("geolocationOptions"));
            return c.promise
        },
        _locate: function() {
            var c = new g;
            this._showLoading();
            if (navigator.geolocation) this.get("useTracking") ? this.get("tracking") ? (this._startTracking(), c.resolve({
                tracking: !0
            })) : (this._stopTracking(), c.resolve({
                tracking: !1
            })) : this._getCurrentPosition().then(d.hitch(this, function(a) {
                this._locateEvent(a);
                c.resolve(a)
            }), d.hitch(this, function(a) {
                a || (a = Error("LocateButton::Could not get current position."));
                this._locateError(a);
                c.reject(a)
            }));
            else {
                var b = Error("LocateButton::geolocation unsupported");
                this._locateError(b);
                c.reject(b)
            }
            this._setTitle();
            return c.promise
        },
        _projectPoint: function(c) {
            var b = new g,
                a = this.get("map").spatialReference,
                f = a.wkid;
            k.defaults.geometryService && 3857 !== f && 102100 !== f && 102113 !== f && 4326 !== f ? k.defaults.geometryService.project([c], a).then(d.hitch(this, function(a) {
                a && a.length ? b.resolve(a[0]) : b.reject(Error("LocateButton::Point was not projected."))
            }), function(a) {
                a || (a = Error("LocateButton::please specify a geometry service on esri/config to project."));
                b.reject(a)
            }) : b.resolve(c);
            return b.promise
        },
        _setPosition: function(c) {
            var b = new g,
                a;
            if (c && c.coords) {
                a = c.coords.latitude;
                var f = c.coords.longitude,
                    e = this.get("scale") || c.coords.accuracy || 5E4;
                (a = new w([f, a], new x({
                    wkid: 4326
                }))) ? this._projectPoint(a).then(d.hitch(this, function(a) {
                    var f = this._createEvent(a, e, c);
                    this.get("setScale") && this.get("map").setScale(e);
                    this.get("centerAt") ? this.get("map").centerAt(a).then(d.hitch(this, function() {
                        b.resolve(f)
                    }), d.hitch(this, function(a) {
                        a || (a = Error("LocateButton::Could not center map."));
                        b.reject(a)
                    })) : b.resolve(f)
                }), d.hitch(this, function(a) {
                    a || (a = Error("LocateButton::Error projecting point."));
                    b.reject(a)
                })) : (a = Error("LocateButton::Invalid point"), b.reject(a))
            } else a = Error("LocateButton::Invalid position"), b.reject(a);
            return b.promise
        },
        _createEvent: function(c, b, a) {
            var d = {
                position: a
            };
            return {
                graphic: new y(c, this.get("symbol"), d, this.get("infoTemplate")),
                scale: b,
                position: a
            }
        },
        _locateEvent: function(c) {
            if (c.graphic) {
                var b = this.get("highlightGraphic"),
                    a = this.get("graphicsLayer");
                b ? (b.setGeometry(c.graphic.geometry),
                    b.setAttributes(c.graphic.attributes), b.setInfoTemplate(c.graphic.infoTemplate), b.setSymbol(c.graphic.symbol)) : (b = c.graphic, this.get("highlightLocation") && (a ? a.add(b) : this.get("map").graphics.add(b)));
                this.set("highlightGraphic", b)
            }
            this._hideLoading();
            this.emit("locate", c)
        },
        _locateError: function(c) {
            this._hideLoading();
            this.emit("locate", {
                graphic: null,
                scale: null,
                position: null,
                error: c
            })
        },
        _showLoading: function() {
            this.get("useTracking") || e.add(this._locateNode, this._css.loading)
        },
        _hideLoading: function() {
            this.get("useTracking") ||
                e.remove(this._locateNode, this._css.loading)
        },
        _init: function() {
            this._visible();
            this._setTitle();
            this.get("tracking") && this.get("useTracking") && this._locate();
            this.set("loaded", !0);
            this.emit("load", {})
        },
        _updateThemeWatch: function(c, b, a) {
            e.remove(this.domNode, b);
            e.add(this.domNode, a)
        },
        _visible: function() {
            this.get("visible") ? m.set(this.domNode, "display", "block") : m.set(this.domNode, "display", "none")
        }
    })
});