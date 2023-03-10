//>>built
define(["../../declare", "dojo/_base/fx", "dojo/_base/lang", "dojo/aspect", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dojo/fx", "dojo/has", "dojox/gesture/swipe", "dojox/mvc/Templated", "dojo/text!./templates/InfographicsCarousel.html", "./Infographic", "dojo/on", "dojo/dom-class", "./InfographicsOptions", "./theme", "../../tasks/geoenrichment/GeoenrichmentTask", "../../tasks/geoenrichment/GeometryStudyArea", "./config", "../_EventedWidget", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/form/Select"], function(l, t, d,
    u, v, w, g, m, p, x, y, z, I, n, q, A, B, C, D, r, E, J) {
    function F(a, b, c) {
        function f(a, b, d, f, e) {
            var g = {};
            g[b] = {
                start: d,
                end: f
            };
            e && (g[b].units = e);
            return t.animateProperty({
                node: a,
                properties: g,
                duration: c
            })
        }
        if (b && c) {
            var e = a.cloneNode(!0);
            a.parentNode.insertBefore(e, a);
            var d;
            if (!w.isBodyLtr()) switch (b) {
                case h:
                    b = k;
                    break;
                case k:
                    b = h
            }
            switch (b) {
                case s:
                    d = m.combine([f(e, "opacity", 1, 0), f(a, "opacity", 0, 1)]);
                    break;
                case h:
                    d = m.combine([f(e, "left", 0, -100, "%"), f(a, "left", 100, 0, "%")]);
                    break;
                case k:
                    d = m.combine([f(e, "left", 0, 100, "%"),
                        f(a, "left", -100, 0, "%")
                    ])
            }
            u.after(d, "onEnd", function() {
                v.destroy(e)
            });
            d.play()
        }
    }
    var s = "f",
        h = "sf",
        k = "sb",
        G = l(x.Swipe, {
            _process: function(a, b, c) {
                c._locking = c._locking || {};
                !c._locking[this.defaultEvent] && !this.isLocked(c.currentTarget) && (c._locking[this.defaultEvent] = !0, this[b](a.data, c))
            }
        }),
        H = l([], {
            _swipe: null,
            _node: null,
            _rtl: null,
            _ltr: null,
            _distance: 50,
            constructor: function(a, b, c, f) {
                this._node = a;
                this._rtl = b;
                this._ltr = c;
                f && (this._distance = f);
                this._swipe = new G;
                n(this._node, this._swipe, function() {});
                n(this._node,
                    this._swipe.end, d.hitch(this, "_end"))
            },
            _end: function(a) {
                a = a.dx;
                Math.abs(a) < this._distance || (0 > a && this._rtl ? this._rtl() : this._ltr && this._ltr())
            }
        });
    return l("esri.dijit.geoenrichment.InfographicsCarousel", [y, E], {
        templateString: z,
        studyArea: null,
        outSR: null,
        studyAreaTitle: null,
        selectedIndex: 0,
        options: null,
        expanded: !0,
        returnGeometry: !1,
        animDuration: 200,
        _items: null,
        _loading: null,
        _infographic: null,
        _getCountryPromise: null,
        _countryForStudyArea: !1,
        _pendingAnimation: null,
        _pendingReload: !0,
        _eventMap: {
            resize: ["size"],
            "data-ready": ["provider"],
            "data-error": ["error"]
        },
        postCreate: function() {
            this.inherited(arguments);
            setTimeout(d.hitch(this, this._onResize), 0);
            p("touch") && new H(this._container, d.hitch(this, "_slideForward"), d.hitch(this, "_slideBack"));
            p("esri-touch") && n(this.domNode, "touchmove", function(a) {
                a.stopPropagation()
            })
        },
        startup: function() {
            this.inherited(arguments);
            this.options || this.set("options", new A)
        },
        _setReturnGeometryAttr: function(a) {
            this._set("returnGeometry", a);
            this._infographic.set("returnGeometry",
                a)
        },
        _setStudyAreaAttr: function(a) {
            this._countryForStudyArea = !1;
            this._set("studyArea", a);
            this._getCountryPromise || (this._infographic.get("countryID") ? this._infographic.set("studyArea", a) : this._getCountry());
            this._updateSubtitle()
        },
        _setOutSR: function(a) {
            this._set("outSR", a);
            this._infographic.set("outSR", a)
        },
        _getCountry: function() {
            if (!this._getCountryPromise) {
                var a = new C(r.server);
                a.token = r.token;
                var b = this.get("studyArea");
                this._getCountryPromise = a.getCountries(b.geometry);
                this._getCountryPromise.always(d.hitch(this,
                    function() {
                        this._getCountryPromise = null
                    }));
                this._getCountryPromise.then(d.hitch(this, this._onGetCountryComplete, b), d.hitch(this, this._onDataError))
            }
        },
        _onGetCountryComplete: function(a, b) {
            this.studyArea === a && (this._countryForStudyArea = !0);
            this._infographic.set("countryID", b[0]);
            this._infographic.set("studyArea", this.studyArea);
            this._getReports()
        },
        _setStudyAreaTitleAttr: function(a) {
            this._set("studyAreaTitle", a);
            this._updateSubtitle()
        },
        _updateSubtitle: function() {
            this._infographic.set("subtitle", this.studyArea instanceof D ? "polygon" == this.studyArea.geometry.type ? this.studyAreaTitle ? this.studyAreaTitle : "${name}" : this.studyAreaTitle ? "\x3cdiv\x3e${address}\x3c/div\x3e\x3cdiv\x3e" + this.studyAreaTitle + " (${name})\x3c/div\x3e" : "\x3cdiv\x3e${address}\x3c/div\x3e\x3cdiv\x3e${name}\x3c/div\x3e" : "\x3cdiv\x3e${address}\x3c/div\x3e\x3cdiv\x3e${name}\x3c/div\x3e")
        },
        _setOptionsAttr: function(a) {
            this._set("options", a);
            this._getReports();
            this._infographic.set("studyAreaOptions", a.studyAreaOptions);
            B.set(this.domNode, this.options.theme)
        },
        _getReports: function() {
            if (this.options) {
                var a = this._infographic.get("countryID");
                a && this.options.getItems(a).then(d.hitch(this, this._fillReports), d.hitch(this, this._onDataError))
            }
        },
        _fillReports: function(a) {
            this._items = [];
            this._select.removeOption(this._select.getOptions());
            for (var b = 0; b < a.length; b++)
                if (a[b].isVisible) {
                    var c = a[b];
                    this._items.push(c);
                    this._select.addOption({
                        value: (this._items.length - 1).toString(),
                        label: c.title
                    })
                }
            this._infographic.set("cacheLimit", this._items.length);
            this._titlePane.style.visibility =
                "";
            this._updateSelection()
        },
        _setExpandedAttr: function(a) {
            this._set("expanded", a);
            a ? q.remove(this.domNode, "Collapsed") : q.add(this.domNode, "Collapsed");
            this._infographic.set("expanded", a);
            this._pendingReload = !0
        },
        _setSelectedIndexAttr: function(a) {
            this.selectedIndex != a && (this._set("selectedIndex", a), this._updateSelection())
        },
        _updateSelection: function() {
            if (this._items) {
                this._pendingAnimation || (this._pendingAnimation = s);
                this._pendingReload = !0;
                var a = this._items[this.selectedIndex];
                this._select.set("value",
                    this.selectedIndex);
                this._infographic.set("type", a.type);
                this._infographic.set("variables", a.variables)
            }
        },
        _onDataReady: function(a) {
            var b = !1,
                c = a.getData();
            if (0 < c.features.length)
                for (var d = c.features[0], e = 0; e < c.fields.length; e++)
                    if (c.fields[e].fullName && d.attributes[c.fields[e].name]) {
                        b = !0;
                        break
                    }
            b ? (F(this._infographic.domNode, this._pendingAnimation, this.animDuration), this._pendingAnimation = null, this.onDataReady(a)) : this._countryForStudyArea || (this._infographic.set("variables", null), a.stop(), this._getCountry())
        },
        onDataReady: function(a) {},
        _onDataLoad: function() {
            this._getCountryPromise || (this._hideProgress(), this.onDataLoad())
        },
        onDataLoad: function() {},
        _onDataError: function(a) {
            this._hideProgress();
            this.onDataError(a)
        },
        onDataError: function(a) {},
        _showProgress: function() {
            this._pendingReload ? (g.set(this._reloadProgress, "display", ""), this._pendingReload = !1) : g.set(this._updateProgress, "display", "")
        },
        _hideProgress: function() {
            g.set(this._reloadProgress, "display", "none");
            g.set(this._updateProgress, "display", "none")
        },
        _slideBack: function() {
            this._pendingAnimation = k;
            this._infographic.set("effect", "slideBack");
            var a = this.get("selectedIndex") - 1;
            0 > a && (a = this._items.length - 1);
            this.set("selectedIndex", a)
        },
        _slideForward: function() {
            this._pendingAnimation = h;
            var a = this.get("selectedIndex") + 1;
            a >= this._items.length && (a = 0);
            this.set("selectedIndex", a)
        },
        _onSelectChange: function() {
            this.set("selectedIndex", +this._select.get("value"))
        },
        _onResize: function() {
            this.onResize([this.domNode.scrollWidth, this.domNode.scrollHeight])
        },
        onResize: function(a) {}
    })
});