//>>built
define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on", "dojo/Deferred", "dojo/text!./templates/HomeButton.html", "dojo/i18n!../nls/jsapi", "dojo/dom-class", "dojo/dom-style"], function(h, k, d, s, t, l, m, n, f, p, q, r, e, g) {
    return k("esri.dijit.HomeButton", [l, n, h], {
        templateString: q,
        options: {
            theme: "HomeButton",
            map: null,
            extent: null,
            fit: !1,
            visible: !0
        },
        constructor: function(c, a) {
            var b = d.mixin({}, this.options, c);
            this.domNode = a;
            this._i18n =
                r;
            this.set("map", b.map);
            this.set("theme", b.theme);
            this.set("visible", b.visible);
            this.set("extent", b.extent);
            this.set("fit", b.fit);
            this.watch("theme", this._updateThemeWatch);
            this.watch("visible", this._visible);
            this._css = {
                container: "homeContainer",
                home: "home",
                loading: "loading"
            }
        },
        postCreate: function() {
            this.inherited(arguments);
            this.own(f(this._homeNode, m, d.hitch(this, this.home)))
        },
        startup: function() {
            this.map || (this.destroy(), console.log("HomeButton::map required"));
            if (this.map.loaded) this._init();
            else f.once(this.map,
                "load", d.hitch(this, function() {
                    this._init()
                }))
        },
        destroy: function() {
            this.inherited(arguments)
        },
        home: function() {
            var c = new p,
                a = this.get("extent");
            this._showLoading();
            var b = {
                extent: a
            };
            a ? this.map.extent !== a ? this.map.setExtent(a, this.get("fit")).then(d.hitch(this, function() {
                this._hideLoading();
                this.emit("home", b);
                c.resolve(b)
            }), d.hitch(this, function(a) {
                a || (a = Error("HomeButton::Error setting map extent"));
                b.error = a;
                this.emit("home", b);
                c.reject(a)
            })) : (this._hideLoading(), this.emit("home", b), c.resolve(b)) :
                (this._hideLoading(), a = Error("HomeButton::home extent is undefined"), b.error = a, this.emit("home", b), c.reject(a));
            return c.promise
        },
        show: function() {
            this.set("visible", !0)
        },
        hide: function() {
            this.set("visible", !1)
        },
        _init: function() {
            this._visible();
            this.get("extent") || this.set("extent", this.map.extent);
            this.set("loaded", !0);
            this.emit("load", {})
        },
        _showLoading: function() {
            e.add(this._homeNode, this._css.loading)
        },
        _hideLoading: function() {
            e.remove(this._homeNode, this._css.loading)
        },
        _updateThemeWatch: function(c,
            a, b) {
            e.remove(this.domNode, a);
            e.add(this.domNode, b)
        },
        _visible: function() {
            this.get("visible") ? g.set(this.domNode, "display", "block") : g.set(this.domNode, "display", "none")
        }
    })
});