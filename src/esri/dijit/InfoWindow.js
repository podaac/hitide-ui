//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/window", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/sniff", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dijit/_Widget", "dijit/_Templated", "dijit/_Container", "../kernel", "../domUtils", "../InfoWindowBase", "./_EventedWidget", "dojo/text!./templates/InfoWindow.html"], function(l, m, h, n, p, q, x, y, k, g, f, r, s, t, z, e, u, v, w) {
    var d = l([v, r, s, t, u], {
        declaredClass: "esri.dijit.InfoWindow",
        isContainer: !0,
        templateString: w,
        anchor: "upperright",
        fixedAnchor: null,
        coords: null,
        isShowing: !0,
        isContentShowing: !0,
        isTitleBarShowing: !0,
        width: 250,
        height: 150,
        title: "Info Window",
        setMap: function(a) {
            this.inherited(arguments);
            g.place(this.domNode, a.root)
        },
        startup: function() {
            if (!this._started) {
                this.inherited(arguments);
                this._ANCHORS = [d.ANCHOR_UPPERRIGHT, d.ANCHOR_LOWERRIGHT, d.ANCHOR_LOWERLEFT, d.ANCHOR_UPPERLEFT];
                if (7 > q("ie")) {
                    var a = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled\x3d'true', sizingMethod\x3d'crop', src\x3d'" + f.getComputedStyle(this._sprite).backgroundImage.replace(/url\(\"/i,
                            "").replace(/\"\)/, "") + "')",
                        b = g.create("div", null, n.body());
                    f.set(b, {
                        width: "1px",
                        height: "1px",
                        display: "none",
                        backgroundImage: "none",
                        filter: a
                    });
                    var c = setTimeout(function() {
                        g.destroy(b);
                        clearTimeout(c);
                        c = b = null
                    }, 100);
                    p.query(".sprite", this.domNode).forEach(function(b) {
                        b.style.backgroundImage = "none";
                        b.style.filter = a
                    })
                }
                this.resize(this.width, this.height);
                this.hide()
            }
        },
        destroy: function() {
            this._destroyed || (this.__unregisterMapListeners(), this.destroyDijits(this._title), this.destroyDijits(this._content),
                this._title.innerHTML = this._content.innerHTML = "", this.inherited(arguments))
        },
        resize: function(a, b) {
            if (a && b) {
                var c = f.set;
                c(this._topleft, {
                    height: b + "px",
                    marginLeft: a + "px"
                });
                c(this._topright, {
                    width: a + "px",
                    height: b + "px"
                });
                c(this._user, "width", a - 8 + "px");
                c(this._hide, "marginLeft", a - 22 + "px");
                c(this._title, "width", a - 25 + "px");
                c(this._content, "height", b - 37 + "px");
                c(this._bottomleft, {
                    marginLeft: a + "px",
                    marginTop: b + "px"
                });
                c(this._bottomright, {
                    width: a - 5 + "px",
                    marginTop: b + "px"
                });
                this.width = a;
                this.height = b;
                this.coords &&
                    this._adjustPosition(this.coords, this.anchor);
                this.onResize(a, b)
            }
        },
        _adjustPosition: function(a, b) {
            var c = f.set;
            c(this._infowindow, {
                left: Math.round(a.x) + "px",
                top: Math.round(a.y) + "px"
            });
            b === d.ANCHOR_UPPERLEFT ? c(this._window, {
                left: null,
                right: this.width + 18 + "px",
                top: null,
                bottom: this.height + 50 + "px"
            }) : b === d.ANCHOR_UPPERRIGHT ? c(this._window, {
                left: "6px",
                right: null,
                top: null,
                bottom: this.height + 50 + "px"
            }) : b === d.ANCHOR_LOWERRIGHT ? c(this._window, {
                left: "6px",
                right: null,
                top: "43px",
                bottom: null
            }) : b === d.ANCHOR_LOWERLEFT &&
                c(this._window, {
                    left: null,
                    right: this.width + 18 + "px",
                    top: "43px",
                    bottom: null
                })
        },
        _getAnchor: function(a) {
            var b = this.map;
            return b && a ? (a.y < b.height / 2 ? "lower" : "upper") + (a.x < b.width / 2 ? "right" : "left") : "upperright"
        },
        show: function(a, b, c) {
            if (a) {
                a.spatialReference ? (this.mapCoords = a, a = this.coords = this.map.toScreen(a, !0)) : (this.mapCoords = null, this.coords = a);
                var d = this.map._getFrameWidth();
                if (-1 !== d && (a.x %= d, 0 > a.x && (a.x += d), this.map.width > d))
                    for (var f = (this.map.width - d) / 2; a.x < f;) a.x += d;
                if (!b || -1 === h.indexOf(this._ANCHORS,
                    b)) b = this._getAnchor(a);
                k.remove(this._pointer, this.anchor);
                b = this.anchor = this.fixedAnchor || b;
                this._adjustPosition(a, b);
                k.add(this._pointer, b);
                e.show(this.domNode);
                this.isShowing = !0;
                if (!c) this.onShow()
            }
        },
        hide: function(a, b) {
            e.hide(this.domNode);
            this.isShowing = !1;
            if (!b) this.onHide()
        },
        showTitleBar: function() {
            e.show(this._titlebar);
            e.show(this._border);
            this.isTitleBarShowing = !0
        },
        hideTitleBar: function() {
            e.hide(this._titlebar);
            e.hide(this._border);
            this.isTitleBarShowing = !1
        },
        showContent: function() {
            e.show(this._content);
            e.show(this._border);
            this.isContentShowing = !0
        },
        hideContent: function() {
            e.hide(this._content);
            e.hide(this._border);
            this.isContentShowing = !1
        },
        move: function(a, b) {
            b ? a = this.coords.offset(a.x, a.y) : (this.coords = a, this.mapCoords && (this.mapCoords = this.map.toMap(a)));
            f.set(this._infowindow, {
                left: Math.round(a.x) + "px",
                top: Math.round(a.y) + "px"
            })
        },
        setFixedAnchor: function(a) {
            a && -1 === h.indexOf(this._ANCHORS, a) || (this.fixedAnchor = a, this.isShowing && this.show(this.mapCoords || this.coords, a), this.onAnchorChange(a))
        },
        setTitle: function(a) {
            this.destroyDijits(this._title);
            this.__setValue("_title", a);
            return this
        },
        setContent: function(a) {
            this.destroyDijits(this._content);
            this.__setValue("_content", a);
            return this
        },
        onShow: function() {
            this.__registerMapListeners();
            this.startupDijits(this._title);
            this.startupDijits(this._content)
        },
        onHide: function() {
            this.__unregisterMapListeners()
        },
        onResize: function() {},
        onAnchorChange: function() {}
    });
    m.mixin(d, {
        ANCHOR_UPPERRIGHT: "upperright",
        ANCHOR_LOWERRIGHT: "lowerright",
        ANCHOR_LOWERLEFT: "lowerleft",
        ANCHOR_UPPERLEFT: "upperleft"
    });
    return d
});