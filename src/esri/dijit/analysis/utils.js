//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/event", "dojo/_base/json", "dojo/dom-attr", "dojo/has", "dojo/i18n", "dojo/io-query", "dojo/i18n!../../nls/jsapi", "dojo/json", "dojo/string", "dojo/query", "dojo/dom-style", "dijit/registry", "../../kernel", "../../lang", "./HelpWindow", "../../tasks/query"], function(d, e, q, r, t, C, u, D, E, v, w, F, s, x, y, z, G, h, A, B) {
    d = {};
    e.mixin(d, {
        _helpDialog: null,
        initHelpLinks: function(a, b, c) {
            this._helpDialog || (this._helpDialog = new A);
            if (a) {
                var d = z.byNode(a).get("helpFileName");
                x("[esriHelpTopic]", a).forEach(function(a, p, H) {
                    a && (y.set(a, "display", !h.isDefined(b) || !0 === b ? "" : "none"), r.connect(a, "onclick", e.hitch(this, function(b) {
                        t.stop(b);
                        this._helpDialog.show(b, {
                            helpId: u.get(a, "esriHelpTopic"),
                            helpFileName: d,
                            analysisGpServer: c && c.analysisGpServer ? c.analysisGpServer : null
                        })
                    })))
                }, this)
            }
        },
        constructAnalysisFeatColl: function(a) {
            var b = {},
                c;
            b.featureCollection = a.layerDefinition;
            for (c in b.featureCollection) b.featureCollection.hasOwnProperty(c) && "objectIdField" === c && (b.featureCollection.objectIdFieldName =
                e.clone(b.featureCollection.objectIdField), delete b.featureCollection.objectIdField);
            b.featureCollection.features = a.featureSet.features;
            return b
        },
        constructAnalysisInputLyrObj: function(a) {
            var b = {};
            if (a.url && !a._collection) b = {
                    url: a.url
                }, a.getDefinitionExpression && a.getDefinitionExpression() ? b.filter = a.getDefinitionExpression() : h.isDefined(a.definitionExpression) && "" !== a.definitionExpression && (b.filter = a.definitionExpression), a.credential && (b.serviceToken = a.credential.token), -1 !== b.url.indexOf("?") &&
                (a = b.url.substring(b.url.indexOf("?") + 1, b.url.length), a = v.queryToObject(a), e.mixin(b, a), b.url = b.url.substring(0, b.url.indexOf("?")));
            else if (!a.url || a._collection) b = a.toJson();
            return b
        },
        buildReport: function(a, b) {
            var c = "",
                d = /<\//g,
                n, p;
            b || (b = {}, e.mixin(b, w.analysisMsgCodes));
            q.forEach(a, function(a, r) {
                var f, g, k, l, m;
                if ("string" === typeof a.message) f = h.isDefined(b[a.messageCode]) ? b[a.messageCode] : a.message, c += a.style.substring(0, a.style.indexOf("\x3c/")) + (a.params ? s.substitute(f, a.params) : f) + a.style.substring(a.style.indexOf("\x3c/"));
                else if (e.isArray(a.message)) {
                    for (n = []; null !== (p = d.exec(a.style));) n.push(p.index);
                    k = g = "";
                    m = l = 0;
                    q.forEach(a.message, function(c, d) {
                        0 === d && (g = a.style);
                        f = h.isDefined(b[a.messageCode + "_" + d]) ? b[a.messageCode + "_" + d] : c;
                        m = n[d];
                        k = a.params ? s.substitute(f, a.params) : f;
                        g = g.substring(0, m + l) + k + g.substring(m + l);
                        l = k.length
                    }, this);
                    c += g
                }
            });
            return c
        },
        getLayerFeatureCount: function(a, b) {
            var c = new B;
            c.geometry = b.geometry || "";
            c.where = b.where || "1\x3d1";
            c.geometryType = b.geometryType || "esriGeometryEnvelope";
            return a.queryCount(c)
        },
        createPolygonFeatureCollection: function(a) {
            var b;
            b = {
                layerDefinition: null,
                featureSet: {
                    features: [],
                    geometryType: "esriGeometryPolygon"
                }
            };
            b.layerDefinition = {
                currentVersion: 10.2,
                copyrightText: "",
                defaultVisibility: !0,
                relationships: [],
                isDataVersioned: !1,
                supportsRollbackOnFailureParameter: !0,
                supportsStatistics: !0,
                supportsAdvancedQueries: !0,
                geometryType: "esriGeometryPolygon",
                minScale: 0,
                maxScale: 0,
                objectIdField: "OBJECTID",
                templates: [],
                type: "Feature Layer",
                displayField: "TITLE",
                visibilityField: "VISIBLE",
                name: a,
                hasAttachments: !1,
                typeIdField: "TYPEID",
                capabilities: "Query",
                allowGeometryUpdates: !0,
                htmlPopupType: "",
                hasM: !1,
                hasZ: !1,
                globalIdField: "",
                supportedQueryFormats: "JSON",
                hasStaticData: !1,
                maxRecordCount: -1,
                indexes: [],
                types: [],
                drawingInfo: {
                    renderer: {
                        type: "simple",
                        symbol: {
                            color: [0, 0, 0, 255],
                            outline: {
                                color: [0, 0, 0, 255],
                                width: 3,
                                type: "esriSLS",
                                style: "esriSLSSolid"
                            },
                            type: "esriSFS",
                            style: "esriSFSNull"
                        },
                        label: "",
                        description: ""
                    },
                    transparency: 0,
                    labelingInfo: null,
                    fixedSymbols: !0
                },
                fields: [{
                    alias: "OBJECTID",
                    name: "OBJECTID",
                    type: "esriFieldTypeOID",
                    editable: !1
                }, {
                    alias: "Title",
                    name: "TITLE",
                    length: 50,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Visible",
                    name: "VISIBLE",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }, {
                    alias: "Description",
                    name: "DESCRIPTION",
                    length: 1073741822,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Type ID",
                    name: "TYPEID",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }]
            };
            return b
        },
        createPointFeatureCollection: function(a) {
            var b;
            b = {
                layerDefinition: null,
                featureSet: {
                    features: [],
                    geometryType: "esriGeometryPoint"
                }
            };
            b.layerDefinition = {
                objectIdField: "OBJECTID",
                templates: [],
                type: "Feature Layer",
                drawingInfo: {
                    renderer: {
                        field1: "TYPEID",
                        type: "simple",
                        symbol: {
                            height: 24,
                            xoffset: 0,
                            yoffset: 12,
                            width: 24,
                            contentType: "image/png",
                            type: "esriPMS",
                            url: "http://static.arcgis.com/images/Symbols/Basic/GreenStickpin.png"
                        },
                        description: "",
                        value: "0",
                        label: "Stickpin"
                    }
                },
                displayField: "TITLE",
                visibilityField: "VISIBLE",
                name: a,
                hasAttachments: !1,
                typeIdField: "TYPEID",
                capabilities: "Query",
                types: [],
                geometryType: "esriGeometryPoint",
                fields: [{
                    alias: "OBJECTID",
                    name: "OBJECTID",
                    type: "esriFieldTypeOID",
                    editable: !1
                }, {
                    alias: "Title",
                    name: "TITLE",
                    length: 50,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Visible",
                    name: "VISIBLE",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }, {
                    alias: "Description",
                    name: "DESCRIPTION",
                    length: 1073741822,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Type ID",
                    name: "TYPEID",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }]
            };
            return b
        }
    });
    return d
});