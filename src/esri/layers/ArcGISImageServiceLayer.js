//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Deferred", "dojo/_base/array", "dojo/_base/json", "dojo/_base/config", "dojo/has", "dojo/io-query", "../kernel", "../config", "../lang", "../request", "../deferredUtils", "../urlUtils", "../geometry/Extent", "../geometry/Point", "../SpatialReference", "./MosaicRule", "./DynamicMapServiceLayer", "./TimeInfo", "./Field", "../graphic", "../tasks/ImageServiceIdentifyTask", "../tasks/ImageServiceIdentifyParameters", "../geometry/Polygon"], function(I, e, A, x, B, F, S, J, T, G, C, s, m, E, H, K, U, D, L, M, N, O, P, Q, R) {
    return I(L, {
        declaredClass: "esri.layers.ArcGISImageServiceLayer",
        _eventMap: {
            "rendering-change": !0,
            "mosaic-rule-change": !0
        },
        constructor: function(a, c) {
            this._url = E.urlToObject(a);
            var b = c && c.imageServiceParameters;
            this.format = b && b.format;
            this.interpolation = b ? b.interpolation : null;
            this.compressionQuality = b ? b.compressionQuality : null;
            this.bandIds = b ? b.bandIds : null;
            this.mosaicRule = b ? b.mosaicRule : null;
            this.renderingRule = b ? b.renderingRule : null;
            this._params = e.mixin({}, this._url.query, {
                f: "image",
                interpolation: this.interpolation,
                format: this.format,
                compressionQuality: this.compressionQuality,
                bandIds: this.bandIds ? this.bandIds.join(",") : null
            }, b ? b.toJson() : {});
            this._initLayer = e.hitch(this, this._initLayer);
            this._queryVisibleRastersHandler = e.hitch(this, this._queryVisibleRastersHandler);
            this._visibleRasters = [];
            this.useMapImage = c && c.useMapImage || !1;
            this.infoTemplate = c && c.infoTemplate;
            this._rasterAttributeTableFields = [];
            this._rasterAttributeTableFeatures = [];
            this._loadCallback = c && c.loadCallback;
            (b = c && c.resourceInfo) ? this._initLayer(b) :
                s({
                    url: this._url.path,
                    content: e.mixin({
                        f: "json"
                    }, this._url.query),
                    callbackParamName: "callback",
                    load: this._initLayer,
                    error: this._errorHandler
                });
            this.registerConnectEvents()
        },
        disableClientCaching: !1,
        _initLayer: function(a, c) {
            this._findCredential();
            (this.credential && this.credential.ssl || a && a._ssl) && this._useSSL();
            var b = this.minScale,
                d = this.maxScale;
            e.mixin(this, a);
            this.minScale = b;
            this.maxScale = d;
            this.initialExtent = this.fullExtent = this.extent = new H(a.extent);
            this.spatialReference = this.initialExtent.spatialReference;
            this.pixelSizeX = parseFloat(this.pixelSizeX);
            this.pixelSizeY = parseFloat(this.pixelSizeY);
            for (var h = this.minValues, n = this.maxValues, f = this.meanValues, q = this.stdvValues, k = this.bands = [], b = 0, d = this.bandCount; b < d; b++) k[b] = {
                min: h[b],
                max: n[b],
                mean: f[b],
                stddev: q[b]
            };
            this.timeInfo = (b = this.timeInfo) && b.timeExtent ? new M(b) : null;
            d = this.fields = [];
            if (h = a.fields)
                for (b = 0; b < h.length; b++) d.push(new N(h[b]));
            this.version = a.currentVersion;
            this.version || (this.version = "fields" in a || "objectIdField" in a || "timeInfo" in a ? 10 :
                9.3);
            C.isDefined(a.minScale) && !this._hasMin && this.setMinScale(a.minScale);
            C.isDefined(a.maxScale) && !this._hasMax && this.setMaxScale(a.maxScale);
            b = {};
            a.defaultMosaicMethod ? (b.method = a.defaultMosaicMethod, b.operation = a.mosaicOperator, b.sortField = a.sortField, b.sortValue = a.sortValue) : b.method = D.METHOD_NONE;
            this.defaultMosaicRule = new D(b);
            this.defaultMosaicRule.ascending = !0;
            10 < this.version && this.hasRasterAttributeTable && this.getRasterAttributeTable().then(e.hitch(this, function(a) {
                a && (a.features && 0 < a.features.length) &&
                    (this._rasterAttributeTableFeatures = e.clone(a.features));
                a && (a.fields && 0 < a.fields.length) && (this._rasterAttributeTableFields = e.clone(a.fields))
            }));
            this.loaded = !0;
            this.onLoad(this);
            if (b = this._loadCallback) delete this._loadCallback, b(this)
        },
        getKeyProperties: function() {
            var a = this._url.path + "/keyProperties",
                c = new A(m._dfdCanceller);
            10 < this.version ? (c._pendingDfd = s({
                url: a,
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback"
            }), c._pendingDfd.then(function(a) {
                c.callback(a)
            }, function(a) {
                c.errback(a)
            })) :
                (a = Error("Layer does not have key properties"), a.log = F.isDebug, c.errback(a));
            return c
        },
        getRasterAttributeTable: function() {
            var a = this._url.path + "/rasterAttributeTable",
                c = new A(m._dfdCanceller);
            10 < this.version && this.hasRasterAttributeTable ? (c._pendingDfd = s({
                url: a,
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback"
            }), c._pendingDfd.then(function(a) {
                c.callback(a)
            }, function(a) {
                c.errback(a)
            })) : (a = Error("Layer does not support raster attribute table"), a.log = F.isDebug, c.errback(a));
            return c
        },
        _getRasterAttributeTableFeatures: function() {
            var a =
                new A;
            if (this._rasterAttributeTableFeatures && 0 < this._rasterAttributeTableFeatures.length) return a.resolve(this._rasterAttributeTableFeatures), a;
            if (10 < this.version && this.hasRasterAttributeTable) return a = this.getRasterAttributeTable(), a.then(e.hitch(this, function(a) {
                a && (a.features && 0 < a.features.length) && (this._rasterAttributeTableFeatures = e.clone(a.features))
            })), a;
            a.resolve(this._rasterAttributeTableFeatures);
            return a
        },
        getCustomRasterFields: function(a) {
            var c = a ? a.rasterAttributeTableFieldPrefix : "",
                b = {
                    name: "Raster.ItemPixelValue",
                    alias: "Item Pixel Value",
                    domain: null,
                    editable: !1,
                    length: 50,
                    type: "esriFieldTypeString"
                };
            a = this.fields ? e.clone(this.fields) : [];
            var d = a.length;
            a[d] = {
                name: "Raster.ServicePixelValue",
                alias: "Service Pixel Value",
                domain: null,
                editable: !1,
                length: 50,
                type: "esriFieldTypeString"
            };
            if (this.capabilities && -1 < this.capabilities.toLowerCase().indexOf("catalog") || this.fields && 0 < this.fields.length) a[d + 1] = b;
            this._rasterAttributeTableFields && 0 < this._rasterAttributeTableFields.length && (b = x.filter(this._rasterAttributeTableFields,
                function(a) {
                    return "esriFieldTypeOID" !== a.type && "value" !== a.name.toLowerCase()
                }), b = x.map(b, function(a) {
                var b = e.clone(a);
                b.name = c + a.name;
                return b
            }), a = a.concat(b));
            return a
        },
        getImageUrl: function(a, c, b, d) {
            var h = a.spatialReference.wkid || B.toJson(a.spatialReference.toJson());
            delete this._params._ts;
            var n = this._url.path + "/exportImage?";
            e.mixin(this._params, {
                bbox: a.xmin + "," + a.ymin + "," + a.xmax + "," + a.ymax,
                imageSR: h,
                bboxSR: h,
                size: c + "," + b
            }, this.disableClientCaching ? {
                _ts: (new Date).getTime()
            } : {});
            var f = this._params.token =
                this._getToken();
            a = E.addProxy(n + J.objectToQuery(e.mixin(this._params, {
                f: "image"
            })));
            a.length > G.defaults.io.postLength || this.useMapImage ? this._jsonRequest = s({
                url: n,
                content: e.mixin(this._params, {
                    f: "json"
                }),
                callbackParamName: "callback",
                load: function(a, b) {
                    var c = a.href;
                    f && (c += -1 === c.indexOf("?") ? "?token\x3d" + f : "\x26token\x3d" + f);
                    d(E.addProxy(c))
                },
                error: this._errorHandler
            }) : d(a)
        },
        onRenderingChange: function() {},
        onMosaicRuleChange: function() {},
        setInterpolation: function(a, c) {
            this.interpolation = this._params.interpolation =
                a;
            c || this.refresh(!0)
        },
        setCompressionQuality: function(a, c) {
            this.compressionQuality = this._params.compressionQuality = a;
            c || this.refresh(!0)
        },
        setBandIds: function(a, c) {
            var b = !1;
            this.bandIds !== a && (b = !0);
            this.bandIds = a;
            this._params.bandIds = a.join(",");
            if (b && !c) this.onRenderingChange();
            c || this.refresh(!0)
        },
        setDefaultBandIds: function(a) {
            this.bandIds = this._params.bandIds = null;
            a || this.refresh(!0)
        },
        setDisableClientCaching: function(a) {
            this.disableClientCaching = a
        },
        setMosaicRule: function(a, c) {
            var b = !1;
            this.mosaicRule !==
                a && (b = !0);
            this.mosaicRule = a;
            this._params.mosaicRule = B.toJson(a.toJson());
            if (b && !c) this.onMosaicRuleChange();
            c || this.refresh(!0)
        },
        setRenderingRule: function(a, c) {
            var b = !1;
            this.renderingRule !== a && (b = !0);
            this.renderingRule = a;
            this._params.renderingRule = a ? B.toJson(a.toJson()) : null;
            if (b && !c) this.onRenderingChange();
            c || this.refresh(!0)
        },
        setImageFormat: function(a, c) {
            this.format = this._params.format = a;
            c || this.refresh(!0)
        },
        setInfoTemplate: function(a) {
            this.infoTemplate = a
        },
        setDefinitionExpression: function(a, c) {
            var b =
                this.mosaicRule ? this.mosaicRule.toJson() : {};
            this.mosaicRule || (this.defaultMosaicRule ? b = this.defaultMosaicRule.toJson() : b.method = D.METHOD_NONE);
            b.where = a;
            b = new D(b);
            this.setMosaicRule(b, c);
            return this
        },
        getDefinitionExpression: function() {
            return this.mosaicRule ? this.mosaicRule.where : null
        },
        refresh: function(a) {
            if (a) this.inherited(arguments);
            else {
                var c = this.disableClientCaching;
                this.disableClientCaching = !0;
                this.inherited(arguments);
                this.disableClientCaching = c
            }
        },
        exportMapImage: function(a, c) {
            var b = G.defaults.map,
                b = e.mixin({
                    size: b.width + "," + b.height
                }, this._params, a ? a.toJson(this.normalization) : {}, {
                    f: "json"
                });
            delete b._ts;
            this._exportMapImage(this._url.path + "/exportImage", b, c)
        },
        queryVisibleRasters: function(a, c, b, d) {
            var h = this._map,
                e = m._fixDfd(new A(m._dfdCanceller));
            this._visibleRasters = [];
            var f, q, k = !0,
                g;
            if (this.infoTemplate && this.infoTemplate.info.fieldInfos && 0 < this.infoTemplate.info.fieldInfos.length) {
                k = !1;
                g = this.infoTemplate.info;
                for (f = 0; f < g.fieldInfos.length; f++)
                    if ((q = g.fieldInfos[f]) && "raster.servicepixelvalue" !==
                        q.fieldName.toLowerCase() && (q.visible || g.title && -1 < g.title.toLowerCase().indexOf(q.fieldName.toLowerCase()))) {
                        k = !0;
                        break
                    }
            }
            f = new Q;
            f.geometry = a.geometry;
            f.returnGeometry = this._map.spatialReference.equals(this.spatialReference);
            f.returnCatalogItems = k;
            f.timeExtent = a.timeExtent;
            f.mosaicRule = this.mosaicRule ? this.mosaicRule : null;
            f.renderingRule = this.renderingRule ? this.renderingRule : null;
            h && (a = new K((h.extent.xmax - h.extent.xmin) / (2 * h.width), (h.extent.ymax - h.extent.ymin) / (2 * h.height), h.extent.spatialReference),
                f.pixelSize = a);
            var l = this;
            a = new P(this.url);
            (e._pendingDfd = a.execute(f)).addCallbacks(function(a) {
                l._queryVisibleRastersHandler(a, c, b, d, e)
            }, function(a) {
                l._resolve([a], null, d, e, !0)
            });
            return e
        },
        _queryVisibleRastersHandler: function(a, c, b, d, h) {
            function n() {
                var a = this.getCustomRasterFields(c),
                    d = this._getDomainFields(a),
                    g = c ? c.returnDomainValues : !1,
                    m = c && c.rasterAttributeTableFieldPrefix,
                    l, n, u, s, w, r, v, t;
                this._getRasterAttributeTableFeatures().then(e.hitch(this, function(a) {
                    for (l = 0; l < k.length; l++) {
                        p = k[l];
                        p.setInfoTemplate(this.infoTemplate);
                        p._layer = this;
                        if (f && (n = f, q && q.length >= l && (u = q[l], n = u.replace(/ /gi, ", ")), p.attributes["Raster.ItemPixelValue"] = n, p.attributes["Raster.ServicePixelValue"] = f, a && 0 < a.length && (s = x.filter(a, function(a) {
                            if (a && a.attributes) return a.attributes.hasOwnProperty("Value") ? a.attributes.Value == n : a.attributes.VALUE == n
                        }), 0 < s.length && (w = e.clone(s[0]), m && w)))) {
                            t = {};
                            for (r in w.attributes) w.attributes.hasOwnProperty(r) && (v = m + r, t[v] = w.attributes[r]);
                            w.attributes = t;
                            p.attributes = e.mixin(p.attributes, w.attributes)
                        }
                        g && (d &&
                            0 < d.length) && x.forEach(d, function(a) {
                            if (a) {
                                var b = p.attributes[a.name];
                                C.isDefined(b) && (b = this._getDomainValue(a.domain, b), C.isDefined(b) && (p.attributes[a.name] = b))
                            }
                        }, this);
                        y.push(p);
                        this._visibleRasters.push(p)
                    }
                    this._resolve([y, null, !0], null, b, h)
                }))
            }
            var f = a.value,
                q, k, g = 0,
                l = 0,
                m = this,
                r = this.objectIdField,
                v;
            if (a.catalogItems) {
                d = 0;
                var t, z, u = a.catalogItems.features.length;
                t = 0;
                k = Array(u);
                q = Array(u);
                v = Array(u);
                for (g = 0; g < u; g++) - 1 < a.properties.Values[g].toLowerCase().indexOf("nodata") && t++;
                t = u - t;
                for (g = 0; g <
                    u; g++) z = -1 < a.properties.Values[g].toLowerCase().indexOf("nodata") ? t++ : d++, k[z] = a.catalogItems.features[g], q[z] = a.properties.Values[g], v[z] = k[z].attributes[r]
            }
            this._visibleRasters = [];
            var p;
            a = -1 < f.toLowerCase().indexOf("nodata");
            f && (!k && !a) && (r = "ObjectId", k = [], p = new O(new H(this.fullExtent), null, {
                ObjectId: 0
            }), k.push(p));
            var y = [];
            k ? !this._map.spatialReference.equals(this.spatialReference) && v && 0 < v.length ? s({
                url: this._url.path + "/query",
                content: {
                    f: "json",
                    objectIds: v.join(","),
                    returnGeometry: !0,
                    outSR: B.toJson(m._map.spatialReference.toJson()),
                    outFields: r
                },
                handleAs: "json",
                callbackParamName: "callback",
                load: function(a) {
                    if (0 === a.features.length) m._resolve([y, null, null], null, b, h);
                    else {
                        for (g = 0; g < a.features.length; g++)
                            for (l = 0; l < k.length; l++) k[l].attributes[r] == a.features[g].attributes[r] && (k[l].geometry = new R(a.features[g].geometry), k[l].geometry.setSpatialReference(m._map.spatialReference));
                        n.call(m)
                    }
                },
                error: function(a) {
                    m._resolve([y, null, null], null, b, h)
                }
            }) : n.call(this) : this._resolve([y, null, null], null, b, h)
        },
        getVisibleRasters: function() {
            var a =
                this._visibleRasters,
                c = [],
                b;
            for (b in a) a.hasOwnProperty(b) && c.push(a[b]);
            return c
        },
        _getDomainFields: function(a) {
            if (a) {
                var c = [];
                x.forEach(a, function(a) {
                    if (a.domain) {
                        var d = {};
                        d.name = a.name;
                        d.domain = a.domain;
                        c.push(d)
                    }
                });
                return c
            }
        },
        _getDomainValue: function(a, c) {
            if (a && a.codedValues) {
                var b;
                x.some(a.codedValues, function(a) {
                    return a.code === c ? (b = a.name, !0) : !1
                });
                return b
            }
        },
        _resolve: function(a, c, b, d, e) {
            c && this[c].apply(this, a);
            b && b.apply(null, a);
            d && m._resDfd(d, a, e)
        }
    })
});