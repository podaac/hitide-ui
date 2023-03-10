//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel", "../geometry/Polygon", "../geometry/jsonUtils"], function(g, n, h, c, p, q, k, l) {
    return g(null, {
        declaredClass: "esri.tasks.BufferParameters",
        geometries: null,
        outSpatialReference: null,
        bufferSpatialReference: null,
        distances: null,
        unit: null,
        unionResults: !1,
        geodesic: !1,
        toJson: function() {
            var a = {
                    unit: this.unit,
                    unionResults: this.unionResults,
                    geodesic: this.geodesic
                },
                f = this.distances,
                b = this.outSpatialReference,
                d = this.bufferSpatialReference,
                m = h.map(this.geometries, function(a) {
                    a = "extent" === a.type ? this._extentToPolygon(a) : a;
                    return a.toJson()
                }, this),
                e = this.geometries;
            if (e && 0 < e.length) {
                var g = "extent" === e[0].type ? "esriGeometryPolygon" : l.getJsonType(e[0]);
                a.geometries = c.toJson({
                    geometryType: g,
                    geometries: m
                });
                a.inSR = e[0].spatialReference.wkid ? e[0].spatialReference.wkid : c.toJson(e[0].spatialReference.toJson())
            }
            f && (a.distances = f.join(","));
            b && (a.outSR = b.wkid ? b.wkid : c.toJson(b.toJson()));
            d && (a.bufferSR = d.wkid ? d.wkid : c.toJson(d.toJson()));
            return a
        },
        _extentToPolygon: function(a) {
            var f = a.xmin,
                b = a.ymin,
                d = a.xmax,
                c = a.ymax;
            return new k({
                rings: [
                    [
                        [f, b],
                        [f, c],
                        [d, c],
                        [d, b],
                        [f, b]
                    ]
                ],
                spatialReference: a.spatialReference.toJson()
            })
        }
    })
});