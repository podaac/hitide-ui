//>>built
define(["require", "module", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/_base/Deferred", "dojo/date/locale", "dojo/sniff", "dojo/io-query", "dojo/dom-construct", "dojo/i18n", "dojo/when", "dojo/promise/all", "../kernel", "../lang", "../request", "../config", "../deferredUtils", "../SpatialReference", "../symbols/SimpleMarkerSymbol", "../symbols/SimpleLineSymbol", "../symbols/SimpleFillSymbol", "../symbols/jsonUtils", "../renderers/SimpleRenderer", "../renderers/UniqueValueRenderer", "../renderers/jsonUtils", "../tasks/QueryTask", "../tasks/query", "../tasks/FeatureSet", "../tasks/StatisticDefinition", "../geometry/Extent", "../geometry/jsonUtils", "../geometry/normalizeUtils", "../geometry/scaleUtils", "./GraphicsLayer", "./Field", "./TimeInfo", "./FeatureType", "./FeatureTemplate", "./FeatureEditResult", "./LabelClass", "./SnapshotMode", "./OnDemandMode", "./SelectionMode", "./StreamMode", "./TrackManager", "dojo/i18n!../nls/jsapi", "require"],
    function(L, R, S, C, q, k, F, u, T, M, U, V, ta, N, W, G, r, D, X, A, H, Y, Z, O, $, P, aa, ba, ca, I, J, da, Q, ea, fa, ga, ha, ia, ja, ka, la, E, ma, K, na, oa, pa, qa, ra) {
        var sa = X.defaults,
            t = S(ha, {
                declaredClass: "esri.layers.FeatureLayer",
                invalidParams: "query contains one or more unsupported parameters",
                reHostedFS: /https?:\/\/services.*\.arcgis\.com/i,
                maxPointCountForAuto: 4E3,
                maxRecordCountForAuto: 2E3,
                maxVertexCountForAuto: 25E4,
                generalizeForScale: 4E3,
                _eventMap: {
                    "add-attachment-complete": ["result"],
                    "before-apply-edits": ["adds", "updates", "deletes"],
                    "delete-attachments-complete": ["results"],
                    "edits-complete": ["adds", "updates", "deletes"],
                    "query-attachment-infos-complete": ["results"],
                    "query-count-complete": ["count"],
                    "query-features-complete": ["featureSet"],
                    "query-ids-complete": ["objectIds"],
                    "query-related-features-complete": ["featureSets"],
                    "selection-complete": ["features", "method"],
                    "update-end": ["error", "info"]
                },
                constructor: function(a, c) {
                    this._preventInit || this._initFeatureLayer(a, c)
                },
                _initFeatureLayer: function(a, c) {
                    this.i18n = ra;
                    c = c || {};
                    this._outFields =
                        c.outFields;
                    this._loadCallback = c.loadCallback;
                    var b = c._usePatch;
                    this._usePatch = null === b || void 0 === b ? !0 : b;
                    this._trackIdField = c.trackIdField;
                    this.objectIdField = c.objectIdField;
                    this._maxOffset = null != c.maxAllowableOffset ? c.maxAllowableOffset : this.maxAllowableOffset;
                    this._optEditable = c.editable;
                    this._optAutoGen = c.autoGeneralize;
                    this.editSummaryCallback = c.editSummaryCallback;
                    this.userId = c.userId;
                    this.userIsAdmin = c.userIsAdmin;
                    this.useMapTime = c.hasOwnProperty("useMapTime") ? !!c.useMapTime : !0;
                    this.source =
                        c.source;
                    this.gdbVersion = c.gdbVersion;
                    this.orderByFields = c.orderByFields;
                    this.maxPointCountForAuto = null != c.maxPointCountForAuto ? c.maxPointCountForAuto : this.maxPointCountForAuto;
                    this.maxRecordCountForAuto = null != c.maxRecordCountForAuto ? c.maxRecordCountForAuto : this.maxRecordCountForAuto;
                    this.maxVertexCountForAuto = null != c.maxVertexCountForAuto ? c.maxVertexCountForAuto : this.maxVertexCountForAuto;
                    this.generalizeForScale = null != c.generalizeForScale ? c.generalizeForScale : this.generalizeForScale;
                    this.queryPagination =
                        null != c.queryPagination ? c.queryPagination : this.url ? this.reHostedFS.test(this.url) : !1;
                    this.multipatchOption = c.multipatchOption;
                    this._selectedFeatures = {};
                    this._selectedFeaturesArr = [];
                    this._newFeatures = [];
                    this._deletedFeatures = {};
                    this._ulid = this._getUniqueId();
                    var d = t,
                        b = this.mode = r.isDefined(c.mode) ? c.mode : d.MODE_ONDEMAND;
                    this._isStream && (this.mode = b = d.MODE_STREAM);
                    switch (b) {
                        case d.MODE_SNAPSHOT:
                            this.currentMode = d.MODE_SNAPSHOT;
                            this._mode = new K(this);
                            this._isSnapshot = !0;
                            break;
                        case d.MODE_ONDEMAND:
                        case d.MODE_AUTO:
                            this.currentMode =
                                d.MODE_ONDEMAND;
                            this._tileWidth = c.tileWidth || 512;
                            this._tileHeight = c.tileHeight || 512;
                            this._mode = new na(this);
                            this.latticeTiling = c.latticeTiling;
                            break;
                        case d.MODE_SELECTION:
                            this.currentMode = d.MODE_SELECTION;
                            this._mode = new oa(this);
                            this._isSelOnly = !0;
                            break;
                        case d.MODE_STREAM:
                            this.currentMode = d.MODE_STREAM, this._mode = new pa(this), this._isStream = !0
                    }
                    this._initLayer = q.hitch(this, this._initLayer);
                    this._selectHandler = q.hitch(this, this._selectHandler);
                    this._editable = !1;
                    if (q.isObject(a) && a.layerDefinition) return this._collection = !0, this.mode = this._isStream ? d.MODE_STREAM : d.MODE_SNAPSHOT, this._initLayer(a), this;
                    this._task = new ca(this.url, {
                        source: this.source,
                        gdbVersion: this.gdbVersion
                    });
                    b = this._url.path;
                    this._fserver = !1; - 1 !== b.search(/\/FeatureServer\//i) && (this._fserver = !0);
                    this.mode === d.MODE_AUTO && this.reHostedFS.test(this.url) && this._queryLimit();
                    (d = c.resourceInfo) ? this._initLayer(d) : (this.source && (d = {
                        source: this.source.toJson()
                    }, this._url.query = q.mixin(this._url.query, {
                        layer: F.toJson(d)
                    })), this.gdbVersion && (this._url.query =
                        q.mixin(this._url.query, {
                            gdbVersion: this.gdbVersion
                        })), D({
                        url: b,
                        content: q.mixin({
                            f: "json"
                        }, this._url.query),
                        callbackParamName: "callback",
                        load: this._initLayer,
                        error: this._errorHandler
                    }));
                    this.registerConnectEvents()
                },
                _initLayer: function(a, c) {
                    if (a || c) {
                        this._json = a;
                        this._findCredential();
                        if (this.credential && this.credential.ssl || a && a._ssl) this._useSSL(), this._task._useSSL();
                        this._collection && (this._isStream || (this.currentMode = t.MODE_SNAPSHOT, this._mode = new K(this)), this._isSnapshot = !0, this._featureSet =
                            a.featureSet, this._nextId = a.nextObjectId, a = a.layerDefinition);
                        this.geometryType = a.geometryType;
                        "string" !== typeof this.multipatchOption && "esriGeometryMultiPatch" === this.geometryType && (this.multipatchOption = "xyFootprint");
                        if (a.hasOwnProperty("capabilities")) {
                            var b = this.capabilities = a.capabilities;
                            b && -1 !== b.toLowerCase().indexOf("editing") ? this._editable = !0 : this._editable = !1
                        } else this._collection || (this._editable = this._fserver);
                        r.isDefined(this._optEditable) ? (this._editable = this._optEditable, delete this._optEditable) :
                            "esriGeometryMultiPatch" === this.geometryType && (this._editable = !1);
                        this._json = F.toJson(this._json);
                        if (this.isEditable()) delete this._maxOffset;
                        else if (this.currentMode !== t.MODE_SNAPSHOT && ("esriGeometryPolyline" === this.geometryType || "esriGeometryPolygon" === this.geometryType || this.hasXYFootprint())) this._autoGeneralize = r.isDefined(this._optAutoGen) ? this._optAutoGen : this.currentMode === t.MODE_ONDEMAND, delete this._optAutoGen;
                        var b = a.effectiveMinScale || a.minScale,
                            d = a.effectiveMaxScale || a.maxScale;
                        !this._hasMin &&
                            b && this.setMinScale(b);
                        !this._hasMax && d && this.setMaxScale(d);
                        this.layerId = a.id;
                        this.name = a.name;
                        this.description = a.description;
                        this.copyright = a.copyrightText;
                        this.type = a.type;
                        this.displayField = a.displayField;
                        this.defaultDefinitionExpression = a.definitionExpression;
                        this.fullExtent = new Q(a.extent);
                        this.initialExtent = new Q(this.fullExtent.toJson());
                        this.fullExtent.spatialReference && (this.spatialReference = new H(this.fullExtent.spatialReference.toJson()));
                        this.defaultVisibility = a.defaultVisibility;
                        if ("esriGeometryPoint" ===
                            this.geometryType || "esriGeometryMultipoint" === this.geometryType) this.latticeTiling = !1;
                        this.indexedFields = a.indexedFields;
                        this.maxRecordCount = a.maxRecordCount;
                        this.canModifyLayer = a.canModifyLayer;
                        this.supportsStatistics = a.supportsStatistics;
                        this.supportsAdvancedQueries = this._collection ? !1 : a.supportsAdvancedQueries;
                        this.hasLabels = a.hasLabels;
                        this.canScaleSymbols = a.canScaleSymbols;
                        this.supportsRollbackOnFailure = a.supportsRollbackOnFailure;
                        this.syncCanReturnChanges = a.syncCanReturnChanges;
                        this.isDataVersioned =
                            a.isDataVersioned;
                        this.editFieldsInfo = a.editFieldsInfo;
                        this.ownershipBasedAccessControlForFeatures = a.ownershipBasedAccessControlForFeatures;
                        this.editFieldsInfo && this.ownershipBasedAccessControlForFeatures && (this.creatorField = this.editFieldsInfo.creatorField);
                        this.relationships = a.relationships;
                        this.allowGeometryUpdates = r.isDefined(a.allowGeometryUpdates) ? a.allowGeometryUpdates : !0;
                        this._isTable = "Table" === this.type;
                        for (var e = this.fields = [], d = a.fields, b = 0; b < d.length; b++) e.push(new ia(d[b]));
                        if (!this.objectIdField) {
                            this.objectIdField =
                                a.objectIdField;
                            if (!this.objectIdField) {
                                d = a.fields;
                                for (b = 0; b < d.length; b++)
                                    if (e = d[b], "esriFieldTypeOID" === e.type) {
                                        this.objectIdField = e.name;
                                        break
                                    }
                            }
                            this.objectIdField || console.debug("esri.layers.FeatureLayer: " + r.substitute({
                                url: this.url
                            }, "objectIdField is not set [url: ${url}]"))
                        }
                        if (!r.isDefined(this._nextId)) {
                            d = this.objectIdField;
                            e = -1;
                            if (this._collection && d)
                                for (var f = (b = this._featureSet) && b.features, l = f ? f.length : 0, g, b = 0; b < l; b++) g = (g = f[b].attributes) && g[d], g > e && (e = g);
                            this._nextId = e + 1
                        }
                        this.globalIdField =
                            a.globalIdField;
                        if (b = this.typeIdField = a.typeIdField)
                            if (b = !this._getField(b) && this._getField(b, !0)) this.typeIdField = b.name;
                        this.visibilityField = a.visibilityField;
                        if (d = a.defaultSymbol) this.defaultSymbol = $.fromJson(d);
                        var h = this.types = [],
                            n = a.types,
                            m, w, e = (b = this.editFieldsInfo) && b.creatorField,
                            f = b && b.editorField;
                        g = e || f;
                        l = [];
                        if (n)
                            for (b = 0; b < n.length; b++) m = new ka(n[b]), w = m.templates, g && (w && w.length) && (l = l.concat(w)), h.push(m);
                        n = a.templates;
                        m = this.templates = [];
                        if (n)
                            for (b = 0; b < n.length; b++) h = new la(n[b]), g &&
                                l.push(h), m.push(h);
                        for (b = 0; b < l.length; b++)
                            if (g = q.getObject("prototype.attributes", !1, l[b])) e && delete g[e], f && delete g[f];
                        if (b = a.timeInfo) this.timeInfo = new ja(b), this._startTimeField = b.startTimeField, this._endTimeField = b.endTimeField, this._startTimeField && this._endTimeField && (this._twoTimeFields = !0), this._trackIdField ? b.trackIdField = this._trackIdField : this._trackIdField = b.trackIdField;
                        this.hasAttachments = !this._collection && a.hasAttachments ? !0 : !1;
                        this.htmlPopupType = a.htmlPopupType;
                        var b = a.drawingInfo,
                            p;
                        if ((e = b && b.labelingInfo) && !this.labelingInfo) this.labelingInfo = k.map(e, function(a) {
                            return new ma(a)
                        }), this._fixLabelExpr();
                        if (!this.renderer)
                            if (b && b.renderer) {
                                if (p = b.renderer, this.setRenderer(ba.fromJson(p)), "classBreaks" === p.type && this.renderer.setMaxInclusive(!0), !this._collection) {
                                    var s = p.type,
                                        d = [];
                                    p = this.renderer;
                                    switch (s) {
                                        case "simple":
                                            d.push(p.symbol);
                                            break;
                                        case "uniqueValue":
                                        case "classBreaks":
                                            d.push(p.defaultSymbol), d = d.concat(k.map(p.infos, function(a) {
                                                return a.symbol
                                            }))
                                    }
                                    var d = k.filter(d,
                                            r.isDefined),
                                        B = this._url.path + "/images/",
                                        x = this._getToken();
                                    k.forEach(d, function(a) {
                                        var b = a.url;
                                        b && (-1 === b.search(/https?\:/) && -1 === b.indexOf("data:") && (a.url = B + b), x && -1 !== a.url.search(/https?\:/) && (a.url += "?token\x3d" + x))
                                    })
                                }
                            } else if (d) n = this.types, 0 < n.length ? (p = new aa(this.defaultSymbol, this.typeIdField), k.forEach(n, function(a) {
                            p.addValue(a.id, a.symbol)
                        })) : p = new P(this.defaultSymbol), this.setRenderer(p);
                        else if (!this._isTable) {
                            switch (this.geometryType) {
                                case "esriGeometryPoint":
                                case "esriGeometryMultipoint":
                                    s =
                                        new Y;
                                    break;
                                case "esriGeometryPolyline":
                                    s = new Z;
                                    break;
                                case "esriGeometryPolygon":
                                    s = new O;
                                    break;
                                default:
                                    this.hasXYFootprint() && (s = new O)
                            }
                            this.setRenderer(s ? new P(s) : null)
                        }
                        s = b && b.transparency || 0;
                        !this.hasOwnProperty("opacity") && 0 < s && (this.opacity = 1 - s / 100);
                        this.version = a.currentVersion;
                        this.version || (this.version = "capabilities" in a || "drawingInfo" in a || "hasAttachments" in a || "htmlPopupType" in a || "relationships" in a || "timeInfo" in a || "typeIdField" in a || "types" in a ? 10 : 9.3);
                        if ((M("ie") || M("safari")) && this.isEditable() &&
                            10.02 > this.version) this._ts = !0;
                        this.statistics = a.statistics;
                        this._fixRendererFields();
                        this._checkFields();
                        this._updateCaps();
                        var v = function() {
                            this.currentMode !== t.MODE_SNAPSHOT && (this.queryPagination = !1);
                            this.loaded = !0;
                            this.onLoad(this);
                            var a = this._loadCallback;
                            a && (delete this._loadCallback, a(this))
                        };
                        this._collection ? (s = this._featureSet, this._featureSet = null, this._mode._drawFeatures(new J(s)), this._fcAdded = !0, v.call(this)) : this._forceIdentity(this._limitPromise ? function() {
                            var a = this;
                            this._limitPromise.then(function(b) {
                                a._checkMode(b)
                            });
                            this._limitPromise.always(function() {
                                a._limitPromise = null;
                                v.call(a)
                            })
                        } : v)
                    }
                },
                onRendererChange: function() {
                    this.inherited(arguments);
                    var a = this._getRenderer();
                    this._ager = !(!a || !a.observationAger || !a.observationRenderer);
                    if (a) {
                        var c = [],
                            a = k.filter([a, a.observationRenderer, a.latestObservationRenderer, a.trackRenderer], r.isDefined);
                        k.forEach(a, function(a) {
                            q.isFunction(a.attributeField) || c.push(a.attributeField);
                            c.push(a.attributeField2);
                            c.push(a.attributeField3)
                        }, this);
                        this._rendererFields = k.filter(c, r.isDefined)
                    } else this._rendererFields = [];
                    this.loaded && (this._fixRendererFields(), this._checkFields(this._rendererFields), this._collection && (this._typesDirty = !0))
                },
                redraw: function() {
                    this.inherited(arguments);
                    this._trackManager && this._trackManager.container && this._trackManager.container.redraw()
                },
                _evalSDRenderer: function() {
                    this.inherited(arguments);
                    var a = this._getRenderer();
                    this._ager = !(!a || !a.observationAger || !a.observationRenderer);
                    this._trackManager && this._trackManager.container && this._trackManager.container.setRenderer(a && a.trackRenderer)
                },
                _setMap: function(a) {
                    var c = this.inherited(arguments),
                        b = this._mode,
                        d = this;
                    b && b.initialize(a);
                    this.geometryType && this.attr("data-geometry-type", this.geometryType.replace(/esriGeometry/i, "").toLowerCase());
                    this._addHandle = this.on("graphic-node-add", function(a) {
                        a = a.graphic.attributes;
                        (a = d._selectedFeatures[a && a[d.objectIdField]]) && a.attr("data-selected", "")
                    });
                    return c
                },
                _unsetMap: function(a) {
                    var c = this._mode;
                    c && c.suspend();
                    this._trackManager && (this._trackManager.destroy(), this._trackManager = null);
                    C.disconnect(this._zoomConnect);
                    C.disconnect(this._addHandle);
                    this._zoomConnect = this._addHandle = null;
                    this._toggleTime(!1);
                    this.inherited("_unsetMap", arguments)
                },
                refresh: function() {
                    var a = this._mode;
                    a && a.refresh()
                },
                hasXYFootprint: function() {
                    return "esriGeometryMultiPatch" === this.geometryType && "xyFootprint" === this.multipatchOption
                },
                getOutFields: function() {
                    return k.filter(this._getOutFields(), function(a) {
                        return "*" === a || !!this._getField(a)
                    }, this)
                },
                setEditable: function(a) {
                    if (!this._collection) return console.log("FeatureLayer:setEditable - this functionality is not yet supported for layer in a feature service"),
                        this;
                    if (!this.loaded) return this._optEditable = a, this;
                    var c = this._editable;
                    this._editable = a;
                    this._updateCaps();
                    if (c !== a) this.onCapabilitiesChange();
                    return this
                },
                getEditCapabilities: function(a) {
                    var c = {
                        canCreate: !1,
                        canUpdate: !1,
                        canDelete: !1
                    };
                    if (!this.loaded || !this.isEditable()) return c;
                    var b = a && a.feature;
                    a = a && a.userId;
                    var d = k.map(this.capabilities ? this.capabilities.toLowerCase().split(",") : [], q.trim),
                        e = -1 < k.indexOf(d, "editing"),
                        f = e && -1 < k.indexOf(d, "create"),
                        c = e && -1 < k.indexOf(d, "update"),
                        d = e && -1 < k.indexOf(d,
                            "delete"),
                        l = this.ownershipBasedAccessControlForFeatures,
                        g = this.editFieldsInfo,
                        h = g && g.creatorField,
                        g = g && g.realm,
                        b = (b = b && b.attributes) && h ? b[h] : void 0,
                        n = !!this.userIsAdmin,
                        h = !l || n || !(!l.allowOthersToUpdate && !l.allowUpdateToOthers),
                        l = !l || n || !(!l.allowOthersToDelete && !l.allowDeleteToOthers);
                    if (n || e && !f && !c && !d) f = c = d = !0;
                    e = {
                        canCreate: f,
                        canUpdate: c,
                        canDelete: d
                    };
                    null === b ? (e.canUpdate = c && h, e.canDelete = d && l) : "" !== b && b && ((a = a || this.getUserId()) && g && (a = a + "@" + g), a.toLowerCase() !== b.toLowerCase() && (e.canUpdate =
                        c && h, e.canDelete = d && l));
                    return e
                },
                getUserId: function() {
                    var a;
                    this.loaded && (a = this.credential && this.credential.userId || this.userId || "");
                    return a
                },
                setUserIsAdmin: function(a) {
                    this.userIsAdmin = a
                },
                setEditSummaryCallback: function(a) {
                    this.editSummaryCallback = a
                },
                getEditSummary: function(a, c, b) {
                    b = r.isDefined(b) ? b : (new Date).getTime();
                    var d = "";
                    b = this.getEditInfo(a, c, b);
                    (c = c && c.callback || this.editSummaryCallback) && (b = c(a, b) || "");
                    if (q.isString(b)) d = b;
                    else {
                        if (b) {
                            a = b.action;
                            c = b.userId;
                            var e = b.timeValue,
                                f = 0;
                            a && f++;
                            c && f++;
                            r.isDefined(e) && f++;
                            1 < f && (d = ("edit" === a ? "edit" : "create") + (c ? "User" : "") + (r.isDefined(e) ? b.displayPattern : ""))
                        }
                        d = d && r.substitute(b, this.i18n.layers.FeatureLayer[d])
                    }
                    return d
                },
                getEditInfo: function(a, c, b) {
                    if (this.loaded) {
                        b = r.isDefined(b) ? b : (new Date).getTime();
                        c = c && c.action || "last";
                        var d = this.editFieldsInfo,
                            e = d && d.creatorField,
                            f = d && d.creationDateField,
                            l = d && d.editorField,
                            d = d && d.editDateField,
                            l = (a = a && a.attributes) && l ? a[l] : void 0,
                            d = a && d ? a[d] : null,
                            e = this._getEditData(a && e ? a[e] : void 0, a && f ? a[f] : null,
                                b);
                        b = this._getEditData(l, d, b);
                        var g;
                        switch (c) {
                            case "creation":
                                g = e;
                                break;
                            case "edit":
                                g = b;
                                break;
                            case "last":
                                g = b || e
                        }
                        g && (g.action = g === b ? "edit" : "creation");
                        return g
                    }
                },
                _getEditData: function(a, c, b) {
                    var d, e, f;
                    r.isDefined(c) && (e = b - c, f = 0 > e ? "Full" : 6E4 > e ? "Seconds" : 12E4 > e ? "Minute" : 36E5 > e ? "Minutes" : 72E5 > e ? "Hour" : 864E5 > e ? "Hours" : 6048E5 > e ? "WeekDay" : "Full");
                    if (void 0 !== a || f) d = d || {}, d.userId = a, f && (a = T.format, b = new Date(c), d.minutes = Math.floor(e / 6E4), d.hours = Math.floor(e / 36E5), d.weekDay = a(b, {
                            datePattern: "EEEE",
                            selector: "date"
                        }),
                        d.formattedDate = a(b, {
                            selector: "date"
                        }), d.formattedTime = a(b, {
                            selector: "time"
                        }), d.displayPattern = f, d.timeValue = c);
                    return d
                },
                isEditable: function() {
                    return !(!this._editable && !this.userIsAdmin)
                },
                setMaxAllowableOffset: function(a) {
                    this.isEditable() || (this._maxOffset = a);
                    return this
                },
                getMaxAllowableOffset: function() {
                    return this._maxOffset
                },
                setAutoGeneralize: function(a) {
                    if (this.loaded) {
                        if (!this.isEditable() && this.currentMode !== t.MODE_SNAPSHOT && ("esriGeometryPolyline" === this.geometryType || "esriGeometryPolygon" ===
                            this.geometryType || this.hasXYFootprint()))
                            if (this._autoGeneralize = a) {
                                if ((a = this._map) && a.loaded) this._maxOffset = Math.floor(a.extent.getWidth() / a.width)
                            } else delete this._maxOffset
                    } else this._optAutoGen = a;
                    return this
                },
                setGDBVersion: function(a) {
                    if (!this._collection && a !== this.gdbVersion && (a || this.gdbVersion)) this.gdbVersion = a, this._task.gdbVersion = a, this._url.query = q.mixin(this._url.query, {
                        gdbVersion: a
                    }), this.loaded && (this.clearSelection(), this._map && this.refresh()), this.onGDBVersionChange();
                    return this
                },
                setDefinitionExpression: function(a) {
                    this._defnExpr = a;
                    (a = this._mode) && a.propertyChangeHandler(1);
                    return this
                },
                getDefinitionExpression: function() {
                    return this._defnExpr
                },
                setTimeDefinition: function(a) {
                    this._isSnapshot ? (this._timeDefn = a, (a = this._mode) && a.propertyChangeHandler(2)) : console.log("FeatureLayer.setTimeDefinition: layer in on-demand or selection mode does not support time definitions. Layer id \x3d " + this.id + ", Layer URL \x3d " + this.url);
                    return this
                },
                getTimeDefinition: function() {
                    return this._timeDefn
                },
                setTimeOffset: function(a, c) {
                    this._timeOffset = a;
                    this._timeOffsetUnits = c;
                    var b = this._mode;
                    b && b.propertyChangeHandler(0);
                    return this
                },
                setUseMapTime: function(a) {
                    this.useMapTime = a;
                    this._toggleTime(!this.suspended);
                    (a = this._mode) && a.propertyChangeHandler(0)
                },
                selectFeatures: function(a, c, b, d) {
                    c = c || t.SELECTION_NEW;
                    a = this._getShallowClone(a);
                    var e = this._map,
                        f, l = this,
                        g = A._fixDfd(new u(A._dfdCanceller));
                    a.outFields = this.getOutFields();
                    a.returnGeometry = !0;
                    a.multipatchOption = this.multipatchOption;
                    e && (a.outSpatialReference =
                        new H(e.spatialReference.toJson()));
                    if (!this._applyQueryFilters(a, !0)) return f = {
                        features: []
                    }, this._selectHandler(f, c, b, d, g), g;
                    if (e = this._canDoClientSideQuery(a)) g._pendingDfd = N(this._doQuery(a, e)), g._pendingDfd.then(function(a) {
                        f = {
                            features: a
                        };
                        l._selectHandler(f, c, b, d, g)
                    });
                    else {
                        if (this._collection) return this._resolve([Error("FeatureLayer::selectFeatures - " + this.invalidParams)], null, d, g, !0), g;
                        var h = this;
                        this._ts && (a._ts = (new Date).getTime());
                        (g._pendingDfd = this._task.execute(a)).addCallbacks(function(a) {
                            h._selectHandler(a,
                                c, b, d, g)
                        }, function(a) {
                            h._resolve([a], null, d, g, !0)
                        })
                    }
                    return g
                },
                getSelectedFeatures: function() {
                    var a = this._selectedFeatures,
                        c = [],
                        b;
                    for (b in a) a.hasOwnProperty(b) && c.push(a[b]);
                    return c
                },
                clearSelection: function(a) {
                    var c = this._selectedFeatures,
                        b = this._mode,
                        d;
                    for (d in c) c.hasOwnProperty(d) && (this._unSelectFeatureIIf(d, b), b._removeFeatureIIf(d));
                    this._selectedFeatures = {};
                    this._isSelOnly && b._applyTimeFilter(!0);
                    if (!a) this.onSelectionClear();
                    return this
                },
                setSelectionSymbol: function(a) {
                    if (this._selectionSymbol =
                        a) {
                        var c = this._selectedFeatures,
                            b;
                        for (b in c) c.hasOwnProperty(b) && c[b].setSymbol(a)
                    }
                    return this
                },
                getSelectionSymbol: function() {
                    return this._selectionSymbol
                },
                setLabelingInfo: function(a) {
                    a ? (this.labelingInfo = a, this._fixLabelExpr()) : delete this.labelingInfo;
                    this._collection && (this._typesDirty = !0);
                    this.onLabelingInfoChange()
                },
                _fixLabelExpr: function() {
                    var a = /\[([^\[\]]+)\]/ig,
                        c, b = this,
                        d = function(a, c) {
                            var d = b._getField(c, !0);
                            return "[" + (d && d.name || c) + "]"
                        };
                    k.forEach(this.labelingInfo, function(b) {
                        if (c = b.labelExpression) b.labelExpression =
                            c.replace(a, d)
                    })
                },
                __msigns: [{
                    n: "applyEdits",
                    c: 5,
                    a: [{
                        i: 0
                    }, {
                        i: 1
                    }],
                    e: 4,
                    f: 1
                }],
                applyEdits: function(a, c, b, d, e, f) {
                    var l = f.assembly,
                        g = f.dfd;
                    this._applyNormalized(a, l && l[0]);
                    this._applyNormalized(c, l && l[1]);
                    this.onBeforeApplyEdits(a, c, b);
                    var h = {},
                        n = this.objectIdField,
                        l = {
                            f: "json"
                        },
                        m = !1;
                    if (this._collection) f = {}, f.addResults = a ? k.map(a, function() {
                            m = !0;
                            return {
                                objectId: this._nextId++,
                                success: !0
                            }
                        }, this) : null, f.updateResults = c ? k.map(c, function(a) {
                            m = !0;
                            var b = a.attributes[n];
                            h[b] = a;
                            return {
                                objectId: b,
                                success: !0
                            }
                        }, this) :
                        null, f.deleteResults = b ? k.map(b, function(a) {
                            m = !0;
                            return {
                                objectId: a.attributes[n],
                                success: !0
                            }
                        }, this) : null, m && this._editHandler(f, a, h, d, e, g);
                    else {
                        a && 0 < a.length && (l.adds = this._convertFeaturesToJson(a, 0, 1), m = !0);
                        if (c && 0 < c.length) {
                            for (f = 0; f < c.length; f++) {
                                var w = c[f];
                                h[w.attributes[n]] = w
                            }
                            l.updates = this._convertFeaturesToJson(c, 0, 0, 1);
                            m = !0
                        }
                        if (b && 0 < b.length) {
                            c = [];
                            for (f = 0; f < b.length; f++) c.push(b[f].attributes[n]);
                            l.deletes = c.join(",");
                            m = !0
                        }
                        if (m) {
                            var p = this;
                            return D({
                                url: this._url.path + "/applyEdits",
                                content: q.mixin(l,
                                    this._url.query),
                                callbackParamName: "callback",
                                load: function(b) {
                                    p._editHandler(b, a, h, d, e, g)
                                },
                                error: function(a) {
                                    p._resolve([a], null, e, g, !0)
                                }
                            }, {
                                usePost: !0
                            })
                        }
                    }
                },
                queryFeatures: function(a, c, b) {
                    return this._query("execute", "onQueryFeaturesComplete", a, c, b)
                },
                queryRelatedFeatures: function(a, c, b) {
                    return this._query("executeRelationshipQuery", "onQueryRelatedFeaturesComplete", a, c, b)
                },
                queryIds: function(a, c, b) {
                    return this._query("executeForIds", "onQueryIdsComplete", a, c, b)
                },
                queryCount: function(a, c, b) {
                    return this._query("executeForCount",
                        "onQueryCountComplete", a, c, b)
                },
                queryExtent: function(a, c, b) {
                    return this._query("executeForExtent", "onQueryExtentComplete", a, c, b)
                },
                queryAttachmentInfos: function(a, c, b) {
                    var d = this._url.path + "/" + a + "/attachments",
                        e = new u(A._dfdCanceller),
                        f = this;
                    e._pendingDfd = D({
                        url: d,
                        content: q.mixin({
                            f: "json"
                        }, this._url.query),
                        callbackParamName: "callback",
                        load: function(b) {
                            b = b.attachmentInfos;
                            var g;
                            k.forEach(b, function(b) {
                                g = U.objectToQuery({
                                    gdbVersion: f._url.query && f._url.query.gdbVersion,
                                    layer: f._url.query && f._url.query.layer,
                                    token: f._getToken()
                                });
                                b.url = d + "/" + b.id + (g ? "?" + g : "");
                                b.objectId = a
                            });
                            f._resolve([b], "onQueryAttachmentInfosComplete", c, e)
                        },
                        error: function(a) {
                            f._resolve([a], null, b, e, !0)
                        }
                    });
                    return e
                },
                addAttachment: function(a, c, b, d) {
                    return this._sendAttachment("add", a, c, b, d)
                },
                updateAttachment: function(a, c, b, d, e) {
                    b.appendChild(V.create("input", {
                        type: "hidden",
                        name: "attachmentId",
                        value: c
                    }));
                    return this._sendAttachment("update", a, b, d, e)
                },
                deleteAttachments: function(a, c, b, d) {
                    var e = this._url.path + "/" + a + "/deleteAttachments",
                        f = new u(A._dfdCanceller),
                        l = this;
                    c = {
                        f: "json",
                        attachmentIds: c.join(",")
                    };
                    f._pendingDfd = D({
                        url: e,
                        content: q.mixin(c, this._url.query),
                        callbackParamName: "callback",
                        load: q.hitch(this, function(c) {
                            c = c.deleteAttachmentResults;
                            c = k.map(c, function(b) {
                                b = new E(b);
                                b.attachmentId = b.objectId;
                                b.objectId = a;
                                return b
                            });
                            l._resolve([c], "onDeleteAttachmentsComplete", b, f)
                        }),
                        error: function(a) {
                            l._resolve([a], null, d, f, !0)
                        }
                    }, {
                        usePost: !0
                    });
                    return f
                },
                addType: function(a) {
                    var c = this.types;
                    if (c) {
                        if (k.some(c, function(b) {
                            return b.id ==
                                a.id ? !0 : !1
                        })) return !1;
                        c.push(a)
                    } else this.types = [a];
                    return this._typesDirty = !0
                },
                deleteType: function(a) {
                    if (this._collection) {
                        var c = this.types;
                        if (c) {
                            var b = -1;
                            k.some(c, function(c, e) {
                                return c.id == a ? (b = e, !0) : !1
                            });
                            if (-1 < b) return this._typesDirty = !0, c.splice(b, 1)[0]
                        }
                    }
                },
                toJson: function() {
                    var a = this._json;
                    if (a = q.isString(a) ? F.fromJson(a) : q.clone(a)) {
                        var a = a.layerDefinition ? a : {
                                layerDefinition: a
                            },
                            c = a.layerDefinition,
                            b = this._collection;
                        if (b && this._typesDirty) {
                            c.types = k.map(this.types || [], function(a) {
                                return a.toJson()
                            });
                            var d = this.renderer,
                                e = this.labelingInfo,
                                f = c.drawingInfo;
                            if ((d || e) && !f) f = c.drawingInfo = {};
                            f && (d && -1 === d.declaredClass.indexOf("TemporalRenderer")) && (f.renderer = d.toJson());
                            e && (f.labelingInfo = k.map(e, function(a) {
                                return a.toJson()
                            }))
                        }
                        d = null;
                        if (!b || this._fcAdded) d = {
                            geometryType: c.geometryType,
                            features: this._convertFeaturesToJson(this.graphics, !0)
                        };
                        a.featureSet = q.mixin({}, a.featureSet || {}, d);
                        b && (a.nextObjectId = this._nextId, c.capabilities = this.capabilities);
                        return a
                    }
                },
                onSelectionComplete: function() {},
                onSelectionClear: function() {},
                onBeforeApplyEdits: function() {},
                onEditsComplete: function() {},
                onQueryFeaturesComplete: function() {},
                onQueryRelatedFeaturesComplete: function() {},
                onQueryIdsComplete: function() {},
                onQueryCountComplete: function() {},
                onQueryExtentComplete: function() {},
                onQueryAttachmentInfosComplete: function() {},
                onAddAttachmentComplete: function() {},
                onUpdateAttachmentComplete: function() {},
                onDeleteAttachmentsComplete: function() {},
                onCapabilitiesChange: function() {},
                onGDBVersionChange: function() {},
                onQueryLimitExceeded: function() {},
                onLabelingInfoChange: function() {},
                _forceIdentity: function(a) {
                    var c = this,
                        b = this._url && this._url.path;
                    (this.ownershipBasedAccessControlForFeatures || this.userIsAdmin) && !this._getToken() && b && G.id && G.id._hasPortalSession() && G.id._doPortalSignIn(b) ? G.id.getCredential(b).then(function() {
                        c._findCredential();
                        a.call(c)
                    }, function() {
                        a.call(c)
                    }) : a.call(this)
                },
                _checkMode: function(a) {
                    var c = this.geometryType,
                        b = this.maxRecordCount;
                    a = (a = a && a.features && a.features[0]) && a.attributes && a.attributes.exceedslimit;
                    if (this.mode ===
                        t.MODE_AUTO && !this.isEditable() && 0 === a && (this.queryPagination || ("esriGeometryPolyline" === c || "esriGeometryPolygon" === c || "esriGeometryMultipoint" === c || this.hasXYFootprint()) && b >= this.maxRecordCountForAuto || "esriGeometryPoint" === c && b >= this.maxPointCountForAuto)) this.currentMode = t.MODE_SNAPSHOT, this._mode = new K(this), this._isSnapshot = !0, this._autoGeneralize = !1
                },
                _queryLimit: function() {
                    var a = this,
                        c = new u;
                    this._limitPromise = c.promise;
                    setTimeout(function() {
                        var b = new I,
                            d = new da;
                        d.statisticType = "exceedslimit";
                        d.maxPointCount = a.maxPointCountForAuto;
                        d.maxRecordCount = a.maxRecordCountForAuto;
                        d.maxVertexCount = a.maxVertexCountForAuto;
                        d.outStatisticFieldName = "exceedslimit";
                        b.outStatistics = [d];
                        a.queryFeatures(b).promise.then(function(a) {
                            c.resolve(a)
                        }, function(a) {
                            c.reject(a)
                        })
                    }, 0)
                },
                _updateCaps: function() {
                    var a = this._editable,
                        c = q.trim(this.capabilities || ""),
                        b = k.map(c ? c.split(",") : [], q.trim),
                        d = k.map(c ? c.toLowerCase().split(",") : [], q.trim),
                        c = k.indexOf(d, "editing"),
                        e, d = {
                            Create: k.indexOf(d, "create"),
                            Update: k.indexOf(d,
                                "update"),
                            Delete: k.indexOf(d, "delete")
                        };
                    if (a && -1 === c) b.push("Editing");
                    else if (!a && -1 < c) {
                        a = [c];
                        for (e in d) - 1 < d[e] && a.push(d[e]);
                        a.sort();
                        for (e = a.length - 1; 0 <= e; e--) b.splice(a[e], 1)
                    }
                    this.capabilities = b.join(",")
                },
                _counter: {
                    value: 0
                },
                _getUniqueId: function() {
                    return this._counter.value++
                },
                onSuspend: function() {
                    this.inherited(arguments);
                    this._toggleTime(!1);
                    var a = this._mode;
                    a && a.suspend()
                },
                onResume: function(a) {
                    this.inherited(arguments);
                    this._toggleTime(!0);
                    this._updateMaxOffset();
                    var c = this._mode,
                        b = this._map,
                        d = this._getRenderer();
                    if (a.firstOccurrence) {
                        this._fixRendererFields();
                        this._checkFields();
                        this.clearSelection();
                        if (this.timeInfo && (this._trackIdField || d && (d.latestObservationRenderer || d.trackRenderer))) this._trackManager = new qa(this), this._trackManager.initialize(b);
                        if (this.mode === t.MODE_AUTO && this.currentMode === t.MODE_SNAPSHOT && ("esriGeometryPolyline" === this.geometryType || "esriGeometryPolygon" === this.geometryType || this.hasXYFootprint()) && !this.getMaxAllowableOffset()) d = this.generalizeForScale, d =
                            this.maxScale ? this.maxScale : this.minScale ? Math.min(d, this.minScale) : Math.min(d, ga.getScale(b, this.initialExtent)), this.setMaxAllowableOffset(b.extent.getWidth() / b.width / b.getScale() * d);
                        this._zoomConnect = C.connect(b, "onZoomEnd", this, this._updateMaxOffset)
                    }
                    c && (a.firstOccurrence ? c.startup() : c.resume())
                },
                _updateMaxOffset: function() {
                    var a = this._map;
                    a && a.loaded && this._autoGeneralize && (this._maxOffset = Math.floor(a.extent.getWidth() / a.width))
                },
                _toggleTime: function(a) {
                    var c = this._map;
                    a && this.timeInfo && this.useMapTime &&
                        c ? (this._mapTimeExtent = c.timeExtent, this._timeConnect || (this._timeConnect = C.connect(c, "onTimeExtentChange", this, this._timeChangeHandler))) : (this._mapTimeExtent = null, C.disconnect(this._timeConnect), this._timeConnect = null)
                },
                _timeChangeHandler: function(a) {
                    this._mapTimeExtent = a;
                    (a = this._mode) && a.propertyChangeHandler(0)
                },
                _getOffsettedTE: function(a) {
                    var c = this._timeOffset,
                        b = this._timeOffsetUnits;
                    return a && c && b ? a.offset(-1 * c, b) : a
                },
                _getTimeOverlap: function(a, c) {
                    return a && c ? a.intersection(c) : a || c
                },
                _getTimeFilter: function(a) {
                    var c =
                        this.getTimeDefinition(),
                        b;
                    if (c && (b = this._getTimeOverlap(c, null), !b)) return [!1];
                    if (a) {
                        if (a = b ? this._getTimeOverlap(a, b) : a, !a) return [!1]
                    } else a = b;
                    return [!0, a]
                },
                _getAttributeFilter: function(a) {
                    var c = this.getDefinitionExpression();
                    return a ? c ? "(" + c + ") AND (" + a + ")" : a : c
                },
                _applyQueryFilters: function(a, c) {
                    a.where = this._getAttributeFilter(a.where);
                    a.maxAllowableOffset = this._maxOffset;
                    c && this.supportsAdvancedQueries && (a.orderByFields = a.orderByFields || this.getOrderByFields());
                    if (this.timeInfo) {
                        var b = this._getTimeFilter(a.timeExtent);
                        if (b[0]) a.timeExtent = b[1];
                        else return !1
                    }
                    return !0
                },
                _add: function(a) {
                    var c = this._selectionSymbol,
                        b = a.attributes,
                        d = this.visibilityField;
                    c && this._isSelOnly && a.setSymbol(c);
                    if (d && b && b.hasOwnProperty(d)) a[b[d] ? "show" : "hide"]();
                    return this.add.apply(this, arguments)
                },
                _remove: function() {
                    return this.remove.apply(this, arguments)
                },
                _canDoClientSideQuery: function(a) {
                    var c = [],
                        b = this._map;
                    if (!(this._isTable || !b && !this._collection))
                        if (!a.text && !(a.where && a.where !== this.getDefinitionExpression() || a.orderByFields &&
                            a.orderByFields.length || a.outStatistics)) {
                            var d = this._isSnapshot,
                                e = this._isSelOnly,
                                f = a.geometry;
                            if (f)
                                if (!e && a.spatialRelationship === I.SPATIAL_REL_INTERSECTS && "extent" === f.type && (d || b.extent.contains(f))) c.push(1);
                                else return;
                            if (b = a.objectIds)
                                if (d) c.push(2);
                                else {
                                    var f = b.length,
                                        l = this._mode,
                                        g = 0,
                                        h;
                                    for (h = 0; h < f; h++) l._getFeature(b[h]) && g++;
                                    if (g === f) c.push(2);
                                    else return
                                }
                            if (this.timeInfo)
                                if (a = a.timeExtent, b = this._mapTimeExtent, d) a && c.push(3);
                                else if (e) {
                                if (a) return
                            } else if (b)
                                if (-1 !== k.indexOf(c, 2)) a && c.push(3);
                                else return;
                            else if (0 < c.length) a && c.push(3);
                            else if (a) return;
                            return 0 < c.length ? c : null
                        }
                },
                _getAbsMid: function(a) {
                    return L.toAbsMid ? L.toAbsMid(a) : R.id.replace(/\/[^\/]*$/ig, "/") + a
                },
                _doQuery: function(a, c, b) {
                    var d = [],
                        e = this._mode,
                        f = this.objectIdField,
                        l = this,
                        g, h, n = new u,
                        m = new u,
                        w = function(a, b) {
                            if (!a.length || !b.length) return a.length ? a : b;
                            var c, d, e = {};
                            a.length > b.length ? (d = a, c = b) : (d = b, c = a);
                            for (var g = d.length, l = c.length, h; g--;) h = d[g], e[h.attributes[f]] = !0;
                            for (; l--;) h = c[l], e[h.attributes[f]] || d.push(h);
                            return d
                        };
                    if (-1 !== k.indexOf(c, 1)) {
                        h = this.graphics;
                        g = h.length;
                        var p = this.spatialIndex || this._map && this._map.spatialIndex,
                            s, B = a.geometry._normalize(null, !0);
                        null == p && sa.autoSpatialIndexing ? s = (this._map || this).addPlugin(this._getAbsMid("../plugins/spatialIndex")).then(q.hitch(this, q.partial(this._getFromIndex, B, p)), function(a) {
                            m.resolve(q.hitch(this, q.partial(this._filterByExtent, h, B)))
                        }) : p && (s = this._getFromIndex(B, p));
                        s ? s.then(function(a) {
                            for (var b = 0; b < a.length; b++) a[b].results && (d = d.concat(a[b].results));
                            m.resolve(d)
                        }).otherwise(function(a) {
                            m.reject(a)
                        }) :
                            m.resolve(this._filterByExtent(h, B))
                    } else m.resolve([]);
                    m.then(function(d) {
                        var h = [];
                        if (-1 !== k.indexOf(c, 2)) {
                            var m = a.objectIds;
                            for (g = m.length; g--;) {
                                var p = e._getFeature(m[g]);
                                p && h.push(p)
                            }
                            h = w(d, h)
                        } else h = d; - 1 !== k.indexOf(c, 3) && this.timeInfo && (d = a.timeExtent, h = l._filterByTime(h, d.startTime, d.endTime).match);
                        b && (h = k.map(h, function(a) {
                            return a.attributes[f]
                        }, this));
                        n.resolve(h)
                    });
                    return n
                },
                _getFromIndex: function(a, c) {
                    c = c || this.spatialIndex || this._map.spatialIndex;
                    a instanceof Array || (a = [a]);
                    var b = this.id;
                    return W(k.map(a, function(a) {
                        return c.intersects(a, b)
                    }))
                },
                _filterByExtent: function(a, c) {
                    for (var b = [], d = 0, e = a.length; d < e; d++) {
                        var f = a[d],
                            l = f.geometry;
                        l && (this.normalization && c.length ? (c[0].intersects(l) || c[1].intersects(l)) && b.push(f) : c.intersects(l) && b.push(f))
                    }
                    return b
                },
                _filterByTime: function(a, c, b) {
                    var d = this._startTimeField,
                        e = this._endTimeField,
                        f;
                    this._twoTimeFields || (f = d || e);
                    var l = r.isDefined,
                        g = [],
                        h = [],
                        n, m = a.length,
                        k, p;
                    c = c ? c.getTime() : -Infinity;
                    b = b ? b.getTime() : Infinity;
                    if (f)
                        for (n = 0; n < m; n++) k =
                            a[n], p = k.attributes, d = p[f], d >= c && d <= b ? g.push(k) : h.push(k);
                    else
                        for (n = 0; n < m; n++) k = a[n], p = k.attributes, f = p[d], p = p[e], f = l(f) ? f : -Infinity, p = l(p) ? p : Infinity, f >= c && f <= b || p >= c && p <= b || c >= f && b <= p ? g.push(k) : h.push(k);
                    return {
                        match: g,
                        noMatch: h
                    }
                },
                _resolve: function(a, c, b, d, e) {
                    c && this[c].apply(this, a);
                    b && b.apply(null, a);
                    d && A._resDfd(d, a, e)
                },
                _getShallowClone: function(a) {
                    var c = new I,
                        b;
                    for (b in a) a.hasOwnProperty(b) && (c[b] = a[b]);
                    return c
                },
                _query: function(a, c, b, d, e) {
                    var f = this,
                        l = this._map,
                        g = new u(A._dfdCanceller),
                        h =
                        b,
                        k = function(b, e) {
                            if (!e && ("execute" === a || "executeRelationshipQuery" === a)) {
                                var h, l;
                                if ("execute" === a) {
                                    h = b.features;
                                    l = h.length;
                                    for (l -= 1; 0 <= l; l--)
                                        if (h[l]._layer = f, !f._isTable) {
                                            var k = f._mode._getFeature(h[l].attributes[f.objectIdField]);
                                            k && h.splice(l, 1, k)
                                        }
                                } else
                                    for (k in b)
                                        if (b.hasOwnProperty(k)) {
                                            h = b[k].features;
                                            l = h.length;
                                            for (l -= 1; 0 <= l; l--) h[l]._layer = f
                                        }
                            }
                            f._resolve([b], c, d, g)
                        };
                    if ("executeRelationshipQuery" !== a) {
                        h = this._getShallowClone(b);
                        h.outFields = this.getOutFields();
                        h.returnGeometry = b.hasOwnProperty("returnGeometry") ?
                            b.returnGeometry : !b.outStatistics;
                        h.returnGeometry && (h.multipatchOption = this.multipatchOption);
                        var m;
                        l && (h.outSpatialReference = new H(l.spatialReference.toJson()));
                        if (!this._applyQueryFilters(h, "execute" === a)) {
                            switch (a) {
                                case "execute":
                                    m = new J({
                                        features: []
                                    });
                                    break;
                                case "executeForIds":
                                    m = [];
                                    break;
                                case "executeForCount":
                                    m = 0;
                                    break;
                                case "executeForExtent":
                                    m = {}
                            }
                            k(m, !0);
                            return g
                        }
                        if (b = "executeForExtent" !== a && this._canDoClientSideQuery(h)) return g._pendingDfd = N(this._doQuery(h, b, "executeForIds" === a || "executeForCount" ===
                            a)), g._pendingDfd.then(function(b) {
                            switch (a) {
                                case "execute":
                                    m = new J;
                                    m.features = b;
                                    break;
                                case "executeForIds":
                                    m = b;
                                    break;
                                case "executeForCount":
                                    m = b.length
                            }
                            k(m, !0)
                        }), g
                    }
                    if (this._collection) return this._resolve([Error("FeatureLayer::_query - " + this.invalidParams)], null, e, g, !0), g;
                    this._ts && (h._ts = (new Date).getTime());
                    (g._pendingDfd = this._task[a](h)).addCallbacks(k, function(a) {
                        f._resolve([a], null, e, g, !0)
                    });
                    return g
                },
                _convertFeaturesToJson: function(a, c, b, d) {
                    var e = [],
                        f = this._selectionSymbol,
                        l = this.visibilityField,
                        g, h = this.objectIdField;
                    if (this.loaded && (b || d)) g = k.filter(this.fields, function(a) {
                        return !1 === a.editable && (!d || a.name !== h)
                    });
                    for (b = 0; b < a.length; b++) {
                        var n = a[b],
                            m = {},
                            r = n.geometry,
                            p = n.attributes,
                            s = n.symbol;
                        if (r && (!d || !this.loaded || this.allowGeometryUpdates)) m.geometry = r.toJson();
                        l ? (m.attributes = p = q.mixin({}, p), p[l] = n.visible ? 1 : 0) : p && (m.attributes = q.mixin({}, p));
                        m.attributes && (g && g.length) && k.forEach(g, function(a) {
                            delete m.attributes[a.name]
                        });
                        s && s !== f && (m.symbol = s.toJson());
                        e.push(m)
                    }
                    return c ? e : F.toJson(e)
                },
                _selectHandler: function(a, c, b, d, e) {
                    var f;
                    d = t;
                    switch (c) {
                        case d.SELECTION_NEW:
                            this.clearSelection(!0);
                            f = !0;
                            break;
                        case d.SELECTION_ADD:
                            f = !0;
                            break;
                        case d.SELECTION_SUBTRACT:
                            f = !1
                    }
                    d = a.features;
                    var l = this._mode,
                        g = [],
                        h = this.objectIdField,
                        k, m;
                    if (f)
                        for (f = 0; f < d.length; f++) k = d[f], m = k.attributes[h], k = l._addFeatureIIf(m, k), g.push(k), this._selectFeatureIIf(m, k, l);
                    else
                        for (f = 0; f < d.length; f++) k = d[f], m = k.attributes[h], this._unSelectFeatureIIf(m, l), m = l._removeFeatureIIf(m), g.push(m || k);
                    this._isSelOnly && l._applyTimeFilter(!0);
                    this._resolve([g, c, a.exceededTransferLimit ? {
                        queryLimitExceeded: !0
                    } : null], "onSelectionComplete", b, e);
                    if (a.exceededTransferLimit) this.onQueryLimitExceeded()
                },
                _selectFeatureIIf: function(a, c, b) {
                    var d = this._selectedFeatures,
                        e = d[a];
                    e || (b._incRefCount(a), d[a] = c, this._isTable || (this._setSelectSymbol(c), c.attr("data-selected", "")));
                    return e || c
                },
                _unSelectFeatureIIf: function(a, c) {
                    var b = this._selectedFeatures[a];
                    b && (c._decRefCount(a), delete this._selectedFeatures[a], this._isTable || (this._setUnSelectSymbol(b),
                        b.attr("data-selected")));
                    return b
                },
                _isSelected: function(a) {},
                _setSelectSymbol: function(a) {
                    var c = this._selectionSymbol;
                    c && !this._isSelOnly && a.setSymbol(c)
                },
                _setUnSelectSymbol: function(a) {
                    var c = this._selectionSymbol;
                    c && !this._isSelOnly && c === a.symbol && a.setSymbol(null, !0)
                },
                _getOutFields: function() {
                    var a = [this.objectIdField, this.typeIdField, this.creatorField, this._startTimeField, this._endTimeField, this._trackIdField].concat(this._rendererFields).concat(this.dataAttributes),
                        a = k.filter(a, function(a, c,
                            e) {
                            return !!a && k.indexOf(e, a) === c
                        }),
                        c = q.clone(this._outFields);
                    if (c) {
                        if (-1 !== k.indexOf(c, "*")) return c;
                        k.forEach(a, function(a) {
                            -1 === k.indexOf(c, a) && c.push(a)
                        });
                        return c
                    }
                    return a
                },
                _checkFields: function(a) {
                    var c = a || this._getOutFields();
                    k.forEach(c, function(a) {
                        "*" !== a && (this._getField(a) || console.debug("esri.layers.FeatureLayer: " + r.substitute({
                            url: this.url,
                            field: a
                        }, "unable to find '${field}' field in the layer 'fields' information [url: ${url}]")))
                    }, this);
                    !a && (!this._isTable && !this._fserver && !this._collection) &&
                        (k.some(this.fields, function(a) {
                        return a && "esriFieldTypeGeometry" === a.type ? !0 : !1
                    }) || console.debug("esri.layers.FeatureLayer: " + r.substitute({
                        url: this.url
                    }, "unable to find a field of type 'esriFieldTypeGeometry' in the layer 'fields' information. If you are using a map service layer, features will not have geometry [url: ${url}]")))
                },
                _fixRendererFields: function() {
                    var a = this.renderer;
                    this._orderBy = null;
                    if (a && 0 < this.fields.length) {
                        var c = [],
                            b, d, a = k.filter([a, a.observationRenderer, a.latestObservationRenderer,
                                a.trackRenderer
                            ], r.isDefined),
                            e = [].concat(a);
                        k.forEach(a, function(a) {
                            k.forEach(a.rendererInfos, function(a) {
                                a.renderer && e.push(a.renderer)
                            })
                        });
                        k.forEach(e, function(a) {
                            if ((d = a.attributeField) && !q.isFunction(d))
                                if (b = !this._getField(d) && this._getField(d, !0)) a.attributeField = b.name;
                            if (d = a.attributeField2)
                                if (b = !this._getField(d) && this._getField(d, !0)) a.attributeField2 = b.name;
                            if (d = a.attributeField3)
                                if (b = !this._getField(d) && this._getField(d, !0)) a.attributeField3 = b.name;
                            q.isFunction(a.attributeField) || c.push(a.attributeField);
                            c.push(a.attributeField2);
                            c.push(a.attributeField3);
                            if ((d = a.rotationInfo && a.rotationInfo.field) && !q.isFunction(d)) {
                                if (b = !this._getField(d) && this._getField(d, !0)) d = a.rotationInfo.field = b.name;
                                c.push(d)
                            }
                            if (a.proportionalSymbolInfo) {
                                if ((d = a.proportionalSymbolInfo.field) && !q.isFunction(d)) {
                                    if (b = !this._getField(d) && this._getField(d, !0)) d = a.proportionalSymbolInfo.field = b.name;
                                    c.push(d);
                                    this._orderBy || (this._orderBy = [d + " DESC"])
                                }
                                if ((d = a.proportionalSymbolInfo.normalizationField) && !q.isFunction(d)) {
                                    if (b = !this._getField(d) && this._getField(d, !0)) d = a.proportionalSymbolInfo.normalizationField = b.name;
                                    c.push(d)
                                }
                            }
                            if (a.colorInfo) {
                                if ((d = a.colorInfo.field) && !q.isFunction(d)) {
                                    if (b = !this._getField(d) && this._getField(d, !0)) d = a.colorInfo.field = b.name;
                                    c.push(d)
                                }
                                if ((d = a.colorInfo.normalizationField) && !q.isFunction(d)) {
                                    if (b = !this._getField(d) && this._getField(d, !0)) d = a.colorInfo.normalizationField = b.name;
                                    c.push(d)
                                }
                            }
                            if (!this._orderBy && a.addBreak && !q.isFunction(a.attributeField) && (a.backgroundFillSymbol || this._hasSizeDiff(a))) this._orderBy = [a.attributeField + " DESC"]
                        }, this);
                        this._rendererFields = k.filter(c, r.isDefined)
                    }
                },
                _hasSizeDiff: function(a) {
                    var c = Number.MAX_VALUE,
                        b = -Number.MAX_VALUE,
                        d, e;
                    k.forEach(a.infos, function(a) {
                        if (e = a.symbol) {
                            d = 0;
                            switch (e.type) {
                                case "simplemarkersymbol":
                                    d = e.size;
                                    break;
                                case "picturemarkersymbol":
                                    d = (e.width + e.height) / 2;
                                    break;
                                case "simplelinesymbol":
                                case "cartographiclinesymbol":
                                    d = e.width;
                                    break;
                                case "simplefillsymbol":
                                case "picturefillsymbol":
                                    d = e.outline && e.outline.width
                            }
                            d && (c = Math.min(c, d), b = Math.max(b, d))
                        }
                    });
                    return c !== Number.MAX_VALUE && b !== -Number.MAX_VALUE && 1 < Math.abs(b - c)
                },
                getOrderByFields: function() {
                    var a = this.orderByFields || this._orderBy;
                    return this.supportsAdvancedQueries && a ? k.filter(a, function(a) {
                        a = a.split(" ")[0];
                        return !!this._getField(a, !0)
                    }, this) : null
                },
                _getField: function(a, c) {
                    var b = this.fields;
                    if (!b || 0 === b.length) return null;
                    var d;
                    c && (a = a.toLowerCase());
                    k.some(b, function(b) {
                        var f = !1;
                        (f = c ? b && b.name.toLowerCase() === a ? !0 : !1 : b && b.name === a ? !0 : !1) && (d = b);
                        return f
                    });
                    return d
                },
                _getDateOpts: function() {
                    this._dtOpts ||
                        (this._dtOpts = {
                        properties: k.map(k.filter(this.fields, function(a) {
                            return !!(a && "esriFieldTypeDate" === a.type)
                        }), function(a) {
                            return a.name
                        })
                    });
                    return this._dtOpts
                },
                _applyNormalized: function(a, c) {
                    a && c && k.forEach(a, function(a, d) {
                        a && c[d] && a.setGeometry(c[d])
                    })
                },
                _editHandler: function(a, c, b, d, e, f) {
                    e = a.addResults;
                    var l = a.updateResults;
                    a = a.deleteResults;
                    var g, h, n, m, q = this.objectIdField,
                        p = this._mode,
                        s = this._isTable;
                    g = this.editFieldsInfo;
                    var r = this.getOutFields() || [],
                        x = g && g.creatorField,
                        v = g && g.creationDateField,
                        y = g && g.editorField,
                        z = g && g.editDateField;
                    g = g && g.realm; - 1 === k.indexOf(r, "*") && (x && -1 === k.indexOf(r, x) && (x = null), v && -1 === k.indexOf(r, v) && (v = null), y && -1 === k.indexOf(r, y) && (y = null), z && -1 === k.indexOf(r, z) && (z = null));
                    var r = v || z ? (new Date).getTime() : null,
                        u = x || y ? this.getUserId() : void 0;
                    u && g && (u = u + "@" + g);
                    if (e)
                        for (g = 0; g < e.length; g++) e[g] = new E(e[g]), s || (h = e[g], h.success && (h = h.objectId, n = c[g], (m = n._graphicsLayer) && m !== this && m.remove(n), m = n.attributes || {}, m[q] = h, x && (m[x] = u), y && (m[y] = u), v && (m[v] = r), z && (m[z] = r),
                            n.setAttributes(m), p._init && p.drawFeature(n)));
                    if (l)
                        for (g = 0; g < l.length; g++)
                            if (l[g] = new E(l[g]), !s && (h = l[g], h.success)) {
                                h = h.objectId;
                                n = b[h];
                                if (c = p._getFeature(h)) c.geometry !== n.geometry && c.setGeometry(ea.fromJson(n.geometry.toJson())), this._repaint(c, h);
                                n = c || n;
                                m = n.attributes || {};
                                y && (m[y] = u);
                                z && (m[z] = r);
                                n.setAttributes(m)
                            }
                    if (a) {
                        b = [];
                        for (g = 0; g < a.length; g++)
                            if (a[g] = new E(a[g]), !s && (h = a[g], h.success && (h = h.objectId, n = p._getFeature(h)))) this._unSelectFeatureIIf(h, p) && b.push(n), n._count = 0, p._removeFeatureIIf(h);
                        if (0 < b.length) this.onSelectionComplete(b, t.SELECTION_SUBTRACT)
                    }
                    this._resolve([e, l, a], "onEditsComplete", d, f)
                },
                _sendAttachment: function(a, c, b, d, e) {
                    var f = this;
                    return D({
                        url: this._url.path + "/" + c + "/" + ("add" === a ? "addAttachment" : "updateAttachment"),
                        form: b,
                        content: q.mixin(this._url.query, {
                            f: "json",
                            token: this._getToken() || void 0
                        }),
                        callbackParamName: "callback.html",
                        handleAs: "json"
                    }).addCallback(function(b) {
                        var e = "add" === a ? "onAddAttachmentComplete" : "onUpdateAttachmentComplete";
                        b = new E(b["add" === a ? "addAttachmentResult" :
                            "updateAttachmentResult"]);
                        b.attachmentId = b.objectId;
                        b.objectId = c;
                        f._resolve([b], e, d);
                        return b
                    }).addErrback(function(a) {
                        f._resolve([a], null, e, null, !0)
                    })
                },
                _repaint: function(a, c, b) {
                    c = r.isDefined(c) ? c : a.attributes[this.objectIdField];
                    (!(c in this._selectedFeatures) || !this._selectionSymbol) && a.setSymbol(a.symbol, b)
                },
                _getKind: function(a) {
                    var c = this._trackManager;
                    return c ? c.isLatestObservation(a) ? 1 : 0 : 0
                }
            });
        q.mixin(t, {
            MODE_SNAPSHOT: 0,
            MODE_ONDEMAND: 1,
            MODE_SELECTION: 2,
            SELECTION_NEW: 3,
            SELECTION_ADD: 4,
            SELECTION_SUBTRACT: 5,
            MODE_AUTO: 6,
            MODE_STREAM: 7,
            POPUP_NONE: "esriServerHTMLPopupTypeNone",
            POPUP_HTML_TEXT: "esriServerHTMLPopupTypeAsHTMLText",
            POPUP_URL: "esriServerHTMLPopupTypeAsURL"
        });
        fa._createWrappers(t);
        return t
    });