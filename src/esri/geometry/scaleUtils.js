//>>built
define(["dojo/_base/lang", "dojo/has", "../kernel", "../config", "../lang", "../WKIDUnitConversion"], function(p, q, r, m, n, h) {
    var k = 20015077 / 180,
        l = m.defaults,
        f = {
            getUnitValue: function(a) {
                var b, c, d;
                a && ("object" === typeof a ? (b = a.wkid, c = a.wkt) : "number" === typeof a ? b = a : "string" === typeof a && (c = a));
                b ? d = h.values[h[b]] : c && -1 !== c.search(/^PROJCS/i) && (a = /UNIT\[([^\]]+)\]\]$/i.exec(c)) && a[1] && (d = parseFloat(a[1].split(",")[1]));
                return d
            },
            getScale: function(a, b, c) {
                var d, e, g;
                1 < arguments.length && n.isDefined(b) && !b.declaredClass ?
                    (d = a, e = b, b = null, g = f.getUnitValue(c)) : (d = b || a.extent, e = a.width, g = f.getUnitValue(d && d.spatialReference));
                return d && e ? 39.37 * (d.getWidth() / e * (g || k)) * l.screenDPI : 0
            },
            getExtentForScale: function(a, b, c) {
                c = c || a.extent;
                var d = f.getUnitValue(a.spatialReference);
                return c.expand(b * a.width / (39.37 * (d || k) * l.screenDPI) / c.getWidth())
            }
        };
    return f
});