//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "./Renderer"], function(l, n, p, q, m) {
    return l(m, {
        declaredClass: "esri.renderer.ScaleDependentRenderer",
        constructor: function(a) {
            this.setRendererInfos(a && a.rendererInfos || [])
        },
        setRendererInfos: function(a) {
            this.rendererInfos = a;
            this._setRangeType();
            return this
        },
        getSymbol: function(a) {
            var b = this.getRendererInfo(a);
            return b && b.renderer.getSymbol(a)
        },
        getRendererInfo: function(a) {
            a = a.getLayer().getMap();
            return "zoom" === this.rangeType ? this.getRendererInfoByZoom(a.getZoom()) :
                this.getRendererInfoByScale(a.getScale())
        },
        getRendererInfoByZoom: function(a) {
            var b, c = this.rendererInfos,
                e, d = 0;
            do b = c[d], a >= b.minZoom && a <= b.maxZoom && (e = b), d++; while (!e && d < c.length);
            return e
        },
        getRendererInfoByScale: function(a) {
            var b, c = this.rendererInfos,
                e, d = 0,
                f, g, h, k;
            do b = c[d], f = b.minScale, g = b.maxScale, h = !f, k = !g, !h && a <= f && (h = !0), !k && a >= g && (k = !0), h && k && (e = b), d++; while (!e && d < c.length);
            return e
        },
        addRendererInfo: function(a) {
            var b, c = 0,
                e, d = this.rendererInfos,
                f = a.hasOwnProperty("minZoom") ? "minZoom" : "minScale",
                g = d.length;
            do {
                e = d[c];
                if (g === c || a[f] < e[f]) d.splice(c, 0, a), this._setRangeType(), b = !0;
                c++
            } while (!b && c < g);
            return this
        },
        _setRangeType: function() {
            var a = this.rendererInfos;
            if (a = a && a[0]) this.rangeType = a.hasOwnProperty("minZoom") ? "zoom" : a.hasOwnProperty("minScale") ? "scale" : ""
        },
        toJson: function() {}
    })
});