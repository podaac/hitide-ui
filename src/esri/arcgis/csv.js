//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/sniff", "dojo/number", "dojox/data/CsvStore", "../kernel", "../config", "../request", "../SpatialReference", "../geometry/Geometry", "../geometry/jsonUtils", "../geometry/webMercatorUtils"], function(h, e, y, J, K, L, N, z, M, p, O, A, B) {
    function C(b) {
        var c = 0,
            d = "";
        e.forEach([",", " ", ";", "|", "\t"], function(f) {
            var e = b.split(f).length;
            e > c && (c = e, d = f)
        });
        return d
    }

    function D(b, c) {
        if (!b || "[object Date]" !== Object.prototype.toString.call(b) || isNaN(b.getTime())) return !1;
        var d = !0;
        if (J("chrome") && /\d+\W*$/.test(c)) {
            var f = c.match(/[a-zA-Z]{2,}/);
            if (f) {
                for (var d = !1, e = 0, l = f.length, s = /^((jan(uary)?)|(feb(ruary)?)|(mar(ch)?)|(apr(il)?)|(may)|(jun(e)?)|(jul(y)?)|(aug(ust)?)|(sep(tember)?)|(oct(ober)?)|(nov(ember)?)|(dec(ember)?)|(am)|(pm)|(gmt)|(utc))$/i; !d && e <= l && !(d = !s.test(f[e]));) e++;
                d = !d
            }
        }
        return d
    }

    function E(b, c, d) {
        var f = b.indexOf("\n"),
            f = h.trim(b.substr(0, f)),
            g = c.columnDelimiter;
        g || (g = C(f));
        var l = new L({
            data: b,
            separator: g
        });
        l.fetch({
            onComplete: function(b, f) {
                var a =
                    0,
                    g = {
                        layerDefinition: c.layerDefinition,
                        featureSet: {
                            features: [],
                            geometryType: "esriGeometryPoint"
                        }
                    },
                    w = g.layerDefinition.objectIdField;
                !w && !e.some(g.layerDefinition.fields, function(a) {
                    return "esriFieldTypeOID" == a.type ? (w = a.name, !0) : !1
                }) && (g.layerDefinition.fields.push({
                    name: "__OBJECTID",
                    alias: "__OBJECTID",
                    type: "esriFieldTypeOID",
                    editable: !1,
                    domain: null
                }), w = "__OBJECTID");
                var h, n, q = l._attributes,
                    p = [],
                    r = [];
                e.forEach(g.layerDefinition.fields, function(a, b) {
                    "esriFieldTypeDate" === a.type ? p.push(a.name) : ("esriFieldTypeDouble" ===
                        a.type || "esriFieldTypeInteger" === a.type) && r.push(a.name)
                });
                c.locationInfo && "coordinates" === c.locationInfo.locationType ? (h = c.locationInfo.latitudeFieldName, n = c.locationInfo.longitudeFieldName) : e.forEach(q, function(a) {
                    var b;
                    b = e.indexOf(F, a.toLowerCase()); - 1 !== b && (h = a);
                    b = e.indexOf(G, a.toLowerCase()); - 1 !== b && (n = a)
                }, this);
                if (!h || !n) setTimeout(function() {
                    console.error("File does not seem to contain fields with point coordinates.")
                }, 1), d && d(null, Error("File does not seem to contain fields with point coordinates."));
                else {
                    -1 === e.indexOf(r, h) && r.push(h); - 1 === e.indexOf(r, n) && r.push(n);
                    var q = 0,
                        v = b.length;
                    for (q; q < v; q++) {
                        var t = b[q],
                            u = l.getAttributes(t),
                            m = {};
                        e.forEach(u, function(a, b) {
                            if (a) {
                                var c = a;
                                0 === a.length && e.forEach(g.layerDefinition.fields, function(b, c) {
                                    b.name === "attribute_" + (c - 1) && (a = "attribute_" + (c - 1))
                                });
                                if (-1 < e.indexOf(p, a)) {
                                    var c = l.getValue(t, c),
                                        d = new Date(c);
                                    m[a] = D(d, c) ? d.getTime() : null
                                } else if (-1 < e.indexOf(r, a)) {
                                    d = K.parse(l.getValue(t, c));
                                    if ((a == h || a == n) && (isNaN(d) || 181 < Math.abs(d))) d = parseFloat(l.getValue(t,
                                        c));
                                    isNaN(d) ? m[a] = null : m[a] = d
                                } else m[a] = l.getValue(t, c)
                            }
                        });
                        m[w] = a;
                        a++;
                        var u = m[h],
                            x = m[n];
                        null == x || (null == u || isNaN(u) || isNaN(x)) || g.featureSet.features.push({
                            geometry: {
                                x: x,
                                y: u,
                                spatialReference: {
                                    wkid: 4326
                                }
                            },
                            attributes: m
                        })
                    }
                    g.layerDefinition.name = "csv";
                    d && d(g)
                }
            },
            onError: function(b) {
                console.error("Error fetching items from CSV store: ", b);
                d && d(null, b)
            }
        });
        return !0
    }

    function v(b, c, d, f, g, l) {
        0 === b.length && g(null);
        var s = A.getGeometryType(c),
            k = [];
        e.forEach(b, function(a) {
                a = new s(a);
                a.spatialReference = d;
                k.push(a)
            },
            this);
        c = [102113, 102100, 3857];
        d.wkid && 4326 === d.wkid && f.wkid && -1 < e.indexOf(c, f.wkid) ? (e.forEach(k, function(a) {
            a.xmin ? (a.xmin = Math.max(a.xmin, -180), a.xmax = Math.min(a.xmax, 180), a.ymin = Math.max(a.ymin, -89.99), a.ymax = Math.min(a.ymax, 89.99)) : a.rings ? e.forEach(a.rings, function(a) {
                e.forEach(a, function(a) {
                    a[0] = Math.min(Math.max(a[0], -180), 180);
                    a[1] = Math.min(Math.max(a[1], -89.99), 89.99)
                }, this)
            }, this) : a.paths ? e.forEach(a.paths, function(a) {
                e.forEach(a, function(a) {
                    a[0] = Math.min(Math.max(a[0], -180), 180);
                    a[1] = Math.min(Math.max(a[1], -89.99), 89.99)
                }, this)
            }, this) : a.x && (a.x = Math.min(Math.max(a.x, -180), 180), a.y = Math.min(Math.max(a.y, -89.99), 89.99))
        }, this), b = [], e.forEach(k, function(a) {
            a = B.geographicToWebMercator(a);
            102100 !== f.wkid && (a.spatialReference = f);
            b.push(a.toJson())
        }, this), g(b)) : null !== d.wkid && -1 < e.indexOf(c, d.wkid) && null !== f.wkid && 4326 === f.wkid ? (b = [], e.forEach(k, function(a) {
            b.push(B.webMercatorToGeographic(a).toJson())
        }, this), g(b)) : (c = function(a, c) {
            a && a.length === b.length ? (b = [], e.forEach(a, function(a) {
                a && (a.rings && 0 < a.rings.length &&
                    0 < a.rings[0].length && 0 < a.rings[0][0].length && !isNaN(a.rings[0][0][0]) && !isNaN(a.rings[0][0][1]) || a.paths && 0 < a.paths.length && 0 < a.paths[0].length && 0 < a.paths[0][0].length && !isNaN(a.paths[0][0][0]) && !isNaN(a.paths[0][0][1]) || a.xmin && !isNaN(a.xmin) && a.ymin && !isNaN(a.ymin) || a.x && !isNaN(a.x) && a.y && !isNaN(a.y)) ? b.push(a.toJson()) : b.push(null)
            }, this), g(b)) : l(a, c)
        }, z.defaults.geometryService ? z.defaults.geometryService.project(k, f, h.hitch(this, c), l) : g(null))
    }

    function H(b, c) {
        var d = [102113, 102100, 3857];
        return b &&
            c && b.wkid === c.wkid && b.wkt === c.wkt || b && c && b.wkid && c.wkid && -1 < e.indexOf(d, b.wkid) && -1 < e.indexOf(d, c.wkid) ? !0 : !1
    }

    function I(b, c, d, f) {
        if (b.featureSet && 0 !== b.featureSet.features.length)
            if (H(d, c)) f(b);
            else {
                var g = function(a) {
                        var c = [];
                        e.forEach(b.featureSet.features, function(b, d) {
                            a[d] && (b.geometry = a[d], c.push(b))
                        }, this);
                        f(b)
                    },
                    l = function(a, c) {
                        console.error("error projecting featureSet (" + b.layerDefinition.name + "). Final try.");
                        f(b)
                    },
                    s = function(a, f) {
                        console.error("error projecting featureSet (" + b.layerDefinition.name +
                            "). Try one more time.");
                        v(k, b.featureSet.geometryType, c, d, h.hitch(this, g), h.hitch(this, l))
                    };
                if (b.featureSet.features && 0 < b.featureSet.features.length) {
                    var k = [];
                    e.forEach(b.featureSet.features, function(a) {
                        if (a.geometry.toJson) k.push(a.geometry);
                        else {
                            var c = A.getGeometryType(b.featureSet.geometryType);
                            k.push(new c(a.geometry))
                        }
                    });
                    c.toJson || (c = new p(c));
                    d.toJson || (d = new p(d));
                    v(k, b.featureSet.geometryType, c, d, h.hitch(this, g), h.hitch(this, s))
                } else f(b)
            }
    }
    var F = "lat latitude y ycenter latitude83 latdecdeg POINT-Y".split(" "),
        G = "lon lng long longitude x xcenter longitude83 longdecdeg POINT-X".split(" ");
    return {
        latFieldStrings: F,
        longFieldStrings: G,
        buildCSVFeatureCollection: function(b) {
            var c = new y,
                d = function(b, d) {
                    d ? c.errback(d) : c.callback(b)
                };
            M({
                url: b.url,
                handleAs: "text",
                load: function(c) {
                    E(c, b, h.hitch(this, d))
                },
                error: function(b) {
                    c.errback(b);
                    console.error("error: " + b)
                }
            }, {
                usePost: !1
            });
            return c
        },
        projectFeatureCollection: function(b, c, d) {
            var e = new y;
            d || (d = new p({
                wkid: 4326
            }));
            I(b, d, c, h.hitch(this, function(b) {
                e.callback(b)
            }));
            return e
        },
        generateDefaultPopupInfo: function(b) {
            var c = {
                    esriFieldTypeDouble: 1,
                    esriFieldTypeSingle: 1
                },
                d = {
                    esriFieldTypeInteger: 1,
                    esriFieldTypeSmallInteger: 1
                },
                f = {
                    esriFieldTypeDate: 1
                },
                g = null;
            b = e.map(b.layerDefinition.fields, h.hitch(this, function(b) {
                "NAME" === b.name.toUpperCase() && (g = b.name);
                var e = "esriFieldTypeOID" !== b.type && "esriFieldTypeGlobalID" !== b.type && "esriFieldTypeGeometry" !== b.type,
                    k = null;
                if (e) {
                    var a = b.name.toLowerCase();
                    if (-1 < ",stretched value,fnode_,tnode_,lpoly_,rpoly_,poly_,subclass,subclass_,rings_ok,rings_nok,".indexOf("," +
                        a + ",") || -1 < a.indexOf("area") || -1 < a.indexOf("length") || -1 < a.indexOf("shape") || -1 < a.indexOf("perimeter") || -1 < a.indexOf("objectid") || a.indexOf("_") === a.length - 1 || a.indexOf("_i") === a.length - 2 && 1 < a.length) e = !1;
                    b.type in d ? k = {
                        places: 0,
                        digitSeparator: !0
                    } : b.type in c ? k = {
                        places: 2,
                        digitSeparator: !0
                    } : b.type in f && (k = {
                        dateFormat: "shortDateShortTime"
                    })
                }
                return h.mixin({}, {
                    fieldName: b.name,
                    label: b.alias,
                    isEditable: !0,
                    tooltip: "",
                    visible: e,
                    format: k,
                    stringFieldOption: "textbox"
                })
            }));
            return {
                title: g ? "{" + g + "}" : "",
                fieldInfos: b,
                description: null,
                showAttachments: !1,
                mediaInfos: []
            }
        },
        _getSeparator: C,
        _isValidDate: D,
        _processCsvData: E,
        _projectGeometries: v,
        _sameSpatialReference: H,
        _projectFeatureSet: I
    }
});