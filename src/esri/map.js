//>>built
define(["require", "dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/on", "dojo/aspect", "dojo/dom", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dijit/registry", "./kernel", "./config", "./sniff", "./lang", "./_coremap", "./MapNavigationManager"], function(s, J, K, A, n, r, B, C, L, D, f, E, M, N, O, v, F, e, p, P, Q) {
    var x = {
            up: "panUp",
            right: "panRight",
            down: "panDown",
            left: "panLeft"
        },
        G = {
            upperRight: "panUpperRight",
            lowerRight: "panLowerRight",
            lowerLeft: "panLowerLeft",
            upperLeft: "panUpperLeft"
        },
        h = A.connect,
        l = A.disconnect,
        m = E.create,
        q = N.set,
        y = n.hitch,
        t = M.getMarginBox,
        H = J.deprecated,
        z = n.mixin,
        I = 0;
    return K(P, {
        declaredClass: "esri.Map",
        constructor: function(a, c) {
            z(this, {
                _slider: null,
                _navDiv: null,
                _mapParams: z({
                    attributionWidth: 0.45,
                    slider: !0,
                    nav: !1,
                    logo: !0,
                    sliderStyle: "small",
                    sliderPosition: "top-left",
                    sliderOrientation: "vertical",
                    autoResize: !0
                }, c || {})
            });
            z(this, {
                isDoubleClickZoom: !1,
                isShiftDoubleClickZoom: !1,
                isClickRecenter: !1,
                isScrollWheelZoom: !1,
                isPan: !1,
                isRubberBandZoom: !1,
                isKeyboardNavigation: !1,
                isPanArrows: !1,
                isZoomSlider: !1
            });
            n.isFunction(v._css) && (v._css = v._css(this._mapParams.force3DTransforms), this.force3DTransforms = this._mapParams.force3DTransforms);
            var b = e("esri-transforms") && e("esri-transitions");
            this.navigationMode = this._mapParams.navigationMode || b && "css-transforms" || "classic";
            "css-transforms" === this.navigationMode && !b && (this.navigationMode = "classic");
            this.fadeOnZoom = p.isDefined(this._mapParams.fadeOnZoom) ? this._mapParams.fadeOnZoom : "css-transforms" === this.navigationMode;
            "css-transforms" !== this.navigationMode && (this.fadeOnZoom = !1);
            this.setMapCursor("default");
            this.smartNavigation = c && c.smartNavigation;
            if (!p.isDefined(this.smartNavigation) && e("mac") && !e("esri-touch") && !e("esri-pointer") && !(3.5 >= e("ff"))) {
                var d = navigator.userAgent.match(/Mac\s+OS\s+X\s+([\d]+)(\.|\_)([\d]+)\D/i);
                d && (p.isDefined(d[1]) && p.isDefined(d[3])) && (b = parseInt(d[1], 10), d = parseInt(d[3], 10), this.smartNavigation = 10 < b || 10 === b && 6 <= d)
            }
            this.showAttribution = p.isDefined(this._mapParams.showAttribution) ?
                this._mapParams.showAttribution : !0;
            this._onLoadHandler_connect = h(this, "onLoad", this, "_onLoadInitNavsHandler");
            var k = m("div", {
                "class": "esriControlsBR" + (this._mapParams.nav ? " withPanArrows" : "")
            }, this.root);
            if (this.showAttribution)
                if (b = n.getObject("esri.dijit.Attribution", !1)) this._initAttribution(b, k);
                else {
                    var w = I++,
                        g = this;
                    this._rids && this._rids.push(w);
                    s(["./dijit/Attribution"], function(a) {
                        var b = g._rids ? r.indexOf(g._rids, w) : -1; - 1 !== b && (g._rids.splice(b, 1), g._initAttribution(a, k))
                    })
                }
            this._mapParams.logo &&
                (b = {}, 6 === e("ie") && (b.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled\x3d'true', sizingMethod\x3d'crop', src\x3d'" + s.toUrl("./images/map/logo-med.png") + "')"), this._ogol = m("div", {
                style: b
            }, k), this._setLogoSize(), this._onMapResizeLogo_connect = h(this, "onResize", this, "_setLogoSize"), !e("esri-touch") && !e("esri-pointer") && (this._ogol_connect = h(this._ogol, "onclick", this, "_openLogoLink")));
            this.navigationManager = new Q(this);
            c && c.basemap && (this._onLoadFix = !0, this.setBasemap(c.basemap), this._onLoadFix = !1);
            if (this.autoResize = this._mapParams.autoResize) b = (b = O.getEnclosingWidget(this.container)) && b.resize ? b : window, d = y(this, this.resize), this._rszSignal = C.pausable(b, "resize", d), this._oriSignal = C.pausable(window, "orientationchange", d), L.after(b, "resize", d, !0)
        },
        _setLogoSize: function() {
            this._ogol && (25E4 > this.root.clientWidth * this.root.clientHeight ? (f.remove(this._ogol, "logo-med"), f.add(this._ogol, "logo-sm")) : (f.remove(this._ogol, "logo-sm"), f.add(this._ogol, "logo-med")))
        },
        _initAttribution: function(a, c) {
            var b =
                m("span", {
                    "class": "esriAttribution"
                }, c, "first");
            q(b, "maxWidth", Math.floor(this.width * this._mapParams.attributionWidth) + "px");
            this._connects.push(h(b, "onclick", function() {
                f.contains(this, "esriAttributionOpen") ? f.remove(this, "esriAttributionOpen") : this.scrollWidth > this.clientWidth && f.add(this, "esriAttributionOpen")
            }));
            this.attribution = new a({
                map: this
            }, b)
        },
        _cleanUp: function() {
            this.disableMapNavigation();
            this.navigationManager.destroy();
            var a = this._slider;
            a && (a.destroy && !a._destroyed) && a.destroy();
            var a =
                this._navDiv,
                c = this.attribution;
            a && E.destroy(a);
            c && c.destroy();
            this._connects.push(this._slider_connect, this._ogol_connect, this._rszSignal, this._oriSignal);
            r.forEach(this._connects, l);
            this.attribution = this.navigationManager = this._rids = this._connects = this._slider_connect = this._ogol_connect = this._rszSignal = this._oriSignal = null;
            this.inherited("_cleanUp", arguments)
        },
        _isPanningOrZooming: function() {
            return this.__panning || this.__zooming
        },
        _canZoom: function(a) {
            var c = this.getLevel();
            return !this.__tileInfo ||
                !(c === this.getMinZoom() && 0 > a || c === this.getMaxZoom() && 0 < a)
        },
        _onLoadInitNavsHandler: function() {
            this.enableMapNavigation();
            this._createNav();
            if ("small" === this._mapParams.sliderStyle || !this._createSlider) this._createSimpleSlider();
            else if (this._mapParams.slider) {
                var a = -1 !== this._getSliderClass(!0).indexOf("Horizontal"),
                    a = [a ? "dijit.form.HorizontalSlider" : "dijit.form.VerticalSlider", a ? "dijit.form.HorizontalRule" : "dijit.form.VerticalRule", a ? "dijit.form.HorizontalRuleLabels" : "dijit.form.VerticalRuleLabels"];
                if (r.some(a, function(a) {
                    return !n.getObject(a, !1)
                })) {
                    var a = r.map(a, function(a) {
                            return a.replace(/\./g, "/")
                        }),
                        c = I++,
                        b = this;
                    this._rids && this._rids.push(c);
                    s(a, function() {
                        var a = b._rids ? r.indexOf(b._rids, c) : -1; - 1 !== a && (b._rids.splice(a, 1), b._createSlider.apply(b, arguments))
                    })
                } else a = r.map(a, function(a) {
                    return n.getObject(a, !1)
                }), this._createSlider.apply(this, a)
            }
            l(this._onLoadHandler_connect)
        },
        _createNav: function() {
            if (this._mapParams.nav) {
                var a, c, b, d = f.add,
                    k = this.id;
                this._navDiv = m("div", {
                        id: k + "_navdiv"
                    },
                    this.root);
                d(this._navDiv, "navDiv");
                var w = this.width / 2,
                    g = this.height / 2,
                    e;
                for (b in x) c = x[b], a = m("div", {
                    id: k + "_pan_" + b
                }, this._navDiv), d(a, "fixedPan " + c), "up" === b || "down" === b ? (e = parseInt(t(a).w, 10) / 2, q(a, {
                    left: w - e + "px",
                    zIndex: 30
                })) : (e = parseInt(t(a).h, 10) / 2, q(a, {
                    top: g - e + "px",
                    zIndex: 30
                })), this._connects.push(h(a, "onclick", y(this, this[c])));
                this._onMapResizeNavHandler_connect = h(this, "onResize", this, "_onMapResizeNavHandler");
                for (b in G) c = G[b], a = m("div", {
                    id: k + "_pan_" + b,
                    style: {
                        zIndex: 30
                    }
                }, this._navDiv), d(a,
                    "fixedPan " + c), this._connects.push(h(a, "onclick", y(this, this[c])));
                this.isPanArrows = !0
            }
        },
        _onMapResizeNavHandler: function(a, c, b) {
            a = this.id;
            c /= 2;
            b /= 2;
            var d = D.byId,
                k, e, g;
            for (k in x) e = d(a + "_pan_" + k), "up" === k || "down" === k ? (g = parseInt(t(e).w, 10) / 2, q(e, "left", c - g + "px")) : (g = parseInt(t(e).h, 10) / 2, q(e, "top", b - g + "px"))
        },
        _createSimpleSlider: function() {
            if (this._mapParams.slider) {
                var a = this._slider = m("div", {
                        id: this.id + "_zoom_slider",
                        "class": this._getSliderClass(),
                        style: {
                            zIndex: 30
                        }
                    }),
                    c = e("esri-touch") && !e("ff") ?
                    "touchstart" : e("esri-pointer") ? navigator.msPointerEnabled ? "MSPointerDown" : "pointerdown" : "onclick",
                    b = m("div", {
                        "class": "esriSimpleSliderIncrementButton"
                    }, a),
                    d = m("div", {
                        "class": "esriSimpleSliderDecrementButton"
                    }, a);
                this._incButton = b;
                this._decButton = d;
                this._simpleSliderZoomHandler(null, null, null, this.getLevel());
                b.innerHTML = "+";
                d.innerHTML = "\x26ndash;";
                8 > e("ie") && f.add(d, "dj_ie67Fix");
                this._connects.push(h(b, c, this, this._simpleSliderChangeHandler));
                this._connects.push(h(d, c, this, this._simpleSliderChangeHandler));
                "touchstart" == c && (this._connects.push(h(b, "onclick", this, this._simpleSliderChangeHandler)), this._connects.push(h(d, "onclick", this, this._simpleSliderChangeHandler)));
                (-1 < this.getMaxZoom() || -1 < this.getMinZoom()) && this._connects.push(h(this, "onZoomEnd", this, this._simpleSliderZoomHandler));
                10 > e("ie") && D.setSelectable(a, !1);
                this.root.appendChild(a);
                this.isZoomSlider = !0
            }
        },
        _simpleSliderChangeHandler: function(a) {
            B.stop(a);
            a = -1 !== a.currentTarget.className.indexOf("IncrementButton") ? !0 : !1;
            this._extentUtil({
                numLevels: a ?
                    1 : -1
            })
        },
        _simpleSliderZoomHandler: function(a, c, b, d) {
            var e;
            a = this._incButton;
            c = this._decButton; - 1 < d && d === this.getMaxZoom() ? e = a : -1 < d && d === this.getMinZoom() && (e = c);
            e ? (f.add(e, "esriSimpleSliderDisabledButton"), f.remove(e === a ? c : a, "esriSimpleSliderDisabledButton")) : (f.remove(a, "esriSimpleSliderDisabledButton"), f.remove(c, "esriSimpleSliderDisabledButton"))
        },
        _getSliderClass: function(a) {
            a = a ? "Large" : "Simple";
            var c = this._mapParams.sliderOrientation,
                b = this._mapParams.sliderPosition || "",
                c = c && "horizontal" === c.toLowerCase() ?
                "esri" + a + "SliderHorizontal" : "esri" + a + "SliderVertical";
            if (b) switch (b.toLowerCase()) {
                case "top-left":
                    b = "esri" + a + "SliderTL";
                    break;
                case "top-right":
                    b = "esri" + a + "SliderTR";
                    break;
                case "bottom-left":
                    b = "esri" + a + "SliderBL";
                    break;
                case "bottom-right":
                    b = "esri" + a + "SliderBR"
            }
            return "esri" + a + "Slider " + c + " " + b
        },
        _createSlider: function(a, c, b) {
            if (this._mapParams.slider) {
                var d = m("div", {
                        id: this.id + "_zoom_slider"
                    }, this.root),
                    k = F.defaults.map,
                    f = this._getSliderClass(!0),
                    g = -1 !== f.indexOf("Horizontal"); - 1 !== f.indexOf("SliderTL") ||
                    f.indexOf("SliderBL"); - 1 !== f.indexOf("SliderTL") || f.indexOf("SliderTR");
                var l = this.getNumLevels();
                if (0 < l) {
                    var n, p, u = this._mapParams.sliderLabels,
                        t = !!u;
                    if (k = !1 !== u) {
                        var s = g ? "bottomDecoration" : "rightDecoration";
                        if (!u) {
                            u = [];
                            for (g = 0; g < l; g++) u[g] = ""
                        }
                        r.forEach([{
                            "class": "esriLargeSliderTicks",
                            container: s,
                            count: l,
                            dijitClass: c
                        }, {
                            "class": t && "esriLargeSliderLabels",
                            container: s,
                            count: l,
                            labels: u,
                            dijitClass: b
                        }], function(a) {
                            var b = m("div"),
                                e = a.dijitClass;
                            delete a.dijitClass;
                            d.appendChild(b);
                            e === c ? n = new e(a, b) : p =
                                new e(a, b)
                        })
                    }
                    a = this._slider = new a({
                        id: d.id,
                        "class": f,
                        minimum: this.getMinZoom(),
                        maximum: this.getMaxZoom(),
                        discreteValues: l,
                        value: this.getLevel(),
                        clickSelect: !0,
                        intermediateChanges: !0,
                        style: "z-index:30;"
                    }, d);
                    a.startup();
                    k && (n.startup(), p.startup());
                    this._slider_connect = h(a, "onChange", this, "_onSliderChangeHandler");
                    this._connects.push(h(this, "onExtentChange", this, "_onExtentChangeSliderHandler"));
                    this._connects.push(h(a._movable, "onFirstMove", this, "_onSliderMoveStartHandler"))
                } else {
                    a = this._slider = new a({
                        id: d.id,
                        "class": f,
                        minimum: 0,
                        maximum: 2,
                        discreteValues: 3,
                        value: 1,
                        clickSelect: !0,
                        intermediateChanges: k.sliderChangeImmediate,
                        style: "height:50px; z-index:30;"
                    }, d);
                    b = a.domNode.firstChild.childNodes;
                    for (g = 1; 3 >= g; g++) q(b[g], "visibility", "hidden");
                    a.startup();
                    this._slider_connect = h(a, "onChange", this, "_onDynSliderChangeHandler");
                    this._connects.push(h(this, "onExtentChange", this, "_onExtentChangeDynSliderHandler"))
                }
                b = a.decrementButton;
                a.incrementButton.style.outline = "none";
                b.style.outline = "none";
                a.sliderHandle.style.outline =
                    "none";
                a._onKeyPress = function() {};
                if (a = a._movable) {
                    var v = a.onMouseDown;
                    a.onMouseDown = function(a) {
                        9 > e("ie") && 1 !== a.button || v.apply(this, arguments)
                    }
                }
                this.isZoomSlider = !0
            }
        },
        _onSliderMoveStartHandler: function() {
            l(this._slider_connect);
            l(this._slidermovestop_connect);
            this._slider_connect = h(this._slider, "onChange", this, "_onSliderChangeDragHandler");
            this._slidermovestop_connect = h(this._slider._movable, "onMoveStop", this, "_onSliderMoveEndHandler")
        },
        _onSliderChangeDragHandler: function(a) {
            this._extentUtil({
                targetLevel: a
            })
        },
        _onSliderMoveEndHandler: function() {
            l(this._slider_connect);
            l(this._slidermovestop_connect)
        },
        _onSliderChangeHandler: function(a) {
            this.setLevel(a)
        },
        _updateSliderValue: function(a, c) {
            l(this._slider_connect);
            var b = this._slider,
                d = b._onChangeActive;
            b._onChangeActive = !1;
            b.set("value", a);
            b._onChangeActive = d;
            this._slider_connect = h(b, "onChange", this, c)
        },
        _onExtentChangeSliderHandler: function(a, c, b, d) {
            l(this._slidermovestop_connect);
            this._updateSliderValue(d.level, "_onSliderChangeHandler")
        },
        _onDynSliderChangeHandler: function(a) {
            this._extentUtil({
                numLevels: 0 <
                    a ? 1 : -1
            })
        },
        _onExtentChangeDynSliderHandler: function() {
            this._updateSliderValue(1, "_onDynSliderChangeHandler")
        },
        _openLogoLink: function(a) {
            window.open(F.defaults.map.logoLink, "_blank");
            B.stop(a)
        },
        enableMapNavigation: function() {
            this.navigationManager.enableNavigation()
        },
        disableMapNavigation: function() {
            this.navigationManager.disableNavigation()
        },
        enableDoubleClickZoom: function() {
            this.isDoubleClickZoom || (this.navigationManager.enableDoubleClickZoom(), this.isDoubleClickZoom = !0)
        },
        disableDoubleClickZoom: function() {
            this.isDoubleClickZoom &&
                (this.navigationManager.disableDoubleClickZoom(), this.isDoubleClickZoom = !1)
        },
        enableShiftDoubleClickZoom: function() {
            this.isShiftDoubleClickZoom || (H(this.declaredClass + ": Map.(enable/disable)ShiftDoubleClickZoom deprecated. Shift-Double-Click zoom behavior will not be supported.", null, "v2.0"), this.navigationManager.enableShiftDoubleClickZoom(), this.isShiftDoubleClickZoom = !0)
        },
        disableShiftDoubleClickZoom: function() {
            this.isShiftDoubleClickZoom && (H(this.declaredClass + ": Map.(enable/disable)ShiftDoubleClickZoom deprecated. Shift-Double-Click zoom behavior will not be supported.",
                null, "v2.0"), this.navigationManager.disableShiftDoubleClickZoom(), this.isShiftDoubleClickZoom = !1)
        },
        enableClickRecenter: function() {
            this.isClickRecenter || (this.navigationManager.enableClickRecenter(), this.isClickRecenter = !0)
        },
        disableClickRecenter: function() {
            this.isClickRecenter && (this.navigationManager.disableClickRecenter(), this.isClickRecenter = !1)
        },
        enablePan: function() {
            this.isPan || (this.navigationManager.enablePan(), this.isPan = !0)
        },
        disablePan: function() {
            this.isPan && (this.navigationManager.disablePan(),
                this.isPan = !1)
        },
        enableRubberBandZoom: function() {
            this.isRubberBandZoom || (this.navigationManager.enableRubberBandZoom(), this.isRubberBandZoom = !0)
        },
        disableRubberBandZoom: function() {
            this.isRubberBandZoom && (this.navigationManager.disableRubberBandZoom(), this.isRubberBandZoom = !1)
        },
        enableKeyboardNavigation: function() {
            this.isKeyboardNavigation || (this.navigationManager.enableKeyboardNavigation(), this.isKeyboardNavigation = !0)
        },
        disableKeyboardNavigation: function() {
            this.isKeyboardNavigation && (this.navigationManager.disableKeyboardNavigation(),
                this.isKeyboardNavigation = !1)
        },
        enableScrollWheelZoom: function() {
            this.isScrollWheelZoom || (this.navigationManager.enableScrollWheelZoom(), this.isScrollWheelZoom = !0)
        },
        disableScrollWheelZoom: function() {
            this.isScrollWheelZoom && (this.navigationManager.disableScrollWheelZoom(), this.isScrollWheelZoom = !1)
        },
        showPanArrows: function() {
            this._navDiv && (this._navDiv.style.display = "block", this.isPanArrows = !0)
        },
        hidePanArrows: function() {
            this._navDiv && (this._navDiv.style.display = "none", this.isPanArrows = !1)
        },
        showZoomSlider: function() {
            this._slider &&
                (q(this._slider.domNode || this._slider, "visibility", "visible"), this.isZoomSlider = !0)
        },
        hideZoomSlider: function() {
            this._slider && (q(this._slider.domNode || this._slider, "visibility", "hidden"), this.isZoomSlider = !1)
        }
    })
});