//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../SpatialReference", "./Geometry"], function(d, f, s, t, l, q, r) {
    function g(a, b) {
        89.99999 < b ? b = 89.99999 : -89.99999 > b && (b = -89.99999);
        var c = b * m;
        return [a * m * e, e / 2 * Math.log((1 + Math.sin(c)) / (1 - Math.sin(c)))]
    }

    function h(a, b, c) {
        a = a / e * k;
        if (c) return b = n / 2 - 2 * Math.atan(Math.exp(-1 * b / e)), [a, b * k];
        c = a - 360 * Math.floor((a + 180) / 360);
        b = n / 2 - 2 * Math.atan(Math.exp(-1 * b / e));
        return [c, b * k]
    }
    var e = 6378137,
        n = 3.141592653589793,
        k = 57.29577951308232,
        m = 0.017453292519943,
        p = {
            type: "point",
            x: 0,
            y: 0
        };
    d = d(r, {
        declaredClass: "esri.geometry.Point",
        constructor: function(a, b, c) {
            f.mixin(this, p);
            f.isArray(a) ? (this.x = a[0], this.y = a[1], this.spatialReference = b) : f.isObject(a) ? (f.mixin(this, a), l.isDefined(this.latitude) && (this.y = this.latitude), l.isDefined(this.longitude) && (this.x = this.longitude), this.spatialReference && (this.spatialReference = new q(this.spatialReference))) : (this.x = a, this.y = b, this.spatialReference = c);
            this.verifySR()
        },
        offset: function(a, b) {
            return new this.constructor(this.x +
                a, this.y + b, this.spatialReference)
        },
        setX: function(a) {
            this.x = a;
            return this
        },
        setY: function(a) {
            this.y = a;
            return this
        },
        setLongitude: function(a) {
            var b = this.spatialReference;
            b && (b._isWebMercator() ? this.x = g(a, this.y)[0] : 4326 === b.wkid && (this.x = a));
            return this
        },
        setLatitude: function(a) {
            var b = this.spatialReference;
            b && (b._isWebMercator() ? this.y = g(this.x, a)[1] : 4326 === b.wkid && (this.y = a));
            return this
        },
        getLongitude: function() {
            var a = this.spatialReference,
                b;
            a && (a._isWebMercator() ? b = h(this.x, this.y)[0] : 4326 === a.wkid &&
                (b = this.x));
            return b
        },
        getLatitude: function() {
            var a = this.spatialReference,
                b;
            a && (a._isWebMercator() ? b = h(this.x, this.y)[1] : 4326 === a.wkid && (b = this.y));
            return b
        },
        update: function(a, b) {
            this.x = a;
            this.y = b;
            return this
        },
        normalize: function() {
            var a = this.x,
                b = this.spatialReference;
            if (b) {
                var c = b._getInfo();
                if (c) {
                    var d = c.valid[0],
                        e = c.valid[1],
                        c = 2 * e;
                    a > e ? (d = Math.ceil(Math.abs(a - e) / c), a -= d * c) : a < d && (d = Math.ceil(Math.abs(a - d) / c), a += d * c)
                }
            }
            return new this.constructor(a, this.y, b)
        },
        toJson: function() {
            var a = {
                    x: this.x,
                    y: this.y
                },
                b = this.spatialReference;
            b && (a.spatialReference = b.toJson());
            return a
        }
    });
    d.lngLatToXY = g;
    d.xyToLngLat = h;
    d.defaultProps = p;
    return d
});