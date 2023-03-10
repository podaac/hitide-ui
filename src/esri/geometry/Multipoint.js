//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../SpatialReference", "./Geometry", "./Point", "./Extent"], function(b, c, s, t, q, r, e, m) {
    var f = {
        type: "multipoint",
        points: null
    };
    b = b(r, {
        declaredClass: "esri.geometry.Multipoint",
        constructor: function(a) {
            c.mixin(this, f);
            this.points = [];
            a && (a.points ? c.mixin(this, a) : this.spatialReference = a, this.spatialReference && (this.spatialReference = new q(this.spatialReference)));
            this.verifySR()
        },
        _extent: null,
        addPoint: function(a) {
            this._extent = null;
            c.isArray(a) ?
                this.points.push(a) : this.points.push([a.x, a.y]);
            return this
        },
        removePoint: function(a) {
            if (this._validateInputs(a)) return this._extent = null, new e(this.points.splice(a, 1)[0], this.spatialReference)
        },
        getExtent: function() {
            if (this._extent) return new m(this._extent);
            var a = this.points,
                n = a.length;
            if (n) {
                var d = a[0],
                    b, c, h = b = d[0],
                    k = c = d[1],
                    e = Math.min,
                    f = Math.max,
                    p = this.spatialReference,
                    l, g;
                for (g = 0; g < n; g++) d = a[g], l = d[0], d = d[1], h = e(h, l), k = e(k, d), b = f(b, l), c = f(c, d);
                this._extent = {
                    xmin: h,
                    ymin: k,
                    xmax: b,
                    ymax: c,
                    spatialReference: p ?
                        p.toJson() : null
                };
                return new m(this._extent)
            }
        },
        _validateInputs: function(a) {
            return null === a || 0 > a || a >= this.points.length ? !1 : !0
        },
        getPoint: function(a) {
            if (this._validateInputs(a)) return a = this.points[a], new e(a[0], a[1], this.spatialReference)
        },
        setPoint: function(a, b) {
            if (this._validateInputs(a)) return this._extent = null, this.points[a] = [b.x, b.y], this
        },
        toJson: function() {
            var a = {
                    points: c.clone(this.points)
                },
                b = this.spatialReference;
            b && (a.spatialReference = b.toJson());
            return a
        }
    });
    b.defaultProps = f;
    return b
});