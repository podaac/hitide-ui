//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/has", "dojox/gfx/_base", "../kernel", "../lang", "../graphic", "./labelLayerUtils/DynamicLabelClass", "./labelLayerUtils/StaticLabelClass", "../symbols/TextSymbol", "../symbols/ShieldLabelSymbol", "../geometry/Extent", "../geometry/Point", "./GraphicsLayer", "./LabelClass", "../renderers/SimpleRenderer"], function(A, r, B, t, I, x, J, y, C, D, E, s, u, K, F, G, H, z) {
    return A(G, {
        declaredClass: "esri.layers.LabelLayer",
        constructor: function(a) {
            this.id = "labels";
            this.featureLayers = [];
            this._featureLayerInfos = [];
            this._preparedLabels = [];
            this._engineType = "STATIC";
            this._mapEventHandlers = [];
            a && (a.id && (this.id = a.id), a.mode && (this._engineType = "DYNAMIC" === a.mode.toUpperCase() ? "DYNAMIC" : "STATIC"))
        },
        _setMap: function(a) {
            var b = this.inherited(arguments);
            this._map && this._mapEventHandlers.push(this._map.on("extent-change", r.hitch(this, "refresh")));
            this.refresh();
            return b
        },
        _unsetMap: function() {
            var a = this.inherited(arguments),
                b;
            for (b = 0; b < this._mapEventHandlers.length; b++) t.disconnect(this._mapEventHandlers[b]);
            this.refresh();
            return a
        },
        setAlgorithmType: function(a) {
            this._engineType = a && "DYNAMIC" === a.toUpperCase() ? "DYNAMIC" : "STATIC";
            this.refresh()
        },
        addFeatureLayer: function(a, b, c, d) {
            if (!this.getFeatureLayer(a.layerId)) {
                var f = [];
                f.push(a.on("update-end", r.hitch(this, "refresh")));
                f.push(a.on("suspend", r.hitch(this, "refresh")));
                f.push(a.on("resume", r.hitch(this, "refresh")));
                f.push(a.on("edits-complete", r.hitch(this, "refresh")));
                f.push(a.on("labeling-info-change", r.hitch(this, "refresh")));
                this._featureLayerInfos.push({
                    FeatureLayer: a,
                    LabelExpressionInfo: c,
                    LabelingOptions: d,
                    LabelRenderer: b,
                    EventHandlers: f
                });
                this.featureLayers.push(a);
                this.refresh()
            }
        },
        getFeatureLayer: function(a) {
            var b, c;
            for (b = 0; b < this.featureLayers.length; b++)
                if (c = this.featureLayers[b], void 0 !== c && c.id == a) return c;
            return null
        },
        removeFeatureLayer: function(a) {
            var b;
            a = this.getFeatureLayer(a);
            if (void 0 !== a && (b = B.indexOf(this.featureLayers, a), -1 < b)) {
                this.featureLayers.splice(b, 1);
                for (a = 0; a < this._featureLayerInfos[b].EventHandlers.length; a++) t.disconnect(this._featureLayerInfos[b].EventHandlers[a]);
                this._featureLayerInfos.splice(b, 1);
                this.refresh()
            }
        },
        getFeatureLayers: function() {
            return this.featureLayers
        },
        getFeatureLayerInfo: function(a) {
            var b, c;
            for (b = 0; b < this.featureLayers.length; b++)
                if (c = this.featureLayers[b], void 0 !== c && c.id == a) return this._featureLayerInfos[b];
            return null
        },
        refresh: function() {
            var a, b, c, d, f, h, m, k, g, v, l, e, p, n, q, w;
            if (this._map) {
                var t = "DYNAMIC" === this._engineType ? new D : new E;
                t.setMap(this._map);
                this._preparedLabels = [];
                for (d = 0; d < this.featureLayers.length; d++)
                    if (f = this.featureLayers[d],
                        f.visible && (b = this._featureLayerInfos[d], f.visibleAtMapScale && !f._suspended)) {
                        q = "";
                        if (h = f.labelingInfo)
                            for (a = 0; a < h.length; a++)
                                if (m = h[a]) {
                                    n = new z(m.symbol);
                                    q = this._readLabelExpression(m);
                                    w = this._convertOptions(m);
                                    break
                                }
                        b.LabelRenderer && (n = b.LabelRenderer);
                        b.LabelExpressionInfo && (q = b.LabelExpressionInfo);
                        b.LabelingOptions && (w = b.LabelingOptions);
                        n instanceof H && (q = this._readLabelExpression(n), n = new z(n.symbol), w = this._convertOptions(n));
                        if (q && "" !== q) {
                            m = f.graphics;
                            h = f.renderer;
                            for (b = 0; b < m.length; b++) {
                                g =
                                    m[b];
                                v = this._map._convertGeometry(this._extent, g.geometry);
                                l = y.substitute(g.attributes, q.replace(/(\{[^\{\r\n]+\})/g, "$$$1"), {
                                    first: !0
                                });
                                c = q.replace(RegExp("\\{", "g"), "").replace(RegExp("\\}", "g"), "").replace(RegExp("\\$", "g"), "");
                                k = f.fields;
                                for (a = 0; a < k.length; a++)
                                    if (k[a].name == c) {
                                        if ((e = k[a].domain) && r.isObject(e))
                                            if ("codedValue" == e.type)
                                                for (c = 0; c < e.codedValues.length; c++) e.codedValues[c].code == l && (l = e.codedValues[c].name);
                                            else "range" == e.type && (e.minValue <= l && l <= e.maxValue) && (l = e.name);
                                            "esriFieldTypeDate" ==
                                            k[a].type && (l = y.substitute({
                                                label: l
                                            }, "${label: DateFormat}"));
                                        break
                                    }
                                if (l && "" !== l) {
                                    if ("point" !== v.type && (a = this._intersects(this._map, v.getExtent()), null === a || 0 === a.length)) continue;
                                    if (n) {
                                        c = n.getSymbol(g);
                                        c instanceof s ? (c = new s(c.toJson()), c.setVerticalAlignment("baseline"), c.setHorizontalAlignment("center")) : c = c instanceof u ? new u(c.toJson()) : new s;
                                        c.setText(l);
                                        n.symbol = c;
                                        k = a = 0;
                                        if (h)
                                            if (e = h.getSize(g), p = h.getSymbol(g), 0 !== e) k = a = e;
                                            else if (p)
                                            if ("simplemarkersymbol" == p.type) k = a = p.size;
                                            else if ("picturemarkersymbol" ==
                                            p.type) a = p.width, k = p.height;
                                        else if ("simplelinesymbol" == p.type || "cartographiclinesymbol" == p.type) a = p.width;
                                        e = {};
                                        e.graphic = g;
                                        e.options = w;
                                        e.geometry = v;
                                        e.labelRenderer = n;
                                        e.labelWidth = c.getWidth() / 2;
                                        e.labelHeight = c.getHeight() / 2;
                                        e.symbolWidth = x.normalizedLength(a) / 2;
                                        e.symbolHeight = x.normalizedLength(k) / 2;
                                        e.text = l;
                                        e.angle = c.angle;
                                        this._preparedLabels.push(e)
                                    }
                                }
                            }
                        }
                    }
                d = t._process(this._preparedLabels);
                this.clear();
                this.drawLabels(this._map, d)
            }
        },
        drawLabels: function(a, b) {
            this._scale = (a.extent.xmax - a.extent.xmin) /
                a.width;
            var c;
            for (c = 0; c < b.length; c++) {
                var d = b[c],
                    f = d.layer,
                    h = d.x,
                    m = d.y,
                    k = d.text,
                    g = d.angle,
                    d = f.labelRenderer.getSymbol(f.graphic),
                    d = d instanceof s ? new s(d.toJson()) : d instanceof u ? new u(d.toJson()) : new s;
                "polyline" == f.geometry.type && d.setAngle(g * (180 / Math.PI));
                d.setText(k);
                f = h;
                d instanceof s && (h = d.getHeight(), g = Math.sin(g), f -= 0.25 * h * this._scale * g, m -= 0.33 * h * this._scale);
                g = new C(new F(f, m, a.extent.spatialReference));
                g.setSymbol(d);
                this.add(g)
            }
        },
        _readLabelExpression: function(a) {
            return a.labelExpressionInfo ?
                a.labelExpressionInfo.value : this._validSyntax(a.labelExpression) ? this._convertLabelExpression(a.labelExpression) : ""
        },
        _validSyntax: function(a) {
            return /^(\s*\[[^\]]+\]\s*)+$/i.test(a)
        },
        _convertLabelExpression: function(a) {
            return a.replace(RegExp("\\[", "g"), "{").replace(RegExp("\\]", "g"), "}")
        },
        _convertOptions: function(a) {
            a = a.labelPlacement;
            var b = !0;
            if ("always-horizontal" == a || "esriServerPolygonPlacementAlwaysHorizontal" == a) b = !1;
            return {
                pointPriorities: "above-center" == a || "esriServerPointLabelPlacementAboveCenter" ==
                    a ? "AboveCenter" : "above-left" == a || "esriServerPointLabelPlacementAboveLeft" == a ? "AboveLeft" : "above-right" == a || "esriServerPointLabelPlacementAboveRight" == a ? "AboveRight" : "below-center" == a || "esriServerPointLabelPlacementBelowCenter" == a ? "BelowCenter" : "below-left" == a || "esriServerPointLabelPlacementBelowLeft" == a ? "BelowLeft" : "below-right" == a || "esriServerPointLabelPlacementBelowRight" == a ? "BelowRight" : "center-center" == a || "esriServerPointLabelPlacementCenterCenter" == a ? "CenterCenter" : "center-left" == a || "esriServerPointLabelPlacementCenterLeft" ==
                    a ? "CenterLeft" : "center-right" == a || "esriServerPointLabelPlacementCenterRight" == a ? "CenterRight" : "AboveRight",
                lineLabelPlacement: "above-start" == a || "below-start" == a || "center-start" == a ? "PlaceAtStart" : "above-end" == a || "below-end" == a || "center-end" == a ? "PlaceAtEnd" : "PlaceAtCenter",
                lineLabelPosition: "above-after" == a || "esriServerLinePlacementAboveAfter" == a || "above-along" == a || "esriServerLinePlacementAboveAlong" == a || "above-before" == a || "esriServerLinePlacementAboveBefore" == a || "above-start" == a || "esriServerLinePlacementAboveStart" ==
                    a || "above-end" == a || "esriServerLinePlacementAboveEnd" == a ? "Above" : "below-after" == a || "esriServerLinePlacementBelowAfter" == a || "below-along" == a || "esriServerLinePlacementBelowAlong" == a || "below-before" == a || "esriServerLinePlacementBelowBefore" == a || "below-start" == a || "esriServerLinePlacementBelowStart" == a || "below-end" == a || "esriServerLinePlacementBelowEnd" == a ? "Below" : "center-after" == a || "esriServerLinePlacementCenterAfter" == a || "center-along" == a || "esriServerLinePlacementCenterAlong" == a || "center-before" == a || "esriServerLinePlacementCenterBefore" ==
                    a || "center-start" == a || "esriServerLinePlacementCenterStart" == a || "center-end" == a || "esriServerLinePlacementCenterEnd" == a ? "OnLine" : "Above",
                labelRotation: b,
                howManyLabels: "OneLabel"
            }
        }
    })
});