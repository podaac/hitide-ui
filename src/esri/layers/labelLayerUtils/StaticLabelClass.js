//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/has", "dojox/gfx/_base", "../../kernel", "../../lang", "../../SpatialReference", "../GraphicsLayer", "../LabelClass", "../../renderers/SimpleRenderer", "../../geometry/Geometry", "../../geometry/Extent", "../../geometry/Point", "../../geometry/Polyline", "../../geometry/Polygon", "../../symbols/TextSymbol", "../../symbols/ShieldLabelSymbol", "../../symbols/SimpleLineSymbol"], function(A, D, E, F, G, H, I, J, B, K, L, M, z, N, O, C, P, Q, R) {
    return A(B, {
        declaredClass: "esri.layers.labelLayerUtils.StaticLabel",
        constructor: function() {
            this._preparedLabels = [];
            this._placedLabels = [];
            this._extent = null;
            this._ymax = this._ymin = this._xmax = this._xmin = 0;
            this._scale = 1
        },
        setMap: function(d) {
            this._map = d;
            this._xmin = d.extent.xmin;
            this._xmax = d.extent.xmax;
            this._ymin = d.extent.ymin;
            this._ymax = d.extent.ymax;
            this._scale = (this._xmax - this._xmin) / d.width
        },
        _process: function(d) {
            var a, b, h, c, g, f, e, k;
            this._preparedLabels = d;
            this._placedLabels = [];
            for (d = this._preparedLabels.length - 1; 0 <= d; d--) {
                a = this._preparedLabels[d];
                c = a.labelWidth;
                g = a.labelHeight;
                e = (f = a.options) && void 0 !== f.lineLabelPlacement ? f.lineLabelPlacement : "PlaceAtCenter";
                k = f && void 0 !== f.lineLabelPosition ? f.lineLabelPosition : "Above";
                b = f && void 0 !== f.labelRotation ? f.labelRotation : !0;
                h = a.angle * (Math.PI / 180);
                var l = [];
                if ("point" === a.geometry.type) this._generatePointPositionsStatically(a, a.geometry.x, a.geometry.y, a.text, h, c, g, a.symbolWidth, a.symbolHeight, f, l);
                else if ("multipoint" === a.geometry.type)
                    for (b = 0; b < a.geometry.points.length; b++) this._generatePointPositionsStatically(a, a.geometry.points[b][0],
                        a.geometry.points[b][1], a.text, h, c, g, a.symbolWidth, a.symbolHeight, f, l);
                else if ("polyline" === a.geometry.type) "PlaceAtStart" === e ? this._generateLinePositionsPlaceAtStartStatically(a, a.geometry, a.text, c, g, 2 * a.symbolHeight + g, e, k, b, l) : "PlaceAtEnd" === e ? this._generateLinePositionsPlaceAtEndStatically(a, a.geometry, a.text, c, g, 2 * a.symbolHeight + g, e, k, b, l) : this._generateLinePositionsPlaceAtCenterStatically(a, a.geometry, a.text, c, g, 2 * a.symbolHeight + g, e, k, b, l);
                else if ("polygon" === a.geometry.type)
                    for (b = 0; b < a.geometry.rings.length; b++) f =
                        a.geometry.rings[b], e = this._calcRingExtent(f), k = e.ymax - e.ymin, e.xmax - e.xmin > 2 * c * this._scale && k > 2 * g * this._scale && this._generatePolygonPositionsForManyLabelsStatically(a, f, a.text, h, c, g, l);
                for (b = 0; b < l.length; b++) f = l[b].x, e = l[b].y, l[b].angle && (h = l[b].angle), this._findPlace(a, a.text, f, e, h, c, g)
            }
            return this._placedLabels
        },
        _generatePointPositionsStatically: function(d, a, b, h, c, g, f, e, k, l, u) {
            d = l && l.pointPriorities ? l.pointPriorities : "AboveRight";
            g = (e + g) * this._scale;
            f = (k + f) * this._scale;
            switch (d.toLowerCase()) {
                case "aboveleft":
                    a -=
                        g;
                    b += f;
                    break;
                case "abovecenter":
                    b += f;
                    break;
                case "aboveright":
                    a += g;
                    b += f;
                    break;
                case "centerleft":
                    a -= g;
                    break;
                case "centercenter":
                    break;
                case "centerright":
                    a += g;
                    break;
                case "belowleft":
                    a -= g;
                    b -= f;
                    break;
                case "belowcenter":
                    b -= f;
                    break;
                case "belowright":
                    a += g;
                    b -= f;
                    break;
                default:
                    return
            }
            u.push({
                x: a,
                y: b
            })
        },
        _generateLinePositionsPlaceAtStartStatically: function(d, a, b, h, c, g, f, e, k, l) {
            f = h * this._scale;
            var u = 0.75 * Math.min(this._map.width, this._map.height) * this._scale,
                m, n, s, q, t, x, p, v;
            for (m = 0; m < a.paths.length; m++) {
                var r =
                    a.paths[m],
                    y = f,
                    w = 0;
                for (n = 0; n < r.length - 1; n++) s = r[n][0], q = r[n][1], t = r[n + 1][0], x = r[n + 1][1], p = t - s, v = x - q, p = Math.sqrt(p * p + v * v), w + p > y ? (w = this._generatePositionsOnLine(d, y, u, w, s, q, t, x, b, h, c, g, e, k, l), y = u) : w += p
            }
        },
        _generateLinePositionsPlaceAtEndStatically: function(d, a, b, h, c, g, f, e, k, l) {
            f = h * this._scale;
            var u = 0.75 * Math.min(this._map.width, this._map.height) * this._scale,
                m, n, s, q, t, x, p, v;
            for (m = 0; m < a.paths.length; m++) {
                var r = a.paths[m],
                    y = f,
                    w = 0;
                for (n = r.length - 2; 0 <= n; n--) s = r[n + 1][0], q = r[n + 1][1], t = r[n][0], x = r[n][1], p =
                    t - s, v = x - q, p = Math.sqrt(p * p + v * v), w + p > y ? (w = this._generatePositionsOnLine(d, y, u, w, s, q, t, x, b, h, c, g, e, k, l), y = u) : w += p
            }
        },
        _generateLinePositionsPlaceAtCenterStatically: function(d, a, b, h, c, g, f, e, k, l) {
            f = 0.75 * Math.min(this._map.width, this._map.height) * this._scale;
            var u, m, n, s, q, t, x, p, v;
            for (u = 0; u < a.paths.length; u++) {
                var r = a.paths[u];
                if (!(2 > r.length)) {
                    var y = 0;
                    for (m = 0; m < r.length - 1; m++) s = r[m][0], q = r[m][1], t = r[m + 1][0], x = r[m + 1][1], p = t - s, v = x - q, y += Math.sqrt(p * p + v * v);
                    var w = 0;
                    for (m = 0; m < r.length - 1; m++) {
                        s = r[m][0];
                        q = r[m][1];
                        t = r[m + 1][0];
                        x = r[m + 1][1];
                        p = t - s;
                        v = x - q;
                        p = Math.sqrt(p * p + v * v);
                        if (w + p > y / 2) break;
                        w += p
                    }
                    m == r.length - 1 && m--;
                    s = r[m][0];
                    q = r[m][1];
                    t = r[m + 1][0];
                    x = r[m + 1][1];
                    p = t - s;
                    v = x - q;
                    w = y / 2 - w;
                    v = Math.atan2(v, p);
                    p = s + w * Math.cos(v);
                    v = q + w * Math.sin(v);
                    s = this._angleAndShifts(s, q, t, x, g, e, k);
                    l.push({
                        x: p + s.shiftX,
                        y: v + s.shiftY,
                        angle: s.angle
                    });
                    var y = p,
                        z = v,
                        w = 0;
                    for (n = m; n < r.length - 1; n++) n == m ? (s = y, q = z) : (s = r[n][0], q = r[n][1]), t = r[n + 1][0], x = r[n + 1][1], p = t - s, v = x - q, p = Math.sqrt(p * p + v * v), w = w + p > f ? this._generatePositionsOnLine(d, f, f, w, s, q, t, x, b, h, c, g,
                        e, k, l) : w + p;
                    w = 0;
                    for (n = m; 0 <= n; n--) n == m ? (s = y, q = z) : (s = r[n + 1][0], q = r[n + 1][1]), t = r[n][0], x = r[n][1], p = t - s, v = x - q, p = Math.sqrt(p * p + v * v), w = w + p > f ? this._generatePositionsOnLine(d, f, f, w, s, q, t, x, b, h, c, g, e, k, l) : w + p
                }
            }
        },
        _generatePositionsOnLine: function(d, a, b, h, c, g, f, e, k, l, u, m, n, s, q) {
            d = Math.atan2(e - g, f - c);
            k = c;
            l = g;
            var t = k;
            u = l;
            do
                if (h = a - h, k += h * Math.cos(d), l += h * Math.sin(d), this._belongs(k, l, c, g, f, e)) h = this._angleAndShifts(c, g, f, e, m, n, s), q.push({
                    x: k + h.shiftX,
                    y: l + h.shiftY,
                    angle: h.angle
                }), t = k, u = l, h = 0, a = b;
                else return b = f -
                    t, e -= u, Math.sqrt(b * b + e * e);
            while (1)
        },
        _belongs: function(d, a, b, h, c, g) {
            if (c == b && g == h) return !1;
            if (c > b) {
                if (d > c || d < b) return !1
            } else if (d < c || d > b) return !1;
            if (g > h) {
                if (a > g || a < h) return !1
            } else if (a < g || a > h) return !1;
            return !0
        },
        _angleAndShifts: function(d, a, b, h, c, g, f) {
            for (d = Math.atan2(h - a, b - d); d > Math.PI / 2;) d -= Math.PI;
            for (; d < -(Math.PI / 2);) d += Math.PI;
            h = Math.sin(d);
            var e = Math.cos(d);
            b = a = 0;
            "Above" == g && (a = c * h * this._scale, b = c * e * this._scale);
            "Below" == g && (a = -c * h * this._scale, b = -c * e * this._scale);
            c = [];
            c.angle = f ? -d : 0;
            c.shiftX = -a;
            c.shiftY = b;
            return c
        },
        _generatePolygonPositionsForManyLabelsStatically: function(d, a, b, h, c, g, f) {
            c = this._calcRingExtent(a);
            if (0.75 * (c.xmax - c.xmin) > this._map.width * this._scale || 0.75 * (c.ymax - c.ymin) > this._map.height * this._scale) {
                var e = this._findCentroidForRing(a, this._xmin, this._ymin, this._xmax, this._ymax);
                d = this._map.width * this._scale < c.xmax - c.xmin ? 1 * this._map.width * this._scale : 1 * (c.xmax - c.xmin);
                h = this._map.height * this._scale < c.ymax - c.ymin ? 1 * this._map.height * this._scale : 1 * (c.ymax - c.ymin);
                g = e[0] - Math.round((e[0] -
                    c.xmin) / d) * d;
                var k = e[1] - Math.round((e[1] - c.ymin) / h) * h,
                    l, e = !0;
                for (l = k; l < c.ymax; l += h) {
                    e = !e;
                    for (k = g + (e ? 0 : d / 2); k < c.xmax; k += d) this._isPointWithinRing(b, a, k, l) && f.push({
                        x: k,
                        y: l
                    })
                }
            } else e = this._findCentroidForRing(a, this._xmin, this._ymin, this._xmax, this._ymax), this._isPointWithinRing(b, a, e[0], e[1]) && f.push({
                x: e[0],
                y: e[1]
            })
        },
        _calcRingExtent: function(d) {
            var a, b;
            b = new z;
            for (a = 0; a < d.length - 1; a++) {
                var h = d[a][0],
                    c = d[a][1];
                if (void 0 === b.xmin || h < b.xmin) b.xmin = h;
                if (void 0 === b.ymin || c < b.ymin) b.ymin = c;
                if (void 0 ===
                    b.xmax || h > b.xmax) b.xmax = h;
                if (void 0 === b.ymax || c > b.ymax) b.ymax = c
            }
            return b
        },
        _isPointWithinPolygon: function(d, a, b, h) {
            var c;
            for (c = 0; c < a.rings.length; c++)
                if (this._isPointWithinRing(d, a.rings[c], b, h)) return !0;
            return !1
        },
        _isPointWithinRing: function(d, a, b, h) {
            var c, g, f, e, k = [],
                l = a.length;
            for (d = 0; d < l - 1; d++)
                if (c = a[d][0], g = a[d][1], f = a[d + 1][0], e = a[d + 1][1], !(c == f && g == e)) {
                    if (g == e)
                        if (h == g) k.push(c);
                        else continue;
                    g = (f - c) / (e - g) * (h - g) + c;
                    f > c && g >= c && g < f ? k.push(g) : f < c && (g <= c && g > f) && k.push(g)
                }
            k.sort(function(a, b) {
                return a -
                    b
            });
            for (d = 0; d < k.length - 1; d++)
                if (c = k[d], f = k[d + 1], b >= c && b < f)
                    if (d % 2) break;
                    else return !0;
            return !1
        },
        _findCentroidForRing: function(d, a, b, h, c) {
            a = d.length;
            b = [0, 0];
            h = 0;
            c = d[0][0];
            for (var g = d[0][1], f = 1; f < a - 1; f++) {
                var e = d[f][0],
                    k = d[f][1],
                    l = d[f + 1][0],
                    u = d[f + 1][1],
                    m = (e - c) * (u - g) - (l - c) * (k - g);
                b[0] += m * (c + e + l);
                b[1] += m * (g + k + u);
                h += m
            }
            b[0] /= 3 * h;
            b[1] /= 3 * h;
            return b
        },
        _findCentroidForFeature: function(d, a, b, h, c) {
            a = 0;
            b = [0, 0];
            for (h = 0; h < d.rings.length; h++) {
                c = d.rings[h];
                for (var g = c.length, f = c[0][0], e = c[0][1], k = 1; k < g - 1; k++) {
                    var l =
                        c[k][0],
                        u = c[k][1],
                        m = c[k + 1][0],
                        n = c[k + 1][1],
                        s = (l - f) * (n - e) - (m - f) * (u - e);
                    b[0] += s * (f + l + m);
                    b[1] += s * (e + u + n);
                    a += s
                }
            }
            b[0] /= 3 * a;
            b[1] /= 3 * a;
            return b
        },
        _findPlace: function(d, a, b, h, c, g, f) {
            if (isNaN(b) || isNaN(h)) return !1;
            for (var e = 0; e < this._placedLabels.length; e++) {
                var k = this._placedLabels[e].angle,
                    l = this._placedLabels[e].width * this._scale,
                    u = this._placedLabels[e].height * this._scale,
                    m = this._placedLabels[e].x - b,
                    n = this._placedLabels[e].y - h;
                if (0 === c && 0 === k) {
                    if (this._findPlace2(-g * this._scale, -f * this._scale, g * this._scale,
                        f * this._scale, m - l, n - u, m + l, n + u)) return !1
                } else {
                    var s = new z(-g * this._scale, -f * this._scale, g * this._scale, f * this._scale, null),
                        q = 0,
                        t = 1;
                    0 !== c && (q = Math.sin(c), t = Math.cos(c));
                    var x = m * t - n * q,
                        m = m * q + n * t,
                        k = k - c,
                        q = Math.sin(k),
                        t = Math.cos(k),
                        p = -l * t - -u * q,
                        n = -l * q + -u * t,
                        k = +l * t - -u * q,
                        v = +l * q + -u * t,
                        l = x + p,
                        u = m - n,
                        q = x + k,
                        t = m - v,
                        p = x - p,
                        n = m + n,
                        x = x - k,
                        m = m + v,
                        k = new C;
                    k.addRing([
                        [l, u],
                        [q, t],
                        [p, n],
                        [x, m],
                        [l, u]
                    ]);
                    if (s.intersects(k)) return !1
                }
            }
            for (; c > Math.PI / 2;) c -= Math.PI;
            for (; c < -(Math.PI / 2);) c += Math.PI;
            e = {};
            e.layer = d;
            e.text = a;
            e.angle = c;
            e.x =
                b;
            e.y = h;
            e.width = g;
            e.height = f;
            this._placedLabels.push(e);
            return !0
        },
        _findPlace2: function(d, a, b, h, c, g, f, e) {
            return (d >= c && d <= f || b >= c && b <= f || d <= c && b >= f) && (a >= g && a <= e || h >= g && h <= e || a <= g && h >= e) ? !0 : !1
        }
    })
});