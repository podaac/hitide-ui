//>>built
define(["dojo/_base/lang", "dojo/has", "../kernel", "./Point"], function(t, u, v, q) {
    function r(a, c, b) {
        return a instanceof q ? new q(a.x + b * (c.x - a.x), a.y + b * (c.y - a.y)) : [a[0] + b * (c[0] - a[0]), a[1] + b * (c[1] - a[1])]
    }

    function g(a, c) {
        return 1E-8 > Math.abs(a - c)
    }

    function s(a, c, b, d) {
        var e, f = g(a[0], c[0]) ? 1E10 : (a[1] - c[1]) / (a[0] - c[0]);
        e = g(b[0], d[0]) ? 1E10 : (b[1] - d[1]) / (b[0] - d[0]);
        var h = a[1] - f * a[0],
            n = b[1] - e * b[0];
        if (g(f, e)) {
            if (g(h, n)) {
                if (g(a[0], c[0]))
                    if (Math.min(a[1], c[1]) < Math.max(b[1], d[1]) || Math.max(a[1], c[1]) > Math.min(b[1],
                        d[1])) e = (a[1] + c[1] + b[1] + d[1] - Math.min(a[1], c[1], b[1], d[1]) - Math.max(a[1], c[1], b[1], d[1])) / 2, a = (e - h) / f;
                    else return null;
                else if (Math.min(a[0], c[0]) < Math.max(b[0], d[0]) || Math.max(a[0], c[0]) > Math.min(b[0], d[0])) a = (a[0] + c[0] + b[0] + d[0] - Math.min(a[0], c[0], b[0], d[0]) - Math.max(a[0], c[0], b[0], d[0])) / 2, e = f * a + h;
                else return null;
                return [a, e]
            }
            return null
        }
        g(f, 1E10) ? (a = a[0], e = e * a + n) : (a = g(e, 1E10) ? b[0] : -(h - n) / (f - e), e = f * a + h);
        return [a, e]
    }
    return {
        getLength: function(a, c) {
            var b = c.x - a.x,
                d = c.y - a.y;
            return Math.sqrt(b * b + d * d)
        },
        _getLength: function(a, c) {
            var b = c[0] - a[0],
                d = c[1] - a[1];
            return Math.sqrt(b * b + d * d)
        },
        getPointOnLine: r,
        getMidpoint: function(a, c) {
            return r(a, c, 0.5)
        },
        _equals: g,
        _getLineIntersection: s,
        getLineIntersection: function(a, c, b, d, e) {
            (a = s([a.x, a.y], [c.x, c.y], [b.x, b.y], [d.x, d.y])) && (a = new q(a[0], a[1], e));
            return a
        },
        _getLineIntersection2: function(a, c) {
            var b = a[0],
                d = a[1],
                e = c[0],
                f = c[1],
                h = b[0],
                b = b[1],
                n = d[0],
                d = d[1],
                k = e[0],
                l = e[1],
                e = f[0] - k,
                k = h - k,
                g = n - h,
                f = f[1] - l,
                l = b - l,
                m = d - b,
                p = f * g - e * m;
            if (0 === p) return !1;
            e = (e * l - f * k) / p;
            k = (g * l - m * k) /
                p;
            return 0 <= e && 1 >= e && 0 <= k && 1 >= k ? [h + e * (n - h), b + e * (d - b)] : !1
        },
        _pointLineDistance: function(a, c) {
            var b = c[0],
                d = c[1],
                e = b[0],
                f = b[1],
                b = a[0],
                h = a[1],
                g = d[0] - e,
                k = d[1] - f,
                l = b - e,
                q = h - f,
                d = Math.sqrt,
                m = Math.pow,
                p = d(m(g, 2) + m(k, 2)),
                l = (l * g + q * k) / (p * p),
                f = f + l * k;
            return d(m(b - (e + l * g), 2) + m(h - f, 2))
        }
    }
});