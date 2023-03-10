//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dojo/has", "dojo/query", "../kernel", "../lang", "../domUtils", "../units", "../SpatialReference", "../WKIDUnitConversion", "../geometry/Point", "../geometry/ScreenPoint", "../geometry/Polyline", "../geometry/geodesicUtils", "../geometry/webMercatorUtils", "../geometry/screenUtils", "../geometry/normalizeUtils", "dojo/i18n!../nls/jsapi"], function(D, m, l, g, n, p, E, s, G, k, H, t, u, v, w, q, x, y, z, A, r,
    B, C, F) {
    return D(null, {
        declaredClass: "esri.dijit.Scalebar",
        map: null,
        mapUnit: null,
        scalebarUnit: null,
        unitsDictionary: [],
        domNode: null,
        screenPt1: null,
        screenPt2: null,
        localStrings: F.widgets.scalebar,
        constructor: function(a, c) {
            this.metricScalebar = p.create("div", {
                innerHTML: "\x3cdiv class\x3d'esriScaleLabelDiv'\x3e\x3cdiv class\x3d'esriScalebarLabel esriScalebarLineLabel esriScalebarSecondNumber'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarLine esriScalebarMetricLine'\x3e\x3c/div\x3e"
            });
            this.englishScalebar =
                p.create("div", {
                    innerHTML: "\x3cdiv class\x3d'esriScalebarLine esriScalebarEnglishLine'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScaleLabelDiv'\x3e\x3cdiv class\x3d'esriScalebarLabel esriScalebarLineLabel esriScalebarSecondNumber'\x3e\x3c/div\x3e\x3c/div\x3e"
                });
            this.domNode = p.create("div");
            a = a || {};
            if (a.map) {
                if (a.scalebarUnit) {
                    if ("english" !== a.scalebarUnit && "metric" !== a.scalebarUnit && "dual" !== a.scalebarUnit) {
                        console.error("scalebar unit only accepts english or metric or dual");
                        return
                    }
                    this.scalebarUnit =
                        a.scalebarUnit
                } else this.scalebarUnit = "english"; if (a.scalebarStyle) {
                    if ("ruler" !== a.scalebarStyle && "line" !== a.scalebarStyle) {
                        console.error("scalebar style must be ruler or line");
                        return
                    }
                    this.scalebarStyle = a.scalebarStyle
                } else this.scalebarStyle = "ruler";
                this.background = a.background;
                switch (this.scalebarUnit) {
                    case "english":
                        "ruler" === this.scalebarStyle && (this.englishScalebar.innerHTML = "\x3cdiv class\x3d'esriScalebarRuler'\x3e\x3cdiv class\x3d'esriScalebarRulerBlock upper_firstpiece'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarRulerBlock upper_secondpiece'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarRulerBlock lower_firstpiece'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarRulerBlock lower_secondpiece'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'scaleLabelDiv'\x3e\x3cdiv class\x3d'esriScalebarLabel' style\x3d'left: -3%'\x3e0\x3c/div\x3e\x3cdiv class\x3d'esriScalebarLabel esriScalebarFirstNumber'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarLabel esriScalebarSecondNumber'\x3e\x3c/div\x3e\x3c/div\x3e");
                        this.domNode.appendChild(this.englishScalebar);
                        break;
                    case "metric":
                        "ruler" === this.scalebarStyle && (this.metricScalebar.innerHTML = "\x3cdiv class\x3d'esriScalebarRuler'\x3e\x3cdiv class\x3d'esriScalebarRulerBlock upper_firstpiece'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarRulerBlock upper_secondpiece'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarRulerBlock lower_firstpiece'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarRulerBlock lower_secondpiece'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'scaleLabelDiv'\x3e\x3cdiv class\x3d'esriScalebarLabel' style\x3d'left: -3%'\x3e0\x3c/div\x3e\x3cdiv class\x3d'esriScalebarLabel esriScalebarFirstNumber'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriScalebarLabel esriScalebarSecondNumber'\x3e\x3c/div\x3e\x3c/div\x3e");
                        this.domNode.appendChild(this.metricScalebar);
                        break;
                    case "dual":
                        this.domNode.appendChild(this.metricScalebar), this.domNode.appendChild(this.englishScalebar)
                }
                this.map = a.map;
                c ? c.appendChild(this.domNode) : (this.map.container.appendChild(this.domNode), a.attachTo ? n.add(this.domNode, "scalebar_" + a.attachTo) : n.add(this.domNode, "scalebar_bottom-left"));
                n.add(this.domNode, "esriScalebar");
                if (this.map.loaded) this._getDistance(this.map.extent), this._checkBingMaps();
                else var b = g.connect(this.map, "onLoad", this,
                    function() {
                        g.disconnect(b);
                        b = null;
                        this._getDistance(this.map.extent);
                        this._checkBingMaps()
                    });
                this._mapOnPan = g.connect(this.map, "onPan", this, this._getDistance);
                this._mapOnExtentChange = g.connect(this.map, "onExtentChange", this, this._getDistance);
                l.forEach(this.map.layerIds, function(a, b) {
                    "esri.virtualearth.VETiledLayer" === this.map.getLayer(a).declaredClass && g.connect(this.map.getLayer(a), "onVisibilityChange", m.hitch(this, function(a) {
                        this._checkBingMaps()
                    }))
                }, this);
                this._mapOnLayerAdd = g.connect(this.map,
                    "onLayerAdd", m.hitch(this, function(a) {
                        "esri.virtualearth.VETiledLayer" === a.declaredClass && g.connect(a, "onVisibilityChange", m.hitch(this, function(a) {
                            this._checkBingMaps()
                        }));
                        this._checkBingMaps()
                    }));
                this._mapOnLayerRemove = g.connect(this.map, "onLayerRemove", m.hitch(this, this._checkBingMaps))
            } else console.error("scalebar: unable to find the 'map' property in parameters")
        },
        hide: function() {
            this._hidden = !0;
            u.hide(this.domNode)
        },
        show: function() {
            this._hidden = !1;
            u.show(this.domNode)
        },
        destroy: function() {
            g.disconnect(this._mapOnPan);
            g.disconnect(this._mapOnExtentChange);
            g.disconnect(this._mapOnLayerAdd);
            g.disconnect(this._mapOnLayerRemove);
            this.hide();
            this.map = null;
            p.destroy(this.domNode)
        },
        _checkBingMaps: function() {
            n.contains(this.domNode, "scalebar_bottom-left") && (s.set(this.domNode, "left", "25px"), l.forEach(this.map.layerIds, function(a, c) {
                if ("esri.virtualearth.VETiledLayer" === this.map.getLayer(a).declaredClass && this.map.getLayer(a).visible) {
                    var b = "95px";
                    this.map._mapParams.nav && (b = "115px");
                    s.set(this.domNode, "left", b)
                }
            }, this))
        },
        _getDistance: function(a) {
            var c = E.position(this.domNode, !0).y - this.map.position.y,
                c = c > this.map.height ? this.map.height : c,
                c = 0 > c ? 0 : c,
                b = new y(0, c),
                c = new y(this.map.width, c),
                f, e;
            this.mapUnit = "esriDecimalDegrees";
            var d = B.toMapPoint(a, this.map.width, this.map.height, b),
                h = B.toMapPoint(a, this.map.width, this.map.height, c),
                b = new x(a.xmin, (a.ymin + a.ymax) / 2, this.map.spatialReference),
                c = new x(a.xmax, (a.ymin + a.ymax) / 2, this.map.spatialReference);
            if (3857 === this.map.spatialReference.wkid || 102100 === this.map.spatialReference.wkid ||
                102113 === this.map.spatialReference.wkid || this.map.spatialReference.wkt && -1 != this.map.spatialReference.wkt.indexOf("WGS_1984_Web_Mercator")) d = r.webMercatorToGeographic(d, !0), h = r.webMercatorToGeographic(h, !0), b = r.webMercatorToGeographic(b, !0), c = r.webMercatorToGeographic(c, !0);
            else if (t.isDefined(q[this.map.spatialReference.wkid]) || this.map.spatialReference.wkt && 0 === this.map.spatialReference.wkt.indexOf("PROJCS")) {
                this.mapUnit = "linearUnit";
                a = Math.abs(a.xmax - a.xmin);
                if (t.isDefined(q[this.map.spatialReference.wkid])) e =
                    q.values[q[this.map.spatialReference.wkid]];
                else {
                    e = this.map.spatialReference.wkt;
                    f = e.lastIndexOf(",") + 1;
                    var g = e.lastIndexOf("]]");
                    e = parseFloat(e.substring(f, g))
                }
                a *= e;
                e = a / 1609;
                f = a / 1E3
            }
            "esriDecimalDegrees" === this.mapUnit && (a = new z(new w({
                wkid: 4326
            })), a.addPath([d, h]), d = C._straightLineDensify(a, 10), a = A.geodesicLengths([d], v.KILOMETERS)[0], d = new z(new w({
                wkid: 4326
            })), d.addPath([b, c]), b = C._straightLineDensify(d, 10), A.geodesicLengths([b], v.KILOMETERS), e = a / 1.609, f = a);
            "english" === this.scalebarUnit ? this._getScaleBarLength(e,
                "mi") : "metric" === this.scalebarUnit ? this._getScaleBarLength(f, "km") : "dual" === this.scalebarUnit && (this._getScaleBarLength(e, "mi"), this._getScaleBarLength(f, "km"))
        },
        _getScaleBarLength: function(a, c) {
            var b = 50 * a / this.map.width,
                f = 0,
                e = c;
            0.1 > b && ("mi" === c ? (b *= 5280, e = "ft") : "km" === c && (b *= 1E3, e = "m"));
            for (; 1 <= b;) b /= 10, f++;
            var d, h;
            0.5 < b ? (d = 1, h = 0.5) : 0.3 < b ? (d = 0.5, h = 0.3) : 0.2 < b ? (d = 0.3, h = 0.2) : 0.15 < b ? (d = 0.2, h = 0.15) : 0.1 <= b && (d = 0.15, h = 0.1);
            d = d / b >= b / h ? h : d;
            b = 50 * (d / b);
            f = Math.pow(10, f) * d;
            this._drawScaleBar(b, f, e)
        },
        _drawScaleBar: function(a,
            c, b) {
            var f = 2 * Math.round(a),
                e, d;
            "mi" === b || "ft" === b ? (this.englishScalebar.style.width = f + "px", a = k(".esriScalebarFirstNumber", this.englishScalebar), e = k(".esriScalebarSecondNumber", this.englishScalebar), d = k(".esriScalebarMetricLineBackground", this.englishScalebar)) : (this.metricScalebar.style.width = f + "px", a = k(".esriScalebarFirstNumber", this.metricScalebar), e = k(".esriScalebarSecondNumber", this.metricScalebar), d = k(".esriScalebarMetricLineBackground", this.metricScalebar));
            l.forEach(d, function(a, b) {
                a.style.width =
                    f - 2 + "px"
            }, this);
            l.forEach(a, function(a, b) {
                a.innerHTML = c
            }, this);
            l.forEach(e, function(a, d) {
                a.innerHTML = "esriUnknown" !== this.mapUnit ? 2 * c + this.localStrings[b] : 2 * c + "Unknown Unit"
            }, this)
        }
    })
});