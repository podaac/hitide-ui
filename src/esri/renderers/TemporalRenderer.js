//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "./Renderer"], function(f, h, k, l, g) {
    return f(g, {
        declaredClass: "esri.renderer.TemporalRenderer",
        constructor: function(a, d, c, b) {
            this.observationRenderer = a;
            this.latestObservationRenderer = d;
            this.trackRenderer = c;
            this.observationAger = b
        },
        getSymbol: function(a) {
            var d = a.getLayer(),
                c = this.getObservationRenderer(a),
                b = c && c.getSymbol(a),
                e = this.observationAger;
            d.timeInfo && (d._map.timeExtent && c === this.observationRenderer && e && b) && (b = e.getAgedSymbol(b,
                a));
            return b
        },
        getObservationRenderer: function(a) {
            return 0 === a.getLayer()._getKind(a) ? this.observationRenderer : this.latestObservationRenderer || this.observationRenderer
        }
    })
});