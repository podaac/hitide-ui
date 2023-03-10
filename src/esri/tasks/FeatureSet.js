//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../lang", "../graphic", "../SpatialReference", "../graphicsUtils", "../geometry/jsonUtils", "../symbols/jsonUtils"], function(g, h, k, r, s, l, m, n, p, c, q) {
    return g(null, {
        declaredClass: "esri.tasks.FeatureSet",
        constructor: function(a) {
            if (a) {
                h.mixin(this, a);
                var b = this.features,
                    d = a.spatialReference,
                    f = c.getGeometryType(a.geometryType),
                    d = this.spatialReference = new n(d);
                this.geometryType = a.geometryType;
                a.fields && (this.fields = a.fields);
                k.forEach(b,
                    function(a, e) {
                        var c = a.geometry && a.geometry.spatialReference;
                        b[e] = new m(f && a.geometry ? new f(a.geometry) : null, a.symbol && q.fromJson(a.symbol), a.attributes);
                        b[e].geometry && !c && b[e].geometry.setSpatialReference(d)
                    })
            } else this.features = []
        },
        displayFieldName: null,
        geometryType: null,
        spatialReference: null,
        fieldAliases: null,
        toJson: function(a) {
            var b = {};
            this.displayFieldName && (b.displayFieldName = this.displayFieldName);
            this.fields && (b.fields = this.fields);
            this.spatialReference ? b.spatialReference = this.spatialReference.toJson() :
                this.features[0] && this.features[0].geometry && (b.spatialReference = this.features[0].geometry.spatialReference.toJson());
            this.features[0] && (this.features[0].geometry && (b.geometryType = c.getJsonType(this.features[0].geometry)), b.features = p._encodeGraphics(this.features, a));
            b.exceededTransferLimit = this.exceededTransferLimit;
            return l.fixJson(b)
        }
    })
});