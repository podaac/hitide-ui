//>>built
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../SpatialReference", "./Geometry", "./Point", "./Extent"], function(f, h, d, C, D, z, A, B, g, v) {
    var y = {
        type: "polyline",
        paths: null
    };
    f = f(B, {
        declaredClass: "esri.geometry.Polyline",
        constructor: function(a) {
            d.mixin(this, y);
            this.paths = [];
            this._path = 0;
            a && (d.isArray(a) ? this.paths = d.isArray(a[0][0]) ? a : [a] : a.paths ? d.mixin(this, a) : this.spatialReference = a, this.spatialReference && (this.spatialReference = new A(this.spatialReference)));
            this.verifySR()
        },
        _extent: null,
        addPath: function(a) {
            this._extent = null;
            this._path = this.paths.length;
            this.paths[this._path] = [];
            d.isArray(a[0]) ? h.forEach(a, this._addPointArr, this) : h.forEach(a, this._addPoint, this);
            return this
        },
        _addPointArr: function(a) {
            this.paths[this._path].push(a)
        },
        _addPoint: function(a) {
            this.paths[this._path].push([a.x, a.y])
        },
        _insertPoints: function(a, b) {
            this._extent = null;
            this._path = b;
            this.paths[this._path] || (this.paths[this._path] = []);
            h.forEach(a, this._addPoint, this)
        },
        _validateInputs: function(a,
            b) {
            return null !== a && void 0 !== a && (0 > a || a >= this.paths.length) || null !== b && void 0 !== a && (0 > b || b >= this.paths[a].length) ? !1 : !0
        },
        getPoint: function(a, b) {
            if (this._validateInputs(a, b)) return new g(this.paths[a][b], this.spatialReference)
        },
        setPoint: function(a, b, c) {
            if (this._validateInputs(a, b)) return this._extent = null, this.paths[a][b] = [c.x, c.y], this
        },
        insertPoint: function(a, b, c) {
            if (this._validateInputs(a) && z.isDefined(b) && 0 <= b && b <= this.paths[a].length) return this._extent = null, this.paths[a].splice(b, 0, [c.x, c.y]),
                this
        },
        removePath: function(a) {
            if (this._validateInputs(a, null)) {
                this._extent = null;
                a = this.paths.splice(a, 1)[0];
                var b, c = a.length,
                    e = this.spatialReference;
                for (b = 0; b < c; b++) a[b] = new g(a[b], e);
                return a
            }
        },
        removePoint: function(a, b) {
            if (this._validateInputs(a, b)) return this._extent = null, new g(this.paths[a].splice(b, 1)[0], this.spatialReference)
        },
        getExtent: function() {
            var a;
            if (this._extent) return a = new v(this._extent), a._partwise = this._partwise, a;
            a = this.paths;
            var b = a.length;
            if (b && a[0].length) {
                var c, e, d, f, k, l, m, h,
                    g = f = a[0][0][0],
                    w = k = a[0][0][1],
                    n = Math.min,
                    p = Math.max,
                    q = this.spatialReference,
                    x = [],
                    r, s, t, u;
                for (l = 0; l < b; l++) {
                    c = a[l];
                    r = s = c[0] && c[0][0];
                    t = u = c[0] && c[0][1];
                    h = c.length;
                    for (m = 0; m < h; m++) e = c[m], d = e[0], e = e[1], g = n(g, d), w = n(w, e), f = p(f, d), k = p(k, e), r = n(r, d), t = n(t, e), s = p(s, d), u = p(u, e);
                    x.push(new v({
                        xmin: r,
                        ymin: t,
                        xmax: s,
                        ymax: u,
                        spatialReference: q ? q.toJson() : null
                    }))
                }
                this._extent = {
                    xmin: g,
                    ymin: w,
                    xmax: f,
                    ymax: k,
                    spatialReference: q ? q.toJson() : null
                };
                this._partwise = 1 < x.length ? x : null;
                a = new v(this._extent);
                a._partwise = this._partwise;
                return a
            }
        },
        toJson: function() {
            var a = {
                    paths: d.clone(this.paths)
                },
                b = this.spatialReference;
            b && (a.spatialReference = b.toJson());
            return a
        }
    });
    f.defaultProps = y;
    return f
});