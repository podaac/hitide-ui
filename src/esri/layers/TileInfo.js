//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../lang", "../SpatialReference", "../geometry/Point", "./LOD"], function(e, f, c, l, m, g, d, h, k) {
    return e(null, {
        declaredClass: "esri.layers.TileInfo",
        constructor: function(a) {
            f.mixin(this, a);
            this.width = this.cols;
            this.height = this.rows;
            a = this.spatialReference;
            var b = this.origin;
            a && (a = this.spatialReference = new d(a.toJson ? a.toJson() : a));
            b && (this.origin = new h(b.toJson ? b.toJson() : b), !b.spatialReference && a && this.origin.setSpatialReference(new d(a.toJson())));
            this.lods = c.map(this.lods, function(a) {
                return new k(a)
            })
        },
        toJson: function() {
            return g.fixJson({
                rows: this.rows,
                cols: this.cols,
                dpi: this.dpi,
                format: this.format,
                compressionQuality: this.compressionQuality,
                origin: this.origin && this.origin.toJson(),
                spatialReference: this.spatialReference && this.spatialReference.toJson(),
                lods: this.lods && c.map(this.lods, function(a) {
                    return a.toJson()
                })
            })
        }
    })
});