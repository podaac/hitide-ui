//>>built
define(["dojo/_base/array", "dojo/_base/lang", "dojo/_base/Deferred", "dojo/has", "../kernel", "../config", "../deferredUtils", "./Polyline", "./Polygon", "./webMercatorUtils", "./jsonUtils"], function(h, m, E, M, N, K, y, v, A, z, L) {
    function w(a, f) {
        return Math.ceil((a - f) / (2 * f))
    }

    function B(a, f) {
        var c = a.paths || a.rings,
            b, e, d = c.length,
            n;
        for (b = 0; b < d; b++) {
            n = c[b].length;
            for (e = 0; e < n; e++) {
                var p = a.getPoint(b, e);
                a.setPoint(b, e, p.offset(f, 0))
            }
        }
        return a
    }

    function F(a, f) {
        if (!(a instanceof v || a instanceof A)) throw console.error("_straightLineDensify: the input geometry is neither polyline nor polygon"),
            Error("_straightLineDensify: the input geometry is neither polyline nor polygon");
        var c = a instanceof v,
            b = [],
            e;
        h.forEach(c ? a.paths : a.rings, function(a) {
            b.push(e = []);
            e.push([a[0][0], a[0][1]]);
            var n, c, q, l, k, g, h, x, m, r, s, t;
            for (k = 0; k < a.length - 1; k++) {
                n = a[k][0];
                c = a[k][1];
                q = a[k + 1][0];
                l = a[k + 1][1];
                h = Math.sqrt((q - n) * (q - n) + (l - c) * (l - c));
                x = (l - c) / h;
                m = (q - n) / h;
                r = h / f;
                if (1 < r) {
                    for (g = 1; g <= r - 1; g++) t = g * f, s = m * t + n, t = x * t + c, e.push([s, t]);
                    g = (h + Math.floor(r - 1) * f) / 2;
                    s = m * g + n;
                    t = x * g + c;
                    e.push([s, t])
                }
                e.push([q, l])
            }
        });
        return c ? new v({
            paths: b,
            spatialReference: a.spatialReference
        }) : new A({
            rings: b,
            spatialReference: a.spatialReference
        })
    }

    function C(a, f, c) {
        f && (a = F(a, 1E6), a = z.webMercatorToGeographic(a, !0));
        c && (a = B(a, c));
        return a
    }

    function D(a, f, c) {
        var b = a.x || a[0],
            e;
        b > f ? (e = w(b, f), a.x ? a = a.offset(e * -2 * f, 0) : a[0] = b + e * -2 * f) : b < c && (e = w(b, c), a.x ? a = a.offset(e * -2 * c, 0) : a[0] = b + e * -2 * c);
        return a
    }

    function G(a, f) {
        var c = -1;
        h.forEach(f.cutIndexes, function(b, e) {
            var d = f.geometries[e];
            h.forEach(d.rings || d.paths, function(a, e) {
                h.some(a, function(b) {
                    if (!(180 > b[0])) {
                        b = 0;
                        var c, f = a.length,
                            g;
                        for (c = 0; c < f; c++) g = a[c][0], b = g > b ? g : b;
                        b = Number(b.toFixed(9));
                        b = -360 * w(b, 180);
                        f = a.length;
                        for (c = 0; c < f; c++) g = d.getPoint(e, c), d.setPoint(e, c, g.offset(b, 0))
                    }
                    return !0
                })
            });
            b === c ? d.rings ? h.forEach(d.rings, function(d, c) {
                a[b] = a[b].addRing(d)
            }) : h.forEach(d.paths, function(d, c) {
                a[b] = a[b].addPath(d)
            }) : (c = b, a[b] = d)
        });
        return a
    }

    function H(a, f, c, b) {
        var e = new E;
        e.addCallbacks(c, b);
        var d = [],
            n = [],
            p, q, l, k, g, m, x, u, r = 0;
        h.forEach(a, function(a) {
            if (a)
                if (p || (p = a.spatialReference, q = p._getInfo(), k = (l = p._isWebMercator()) ?
                    2.0037508342788905E7 : 180, g = l ? -2.0037508342788905E7 : -180, m = l ? 102100 : 4326, x = new v({
                        paths: [
                            [
                                [k, g],
                                [k, k]
                            ]
                        ],
                        spatialReference: {
                            wkid: m
                        }
                    }), u = new v({
                        paths: [
                            [
                                [g, g],
                                [g, k]
                            ]
                        ],
                        spatialReference: {
                            wkid: m
                        }
                    })), q) {
                    var b = L.fromJson(a.toJson()),
                        c = a.getExtent();
                    "point" === a.type ? d.push(D(b, k, g)) : "multipoint" === a.type ? (b.points = h.map(b.points, function(a) {
                        return D(a, k, g)
                    }), d.push(b)) : "extent" === a.type ? (b = c._normalize(null, null, q), d.push(b.rings ? new A(b) : b)) : c ? (a = w(c.xmin, g) * 2 * k, b = 0 === a ? b : B(b, a), c = c.offset(a, 0), c.intersects(x) &&
                        c.xmax !== k ? (r = c.xmax > r ? c.xmax : r, b = C(b, l), n.push(b), d.push("cut")) : c.intersects(u) && c.xmin !== g ? (r = c.xmax * 2 * k > r ? c.xmax * 2 * k : r, b = C(b, l, 360), n.push(b), d.push("cut")) : d.push(b)) : d.push(b)
                } else d.push(a);
            else d.push(a)
        });
        c = new v;
        b = w(r, k);
        for (var s = -90, t = b; 0 < b;) {
            var y = -180 + 360 * b;
            c.addPath([
                [y, s],
                [y, -1 * s]
            ]);
            s *= -1;
            b--
        }
        0 < n.length && 0 < t ? f ? f.cut(n, c, function(b) {
            n = G(n, b);
            var c = [];
            h.forEach(d, function(b, e) {
                if ("cut" === b) {
                    var f = n.shift();
                    a[e].rings && 1 < a[e].rings.length && f.rings.length >= a[e].rings.length ? (d[e] = "simplify",
                        c.push(f)) : d[e] = !0 === l ? z.geographicToWebMercator(f) : f
                }
            });
            0 < c.length ? f.simplify(c, function(a) {
                h.forEach(d, function(b, c) {
                    "simplify" === b && (d[c] = !0 === l ? z.geographicToWebMercator(a.shift()) : a.shift())
                });
                e.callback(d)
            }, function(a) {
                e.errback(a)
            }) : e.callback(d)
        }, function(a) {
            e.errback(a)
        }) : e.errback(Error("esri.geometry.normalizeCentralMeridian: 'geometryService' argument is missing.")) : (h.forEach(d, function(a, b) {
            if ("cut" === a) {
                var c = n.shift();
                d[b] = !0 === l ? z.geographicToWebMercator(c) : c
            }
        }), e.callback(d));
        return e
    }

    function u(a, f, c, b) {
        var e = !1,
            d;
        m.isObject(a) && a && (m.isArray(a) ? a.length && ((d = a[0] && a[0].declaredClass) && -1 !== d.indexOf("Graphic") ? (a = h.map(a, function(a) {
            return a.geometry
        }), e = a.length ? !0 : !1) : d && -1 !== d.indexOf("esri.geometry.") && (e = !0)) : (d = a.declaredClass) && -1 !== d.indexOf("FeatureSet") ? (a = h.map(a.features || [], function(a) {
            return a.geometry
        }), e = a.length ? !0 : !1) : d && -1 !== d.indexOf("esri.geometry.") && (e = !0));
        e && f.push({
            index: c,
            property: b,
            value: a
        })
    }

    function I(a, f) {
        var c = [];
        h.forEach(f, function(b) {
            var e = b.i,
                d = a[e];
            b = b.p;
            var f;
            if (m.isObject(d) && d)
                if (b)
                    if ("*" === b[0])
                        for (f in d) d.hasOwnProperty(f) && u(d[f], c, e, f);
                    else h.forEach(b, function(a) {
                        u(m.getObject(a, !1, d), c, e, a)
                    });
            else u(d, c, e)
        });
        return c
    }

    function J(a, f) {
        var c = 0,
            b = {};
        h.forEach(f, function(e) {
            var d = e.index,
                f = e.property,
                h = e.value,
                q = h.length || 1,
                l = a.slice(c, c + q);
            m.isArray(h) || (l = l[0]);
            c += q;
            delete e.value;
            f ? (b[d] = b[d] || {}, b[d][f] = l) : b[d] = l
        });
        return b
    }
    return {
        normalizeCentralMeridian: H,
        _foldCutResults: G,
        _prepareGeometryForCut: C,
        _offsetMagnitude: w,
        _pointNormalization: D,
        _updatePolyGeometry: B,
        _straightLineDensify: F,
        _createWrappers: function(a) {
            var f = m.isObject(a) ? a.prototype : m.getObject(a + ".prototype");
            h.forEach(f.__msigns, function(a) {
                var b = f[a.n];
                f[a.n] = function() {
                    var e = this,
                        d = [],
                        f, p = new E(y._dfdCanceller);
                    a.f && y._fixDfd(p);
                    for (f = 0; f < a.c; f++) d[f] = arguments[f];
                    var m = {
                        dfd: p
                    };
                    d.push(m);
                    var l, k = [],
                        g;
                    e.normalization && !e._isTable && (l = I(d, a.a), h.forEach(l, function(a) {
                        k = k.concat(a.value)
                    }), k.length && (g = H(k, K.defaults.geometryService)));
                    g ? (p._pendingDfd = g, g.addCallbacks(function(a) {
                        p.canceled ||
                            (m.assembly = J(a, l), p._pendingDfd = b.apply(e, d))
                    }, function(b) {
                        var f = e.declaredClass;
                        f && -1 !== f.indexOf("FeatureLayer") ? e._resolve([b], null, d[a.e], p, !0) : e._errorHandler(b, d[a.e], p)
                    })) : p._pendingDfd = b.apply(e, d);
                    return p
                }
            })
        },
        _disassemble: I,
        _addToBucket: u,
        _reassemble: J
    }
});