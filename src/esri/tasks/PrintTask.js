//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/_base/Deferred", "dojo/has", "../kernel", "../lang", "../deferredUtils", "./Task", "../renderers/SimpleRenderer", "../geometry/scaleUtils", "./Geoprocessor", "./PrintTemplate", "dojo/dom-construct", "dojox/gfx/_base", "dojox/gfx/canvas", "dojox/json/query", "require", "require"], function(w, g, m, r, x, y, H, s, z, A, B, C, D, E, F, t, u, G) {
    return w(A, {
        declaredClass: "esri.tasks.PrintTask",
        constructor: function(b, f) {
            this.url = b;
            this.printGp = new D(this.url);
            this._handler =
                g.hitch(this, this._handler);
            f && f.async && (this.async = f.async);
            this._colorEvaluator = G("$..color")
        },
        _handler: function(b, f, a, e, c) {
            try {
                var h;
                this.async ? "esriJobSucceeded" === b.jobStatus && this.printGp.getResultData(b.jobId, "Output_File", g.hitch(this, function(b) {
                    h = b.value;
                    this._successHandler([h], "onComplete", a, c)
                })) : (h = b[0].value, this._successHandler([h], "onComplete", a, c))
            } catch (d) {
                this._errorHandler(d, e, c)
            }
        },
        execute: function(b, f, a) {
            var e = this._handler,
                c = this._errorHandler,
                h = b.template || new E,
                d = h.exportOptions,
                l;
            d && (l = {
                outputSize: [d.width, d.height],
                dpi: d.dpi
            });
            this._preserveScale = !1 !== h.preserveScale;
            var d = h.layoutOptions,
                k, v = [];
            if (d) {
                this.legendAll = !1;
                d.legendLayers ? m.forEach(d.legendLayers, function(a) {
                    var b = {};
                    b.id = a.layerId;
                    a.subLayerIds && (b.subLayerIds = a.subLayerIds);
                    v.push(b)
                }) : this.legendAll = !0;
                var n, p;
                if ("Miles" === d.scalebarUnit || "Kilometers" === d.scalebarUnit) n = "Kilometers", p = "Miles";
                else if ("Meters" === d.scalebarUnit || "Feet" === d.scalebarUnit) n = "Meters", p = "Feet";
                k = {
                    Miles: "mi",
                    Kilometers: "km",
                    Yards: "yd",
                    Feet: "ft",
                    Meters: "m"
                };
                k = {
                    titleText: d.titleText,
                    authorText: d.authorText,
                    copyrightText: d.copyrightText,
                    customTextElements: d.customTextElements,
                    scaleBarOptions: {
                        metricUnit: n,
                        metricLabel: k[n],
                        nonMetricUnit: p,
                        nonMetricLabel: k[p]
                    },
                    legendOptions: {
                        operationalLayers: v
                    }
                }
            }
            n = this._getPrintDefinition(b.map);
            b.outSpatialReference && (n.mapOptions.spatialReference = b.outSpatialReference.toJson());
            b.template && s.isDefined(b.template.showAttribution) && (n.mapOptions.showAttribution = b.template.showAttribution);
            g.mixin(n, {
                exportOptions: l,
                layoutOptions: k
            });
            this.allLayerslegend && g.mixin(n.layoutOptions, {
                legendOptions: {
                    operationalLayers: this.allLayerslegend
                }
            });
            h = {
                Web_Map_as_JSON: r.toJson(s.fixJson(n)),
                Format: h.format,
                Layout_Template: h.layout
            };
            b.extraParameters && (h = g.mixin(h, b.extraParameters));
            var q = new x(z._dfdCanceller);
            b = function(b, c) {
                e(b, c, f, a, q)
            };
            l = function(b) {
                c(b, a, q)
            };
            q._pendingDfd = this.async ? this.printGp.submitJob(h, b, null, l) : this.printGp.execute(h, b, l);
            return q
        },
        onComplete: function() {},
        _multipointLayer: function() {
            this.layerDefinition = {
                name: "multipointLayer",
                geometryType: "esriGeometryMultipoint",
                drawingInfo: {
                    renderer: null
                }
            };
            this.featureSet = {
                geometryType: "esriGeometryMultipoint",
                features: []
            }
        },
        _polygonLayer: function() {
            this.layerDefinition = {
                name: "polygonLayer",
                geometryType: "esriGeometryPolygon",
                drawingInfo: {
                    renderer: null
                }
            };
            this.featureSet = {
                geometryType: "esriGeometryPolygon",
                features: []
            }
        },
        _pointLayer: function() {
            this.layerDefinition = {
                name: "pointLayer",
                geometryType: "esriGeometryPoint",
                drawingInfo: {
                    renderer: null
                }
            };
            this.featureSet = {
                geometryType: "esriGeometryPoint",
                features: []
            }
        },
        _polylineLayer: function() {
            this.layerDefinition = {
                name: "polylineLayer",
                geometryType: "esriGeometryPolyline",
                drawingInfo: {
                    renderer: null
                }
            };
            this.featureSet = {
                geometryType: "esriGeometryPolyline",
                features: []
            }
        },
        _convertSvgSymbol: function(b) {
            if (!(8 >= y("ie")) && b.path) {
                this._canvasHolder || (this._canvasHolder = F.create("div"), this._canSurface = u.createSurface(this._canvasHolder, 200, 200));
                var f = this._canSurface.createObject(u.Path, b.path).setFill(b.color).setStroke(b.outline);
                "pendingRender" in this._canSurface &&
                    this._canSurface._render(!0);
                var a = this._canSurface.rawNode.getContext("2d"),
                    e = Math.ceil(f.getBoundingBox().width + f.getBoundingBox().x),
                    c = Math.ceil(f.getBoundingBox().height + f.getBoundingBox().y),
                    h = a.getImageData(f.getBoundingBox().x, f.getBoundingBox().y, e, c);
                a.canvas.width = e;
                a.canvas.height = c;
                a.putImageData(h, 0, 0);
                a = a.canvas.toDataURL("image/png");
                return {
                    type: "esriPMS",
                    imageData: a.substr(22, a.length),
                    angle: -b.angle,
                    contentType: "image/png",
                    height: b.size ? b.size : c - f.getBoundingBox().y,
                    width: b.size ?
                        b.size : e - f.getBoundingBox().x,
                    xoffset: b.xoffset,
                    yoffset: b.yoffset
                }
            }
        },
        _convertSvgRenderer: function(b) {
            "simple" === b.type && b.symbol && b.symbol.path ? b.symbol = this._convertSvgSymbol(b.symbol) : "uniqueValue" === b.type ? (b.defaultSymbol && b.defaultSymbol.path && (b.defaultSymbol = this._convertSvgSymbol(b.defaultSymbol)), b.uniqueValueInfos && m.forEach(b.uniqueValueInfos, function(b) {
                b.symbol.path && (b.symbol = this._convertSvgSymbol(b.symbol))
            }, this)) : "classBreaks" === b.type && (b.defaultSymbol && b.defaultSymbol.path && (b.defaultSymbol =
                this._convertSvgSymbol(b.defaultSymbol)), b.classBreakInfos && m.forEach(b.classBreakInfos, function(b) {
                b.symbol.path && (b.symbol = this._convertSvgSymbol(b.symbol))
            }, this))
        },
        _createFeatureCollection: function(b, f) {
            var a = new this._polygonLayer,
                e = new this._polylineLayer,
                c = new this._pointLayer,
                h = new this._multipointLayer;
            "esri.layers.FeatureLayer" === b.declaredClass && (a.layerDefinition.name = e.layerDefinition.name = c.layerDefinition.name = h.layerDefinition.name = b.name || b.id);
            b.renderer && !g.isFunction(b.renderer.attributeField) ?
                (a.layerDefinition.drawingInfo.renderer = b.renderer.toJson(), e.layerDefinition.drawingInfo.renderer = b.renderer.toJson(), c.layerDefinition.drawingInfo.renderer = b.renderer.toJson(), h.layerDefinition.drawingInfo.renderer = b.renderer.toJson()) : (delete a.layerDefinition.drawingInfo, delete e.layerDefinition.drawingInfo, delete c.layerDefinition.drawingInfo, delete h.layerDefinition.drawingInfo);
            var d = b.fields;
            !d && (b.renderer && !g.isFunction(b.renderer.attributeField)) && ("esri.renderer.ClassBreaksRenderer" ===
                b.renderer.declaredClass ? (d = [{
                    name: b.renderer.attributeField,
                    type: "esriFieldTypeDouble"
                }], b.renderer.normalizationField && d.push({
                    name: b.renderer.normalizationField,
                    type: "esriFieldTypeDouble"
                })) : "esri.renderer.UniqueValueRenderer" === b.renderer.declaredClass && (d = [{
                    name: b.renderer.attributeField,
                    type: "esriFieldTypeString"
                }], b.renderer.attributeField2 && d.push({
                    name: b.renderer.attributeField2,
                    type: "esriFieldTypeString"
                }), b.renderer.attributeField3 && d.push({
                    name: b.renderer.attributeField3,
                    type: "esriFieldTypeString"
                })));
            d && (a.layerDefinition.fields = d, e.layerDefinition.fields = d, c.layerDefinition.fields = d, h.layerDefinition.fields = d);
            var l;
            for (l = 0; l < b.graphics.length; l++) {
                var k = b.graphics[l];
                if (!1 !== k.visible && k.geometry && (d = k.toJson(), !d.symbol || !(d.symbol.outline && "esriCLS" === d.symbol.outline.type))) {
                    d.symbol && (d.symbol.outline && d.symbol.outline.color && d.symbol.outline.color[3]) && (d.symbol.outline.color[3] = 255);
                    if (b.renderer && !d.symbol && (g.isFunction(b.renderer.attributeField) || b.renderer.proportionalSymbolInfo ||
                        "esri.renderer.DotDensityRenderer" === b.renderer.declaredClass || f))
                        if (f = f || b.renderer, d.symbol = f.getSymbol(k) ? f.getSymbol(k).toJson() : d.symbol, f.proportionalSymbolInfo)
                            if (f.getSize(k)) "point" === k.geometry.type || "multipoint" === k.geometry.type || "polygon" === k.geometry.type ? d.symbol.size = t.px2pt(f.getSize(k)) : "polyline" === k.geometry.type && (d.symbol.width = t.px2pt(f.getSize(k)));
                            else continue;
                    d.symbol && d.symbol.path && (d.symbol = this._convertSvgSymbol(d.symbol));
                    switch (k.geometry.type) {
                        case "polygon":
                            a.featureSet.features.push(d);
                            break;
                        case "polyline":
                            e.featureSet.features.push(d);
                            break;
                        case "point":
                            c.featureSet.features.push(d);
                            break;
                        case "multipoint":
                            h.featureSet.features.push(d)
                    }
                }
            }
            d = [];
            0 < c.featureSet.features.length && d.push(c);
            0 < e.featureSet.features.length && d.push(e);
            0 < a.featureSet.features.length && d.push(a);
            0 < h.featureSet.features.length && d.push(h);
            m.forEach(d, function(a) {
                a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.renderer && this._convertSvgRenderer(a.layerDefinition.drawingInfo.renderer)
            }, this);
            return {
                id: b.id,
                opacity: b.opacity,
                minScale: b.minScale || 0,
                maxScale: b.maxScale || 0,
                featureCollection: {
                    layers: d
                }
            }
        },
        _getPrintDefinition: function(b) {
            var f = {
                    operationalLayers: this._createOperationalLayers(b)
                },
                a = b.extent,
                e = b.spatialReference;
            b.spatialReference._isWrappable() && (a = a._normalize(!0), e = a.spatialReference);
            a = {
                mapOptions: {
                    showAttribution: b.showAttribution,
                    extent: a.toJson(),
                    spatialReference: e.toJson()
                }
            };
            this._preserveScale && g.mixin(a.mapOptions, {
                scale: C.getScale(b)
            });
            b.timeExtent && g.mixin(a.mapOptions, {
                time: [b.timeExtent.startTime.getTime(),
                    b.timeExtent.endTime.getTime()
                ]
            });
            b = {};
            g.mixin(b, a, f);
            return b
        },
        _createOperationalLayers: function(b) {
            var f, a, e, c, h = [],
                d = [];
            this.allLayerslegend = this.legendAll ? [] : null;
            for (f = 0; f < b.layerIds.length; f++)
                if (a = b.getLayer(b.layerIds[f]), a.loaded && a.visible && -1 === m.indexOf(h, a.id)) switch (e = a.declaredClass, c = {
                    id: a.id,
                    title: a.id,
                    opacity: a.opacity,
                    minScale: a.minScale || 0,
                    maxScale: a.maxScale || 0
                }, c = g.mixin(c, this._getUrlAndToken(a)), e) {
                    case "esri.layers.ArcGISDynamicMapServiceLayer":
                        var l = [];
                        if (a._params.dynamicLayers) {
                            var k =
                                r.fromJson(a._params.dynamicLayers);
                            m.forEach(k, function(a) {
                                l.push({
                                    id: a.id,
                                    layerDefinition: a
                                })
                            })
                        } else a.supportsDynamicLayers && (k = a.createDynamicLayerInfosFromLayerInfos()), m.forEach(a.layerInfos, function(b, c) {
                            var d = {
                                id: b.id,
                                layerDefinition: {
                                    definitionExpression: null,
                                    layerTimeOptions: null
                                }
                            };
                            a.layerDefinitions && a.layerDefinitions[b.id] && (d.layerDefinition.definitionExpression = a.layerDefinitions[b.id]);
                            a.layerTimeOptions && a.layerTimeOptions[b.id] && (d.layerDefinition.layerTimeOptions = a.layerTimeOptions[b.id]);
                            k && k[c] && (d.layerDefinition.source = k[c].source.toJson());
                            (d.layerDefinition.definitionExpression || d.layerDefinition.layerTimeOptions) && l.push(d)
                        });
                        c = g.mixin(c, {
                            visibleLayers: a._params.layers ? a.visibleLayers : null,
                            layers: l
                        });
                        d.push(c);
                        this.allLayerslegend && this.allLayerslegend.push({
                            id: a.id,
                            subLayerIds: a.visibleLayers
                        });
                        break;
                    case "esri.layers.ArcGISImageServiceLayer":
                        c = g.mixin(c, {
                            url: a.url,
                            bandIds: a.bandIds,
                            compressionQuality: a.compressionQuality,
                            format: a.format,
                            interpolation: a.interpolation
                        });
                        a.mosaicRule &&
                            g.mixin(c, {
                                mosaicRule: a.mosaicRule.toJson()
                            });
                        a.renderingRule && g.mixin(c, {
                            renderingRule: a.renderingRule.toJson()
                        });
                        d.push(c);
                        this.allLayerslegend && this.allLayerslegend.push({
                            id: a.id
                        });
                        break;
                    case "esri.layers.WMSLayer":
                        c = g.mixin(c, {
                            url: a.url,
                            title: a.title,
                            type: "wms",
                            version: a.version,
                            transparentBackground: a.imageTransparency,
                            visibleLayers: a.visibleLayers
                        });
                        d.push(c);
                        this.allLayerslegend && this.allLayerslegend.push({
                            id: a.id,
                            subLayerIds: a.visibleLayers
                        });
                        break;
                    case "esri.virtualearth.VETiledLayer":
                        e =
                            a.mapStyle;
                        "aerialWithLabels" === e && (e = "Hybrid");
                        c = g.mixin(c, {
                            visibility: a.visible,
                            type: "BingMaps" + e,
                            culture: a.culture,
                            key: a.bingMapsKey
                        });
                        d.push(c);
                        break;
                    case "esri.layers.OpenStreetMapLayer":
                        c = g.mixin(c, {
                            type: "OpenStreetMap",
                            url: a.tileServers[0]
                        });
                        d.push(c);
                        break;
                    case "esri.layers.WMTSLayer":
                        c = g.mixin(c, {
                            url: a.url,
                            type: "wmts",
                            layer: a.layerInfos[0].identifier,
                            style: a.layerInfos[0].style,
                            format: a.layerInfos[0].format,
                            tileMatrixSet: a.layerInfos[0].tileMatrixSet
                        });
                        d.push(c);
                        break;
                    case "esri.layers.MapImageLayer":
                        e =
                            a.getImages();
                        m.forEach(e, function(b, e) {
                            b.href && (c = {
                                id: a.id + "_image" + e,
                                type: "image",
                                title: a.id,
                                minScale: a.minScale || 0,
                                maxScale: a.maxScale || 0,
                                opacity: a.opacity,
                                extent: b.extent.toJson(),
                                url: b.href
                            }, d.push(c))
                        });
                        break;
                    case "esri.layers.WebTiledLayer":
                        e = a.url.replace(/\$\{/g, "{");
                        c = g.mixin(c, {
                            type: "WebTiledLayer",
                            urlTemplate: e,
                            credits: a.copyright
                        });
                        a.subDomains && 0 < a.subDomains.length && (c.subDomains = a.subDomains);
                        d.push(c);
                        break;
                    default:
                        if (a.getTileUrl || a.getImageUrl) c = g.mixin(c, {
                            url: a.url
                        }), d.push(c)
                }
                for (f =
                    0; f < b.graphicsLayerIds.length; f++)
                    if (a = b.getLayer(b.graphicsLayerIds[f]), a.loaded && a.visible && -1 === m.indexOf(h, a.id)) switch (e = a.declaredClass, e) {
                        case "esri.layers.FeatureLayer":
                        case "esri.layers.LabelLayer":
                        case "esri.layers.CSVLayer":
                            e = null;
                            a.url && a.renderer && ("esri.renderer.ScaleDependentRenderer" === a.renderer.declaredClass ? "scale" === a.renderer.rangeType ? e = a.renderer.getRendererInfoByScale(b.getScale()) && a.renderer.getRendererInfoByScale(b.getScale()).renderer : "zoom" === a.renderer.rangeType && (e =
                                a.renderer.getRendererInfoByZoom(b.getZoom()) && a.renderer.getRendererInfoByZoom(b.getZoom()).renderer) : e = a.renderer);
                            if (e && ("esri.renderer.SimpleRenderer" === e.declaredClass || g.isString(e.attributeField) && a._getField(e.attributeField, !0)) && !e.proportionalSymbolInfo && "esri.renderer.DotDensityRenderer" !== e.declaredClass && "esri.layers.CSVLayer" !== a.declaredClass)
                                if (c = {
                                        id: a.id,
                                        title: a.id,
                                        opacity: a.opacity,
                                        minScale: a.minScale || 0,
                                        maxScale: a.maxScale || 0,
                                        layerDefinition: {
                                            drawingInfo: {
                                                renderer: e.toJson()
                                            }
                                        }
                                    },
                                    c = g.mixin(c, this._getUrlAndToken(a)), this._convertSvgRenderer(c.layerDefinition.drawingInfo.renderer), 1 > a.opacity || this._updateLayerOpacity(c))
                                    if (a._params.source && (e = a._params.source.toJson(), g.mixin(c.layerDefinition, {
                                        source: e
                                    })), a.getDefinitionExpression() && g.mixin(c.layerDefinition, {
                                        definitionExpression: a.getDefinitionExpression()
                                    }), 2 !== a.mode) 0 < a.getSelectedFeatures().length && (e = m.map(a.getSelectedFeatures(), function(b) {
                                            return b.attributes[a.objectIdField]
                                        }), 0 < e.length && a.getSelectionSymbol() &&
                                        g.mixin(c, {
                                            selectionObjectIds: e,
                                            selectionSymbol: a.getSelectionSymbol().toJson()
                                        }));
                                    else {
                                        e = m.map(a.getSelectedFeatures(), function(b) {
                                            return b.attributes[a.objectIdField]
                                        });
                                        if (0 === e.length || !a._params.drawMode) break;
                                        g.mixin(c.layerDefinition, {
                                            objectIds: e
                                        });
                                        e = null;
                                        a.getSelectionSymbol() && (e = new B(a.getSelectionSymbol()));
                                        g.mixin(c.layerDefinition.drawingInfo, {
                                            renderer: e && e.toJson()
                                        })
                                    } else c = this._createFeatureCollection(a);
                            else c = e && (e.proportionalSymbolInfo || "esri.renderer.DotDensityRenderer" === e.declaredClass) ?
                                this._createFeatureCollection(a, e) : this._createFeatureCollection(a);
                            d.push(c);
                            this.allLayerslegend && this.allLayerslegend.push({
                                id: a.id
                            });
                            break;
                        case "esri.layers.GraphicsLayer":
                            c = this._createFeatureCollection(a), d.push(c), this.allLayerslegend && this.allLayerslegend.push({
                                id: a.id
                            })
                    }
                    b.graphics && 0 < b.graphics.graphics.length && (c = this._createFeatureCollection(b.graphics), d.push(c));
            return d
        },
        _getUrlAndToken: function(b) {
            return {
                token: b._getToken(),
                url: b._url ? b._url.path : null
            }
        },
        _updateLayerOpacity: function(b) {
            var f =
                this._colorEvaluator(b),
                f = m.filter(f, function(a) {
                    return g.isArray(a) && 4 === a.length
                }),
                a = !0;
            if (f.length) {
                var e = f[0][3],
                    c;
                for (c = 1; c < f.length; c++)
                    if (e !== f[c][3]) {
                        a = !1;
                        break
                    }
                if (a) {
                    b.opacity = e / 255;
                    for (c = 0; c < f.length; c++) f[c][3] = 255
                }
            }
            return a
        }
    })
});