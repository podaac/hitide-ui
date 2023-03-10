//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "./kernel"], function(l, g, k, m, n) {
    return {
        _serializeLayerDefinitions: function(a) {
            var b = [],
                c = !1,
                e = /[:;]/;
            if (a && (g.forEach(a, function(a, d) {
                a && (b.push([d, a]), !c && e.test(a) && (c = !0))
            }), 0 < b.length)) {
                var d;
                c ? (d = {}, g.forEach(b, function(a) {
                    d[a[0]] = a[1]
                }), d = k.toJson(d)) : (d = [], g.forEach(b, function(a) {
                    d.push(a[0] + ":" + a[1])
                }), d = d.join(";"));
                return d
            }
            return null
        },
        _serializeTimeOptions: function(a, b) {
            if (a) {
                var c = [];
                g.forEach(a, function(a, d) {
                    if (a) {
                        var f =
                            a.toJson();
                        b && -1 !== g.indexOf(b, d) && (f.useTime = !1);
                        c.push('"' + d + '":' + k.toJson(f))
                    }
                });
                if (c.length) return "{" + c.join(",") + "}"
            }
        },
        _getVisibleLayers: function(a, b) {
            var c = [],
                e, d, f;
            if (!a) return c;
            if (b) {
                c = b.concat();
                for (f = 0; f < a.length; f++) e = a[f], d = g.indexOf(a, e.id), e.subLayerIds && -1 < d && (c.splice(d, 1), c = c.concat(e.subLayerIds))
            } else c = this._getDefaultVisibleLayers(a);
            return c
        },
        _getDefaultVisibleLayers: function(a) {
            var b = [],
                c;
            if (!a) return b;
            for (c = 0; c < a.length; c++) 0 <= a[c].parentLayerId && -1 === g.indexOf(b, a[c].parentLayerId) &&
                g.some(a, function(b) {
                    return b.id === a[c].parentLayerId
                }) || a[c].defaultVisibility && b.push(a[c].id);
            return b
        },
        _getLayersForScale: function(a, b) {
            var c = [];
            if (0 < a && b) {
                var e;
                for (e = 0; e < b.length; e++)
                    if (!(0 <= b[e].parentLayerId && -1 === g.indexOf(c, b[e].parentLayerId) && g.some(b, function(a) {
                        return a.id === b[e].parentLayerId
                    })) && 0 <= b[e].id) {
                        var d = !0,
                            f = b[e].maxScale,
                            h = b[e].minScale;
                        if (0 < f || 0 < h) 0 < f && 0 < h ? d = f <= a && a <= h : 0 < f ? d = f <= a : 0 < h && (d = a <= h);
                        d && c.push(b[e].id)
                    }
            }
            return c
        }
    }
});