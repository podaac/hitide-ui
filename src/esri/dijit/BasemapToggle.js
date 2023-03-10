//>>built
define(["require", "dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on", "dojo/text!./templates/BasemapToggle.html", "dojo/i18n!../nls/jsapi", "dojo/dom-class", "dojo/dom-style", "dojo/dom-construct"], function(d, m, n, f, t, u, p, q, r, h, s, e, g, k, l) {
    d = d.toUrl(".");
    return n("esri.dijit.BasemapToggle", [p, r, m], {
        templateString: s,
        options: {
            theme: "BasemapToggle",
            map: null,
            visible: !0,
            basemap: "hybrid",
            defaultBasemap: "streets",
            basemaps: {
                streets: {
                    label: e.widgets.basemapToggle.basemapLabels.streets,
                    url: d + "/images/basemaps/streets.jpg"
                },
                satellite: {
                    label: e.widgets.basemapToggle.basemapLabels.satellite,
                    url: d + "/images/basemaps/satellite.jpg"
                },
                hybrid: {
                    label: e.widgets.basemapToggle.basemapLabels.hybrid,
                    url: d + "/images/basemaps/hybrid.jpg"
                },
                topo: {
                    label: e.widgets.basemapToggle.basemapLabels.topo,
                    url: d + "/images/basemaps/topo.jpg"
                },
                gray: {
                    label: e.widgets.basemapToggle.basemapLabels.gray,
                    url: d + "/images/basemaps/gray.jpg"
                },
                oceans: {
                    label: e.widgets.basemapToggle.basemapLabels.oceans,
                    url: d + "/images/basemaps/oceans.jpg"
                },
                "national-geographic": {
                    label: e.widgets.basemapToggle.basemapLabels["national-geographic"],
                    url: d + "/images/basemaps/national-geographic.jpg"
                },
                osm: {
                    label: e.widgets.basemapToggle.basemapLabels.osm,
                    url: d + "/images/basemaps/osm.jpg"
                }
            }
        },
        constructor: function(a, b) {
            var c = f.mixin({}, this.options, a);
            this.domNode = b;
            this._i18n = e;
            this.set("map", c.map);
            this.set("theme", c.theme);
            this.set("visible", c.visible);
            this.set("basemaps", c.basemaps);
            this.set("basemap", c.basemap);
            this.set("defaultBasemap", c.defaultBasemap);
            this.watch("theme",
                this._updateThemeWatch);
            this.watch("visible", this._visible);
            this._css = {
                container: "basemapContainer",
                toggleButton: "toggleButton",
                basemapImage: "basemapImage",
                basemapTitle: "basemapTitle"
            }
        },
        postCreate: function() {
            this.inherited(arguments);
            this.own(h(this._toggleNode, q, f.hitch(this, this.toggle)))
        },
        startup: function() {
            this.map || (this.destroy(), console.log("BasemapToggle::map required"));
            if (this.map.loaded) this._init();
            else h.once(this.map, "load", f.hitch(this, function() {
                this._init()
            }))
        },
        destroy: function() {
            this.inherited(arguments)
        },
        show: function() {
            this.set("visible", !0)
        },
        hide: function() {
            this.set("visible", !1)
        },
        toggle: function() {
            var a = this.map.getBasemap();
            a && this.set("defaultBasemap", a);
            var a = this.get("defaultBasemap"),
                b = this.get("basemap"),
                c = {
                    previousBasemap: a,
                    currentBasemap: b
                };
            a !== b ? (this.map.setBasemap(b), this.set("basemap", a), this._basemapChange()) : c.error = Error("BasemapToggle::Current basemap is same as new basemap");
            this.emit("toggle", c)
        },
        _init: function() {
            this._visible();
            this._basemapChange();
            this.own(h(this.map, "basemap-change",
                f.hitch(this, function() {
                    this._basemapChange()
                })));
            this.set("loaded", !0);
            this.emit("load", {})
        },
        _getBasemapInfo: function(a) {
            var b = this.get("basemaps");
            if (b && b.hasOwnProperty(a)) return b[a]
        },
        _updateImage: function() {
            var a = this.get("basemap"),
                a = this._getBasemapInfo(a),
                b;
            b = "" + ('\x3cdiv class\x3d"' + this._css.basemapImage + '"\x3e\x3cimg alt\x3d"' + a.label + '" src\x3d"' + a.url + '" /\x3e\x3c/div\x3e');
            b += '\x3cdiv class\x3d"' + this._css.basemapTitle + '"\x3e' + a.label + "\x3c/div\x3e";
            l.empty(this._toggleNode);
            l.place(b,
                this._toggleNode, "only")
        },
        _basemapChange: function() {
            var a = this.map.getBasemap();
            a && this.set("defaultBasemap", a);
            var a = this.get("defaultBasemap"),
                b = this.get("basemap");
            this._updateImage();
            g.remove(this._toggleNode, a);
            g.add(this._toggleNode, b)
        },
        _updateThemeWatch: function(a, b, c) {
            this.get("loaded") && (g.remove(this.domNode, b), g.add(this.domNode, c))
        },
        _visible: function() {
            this.get("visible") ? k.set(this.domNode, "display", "block") : k.set(this.domNode, "display", "none")
        }
    })
});