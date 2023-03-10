//>>built
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../SpatialReference", "./Geometry", "./Point", "./webMercatorUtils", "./mathUtils"], function(x, v, s, B, C, y, t, z, m, u, A) {
    var w = {
            type: "extent",
            xmin: 0,
            ymin: 0,
            xmax: 0,
            ymax: 0
        },
        g = x(z, {
            declaredClass: "esri.geometry.Extent",
            constructor: function(a, c, b, d, e) {
                s.mixin(this, w);
                s.isObject(a) ? (s.mixin(this, a), this.spatialReference && (this.spatialReference = new t(this.spatialReference))) : this.update(a, c, b, d, e);
                this.verifySR()
            },
            getWidth: function() {
                return Math.abs(this.xmax -
                    this.xmin)
            },
            getHeight: function() {
                return Math.abs(this.ymax - this.ymin)
            },
            getCenter: function() {
                return new m((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2, this.spatialReference)
            },
            centerAt: function(a) {
                var c = this.getCenter(),
                    b = a.x - c.x;
                a = a.y - c.y;
                return new g(this.xmin + b, this.ymin + a, this.xmax + b, this.ymax + a, this.spatialReference)
            },
            update: function(a, c, b, d, e) {
                this.xmin = a;
                this.ymin = c;
                this.xmax = b;
                this.ymax = d;
                this.spatialReference = e;
                return this
            },
            offset: function(a, c) {
                return new g(this.xmin + a, this.ymin + c, this.xmax +
                    a, this.ymax + c, this.spatialReference)
            },
            expand: function(a) {
                var c = (1 - a) / 2;
                a = this.getWidth() * c;
                c *= this.getHeight();
                return new g(this.xmin + a, this.ymin + c, this.xmax - a, this.ymax - c, this.spatialReference)
            },
            intersects: function(a) {
                if (!a) return !1;
                var c = a.type,
                    b = this.spatialReference,
                    d = a.spatialReference;
                b && (d && !b.equals(d) && b._canProject(d)) && (a = b.isWebMercator() ? u.geographicToWebMercator(a) : u.webMercatorToGeographic(a, !0));
                switch (c) {
                    case "point":
                        return this.contains(a);
                    case "multipoint":
                        return this._intersectsMultipoint(a);
                    case "extent":
                        return this._intersectsExtent(a);
                    case "polygon":
                        return this._intersectsPolygon(a);
                    case "polyline":
                        return this._intersectsPolyline(a)
                }
            },
            _intersectsMultipoint: function(a) {
                var c = a.points.length,
                    b;
                for (b = 0; b < c; b++)
                    if (this.contains(a.getPoint(b))) return !0;
                return !1
            },
            _intersectsExtent: function(a) {
                var c, b, d, e, f = !1;
                this.xmin <= a.xmin ? (c = a.xmin, this.xmax < c ? f = !0 : d = Math.min(this.xmax, a.xmax) - c) : (c = this.xmin, a.xmax < c ? f = !0 : d = Math.min(this.xmax, a.xmax) - c);
                this.ymin <= a.ymin ? (b = a.ymin, this.ymax < b ? f = !0 :
                    e = Math.min(this.ymax, a.ymax) - b) : (b = this.ymin, a.ymax < b ? f = !0 : e = Math.min(this.ymax, a.ymax) - b);
                return f ? null : new g(c, b, c + d, b + e, this.spatialReference)
            },
            _intersectsPolygon: function(a) {
                var c = [this.xmin, this.ymax],
                    b = [this.xmax, this.ymax],
                    d = [this.xmin, this.ymin],
                    e = [this.xmax, this.ymin],
                    f = [c, b, d, e],
                    c = [
                        [d, c],
                        [c, b],
                        [b, e],
                        [e, d]
                    ],
                    d = a.rings,
                    e = d.length,
                    k, g = new m(0, 0, this.spatialReference);
                k = f.length;
                for (b = 0; b < k; b++)
                    if (g.update(f[b][0], f[b][1]), a.contains(g)) return !0;
                g.setSpatialReference(a.spatialReference);
                for (var l,
                    h, b = 0; b < e; b++)
                    if (f = d[b], k = f.length) {
                        l = f[0];
                        g.update(l[0], l[1]);
                        if (this.contains(g)) return !0;
                        for (a = 1; a < k; a++) {
                            h = f[a];
                            g.update(h[0], h[1]);
                            if (this.contains(g) || this._intersectsLine([l, h], c)) return !0;
                            l = h
                        }
                    }
                return !1
            },
            _intersectsPolyline: function(a) {
                var c = [
                        [
                            [this.xmin, this.ymin],
                            [this.xmin, this.ymax]
                        ],
                        [
                            [this.xmin, this.ymax],
                            [this.xmax, this.ymax]
                        ],
                        [
                            [this.xmax, this.ymax],
                            [this.xmax, this.ymin]
                        ],
                        [
                            [this.xmax, this.ymin],
                            [this.xmin, this.ymin]
                        ]
                    ],
                    b, d = a.paths,
                    e = d.length,
                    f, k, g, l, h = new m(0, 0, a.spatialReference);
                for (a =
                    0; a < e; a++)
                    if (f = d[a], k = f.length) {
                        g = f[0];
                        h.update(g[0], g[1]);
                        if (this.contains(h)) return !0;
                        for (b = 1; b < k; b++) {
                            l = f[b];
                            h.update(l[0], l[1]);
                            if (this.contains(h) || this._intersectsLine([g, l], c)) return !0;
                            g = l
                        }
                    }
                return !1
            },
            _intersectsLine: function(a, c) {
                var b = A._getLineIntersection2,
                    d, e = c.length;
                for (d = 0; d < e; d++)
                    if (b(a, c[d])) return !0;
                return !1
            },
            contains: function(a) {
                if (!a) return !1;
                var c = a.type;
                if ("point" === c) {
                    var b = this.spatialReference,
                        d = a.spatialReference,
                        c = a.x;
                    a = a.y;
                    b && (d && !b.equals(d) && b._canProject(d)) && (a = b.isWebMercator() ?
                        m.lngLatToXY(c, a) : m.xyToLngLat(c, a, !0), c = a[0], a = a[1]);
                    return c >= this.xmin && c <= this.xmax && a >= this.ymin && a <= this.ymax
                }
                return "extent" === c ? this._containsExtent(a) : !1
            },
            _containsExtent: function(a) {
                var c = a.xmin,
                    b = a.ymin,
                    d = a.xmax,
                    e = a.ymax,
                    f = a.spatialReference;
                a = new m(c, b, f);
                c = new m(c, e, f);
                e = new m(d, e, f);
                b = new m(d, b, f);
                return this.contains(a) && this.contains(c) && this.contains(e) && this.contains(b) ? !0 : !1
            },
            union: function(a) {
                return new g(Math.min(this.xmin, a.xmin), Math.min(this.ymin, a.ymin), Math.max(this.xmax,
                    a.xmax), Math.max(this.ymax, a.ymax), this.spatialReference)
            },
            getExtent: function() {
                var a = this.spatialReference;
                return new g(this.xmin, this.ymin, this.xmax, this.ymax, a && new t(a.toJson()))
            },
            _shiftCM: function(a) {
                if (!this._shifted) {
                    var c = new g(this.toJson()),
                        b = c.spatialReference;
                    if (a = a || b._getInfo()) {
                        var d = this._getCM(a);
                        if (d) {
                            var e = b._isWebMercator() ? u.webMercatorToGeographic(d) : d;
                            c.xmin -= d.x;
                            c.xmax -= d.x;
                            b._isWebMercator() || (e.x = this._normalizeX(e.x, a).x);
                            c.setSpatialReference(new t(y.substitute({
                                    Central_Meridian: e.x
                                },
                                4326 === b.wkid ? a.altTemplate : a.wkTemplate)))
                        }
                    }
                    this._shifted = c
                }
                return this._shifted
            },
            _getCM: function(a) {
                var c, b = a.valid[0];
                a = a.valid[1];
                var d = this.xmin,
                    e = this.xmax;
                if (!(d >= b && d <= a) || !(e >= b && e <= a)) c = this.getCenter();
                return c
            },
            _normalize: function(a, c, b) {
                var d = new g(this.toJson()),
                    e = d.spatialReference;
                if (e && (b = b || e._getInfo())) {
                    var f = v.map(this._getParts(b), function(a) {
                        return a.extent
                    });
                    return 2 < f.length ? a ? this._shiftCM(b) : d.update(b.valid[0], d.ymin, b.valid[1], d.ymax, e) : 2 === f.length ? a ? this._shiftCM(b) :
                        c ? f : {
                            rings: v.map(f, function(a) {
                                return [
                                    [a.xmin, a.ymin],
                                    [a.xmin, a.ymax],
                                    [a.xmax, a.ymax],
                                    [a.xmax, a.ymin],
                                    [a.xmin, a.ymin]
                                ]
                            }),
                            spatialReference: e
                        } : f[0] || d
                }
                return d
            },
            _getParts: function(a) {
                if (!this._parts) {
                    var c = this.xmin,
                        b = this.xmax,
                        d = this.ymin,
                        e = this.ymax,
                        f = this.spatialReference,
                        k = this.getWidth(),
                        m = c,
                        l = b,
                        h = 0,
                        n = 0,
                        r = [],
                        p, q;
                    a = a || f._getInfo();
                    p = a.valid[0];
                    q = a.valid[1];
                    n = this._normalizeX(c, a);
                    c = n.x;
                    h = n.frameId;
                    n = this._normalizeX(b, a);
                    b = n.x;
                    n = n.frameId;
                    a = c === b && 0 < k;
                    if (k > 2 * q) {
                        k = new g(m < l ? c : b, d, q, e, f);
                        c = new g(p,
                            d, m < l ? b : c, e, f);
                        q = new g(0, d, q, e, f);
                        d = new g(p, d, 0, e, f);
                        f = [];
                        p = [];
                        k.contains(q) && f.push(h);
                        k.contains(d) && p.push(h);
                        c.contains(q) && f.push(n);
                        c.contains(d) && p.push(n);
                        for (e = h + 1; e < n; e++) f.push(e), p.push(e);
                        r.push({
                            extent: k,
                            frameIds: [h]
                        }, {
                            extent: c,
                            frameIds: [n]
                        }, {
                            extent: q,
                            frameIds: f
                        }, {
                            extent: d,
                            frameIds: p
                        })
                    } else c > b || a ? r.push({
                        extent: new g(c, d, q, e, f),
                        frameIds: [h]
                    }, {
                        extent: new g(p, d, b, e, f),
                        frameIds: [n]
                    }) : r.push({
                        extent: new g(c, d, b, e, f),
                        frameIds: [h]
                    });
                    this._parts = r
                }
                return this._parts
            },
            _normalizeX: function(a,
                c) {
                var b = 0,
                    d = c.valid[0],
                    e = c.valid[1],
                    f = 2 * e;
                a > e ? (b = Math.ceil(Math.abs(a - e) / f), a -= b * f) : a < d && (b = Math.ceil(Math.abs(a - d) / f), a += b * f, b = -b);
                return {
                    x: a,
                    frameId: b
                }
            },
            toJson: function() {
                var a = {
                        xmin: this.xmin,
                        ymin: this.ymin,
                        xmax: this.xmax,
                        ymax: this.ymax
                    },
                    c = this.spatialReference;
                c && (a.spatialReference = c.toJson());
                return a
            }
        });
    g.defaultProps = w;
    return g
});