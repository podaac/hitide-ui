//>>built
define(["require", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Deferred", "dojo/_base/json", "dojo/_base/url", "dojo/on", "dojo/DeferredList", "dojo/dom-construct", "../kernel", "../config", "../lang", "../request", "../SpatialReference", "../map", "../urlUtils", "../geometry/ScreenPoint", "../geometry/Extent", "../geometry/webMercatorUtils", "../symbols/jsonUtils", "../renderers/jsonUtils", "../dijit/PopupTemplate", "../dijit/Popup", "../tasks/query", "../tasks/GeometryService", "./csv", "../layers/ArcGISTiledMapServiceLayer", "../layers/ArcGISDynamicMapServiceLayer", "../layers/ArcGISImageServiceLayer", "../layers/CSVLayer", "../layers/OpenStreetMapLayer", "../layers/WebTiledLayer", "../layers/FeatureLayer", "../layers/WMSLayer", "../layers/KMLLayer", "../layers/GeoRSSLayer", "../layers/LabelClass", "../virtualearth/VETiledLayer", "../layers/TileInfo", "../layers/DynamicLayerInfo", "../layers/LayerDrawingOptions", "../layers/ImageParameters", "../layers/ImageServiceParameters", "../layers/RasterFunction", "../layers/MosaicRule", "../layers/WMSLayerInfo", "dojo/i18n!../nls/jsapi"],
    function(Aa, l, h, s, r, F, Ba, Ca, B, Da, G, H, g, w, x, Ea, ba, ca, C, Fa, D, Ga, da, Ha, Ia, Ja, ea, fa, ga, ha, Ka, La, Ma, y, Na, Oa, Pa, Qa, t, Ra, Sa, Ta, Ua, Va, Wa, Xa, Ya, P) {
        function E(a) {
            return w({
                url: n.arcgisUrl + "/" + a.itemId + "/data",
                content: {
                    f: "json"
                },
                callbackParamName: "callback"
            }, {
                disableIdentityLookup: !0,
                _preLookup: !0
            })
        }

        function Q(a, f) {
            var b = {
                f: "json"
            };
            f && (b.token = f);
            return w({
                url: a,
                content: b,
                callbackParamName: "callback"
            }, {
                disableIdentityLookup: !0
            })
        }

        function ia(a) {
            a.itemProperties.layerDefinition && (a.layerDefinition ? (a.layerDefinition.drawingInfo ||
                (a.layerDefinition.drawingInfo = a.itemProperties.layerDefinition.drawingInfo), g.isDefined(a.layerDefinition.definitionExpression) || (a.layerDefinition.definitionExpression = a.itemProperties.layerDefinition.definitionExpression), g.isDefined(a.layerDefinition.minScale) || (a.layerDefinition.minScale = a.itemProperties.layerDefinition.minScale), g.isDefined(a.layerDefinition.maxScale) || (a.layerDefinition.maxScale = a.itemProperties.layerDefinition.maxScale)) : a.layerDefinition = a.itemProperties.layerDefinition);
            a.itemProperties.popupInfo && (!a.popupInfo && !a.disablePopup) && (a.popupInfo = a.itemProperties.popupInfo);
            g.isDefined(a.itemProperties.showLegend) && !g.isDefined(a.showLegend) && (a.showLegend = a.itemProperties.showLegend);
            g.isDefined(a.itemProperties.refreshInterval) && !g.isDefined(a.refreshInterval) && (a.refreshInterval = a.itemProperties.refreshInterval)
        }

        function I(a, f) {
            var b = new r,
                d = a.itemData,
                c = [],
                e = [];
            h.forEach(d.operationalLayers, function(a) {
                if (a.itemId && !a.type) {
                    var b = a.url.toLowerCase(); - 1 < b.indexOf("/featureserver") ||
                        -1 < b.indexOf("/mapserver/") ? (e.push(a), c.push(E(a))) : -1 < b.indexOf("/mapserver") && -1 === b.indexOf("/mapserver/") && (!a.layers || !g.isDefined(a.minScale) && !g.isDefined(a.maxScale)) ? (e.push(a), c.push(E(a))) : -1 < b.indexOf("/imageserver") && (!g.isDefined(a.minScale) && !g.isDefined(a.maxScale)) && (e.push(a), c.push(E(a)))
                }
            });
            d.baseMap && d.baseMap.baseMapLayers && h.forEach(d.baseMap.baseMapLayers, function(a) {
                a.itemId && (e.push(a), c.push(E(a)))
            });
            if (0 < c.length) {
                var k = {};
                (new B(c)).addCallback(function(c) {
                    h.forEach(e,
                        function(a, e) {
                            var b = c[e][1];
                            if (b && !(b instanceof Error) && (k[a.itemId] = b, !a.type)) {
                                var d = a.url.toLowerCase();
                                if ((-1 < d.indexOf("/featureserver") || -1 < d.indexOf("/mapserver/")) && b.layers) h.forEach(b.layers, function(b) {
                                    if (d.endsWith("/featureserver/" + b.id) || d.endsWith("/mapserver/" + b.id)) a.itemProperties = b, ia(a)
                                });
                                else if (-1 < d.indexOf("/mapserver")) b.layers && !a.layers && (a.layers = b.layers), g.isDefined(b.minScale) && !g.isDefined(a.minScale) && (a.minScale = b.minScale), g.isDefined(b.maxScale) && !g.isDefined(a.maxScale) &&
                                    (a.maxScale = b.maxScale), g.isDefined(b.refreshInterval) && !g.isDefined(a.refreshInterval) && (a.refreshInterval = b.refreshInterval);
                                else if (-1 < d.indexOf("/imageserver") && (g.isDefined(b.minScale) && !g.isDefined(a.minScale) && (a.minScale = b.minScale), g.isDefined(b.maxScale) && !g.isDefined(a.maxScale) && (a.maxScale = b.maxScale), g.isDefined(b.refreshInterval) && !g.isDefined(a.refreshInterval) && (a.refreshInterval = b.refreshInterval), b.popupInfo && (!a.popupInfo && !a.disablePopup) && (a.popupInfo = b.popupInfo), b.renderingRule &&
                                    !a.renderingRule && (a.renderingRule = b.renderingRule, b.renderingRule.functionName && (a.renderingRule.rasterFunction = b.renderingRule.functionName)), b.bandIds && !a.bandIds && (a.bandIds = b.bandIds), b.mosaicRule && !a.mosaicRule && (a.mosaicRule = b.mosaicRule), b.format && !a.format && (a.format = b.format), g.isDefined(b.compressionQuality) && !g.isDefined(a.compressionQuality) && (a.compressionQuality = b.compressionQuality), b.layerDefinition && b.layerDefinition.definitionExpression && (!g.isDefined(a.layerDefinition) || !g.isDefined(a.layerDefinition.definitionExpression)))) a.layerDefinition =
                                    a.layerDefinition || {}, a.layerDefinition.definitionExpression = b.layerDefinition.definitionExpression
                            }
                        });
                    a.relatedItemsData = k;
                    b.callback(a)
                })
            } else b.callback(a);
            return b
        }

        function Za(a, f) {
            var b = new r,
                d = a.itemData,
                c = d.baseMap.baseMapLayers[0];
            if ("BingMapsAerial" === c.type || "BingMapsRoad" === c.type || "BingMapsHybrid" === c.type)
                if (c.portalUrl) delete f.bingMapsKey, G.id.checkSignInStatus(ba.urlToObject(n.arcgisUrl).path).then(l.hitch(null, function(a, b, e, d, f) {
                    Q(c.portalUrl, f.token).then(l.hitch(null, R, a, b, e, d),
                        l.hitch(null, J, a, b, e, d))
                }, a, f, d, b), l.hitch(null, function(a, b, e, d, f) {
                    Q(c.portalUrl).then(l.hitch(null, R, a, b, e, d), l.hitch(null, J, a, b, e, d))
                }, a, f, d, b));
                else if (f.bingMapsKey) {
                var e = new t({
                    bingMapsKey: f.bingMapsKey,
                    mapStyle: t.MAP_STYLE_AERIAL
                });
                s.connect(e, "onLoad", l.hitch(this, function() {
                    b.callback([a, f])
                }));
                s.connect(e, "onError", function(e) {
                    delete f.bingMapsKey;
                    a.itemData = K(d);
                    c = a.itemData.baseMap.baseMapLayers[0];
                    c.errors = [];
                    c.errors.push({
                        message: "The owner of the application has not provided a valid Bing Key for the Bing Map it includes. Switching to Esri layers."
                    });
                    b.callback([a, f])
                })
            } else a.itemData = K(d), c = a.itemData.baseMap.baseMapLayers[0], c.errors = [], c.errors.push({
                message: "The owner of the application has not provided a Bing Key for the Bing Map it includes. Switching to Esri layers."
            }), b.callback([a, f]);
            else b.callback([a, f]);
            return b
        }

        function R(a, f, b, d, c) {
            c.bingKey ? (f.bingMapsKey = c.bingKey, c = new t({
                bingMapsKey: f.bingMapsKey,
                mapStyle: t.MAP_STYLE_AERIAL
            }), s.connect(c, "onLoad", l.hitch(this, function() {
                d.callback([a, f])
            })), s.connect(c, "onError", function(e) {
                delete f.bingMapsKey;
                a.itemData = K(b);
                e = a.itemData.baseMap.baseMapLayers[0];
                e.errors = [];
                e.errors.push({
                    message: "The owner of the map has not provided a valid Bing Key for the Bing Map it includes. Switching to Esri layers."
                });
                d.callback([a, f])
            })) : J(a, f, b, d)
        }

        function J(a, f, b, d) {
            delete f.bingMapsKey;
            a.itemData = K(b);
            b = a.itemData.baseMap.baseMapLayers[0];
            b.errors = [];
            b.errors.push({
                message: "The owner of the map has not provided a Bing Key for the Bing Map it includes. Switching to Esri layers."
            });
            d.callback([a, f])
        }

        function K(a) {
            a.baseMap =
                "BingMapsAerial" === a.baseMap.baseMapLayers[0].type ? {
                    title: "Imagery",
                    baseMapLayers: [{
                        id: "World_Imagery_2017",
                        visibility: !0,
                        opacity: 1,
                        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                    }]
            } : "BingMapsRoad" === a.baseMap.baseMapLayers[0].type ? {
                title: "Streets",
                baseMapLayers: [{
                    id: "World_Street_Map_8421",
                    opacity: 1,
                    visibility: !0,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
                }]
            } : {
                title: "Imagery with Labels",
                baseMapLayers: [{
                    id: "World_Imagery_6611",
                    opacity: 1,
                    visibility: !0,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                }, {
                    id: "World_Boundaries_and_Places_1145",
                    isReference: !0,
                    opacity: 1,
                    visibility: !0,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"
                }]
            };
            return a
        }

        function S(a, f, b, d) {
            var c = a.dynamicLayerInfos || a.layerInfos,
                e = f.layers;
            if (e && c)
                if (d.usePopupManager) {
                    var k;
                    h.forEach(c, function(a) {
                        var d = a.id;
                        if (!a.subLayerIds)
                            for (a = 0; a < e.length; a++) {
                                var c = e[a];
                                if (c.id === d && c.popupInfo) {
                                    k || (k = {});
                                    k[d] = {
                                        infoTemplate: new b(c.popupInfo),
                                        layerUrl: c.layerUrl
                                    };
                                    break
                                }
                            }
                    });
                    k && a.setInfoTemplates(k)
                } else {
                    var q = [],
                        m = [],
                        z = [],
                        p = [],
                        u = [],
                        ja = [];
                    h.forEach(c, function(b) {
                        var d = b.id;
                        if (!b.subLayerIds && -1 !== h.indexOf(a.visibleLayers, d))
                            for (b = 0; b < e.length; b++) {
                                var c = e[b];
                                if (c.id === d) {
                                    m.push(d);
                                    q.push(c.popupInfo);
                                    z.push(c.layerUrl || "");
                                    c.layerDefinition && c.layerDefinition.definitionExpression ? p.push(c.layerDefinition.definitionExpression) : p.push("");
                                    u.push(g.isDefined(c.minScale) ?
                                        c.minScale : null);
                                    ja.push(g.isDefined(c.maxScale) ? c.maxScale : null);
                                    break
                                }
                            }
                    });
                    q.length && (a.__popups = q, a.__popupIds = m, a.__popupUrls = z, a.__popupWhereClauses = p, a.__popupMinScales = u, a.__popupMaxScales = ja, a.__resourceInfo = f.resourceInfo)
                }
        }

        function T(a) {
            if (!a) return !1;
            var f = (new Ba(n.arcgisUrl)).authority;
            return -1 !== a.indexOf(".arcgis.com/") || -1 !== a.indexOf(f)
        }

        function ka(a) {
            return !a ? !1 : -1 !== a.indexOf("/services.arcgisonline.com/") || -1 !== a.indexOf("/server.arcgisonline.com/")
        }

        function A(a) {
            if ("https:" ===
                location.protocol && (T(a) || ka(a))) a = a.replace("http:", "https:");
            return a
        }

        function U(a, f, b) {
            var d = [],
                c;
            a.displayLevels || (d = h.map(a.resourceInfo.tileInfo.lods, function(a) {
                return a.level
            }));
            a.exclusionAreas && (c = l.clone(a.exclusionAreas), c = h.map(c, function(a) {
                a.geometry = new C(a.geometry);
                return a
            }));
            d = new fa(A(a.url), {
                resourceInfo: a.resourceInfo,
                opacity: a.opacity,
                visible: a.visibility,
                displayLevels: a.displayLevels || d,
                id: a.id,
                minScale: a.minScale,
                maxScale: a.maxScale,
                refreshInterval: a.refreshInterval,
                exclusionAreas: c
            });
            b.ignorePopups || S(d, a, f, b);
            return d
        }

        function V(a, f) {
            if (!a || !f || 0 === f.length) return [];
            var b = "," + f + ",",
                d = [],
                c, e = ",";
            for (c = 0; c < a.length; c++)
                if (null !== a[c].subLayerIds) {
                    if (-1 === b.indexOf("," + a[c].id + ",") || -1 < e.indexOf("," + a[c].id + ",")) e += a[c].subLayerIds.toString() + ","
                } else -1 < b.indexOf("," + a[c].id + ",") && -1 === e.indexOf("," + a[c].id + ",") && d.push(a[c].id);
            return d
        }

        function la(a, f, b) {
            var d = new Ua;
            d.format = "png24";
            a.resourceInfo && (a.resourceInfo.supportedImageFormatTypes && -1 < a.resourceInfo.supportedImageFormatTypes.indexOf("PNG32")) &&
                (d.format = "png32");
            var d = new ga(A(a.url), {
                    resourceInfo: a.resourceInfo,
                    opacity: a.opacity,
                    visible: a.visibility,
                    id: a.id,
                    imageParameters: d,
                    minScale: a.minScale,
                    maxScale: a.maxScale,
                    refreshInterval: a.refreshInterval
                }),
                c = a.visibleLayers;
            if (!a.visibleLayers) {
                var e = "";
                h.forEach(d.layerInfos, function(a) {
                    a.defaultVisibility && (e += (0 < e.length ? "," : "") + a.id)
                });
                c = e
            }
            if (a.layers && 0 < a.layers.length) {
                var k = [],
                    q = [],
                    m, g = [],
                    p, u;
                h.forEach(a.layers, function(b) {
                    b.layerDefinition && b.layerDefinition.definitionExpression && (k[b.id] =
                        b.layerDefinition.definitionExpression);
                    if (b.layerDefinition && b.layerDefinition.source) {
                        m = null;
                        u = b.layerDefinition.source;
                        if ("mapLayer" === u.type) {
                            var e = h.filter(a.resourceInfo.layers, function(a) {
                                return a.id === u.mapLayerId
                            });
                            e.length && (m = l.mixin(e[0], b))
                        } else m = l.mixin({}, b);
                        m && (m.source = u, delete m.popupInfo, m = new Sa(m), a.visibleLayers && (e = "string" == typeof a.visibleLayers ? a.visibleLayers.split(",") : a.visibleLayers, -1 < h.indexOf(e, b.id) ? m.defaultVisibility = !0 : m.defaultVisibility = !1), q.push(m))
                    }
                    b.layerDefinition &&
                        (b.layerDefinition.source && b.layerDefinition.drawingInfo) && (p = new Ta(b.layerDefinition.drawingInfo), g[b.id] = p)
                }, this);
                0 < k.length && d.setLayerDefinitions(k);
                0 < q.length ? (d.setDynamicLayerInfos(q, !0), 0 < g.length && d.setLayerDrawingOptions(g, !0)) : (c = V(d.layerInfos, c), d.setVisibleLayers(c))
            } else c = V(d.layerInfos, c), d.setVisibleLayers(c);
            b.ignorePopups || S(d, a, f, b);
            return d
        }

        function $a(a, f, b) {
            var d = new Va;
            d.bandIds = a.bandIds;
            null != a.format && (d.format = a.format, null != a.compressionQuality && (d.compressionQuality =
                a.compressionQuality));
            if (a.renderingRule && a.renderingRule.rasterFunction) {
                var c = new Wa(a.renderingRule);
                d.renderingRule = c
            }
            a.mosaicRule && (c = new Xa(a.mosaicRule), d.mosaicRule = c);
            g.isDefined(a.noData) && (d.noData = a.noData);
            g.isDefined(a.noDataInterpretation) && (d.noDataInterpretation = a.noDataInterpretation);
            g.isDefined(a.interpolation) && (d.interpolation = a.interpolation);
            d = new ha(A(a.url), {
                resourceInfo: a.resourceInfo,
                opacity: a.opacity,
                visible: a.visibility,
                id: a.id,
                imageServiceParameters: d,
                minScale: a.minScale,
                maxScale: a.maxScale,
                refreshInterval: a.refreshInterval
            });
            a.layerDefinition && a.layerDefinition.definitionExpression && d.setDefinitionExpression(a.layerDefinition.definitionExpression, !0);
            !b.ignorePopups && a.popupInfo && d.setInfoTemplate(new f(a.popupInfo));
            return d
        }

        function W(a, f, b) {
            var d = [102113, 102100, 3857],
                c = b || new x(f[0].layerObject.fullExtent.spatialReference),
                e = new x(a.resourceInfo.fullExtent.spatialReference);
            return c.wkt == e.wkt && (c.wkid == e.wkid || g.isDefined(c.latestWkid) && c.latestWkid == e.wkid ||
                g.isDefined(e.latestWkid) && c.wkid == e.latestWkid || g.isDefined(c.latestWkid) && c.latestWkid == e.latestWkid) || c.wkid && e.wkid && h.some(d, function(a) {
                return a === e.wkid
            }) && h.some(d, function(a) {
                return a === c.wkid
            }) ? !0 : !1
        }

        function X(a, f) {
            if (!f[0].layerObject.tileInfo) return !1;
            var b = [];
            h.forEach(f, function(a) {
                a.baseMapLayer && a.layerObject.tileInfo && (b = b.concat(h.map(a.layerObject.tileInfo.lods, function(a) {
                    return a.scale
                })))
            });
            return h.some(a.resourceInfo.tileInfo.lods, function(a) {
                return h.some(b, function(b) {
                    return b ===
                        a.scale
                })
            })
        }

        function Y(a, f, b, d, c) {
            var e, k = b._clazz;
            if ("OpenStreetMap" === a.type) e = new La({
                id: a.id,
                opacity: a.opacity,
                visible: null !== a.visibility && void 0 !== a.visibility ? a.visibility : !0
            });
            else if ("WMS" === a.type) {
                var q = [],
                    m = [];
                h.forEach(a.layers, function(a) {
                    m.push(new Ya({
                        name: a.name,
                        title: a.title,
                        legendURL: a.legendURL
                    }));
                    q.push(a.name)
                }, this);
                a.visibleLayers && (q = a.visibleLayers);
                d = {
                    extent: new C(a.extent[0][0], a.extent[0][1], a.extent[1][0], a.extent[1][1], new x({
                        wkid: 4326
                    })),
                    layerInfos: m,
                    version: a.version,
                    maxWidth: a.maxWidth,
                    maxHeight: a.maxHeight,
                    getMapURL: a.mapUrl,
                    spatialReferences: a.spatialReferences,
                    title: a.title,
                    copyright: a.copyright,
                    minScale: a.minScale || 0,
                    maxScale: a.maxScale || 0,
                    format: a.format
                };
                e = new Na(a.url, {
                    id: a.id,
                    visibleLayers: q,
                    format: "png",
                    transparent: a.baseMapLayer ? !1 : !0,
                    opacity: a.opacity,
                    visible: null !== a.visibility ? a.visibility : !0,
                    resourceInfo: d,
                    refreshInterval: a.refreshInterval
                });
                e.spatialReference.wkid = d.spatialReferences[0]
            } else if ("KML" === a.type) {
                b = a.url;
                if (G.id && (k = G.id.findCredential(ba.urlToObject(n.arcgisUrl).path))) {
                    f =
                        n.arcgisUrl.substring(n.arcgisUrl.indexOf("//") + 2, n.arcgisUrl.indexOf("/", n.arcgisUrl.indexOf("//") + 3));
                    c = f.split(".");
                    c = c[c.length - 2] + "." + c[c.length - 1];
                    var z = b.indexOf(c); - 1 < z && (b = "https://" + f + b.substring(z + c.length));
                    b += "?token\x3d" + k.token
                }
                e = new Oa(b, {
                    id: a.id,
                    visible: null !== a.visibility ? a.visibility : !0,
                    outSR: d,
                    refreshInterval: a.refreshInterval
                });
                s.connect(e, "onLoad", function() {
                    (a.opacity || 0 === a.opacity) && e.setOpacity(a.opacity);
                    g.isDefined(a.minScale) && g.isDefined(a.maxScale) && e.setScaleRange(a.minScale,
                        a.maxScale);
                    a.visibleFolders && h.forEach(e.folders, function(b) {
                        -1 < h.indexOf(a.visibleFolders, b.id) ? e.setFolderVisibility(b, !0) : e.setFolderVisibility(b, !1)
                    }, this)
                })
            } else "WebTiledLayer" === a.type ? (e = new Ma(a.templateUrl, {
                        id: a.id,
                        visible: null !== a.visibility ? a.visibility : !0,
                        opacity: a.opacity,
                        copyright: a.copyright,
                        fullExtent: a.fullExtent && new C(a.fullExtent),
                        initialExtent: a.fullExtent && new C(a.fullExtent),
                        subDomains: a.subDomains,
                        tileInfo: a.tileInfo ? new Ra(a.tileInfo) : null,
                        refreshInterval: a.refreshInterval
                    }),
                    s.connect(e, "onLoad", function() {
                        (g.isDefined(a.minScale) || g.isDefined(a.maxScale)) && e.setScaleRange(a.minScale, a.maxScale)
                    })) : "GeoRSS" === a.type ? (e = new Pa(a.url, {
                    id: a.id,
                    opacity: a.opacity,
                    outSpatialReference: d,
                    refreshInterval: a.refreshInterval
                }), s.connect(e, "onLoad", function() {
                    !1 === a.visibility && e.hide();
                    g.isDefined(a.minScale) && g.isDefined(a.maxScale) && e.setScaleRange(a.minScale, a.maxScale);
                    var b = e.getFeatureLayers();
                    h.forEach(b, function(c) {
                        a.pointSymbol && "esriGeometryPoint" === c.geometryType ? (c.renderer.symbol =
                            D.fromJson(a.pointSymbol), 1 === b.length && (e.pointSymbol = D.fromJson(a.pointSymbol))) : a.lineSymbol && "esriGeometryPolyline" === c.geometryType ? (c.renderer.symbol = D.fromJson(a.lineSymbol), 1 === b.length && (e.polylineSymbol = D.fromJson(a.lineSymbol))) : a.polygonSymbol && "esriGeometryPolygon" === c.geometryType && (c.renderer.symbol = D.fromJson(a.polygonSymbol), 1 === b.length && (e.polygonSymbol = D.fromJson(a.polygonSymbol)))
                    })
                })) : "CSV" == a.type && a.url ? (d = {
                    layerDefinition: a.layerDefinition,
                    columnDelimiter: a.columnDelimiter,
                    id: a.id ? a.id : null,
                    visible: null !== a.visibility ? a.visibility : !0,
                    opacity: a.opacity,
                    refreshInterval: a.refreshInterval
                }, a.locationInfo && (d.latitudeFieldName = a.locationInfo.latitudeFieldName, d.longitudeFieldName = a.locationInfo.longitudeFieldName), b.ignorePopups || (d.infoTemplate = new da(a.popupInfo ? a.popupInfo : ea.generateDefaultPopupInfo(a))), e = new Ka(a.url, d)) : a.layerDefinition && !a.url ? (d = F.fromJson(F.toJson(a)), delete d.id, delete d.opacity, delete d.visibility, e = new y(d, {
                    id: a.id,
                    opacity: a.opacity,
                    visible: a.visibility,
                    outFields: ["*"],
                    autoGeneralize: !0
                }), !b.ignorePopups && d.popupInfo && e.setInfoTemplate(new k(d.popupInfo))) : "BingMapsAerial" === a.type || "BingMapsRoad" === a.type || "BingMapsHybrid" === a.type ? b.bingMapsKey ? (d = t.MAP_STYLE_AERIAL_WITH_LABELS, "BingMapsAerial" === a.type ? d = t.MAP_STYLE_AERIAL : "BingMapsRoad" === a.type && (d = t.MAP_STYLE_ROAD), e = new t({
                    bingMapsKey: b.bingMapsKey,
                    mapStyle: d,
                    opacity: a.opacity,
                    id: a.id
                }), s.connect(e, "onError", l.hitch(this, function(a) {
                    a.errors = a.errors || [];
                    a.errors.push({
                        message: "This application does not have a valid Bing Key for the Bing layer that is included in this map. [type:" +
                            a.type + "]"
                    })
                }, a))) : (a.errors = a.errors || [], a.errors.push({
                    message: "This application does not provide a Bing Key for the Bing layer that is included in this map. [type:" + a.type + "]"
                })) : a.resourceInfo && a.resourceInfo.mapName ? e = !0 === a.resourceInfo.singleFusedMapCache && (a.baseMapLayer || W(a, f, d) && X(a, c)) ? U(a, k, b) : la(a, k, b) : a.resourceInfo && a.resourceInfo.pixelSizeX ? e = !0 === a.resourceInfo.singleFusedMapCache && (a.baseMapLayer || W(a, f, d) && X(a, c)) ? U(a, k, b) : $a(a, k, b) : a.resourceInfo && "Feature Layer" === a.resourceInfo.type &&
                (a.capabilities && (a.resourceInfo.capabilities = a.capabilities), e = new y(A(a.url), {
                    resourceInfo: a.resourceInfo,
                    opacity: a.opacity,
                    visible: a.visibility,
                    id: a.id,
                    mode: T(a.url) ? y.MODE_AUTO : g.isDefined(a.mode) ? a.mode : y.MODE_ONDEMAND,
                    outFields: ["*"],
                    autoGeneralize: !0,
                    refreshInterval: a.refreshInterval
                }), !b.ignorePopups && a.popupInfo && e.setInfoTemplate(new k(a.popupInfo)), a.layerDefinition && (a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.renderer && (d = Ga.fromJson(a.layerDefinition.drawingInfo.renderer),
                    d.isMaxInclusive = !0, e.setRenderer(d)), a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.labelingInfo && (d = h.map(a.layerDefinition.drawingInfo.labelingInfo, function(a) {
                    return new Qa(a)
                }), e.setLabelingInfo(d)), a.layerDefinition.definitionExpression && e.setDefinitionExpression(a.layerDefinition.definitionExpression), g.isDefined(a.layerDefinition.minScale) && e.setMinScale(a.layerDefinition.minScale), g.isDefined(a.layerDefinition.maxScale) && e.setMaxScale(a.layerDefinition.maxScale)));
            e && (e.arcgisProps = {
                title: a.title
            }, a.baseMapLayer && (e._basemapGalleryLayerType = a.isReference ? "reference" : "basemap"));
            return e
        }

        function Z(a, f, b, d) {
            h.forEach(a, function(e, c) {
                if (e.url && !e.type) {
                    if (0 === c || a[0].layerObject) e.layerObject = Y(e, a, f, b, d)
                } else e.layerObject = Y(e, a, f, b, d)
            });
            var c = h.filter(a, function(a) {
                    return !a.isReference
                }),
                e = h.filter(a, function(a) {
                    return !!a.isReference
                });
            return a = c.concat(e)
        }

        function $(a) {
            var f = null;
            a = a[0];
            a.url && !a.type ? a.resourceInfo.spatialReference && (f = new x, a.resourceInfo.spatialReference.wkid &&
                (f.wkid = a.resourceInfo.spatialReference.wkid), a.resourceInfo.spatialReference.wkt && (f.wkt = a.resourceInfo.spatialReference.wkt)) : -1 < a.type.indexOf("BingMaps") || "OpenStreetMap" == a.type ? f = new x({
                wkid: 102100
            }) : "WMS" == a.type && (f = new x({
                wkid: a.spatialReferences[0]
            }));
            return f
        }

        function ma(a, f, b, d, c, e, k) {
            h.forEach(f, function(b, e) {
                b.url && !b.type && (b.resourceInfo = a[b.deferredsPos][1], delete b.deferredsPos)
            });
            e = e || $(f);
            f = Z(f, b, e, k);
            c.callback(f);
            return c
        }

        function na(a, f) {
            var b = A(a);
            return w({
                url: b,
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: function(a, c) {
                    a.message = a.message ? a.message + (" [url:" + b + "]") : "[url:" + b + "]";
                    f.push(a);
                    H.defaults.io.errorHandler(a, c)
                }
            })
        }

        function oa(a) {
            var f = n.arcgisUrl + "/" + a.itemId + "/data";
            return w({
                url: f,
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: function(b, d) {
                    b.message = b.message ? b.message + (" [url:" + f + "]") : "[url:" + f + "]";
                    a.errors = a.errors || [];
                    a.errors.push(b);
                    H.defaults.io.errorHandler(b, d)
                }
            })
        }

        function pa(a, f, b) {
            var d = new r;
            if ((!b.featureCollection || !b.featureCollection.layers) &&
                !b.layers) return console.log("Invalid Feature Collection item data [item id: " + a.itemId + "]: ", b), a.errors = a.errors || [], a.errors.push({
                message: "Invalid Feature Collection item data. [item id: " + a.itemId + "]"
            }), d.errback(), d;
            b.layers && (b.featureCollection = {
                layers: b.layers
            }, delete b.layers, g.isDefined(b.showLegend) && (b.featureCollection.showLegend = b.showLegend, delete b.showLegend));
            qa(a, b.featureCollection, f).then(function(c) {
                b.featureCollection = c;
                a.featureCollection && a.featureCollection.layers ? h.forEach(b.featureCollection.layers,
                    function(b, c) {
                        var d = a.featureCollection.layers[c];
                        if (!d.poupInfo && !d.layerDefinition) d.popupInfo = b.popupInfo, d.layerDefinition = b.layerDefinition;
                        else if (d.layerDefinition) {
                            if (g.isDefined(d.layerDefinition.minScale) && g.isDefined(d.layerDefinition.maxScale) && (d.layerDefinition.minScale !== b.layerDefinition.minScale || d.layerDefinition.maxScale !== b.layerDefinition.maxScale)) delete b.layerDefinition.minscale, delete b.layerDefinition.maxScale;
                            d.layerDefinition.drawingInfo && F.toJson(d.layerDefinition.drawingInfo) !==
                                F.toJson(b.layerDefinition.drawingInfo) && delete b.layerDefinition.drawingInfo;
                            d.layerDefinition.showLegend !== b.layerDefinition.showLegend && delete b.layerDefinition.showLegend;
                            d.layerDefinition = l.mixin(d.layerDefinition, b.layerDefinition)
                        } else d.layerDefinition = b.layerDefinition;
                        d.featureSet = b.featureSet;
                        d.nextObjectId = b.nextObjectId
                    }) : (a.featureCollection = a.featureCollection || {}, a.featureCollection = l.mixin(a.featureCollection, b.featureCollection));
                d.callback(a)
            });
            return d
        }

        function qa(a, f, b) {
            var d =
                new r,
                c = [];
            h.forEach(f.layers, function(a) {
                a.featureSet && (a.featureSet.features && a.featureSet.features.length && a.featureSet.features[0].geometry && a.featureSet.features[0].geometry.spatialReference) && (a.deferredsPos = c.length, c.push(ea.projectFeatureCollection(a, b, a.featureSet.features[0].geometry.spatialReference)))
            });
            (new B(c)).addCallback(function() {
                h.forEach(f.layers, function(b) {
                    g.isDefined(b.deferredsPos) && (c[b.deferredsPos].results && c[b.deferredsPos].results.length ? b = c[b.deferredsPos].results[0] :
                        (console.log("Errors projecting feature collection. [" + a.title + " - " + b.layerDefinition.name + "]"), b.errors = b.errors || [], b.errors.push({
                            message: "Errors projecting feature collection. [" + a.title + " - " + b.layerDefinition.name + "]"
                        })), delete b.deferredsPos)
                });
                d.callback(f)
            });
            return d
        }

        function L(a, f, b, d) {
            var c = new r,
                e = new r,
                k = [],
                g;
            h.forEach(a.operationalLayers, function(a) {
                a.itemId && "Feature Collection" == a.type && k.push(oa(a).then(l.hitch(null, pa, a, b)))
            });
            0 === k.length ? ra(a, f, b, d, e) : (g = new B(k), g.addCallback(function(c) {
                ra(a,
                    f, b, d, e)
            }));
            e.then(function(a) {
                k = [];
                h.forEach(a, function(a) {
                    a = a.layerObject;
                    if (a instanceof y && !a.loaded && !a.loadError) {
                        var b = new r;
                        Ca.once(a, "load, error", function() {
                            b.callback(a)
                        });
                        k.push(b)
                    }
                });
                if (k.length) {
                    var b = new r;
                    g = new B(k);
                    g.addCallback(function() {
                        b.callback(a)
                    });
                    return b.promise
                }
                return a
            }).then(function(a) {
                var b = [];
                h.forEach(a, function(a) {
                    if (a.layerObject instanceof y) {
                        var c = a.layerObject;
                        c.loaded && (c.labelingInfo && (a.showLabels || c._collection)) && b.push(c)
                    }
                });
                b.length ? Aa(["../layers/LabelLayer"],
                    function(d) {
                        var e = new d;
                        h.forEach(b, function(a) {
                            e.addFeatureLayer(a)
                        });
                        a.push({
                            layerObject: e
                        });
                        c.callback(a)
                    }) : c.callback(a)
            });
            return c
        }

        function ra(a, f, b, d, c) {
            var e = [],
                k = [],
                g = [];
            h.forEach(a.operationalLayers, function(a, b) {
                a.featureCollection ? h.forEach(a.featureCollection.layers, function(c, d) {
                    var e = !0;
                    a.visibleLayers && -1 == h.indexOf(a.visibleLayers, d) && (e = !1);
                    c.visibility = a.visibility && e;
                    c.opacity = a.opacity;
                    c.id = (a.id || "operational" + b) + "_" + d;
                    g.push(c)
                }, this) : g.push(a)
            });
            h.forEach(a.baseMap.baseMapLayers,
                function(a, b) {
                    a.baseMapLayer = !0;
                    a.id = a.id || "base" + b;
                    e.push(a)
                });
            h.forEach(g, function(a, b) {
                a.id = a.id || "operational" + b;
                e.push(a)
            });
            h.forEach(e, function(a) {
                a.url && !a.type && (a.deferredsPos = k.length, a.errors = a.errors || [], k.push(na(a.url, a.errors)))
            });
            0 === k.length ? (b = b || $(e), e = Z(e, f, b, d), c.callback(e)) : (new B(k)).addCallback(function(a) {
                ma(a, e, f, k, c, b, d)
            });
            return c
        }

        function M(a, f, b, d) {
            var c = a.minScale,
                e = a.maxScale;
            if (10.1 >= b.version && f)
                for (a = f.length - 1; 0 <= a; a--) {
                    if (f[a].id == d)
                        if (0 == c && 0 < f[a].minScale ? c =
                            f[a].minScale : 0 < c && 0 == f[a].minScale ? c = b.minScale : 0 < c && 0 < f[a].minScale && (c = Math.min(c, f[a].minScale)), e = Math.max(b.maxScale || 0, f[a].maxScale || 0), b.setScaleRange(c, e), -1 < f[a].parentLayerId) d = f[a].parentLayerId;
                        else break
                } else 10.1 < b.version && (h.forEach(a.layerInfos, function(a) {
                    a.id == d && (0 == c && 0 < a.minScale ? c = a.minScale : 0 < c && 0 == a.minScale || 0 < c && 0 < a.minScale && (c = Math.min(c, a.minScale)), e = Math.max(e || 0, a.maxScale || 0))
                }), b.setScaleRange(c, e))
        }

        function N(a, f, b, d) {
            var c = a.url,
                e = a.__popupIds,
                k = a.__popupUrls,
                q = a.__popupWhereClauses,
                m = a.__popupMinScales,
                z = a.__popupMaxScales,
                p = a.__resourceInfo,
                u = [];
            h.forEach(a.__popups, function(d, l) {
                if (d) {
                    var n, r = [];
                    h.forEach(d.fieldInfos, function(a) {
                        "shape" !== a.fieldName.toLowerCase() && r.push(a.fieldName)
                    });
                    if (a.dynamicLayerInfos && 0 < a.dynamicLayerInfos.length) {
                        var t = h.filter(a.dynamicLayerInfos, function(a) {
                            return e[l] == a.id
                        })[0].source;
                        n = new y(c + "/dynamicLayer", {
                            id: a.id + "_" + e[l],
                            source: t,
                            outFields: r,
                            mode: y.MODE_SELECTION,
                            infoTemplate: d && new b(d),
                            drawMode: !1,
                            visible: a.visible,
                            autoGeneralize: !0
                        });
                        var v = function(b, c) {
                            0 < q[b].length && c.setDefinitionExpression(q[b]);
                            if (!g.isDefined(m[b]) && !g.isDefined(z[b])) M(a, f || p.layers, c, e[b]);
                            else if (g.isDefined(a.minScale) || g.isDefined(a.maxScale)) {
                                var d = a.minScale,
                                    k = a.maxScale;
                                0 == d && 0 < m[b] ? d = m[b] : 0 < d && 0 == m[b] || 0 < d && 0 < m[b] && (d = Math.min(d, m[b]));
                                k = Math.max(k || 0, z[b] || 0);
                                c.setScaleRange(d, k)
                            } else c.setScaleRange(m[b], z[b])
                        };
                        n.loaded ? v(l, n) : s.connect(n, "onLoad", function(a) {
                            v(l, n)
                        })
                    } else {
                        var w = null,
                            x = c + "/" + e[l];
                        if (k[l].length) x = k[l];
                        else if (f)
                            for (t =
                                0; t < f.length; t++)
                                if (f[t].id === e[l]) {
                                    w = f[t];
                                    break
                                }
                        n = new y(A(x), {
                            id: a.id + "_" + e[l],
                            outFields: r,
                            mode: y.MODE_SELECTION,
                            infoTemplate: d && new b(d),
                            drawMode: !1,
                            visible: a.visible,
                            resourceInfo: w,
                            autoGeneralize: !0
                        });
                        n.loaded ? (0 < q[l].length && n.setDefinitionExpression(q[l]), M(a, f || p.layers, n, e[l])) : s.connect(n, "onLoad", function(b) {
                            0 < q[l].length && n.setDefinitionExpression(q[l]);
                            M(a, f || p.layers, b, e[l])
                        })
                    }
                    u.push(n)
                }
            });
            0 < u.length && (s.connect(a, "onVisibilityChange", l.hitch(this, function(a, b) {
                h.forEach(a, function(a) {
                    b ?
                        a.show() : a.hide()
                })
            }, u)), s.connect(d, "onLayerRemove", l.hitch(this, function(a, b, c) {
                a.id === c.id && h.forEach(b, function(a) {
                    d.removeLayer(a)
                })
            }, a, u)));
            delete a.__popups;
            delete a.__popupIds;
            delete a.__popupUrls;
            delete a.__popupWhereClauses;
            delete a.__popupMinScales;
            delete a.__popupMaxScales;
            delete a.__resourceInfo;
            return u
        }

        function sa(a) {
            return w({
                url: A(a.url + "/layers"),
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: function() {}
            })
        }

        function ta(a, f, b) {
            var d = [];
            h.forEach(a, function(a) {
                var b = a.__popups;
                b && (1 < b.length && 10 <= a.version) && (a.__deferredsPos = d.length, d.push(sa(a)))
            });
            var c = [];
            0 < d.length ? (new B(d)).addCallback(function(d) {
                h.forEach(a, function(a) {
                    a.__popups && 0 < a.__popups.length && (a.__deferredsPos || 0 === a.__deferredsPos ? (c = c.concat(N(a, d[a.__deferredsPos][1].layers, b, f)), delete a.__deferredsPos) : c = c.concat(N(a, null, b, f)))
                });
                f.addLayers(c)
            }) : (h.forEach(a, function(a) {
                a.__popups && 0 < a.__popups.length && (c = c.concat(N(a, null, b, f)))
            }), f.addLayers(c))
        }

        function ua(a) {
            h.forEach(a, function(a) {
                var b = a.layer;
                b.toJson && (a = b.toJson(), a.featureSet && -1 < b.name.indexOf("Text") && h.forEach(a.featureSet.features, function(a, c) {
                    if (a.attributes.TEXT) {
                        var e = b.graphics[c];
                        e.symbol.setText(a.attributes.TEXT);
                        a.symbol.horizontalAlignment && (e.symbol.align = a.symbol.horizontalAlignment);
                        e.setSymbol(e.symbol);
                        e.setAttributes(a.attributes)
                    }
                }, this))
            })
        }

        function va(a) {
            var f = 6;
            h.forEach(a, function(a) {
                if (a = a.renderer) "esri.renderer.SimpleRenderer" === a.declaredClass ? ((a = a.symbol) && a.xoffset && (f = Math.max(f, Math.abs(a.xoffset))),
                    a && a.yoffset && (f = Math.max(f, Math.abs(a.yoffset)))) : ("esri.renderer.UniqueValueRenderer" === a.declaredClass || "esri.renderer.ClassBreaksRenderer" === a.declaredClass) && h.forEach(a.infos, function(a) {
                    (a = a.symbol) && a.xoffset && (f = Math.max(f, Math.abs(a.xoffset)));
                    a && a.yoffset && (f = Math.max(f, Math.abs(a.yoffset)))
                })
            });
            return f
        }

        function aa(a) {
            var f = this,
                b = f.infoWindow,
                d = a.graphic;
            if (f.loaded) {
                b.hide();
                b.clearFeatures();
                var c = [];
                h.forEach(f.graphicsLayerIds, function(a) {
                    if ((a = f.getLayer(a)) && -1 !== a.declaredClass.indexOf("FeatureLayer") &&
                        a.loaded && a.visible) a.clearSelection(), a.infoTemplate && !a.suspended && c.push(a)
                });
                h.forEach(f.layerIds, function(a) {
                    (a = f.getLayer(a)) && (-1 !== a.declaredClass.indexOf("ArcGISImageServiceLayer") && a.loaded && a.visible && a.infoTemplate) && c.push(a)
                });
                d = d && d.getInfoTemplate() ? d : null;
                if (c.length || d) {
                    var e = va(c),
                        k = a.screenPoint,
                        g = f.toMap(new ca(k.x - e, k.y + e)),
                        e = f.toMap(new ca(k.x + e, k.y - e)),
                        g = new C(g.x, g.y, e.x, e.y, f.spatialReference),
                        m = new Ia;
                    m.geometry = g;
                    m.timeExtent = f.timeExtent;
                    var l = !0,
                        g = h.map(c, function(b) {
                            var c; - 1 !== b.declaredClass.indexOf("ArcGISImageServiceLayer") ? (m.geometry = a.mapPoint, l = !1, c = b.queryVisibleRasters(m, {
                                rasterAttributeTableFieldPrefix: "Raster.",
                                returnDomainValues: !0
                            }), c.addCallback(function() {
                                return b.getVisibleRasters()
                            })) : (c = b.selectFeatures(m), c.addCallback(function() {
                                return b.getSelectedFeatures()
                            }));
                            return c
                        });
                    d && (e = new r, e.callback([d]), g.splice(0, 0, e));
                    if (!h.some(g, function(a) {
                        return -1 === a.fired
                    })) {
                        var p = d ? 1 : 0;
                        h.forEach(c, function(a) {
                            p = -1 !== a.declaredClass.indexOf("ArcGISImageServiceLayer") ?
                                p + a.getVisibleRasters().length : p + a.getSelectedFeatures().length
                        });
                        if (!p) return
                    }
                    b.setFeatures(g);
                    b.show(a.mapPoint, {
                        closestFirst: l
                    })
                }
            }
        }

        function ab(a, f) {
            var b = f.mapOptions || {},
                d;
            b.infoWindow || (d = new Ha({
                visibleWhenEmpty: !1
            }, Da.create("div")), b.infoWindow = d);
            !g.isDefined(b.showInfoWindowOnClick) && !f.usePopupManager && (b.showInfoWindowOnClick = !1);
            b = new Ea(a, b);
            s.connect(b, "onLayersAddResult", ua);
            return b
        }

        function v(a, f, b, d, c, e) {
            var k, g, m, l;
            d.map ? (k = d.map, g = d.clickEventHandle, m = d.clickEventListener, l = d.errors) :
                (k = ab(d, c), !c.ignorePopups && (!c.disableClickBehavior && !c.usePopupManager) && (g = s.connect(k, "onClick", aa), m = aa));
            k.addLayers(a);
            !c.ignorePopups && !c.usePopupManager && ta(a, k, c._clazz);
            var p = l || [];
            h.forEach(f, function(a) {
                a.errors && (p = p.concat(a.errors))
            }, this);
            k.loaded ? e.callback({
                map: k,
                itemInfo: b,
                errors: p,
                clickEventHandle: g,
                clickEventListener: m
            }) : s.connect(k, "onLoad", function() {
                e.callback({
                    map: k,
                    itemInfo: b,
                    errors: p,
                    clickEventHandle: g,
                    clickEventListener: m
                })
            })
        }

        function O(a, f, b, d, c) {
            var e = [];
            h.forEach(c,
                function(a) {
                    l.isArray(a.layerObject) ? h.forEach(a.layerObject, function(a) {
                        e.push(a)
                    }) : e.push(a.layerObject)
                });
            if ("BingMapsAerial" === c[0].type || "BingMapsRoad" === c[0].type || "BingMapsHybrid" === c[0].type) var k = setInterval(function() {
                if (c[0].layerObject && c[0].layerObject.loaded) clearInterval(k), wa(a, f, b, d, c, e);
                else if (c[0].errors) {
                    clearInterval(k);
                    var g = "";
                    c[0].errors && c[0].errors.length && (g = " (" + c[0].errors[0].message + ")");
                    d.errback(Error(P.arcgis.utils.baseLayerError + g))
                }
            }, 10);
            else if (!e[0] && c[0].baseMapLayer) {
                var g =
                    "";
                c[0].errors && c[0].errors.length && (g = " (" + c[0].errors[0].message + ")");
                d.errback(Error(P.arcgis.utils.baseLayerError + g))
            } else wa(a, f, b, d, c, e)
        }

        function wa(a, f, b, d, c, e) {
            try {
                var k = b.mapOptions || {};
                b.mapOptions = k;
                var l = a.item;
                e = h.filter(e, g.isDefined);
                if (l)
                    if (l.extent && l.extent.length)
                        if (k.extent) v(e, c, a, f, b, d);
                        else {
                            var m = new C(l.extent[0][0], l.extent[0][1], l.extent[1][0], l.extent[1][1], new x({
                                    wkid: 4326
                                })),
                                n = e[0].spatialReference;
                            4326 === n.wkid ? (k.extent = m, v(e, c, a, f, b, d)) : 102100 === n.wkid || 102113 === n.wkid ||
                                3857 === n.wkid ? (m.xmin = Math.max(m.xmin, -180), m.xmax = Math.min(m.xmax, 180), m.ymin = Math.max(m.ymin, -89.99), m.ymax = Math.min(m.ymax, 89.99), k.extent = Fa.geographicToWebMercator(m), v(e, c, a, f, b, d)) : b.geometryServiceURL || H.defaults.geometryService ? (b.geometryServiceURL ? new Ja(b.geometryServiceURL) : H.defaults.geometryService).project([m], n, function(g) {
                                    g = g[0];
                                    k.extent = k.extent || g;
                                    v(e, c, a, f, b, d)
                                }, function() {
                                    v(e, c, a, f, b, d)
                                }) : d.errback(Error(P.arcgis.utils.geometryServiceError))
                        } else v(e, c, a, f, b, d);
                else v(e, c, a,
                    f, b, d)
            } catch (p) {
                d.errback(p)
            }
        }

        function xa(a) {
            var f = [];
            a = a.baseMap.baseMapLayers.concat(a.operationalLayers);
            h.forEach(a, function(a, d) {
                var c = {};
                if (a.featureCollection && "CSV" !== a.type)!0 === a.featureCollection.showLegend && h.forEach(a.featureCollection.layers, function(d) {
                    !1 !== d.showLegend && (c = {
                        layer: d.layerObject,
                        title: a.title,
                        defaultSymbol: d.renderer && d.renderer.defaultSymbol && d.renderer.defaultLabel ? !0 : !1
                    }, 1 < a.featureCollection.layers.length && (c.title += " - " + d.layerDefinition.name), f.push(c))
                });
                else if (a.baseMapLayer &&
                    !0 === a.showLegend && a.layerObject || !a.baseMapLayer && !1 !== a.showLegend && a.layerObject) {
                    var e = a.layerObject.renderer,
                        e = !e || e && e.defaultSymbol && e.defaultLabel ? !0 : !1;
                    if (10.1 > a.layerObject.version && (a.layerObject instanceof ga || a.layerObject instanceof fa) || a.layerObject instanceof ha) e = !0;
                    c = {
                        layer: a.layerObject,
                        title: a.title,
                        defaultSymbol: e
                    };
                    a.layers && (e = h.map(h.filter(a.layers, function(a) {
                        return !1 === a.showLegend
                    }), function(a) {
                        return a.id
                    }), e.length && (c.hideLayers = e));
                    f.push(c)
                }
            });
            return f
        }

        function ya(a,
            f, b, d) {
            Za(d, f).then(function(c) {
                var d = c[0],
                    f = c[1];
                if (!d.itemData.operationalLayers || 0 === d.itemData.operationalLayers.length) I(d, f).addCallback(function(c) {
                    L(c.itemData, f).addCallback(l.hitch(null, O, c, a, f, b))
                });
                else {
                    var g = new r,
                        m = d.itemData.baseMap.baseMapLayers.slice(0),
                        n = h.filter(d.itemData.baseMap.baseMapLayers, function(a) {
                            return !a.isReference
                        });
                    c = {
                        item: d.item,
                        itemData: {
                            baseMap: {
                                baseMapLayers: n
                            }
                        }
                    };
                    d.itemData.baseMap.baseMapLayers = h.filter(d.itemData.baseMap.baseMapLayers, function(a) {
                        return a.isReference
                    });
                    I(c, f).addCallback(function(b) {
                        L(b.itemData, f).addCallback(l.hitch(null, O, b, a, f, g))
                    });
                    g.then(function(a) {
                        I(d, f).addCallback(function(c) {
                            L(c.itemData, f, a.map.spatialReference, n).addCallback(function(d) {
                                c.itemData.baseMap.baseMapLayers = m;
                                O(c, a, f, b, d)
                            })
                        })
                    }, l.hitch(b, b.errback))
                }
            })
        }

        function za(a) {
            n._arcgisUrl && 0 < n._arcgisUrl.length && (n.arcgisUrl = n._arcgisUrl);
            var f = n.arcgisUrl + "/" + a,
                b = {},
                d = new r;
            w({
                url: f,
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                load: function(a) {
                    b.item = a;
                    w({
                        url: f + "/data",
                        content: {
                            f: "json"
                        },
                        callbackParamName: "callback",
                        load: function(a) {
                            b.itemData = a;
                            d.callback(b)
                        },
                        error: function(a) {
                            d.errback(a)
                        }
                    })
                },
                error: function(a) {
                    d.errback(a)
                }
            });
            return d
        }
        String.prototype.endsWith = function(a) {
            return this.match(a + "$") == a
        };
        var n;
        n = {
            arcgisUrl: location.protocol + "//www.arcgis.com/sharing/rest/content/items",
            getItem: za,
            createMap: function(a, f, b) {
                var d = new r;
                b = b || {};
                var c = b.infoTemplateClass;
                b._clazz = c && (l.isObject(c) ? c : l.getObject(c)) || da;
                l.isString(a) ? za(a).addCallback(l.hitch(null, ya, f, b, d)).addErrback(l.hitch(d,
                    d.errback)) : ya(f, b, d, a);
                return d
            },
            getLegendLayers: function(a) {
                return a && a.itemInfo && a.itemInfo.itemData ? xa(a.itemInfo.itemData) : []
            },
            _arcgisUrl: null,
            _getItemProps: I,
            _getItemData: E,
            _getBingKey: Q,
            _portalUrlResponse: R,
            _portalUrlFailure: J,
            _processFSItemProperties: ia,
            _getLayers: L,
            _preBuildLayerObjects: ma,
            _buildLayerObjects: Z,
            _preCreateMap: O,
            _getMapSR: $,
            _createMap: v,
            _addSelectionLayers: ta,
            _createSelectionFeatureLayers: N,
            _getServiceInfo: na,
            _getFeatureCollectionItem: oa,
            _mergeFeatureCollectionItem: pa,
            _projectFeatureCollection: qa,
            _getLayersInfo: sa,
            _initLayer: Y,
            _loadAsCached: U,
            _loadAsDynamic: la,
            _processPopups: S,
            _onLayersAddResult: ua,
            _sameSpatialReferenceAsBasemap: W,
            _sameTilingSchemeAsBasemap: X,
            _showPopup: aa,
            _calculateClickTolerance: va,
            _getVisibleFeatureLayers: V,
            _updateLayerScaleInfo: M,
            _checkUrl: A,
            _isHostedService: T,
            _isAgolService: ka,
            _getLegendLayers: xa
        };
        l.setObject("arcgis.utils", n, G);
        return n
    });