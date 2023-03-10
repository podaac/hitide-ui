//>>built
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../SpatialReference", "./Geometry", "./Point", "./Extent", "./mathUtils"], function(A, q, l, E, F, B, C, D, p, v, y) {
    var z = {
            type: "polygon",
            rings: null
        },
        n = A(D, {
            declaredClass: "esri.geometry.Polygon",
            constructor: function(a) {
                l.mixin(this, z);
                this.rings = [];
                this._ring = 0;
                a && (l.isArray(a) ? this.rings = l.isArray(a[0][0]) ? a : [a] : a.rings ? l.mixin(this, a) : this.spatialReference = a, this.spatialReference && (this.spatialReference = new C(this.spatialReference)));
                this.verifySR()
            },
            _extent: null,
            addRing: function(a) {
                this._extent = this._centroid = null;
                this._ring = this.rings.length;
                this.rings[this._ring] = [];
                l.isArray(a[0]) ? q.forEach(a, this._addPointArr, this) : q.forEach(a, this._addPoint, this);
                return this
            },
            _addPointArr: function(a) {
                this.rings[this._ring].push(a)
            },
            _addPoint: function(a) {
                this.rings[this._ring].push([a.x, a.y])
            },
            _insertPoints: function(a, b) {
                this._extent = this._centroid = null;
                this._ring = b;
                this.rings[this._ring] || (this.rings[this._ring] = []);
                q.forEach(a, this._addPoint,
                    this)
            },
            _validateInputs: function(a, b) {
                return null !== a && void 0 !== a && (0 > a || a >= this.rings.length) || null !== b && void 0 !== a && (0 > b || b >= this.rings[a].length) ? !1 : !0
            },
            getPoint: function(a, b) {
                if (this._validateInputs(a, b)) return new p(this.rings[a][b], this.spatialReference)
            },
            setPoint: function(a, b, c) {
                if (this._validateInputs(a, b)) return this._extent = this._centroid = null, this.rings[a][b] = [c.x, c.y], this
            },
            insertPoint: function(a, b, c) {
                if (this._validateInputs(a) && B.isDefined(b) && 0 <= b && b <= this.rings[a].length) return this._extent =
                    this._centroid = null, this.rings[a].splice(b, 0, [c.x, c.y]), this
            },
            removeRing: function(a) {
                if (this._validateInputs(a, null)) {
                    this._extent = this._centroid = null;
                    a = this.rings.splice(a, 1)[0];
                    var b, c = a.length,
                        d = this.spatialReference;
                    for (b = 0; b < c; b++) a[b] = new p(a[b], d);
                    return a
                }
            },
            removePoint: function(a, b) {
                if (this._validateInputs(a, b)) return this._extent = this._centroid = null, new p(this.rings[a].splice(b, 1)[0], this.spatialReference)
            },
            getExtent: function() {
                var a;
                if (this._extent) return a = new v(this._extent), a._partwise =
                    this._partwise, a;
                a = this.rings;
                var b = a.length;
                if (b && a[0].length) {
                    var c, d, e, g, h, f, k, m, w = g = a[0][0][0],
                        x = h = a[0][0][1],
                        l = Math.min,
                        p = Math.max,
                        n = this.spatialReference,
                        q = [],
                        r, s, t, u;
                    for (f = 0; f < b; f++) {
                        c = a[f];
                        r = s = c[0] && c[0][0];
                        t = u = c[0] && c[0][1];
                        m = c.length;
                        for (k = 0; k < m; k++) d = c[k], e = d[0], d = d[1], w = l(w, e), x = l(x, d), g = p(g, e), h = p(h, d), r = l(r, e), t = l(t, d), s = p(s, e), u = p(u, d);
                        q.push(new v({
                            xmin: r,
                            ymin: t,
                            xmax: s,
                            ymax: u,
                            spatialReference: n ? n.toJson() : null
                        }))
                    }
                    this._extent = {
                        xmin: w,
                        ymin: x,
                        xmax: g,
                        ymax: h,
                        spatialReference: n ? n.toJson() : null
                    };
                    this._partwise = 1 < q.length ? q : null;
                    a = new v(this._extent);
                    a._partwise = this._partwise;
                    return a
                }
            },
            contains: function(a) {
                var b = this.rings,
                    c, d = !1,
                    e, g, h, f, k, m, l = b.length;
                c = this.spatialReference;
                e = a.spatialReference;
                var n = a.x;
                a = a.y;
                c && (e && !c.equals(e) && c._canProject(e)) && (a = c.isWebMercator() ? p.lngLatToXY(n, a) : p.xyToLngLat(n, a, !0), n = a[0], a = a[1]);
                for (m = 0; m < l; m++) {
                    c = b[m];
                    h = c.length;
                    for (k = f = 0; k < h; k++)
                        if (f++, f === h && (f = 0), e = c[k], g = c[f], (e[1] < a && g[1] >= a || g[1] < a && e[1] >= a) && e[0] + (a - e[1]) / (g[1] - e[1]) * (g[0] - e[0]) <
                            n) d = !d
                }
                return d
            },
            getCentroid: function() {
                if (null != this._centroid) return this._centroid;
                var a, b, c, d, e = [],
                    g, h;
                q.forEach(this.rings, function(d) {
                    a = b = c = 0;
                    q.forEach(d, function(e, m) {
                        m < d.length - 1 && (g = d[m + 1], h = e[0] * g[1] - g[0] * e[1], a += (e[0] + g[0]) * h, b += (e[1] + g[1]) * h, c += h)
                    });
                    0 < c && (c *= -1);
                    e.push([a, b, c / 2])
                });
                e.sort(function(a, b) {
                    return a[2] - b[2]
                });
                d = 6 * e[0][2];
                return this._centroid = new p(e[0][0] / d, e[0][1] / d, this.spatialReference)
            },
            isClockwise: function(a) {
                var b = 0,
                    c, d = a.length,
                    e = l.isArray(a[0]) ? function(a, b) {
                        return a[0] *
                            b[1] - b[0] * a[1]
                    } : function(a, b) {
                        return a.x * b.y - b.x * a.y
                    };
                for (c = 0; c < d; c++) b += e(a[c], a[(c + 1) % d]);
                return 0 >= b / 2
            },
            isSelfIntersecting: function(a) {
                a = a || this;
                var b, c, d, e, g, h, f, k = a.rings.length,
                    m;
                for (d = 0; d < k; d++) {
                    for (b = 0; b < a.rings[d].length - 1; b++) {
                        g = [
                            [a.rings[d][b][0], a.rings[d][b][1]],
                            [a.rings[d][b + 1][0], a.rings[d][b + 1][1]]
                        ];
                        for (c = d + 1; c < k; c++)
                            for (e = 0; e < a.rings[c].length - 1; e++)
                                if (h = [
                                    [a.rings[c][e][0], a.rings[c][e][1]],
                                    [a.rings[c][e + 1][0], a.rings[c][e + 1][1]]
                                ], (f = y._getLineIntersection2(g, h)) && !(f[0] === g[0][0] &&
                                    f[1] === g[0][1] || f[0] === h[0][0] && f[1] === h[0][1] || f[0] === g[1][0] && f[1] === g[1][1] || f[0] === h[1][0] && f[1] === h[1][1])) return !0
                    }
                    e = a.rings[d].length;
                    if (!(4 >= e))
                        for (b = 0; b < e - 3; b++) {
                            m = e - 1;
                            0 === b && (m = e - 2);
                            g = [
                                [a.rings[d][b][0], a.rings[d][b][1]],
                                [a.rings[d][b + 1][0], a.rings[d][b + 1][1]]
                            ];
                            for (c = b + 2; c < m; c++)
                                if (h = [
                                    [a.rings[d][c][0], a.rings[d][c][1]],
                                    [a.rings[d][c + 1][0], a.rings[d][c + 1][1]]
                                ], (f = y._getLineIntersection2(g, h)) && !(f[0] === g[0][0] && f[1] === g[0][1] || f[0] === h[0][0] && f[1] === h[0][1] || f[0] === g[1][0] && f[1] === g[1][1] ||
                                    f[0] === h[1][0] && f[1] === h[1][1])) return !0
                        }
                }
                return !1
            },
            toJson: function() {
                var a = {
                        rings: l.clone(this.rings)
                    },
                    b = this.spatialReference;
                b && (a.spatialReference = b.toJson());
                return a
            }
        });
    n.defaultProps = z;
    n.createEllipse = function(a) {
        var b = a.center.x,
            c = a.center.y,
            d = a.longAxis,
            e = a.shortAxis,
            g = a.numberOfPoints,
            h = a.map,
            f, k, m;
        a = [];
        var l = 2 * Math.PI / g;
        for (k = 0; k < g; k++) f = Math.cos(k * l), m = Math.sin(k * l), f = h.toMap({
            x: d * f + b,
            y: e * m + c
        }), a.push(f);
        a.push(a[0]);
        b = new n(h.spatialReference);
        b.addRing(a);
        return b
    };
    n.createCircle = function(a) {
        return n.createEllipse({
            center: a.center,
            longAxis: a.r,
            shortAxis: a.r,
            numberOfPoints: a.numberOfPoints,
            map: a.map
        })
    };
    return n
});