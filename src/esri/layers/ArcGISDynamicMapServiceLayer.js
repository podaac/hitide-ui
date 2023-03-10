//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/sniff", "dojo/io-query", "../kernel", "../config", "../request", "../urlUtils", "../layerUtils", "../geometry/scaleUtils", "./DynamicMapServiceLayer", "./ArcGISMapServiceLayer", "./TimeInfo", "./LayerTimeOptions", "./ImageParameters", "./DynamicLayerInfo", "./LayerMapSource"], function(u, f, l, p, v, w, F, q, x, r, k, y, z, A, B, C, s, D, E) {
    return u([z, A], {
        declaredClass: "esri.layers.ArcGISDynamicMapServiceLayer",
        _eventMap: {
            "gdb-version-change": !0
        },
        constructor: function(a,
            b, c) {
            a = b && b.imageParameters;
            var d = f.hitch;
            if (a) {
                var g = a.layerDefinitions;
                g && this.setLayerDefinitions(g);
                a.layerOption === s.LAYER_OPTION_SHOW && (this.visibleLayers = [].concat(a.layerIds))
            }
            this._setIsPNG32 = d(this, this._setIsPNG32);
            this.dpi = a && a.dpi || 96;
            this.imageFormat = a && a.format || "png8";
            this.imageTransparency = a && !1 === a.transparent ? !1 : !0;
            this._setIsPNG32();
            this.gdbVersion = b && b.gdbVersion;
            this._params.gdbVersion = this.gdbVersion;
            f.mixin(this._params, this._url.query, {
                dpi: this.dpi,
                transparent: this.imageTransparency,
                format: this.imageFormat
            }, a ? a.toJson() : {});
            this.getImageUrl = d(this, this.getImageUrl);
            this._initLayer = d(this, this._initLayer);
            this._load = d(this, this._load);
            this.useMapImage = b ? b.useMapImage : !1;
            this._loadCallback = b && b.loadCallback;
            (b = b && b.resourceInfo) ? this._initLayer(b) : (void 0 === c || !1 === c) && this._load();
            this.registerConnectEvents()
        },
        disableClientCaching: !1,
        layerDefinitions: null,
        _initLayer: function(a, b) {
            this.inherited(arguments);
            a.timeInfo && (this.timeInfo = new B(a.timeInfo));
            this.loaded = !0;
            this.onLoad(this);
            var c = this._loadCallback;
            c && (delete this._loadCallback, c(this))
        },
        getImageUrl: function(a, b, c, d) {
            var g = this._url.path + "/export?",
                e = this._params,
                t = a.spatialReference.wkid || p.toJson(a.spatialReference.toJson()),
                h = this._errorHandler;
            delete e._ts;
            f.mixin(e, {
                bbox: a.xmin + "," + a.ymin + "," + a.xmax + "," + a.ymax,
                bboxSR: t,
                imageSR: t,
                size: b + "," + c
            }, this.disableClientCaching ? {
                _ts: (new Date).getTime()
            } : {});
            e.layerDefs && (a = e.layerDefs, delete e.layerDefs, f.mixin(e, {
                layerDefs: a
            }));
            var m = e.token = this._getToken();
            a = r.addProxy(g +
                w.objectToQuery(f.mixin({}, e, {
                    f: "image"
                })));
            a.length > q.defaults.io.postLength || this.useMapImage ? this._jsonRequest = x({
                url: g,
                content: f.mixin(e, {
                    f: "json"
                }),
                callbackParamName: "callback",
                load: function(a, b) {
                    var c = a.href;
                    m && (c += -1 === c.indexOf("?") ? "?token\x3d" + m : "\x26token\x3d" + m);
                    d(r.addProxy(c))
                },
                error: h
            }) : d(a)
        },
        _setIsPNG32: function() {
            var a = this.imageFormat.toLowerCase(),
                b = v("ie");
            this.isPNG32 = b && 6 === b && ("png32" === a || "png24" === a) && this.imageTransparency
        },
        _setTime: function(a) {
            var b = this.timeInfo;
            a = this._params.time =
                a ? a.toJson().join(",") : null;
            if (10.02 > this.version && b)
                if (a) this._params.layerTimeOptions = k._serializeTimeOptions(this.layerTimeOptions);
                else {
                    var c = this.layerInfos;
                    if (c) {
                        var d = this.layerTimeOptions,
                            g = d ? d.slice(0) : [],
                            e = [];
                        l.forEach(c, function(a) {
                            a.subLayerIds || e.push(a.id)
                        });
                        e.length && (l.forEach(e, function(a) {
                            if (!g[a]) {
                                var b = new C;
                                b.useTime = !1;
                                g[a] = b
                            }
                        }), this._params.layerTimeOptions = k._serializeTimeOptions(g, e))
                    }
                }
            10.02 <= this.version && b && (!a && !b.hasLiveData) && (this._params.time = "null,null")
        },
        setDPI: function(a,
            b) {
            this.dpi = this._params.dpi = a;
            b || this.refresh(!0)
        },
        setImageFormat: function(a, b) {
            this.imageFormat = this._params.format = a;
            this._setIsPNG32();
            b || this.refresh(!0)
        },
        setImageTransparency: function(a, b) {
            this.imageTransparency = this._params.transparent = a;
            this._setIsPNG32();
            b || this.refresh(!0)
        },
        setVisibleLayers: function(a, b) {
            this.visibleLayers = a;
            this._params.layers = s.LAYER_OPTION_SHOW + ":" + a.join(",");
            this._updateDynamicLayers();
            b || this.refresh(!0)
        },
        setDefaultVisibleLayers: function(a) {
            this.visibleLayers = this._defaultVisibleLayers;
            this._params.layers = null;
            this._updateDynamicLayers();
            a || this.refresh(!0)
        },
        setLayerDefinitions: function(a, b) {
            this.layerDefinitions = a;
            this._params.layerDefs = k._serializeLayerDefinitions(a);
            this._updateDynamicLayers();
            b || this.refresh(!0)
        },
        setDefaultLayerDefinitions: function(a) {
            this.layerDefinitions = this._params.layerDefs = null;
            this._updateDynamicLayers();
            a || this.refresh(!0)
        },
        setDisableClientCaching: function(a) {
            this.disableClientCaching = a
        },
        setLayerTimeOptions: function(a, b) {
            this.layerTimeOptions = a;
            this._params.layerTimeOptions =
                k._serializeTimeOptions(a);
            this._updateDynamicLayers();
            b || this.refresh(!0)
        },
        refresh: function(a) {
            if (a) this.inherited(arguments);
            else {
                var b = this.disableClientCaching;
                this.disableClientCaching = !0;
                this.inherited(arguments);
                this.disableClientCaching = b
            }
        },
        setLayerDrawingOptions: function(a, b) {
            this.layerDrawingOptions = a;
            this._updateDynamicLayers();
            b || this.refresh(!0)
        },
        setDynamicLayerInfos: function(a, b) {
            a && 0 < a.length ? (this.dynamicLayerInfos = a, this.visibleLayers = k._getDefaultVisibleLayers(a)) : this.dynamicLayerInfos =
                this.layerDrawingOptions = null;
            this._updateDynamicLayers();
            b || this.refresh(!0)
        },
        createDynamicLayerInfosFromLayerInfos: function() {
            var a = [],
                b;
            l.forEach(this.layerInfos, function(c, d) {
                b = new D(c.toJson());
                b.source = new E({
                    mapLayerId: c.id
                });
                a.push(b)
            });
            return a
        },
        _onDynamicLayersChange: function() {},
        _updateDynamicLayers: function() {
            if (this.dynamicLayerInfos && 0 < this.dynamicLayerInfos.length || this.layerDrawingOptions && 0 < this.layerDrawingOptions.length) {
                if (!this.dynamicLayerInfos || 0 === this.dynamicLayerInfos.length) this.dynamicLayerInfos =
                    this.createDynamicLayerInfosFromLayerInfos();
                var a;
                a = this.dynamicLayerInfos;
                var b = [],
                    c = this._map && y.getScale(this._map),
                    d = this.visibleLayers,
                    g = c ? k._getLayersForScale(c, a) : d;
                l.forEach(a, function(a) {
                    if (!a.subLayerIds) {
                        var c, h = a.id;
                        if (-1 !== l.indexOf(d, h) && -1 !== l.indexOf(g, h)) {
                            c = {
                                id: h
                            };
                            c.source = a.source && a.source.toJson();
                            var f;
                            this.layerDefinitions && this.layerDefinitions[h] && (f = this.layerDefinitions[h]);
                            f && (c.definitionExpression = f);
                            var k;
                            this.layerDrawingOptions && this.layerDrawingOptions[h] && (k = this.layerDrawingOptions[h]);
                            k && (c.drawingInfo = k.toJson());
                            var n;
                            this.layerTimeOptions && this.layerTimeOptions[h] && (n = this.layerTimeOptions[h]);
                            n && (c.layerTimeOptions = n.toJson());
                            c.minScale = a.minScale || 0;
                            c.maxScale = a.maxScale || 0;
                            b.push(c)
                        }
                    }
                }, this);
                a = p.toJson(b);
                if (!this._params.dynamicLayers || this._params.dynamicLayers.length !== a.length || this._params.dynamicLayers !== a) this._params.dynamicLayers = a, this._onDynamicLayersChange(this._params.dynamicLayers)
            } else this._params.dynamicLayers ? (this._params.dynamicLayers = null, this._onDynamicLayersChange(null)) :
                this._params.dynamicLayers = null
        },
        _onExtentChangeHandler: function(a, b, c) {
            c && this._updateDynamicLayers();
            this.inherited(arguments)
        },
        _setMap: function(a, b, c) {
            this._map = a;
            this._updateDynamicLayers();
            return this.inherited(arguments)
        },
        onGDBVersionChange: function() {},
        setGDBVersion: function(a, b) {
            this.gdbVersion = a;
            this._params.gdbVersion = a;
            this.onGDBVersionChange();
            b || this.refresh(!0)
        },
        exportMapImage: function(a, b) {
            var c = q.defaults.map,
                c = f.mixin({
                    size: c.width + "," + c.height
                }, this._params, a ? a.toJson(this.normalization) : {}, {
                    f: "json"
                });
            delete c._ts;
            if (c.layerDefs) {
                var d = c.layerDefs;
                delete c.layerDefs;
                f.mixin(c, {
                    layerDefs: d
                })
            }
            this._exportMapImage(this._url.path + "/export", c, b)
        }
    })
});