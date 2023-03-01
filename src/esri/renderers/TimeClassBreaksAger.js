//>>built
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/has", "dojo/date", "../kernel", "../lang", "../symbols/jsonUtils", "./SymbolAger"], function(a, h, c, p, k, q, l, m, n) {
    a = a(n, {
        declaredClass: "esri.renderer.TimeClassBreaksAger",
        constructor: function(b, a) {
            this.infos = b;
            this.timeUnits = a || "day";
            b.sort(function(b, a) {
                return b.minAge < a.minAge ? -1 : b.minAge > a.minAge ? 1 : 0
            })
        },
        getAgedSymbol: function(b, a) {
            var d = a.getLayer(),
                c = a.attributes,
                e = l.isDefined;
            b = m.fromJson(b.toJson());
            var f = d._map.timeExtent.endTime;
            if (!f) return b;
            var g = k.difference(new Date(c[d._startTimeField]), f, this.timeUnits);
            h.some(this.infos, function(a) {
                if (g >= a.minAge && g <= a.maxAge) {
                    var c = a.color,
                        d = a.size;
                    a = a.alpha;
                    c && b.setColor(c);
                    e(d) && this._setSymbolSize(b, d);
                    e(a) && b.color && (b.color.a = a);
                    return !0
                }
            }, this);
            return b
        }
    });
    c.mixin(a, {
        UNIT_DAYS: "day",
        UNIT_HOURS: "hour",
        UNIT_MILLISECONDS: "millisecond",
        UNIT_MINUTES: "minute",
        UNIT_MONTHS: "month",
        UNIT_SECONDS: "second",
        UNIT_WEEKS: "week",
        UNIT_YEARS: "year"
    });
    return a
});