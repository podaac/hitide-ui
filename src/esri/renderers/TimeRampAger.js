//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Color", "dojo/has", "../kernel", "../symbols/jsonUtils", "./SymbolAger"], function(m, r, n, s, t, p, q) {
    return m(q, {
        declaredClass: "esri.renderer.TimeRampAger",
        constructor: function(g, k, a) {
            this.colorRange = g;
            this.sizeRange = k;
            this.alphaRange = a
        },
        getAgedSymbol: function(g, k) {
            var a = k.getLayer(),
                c = k.attributes;
            g = p.fromJson(g.toJson());
            var b = a._map.timeExtent,
                d = b.startTime,
                b = b.endTime;
            if (!d || !b) return g;
            d = d.getTime();
            b = b.getTime();
            a = new Date(c[a._startTimeField]);
            a = a.getTime();
            a < d && (a = d);
            d = b === d ? 1 : (a - d) / (b - d);
            if (a = this.sizeRange) c = a[0], b = a[1], a = Math.abs(b - c) * d, this._setSymbolSize(g, c < b ? c + a : c - a);
            if (a = this.colorRange) {
                var b = a[0],
                    f = a[1],
                    l = Math.round,
                    c = new n,
                    e = b.r,
                    h = f.r,
                    a = Math.abs(h - e) * d;
                c.r = l(e < h ? e + a : e - a);
                e = b.g;
                h = f.g;
                a = Math.abs(h - e) * d;
                c.g = l(e < h ? e + a : e - a);
                e = b.b;
                h = f.b;
                a = Math.abs(h - e) * d;
                c.b = l(e < h ? e + a : e - a);
                b = b.a;
                f = f.a;
                a = Math.abs(f - b) * d;
                c.a = b < f ? b + a : b - a;
                g.setColor(c)
            }
            c = g.color;
            if ((a = this.alphaRange) && c) b = a[0], f = a[1], a = Math.abs(f - b) * d, c.a = b < f ? b + a : b - a;
            return g
        }
    })
});