//>>built
define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../SpatialReference", "./Point"], function(h, n, p, q, l, c) {
    function e(a, d, f, g) {
        if ("point" === a.type) {
            var b = d(a.x, a.y, g);
            return new a.constructor(b[0], b[1], new l(f))
        }
        if ("extent" === a.type) {
            var b = d(a.xmin, a.ymin, g),
                c = d(a.xmax, a.ymax, g);
            return new a.constructor(b[0], b[1], c[0], c[1], new l(f))
        }
        if ("polyline" === a.type || "polygon" === a.type) {
            var b = "polyline" === a.type,
                k = [],
                e;
            h.forEach(b ? a.paths : a.rings, function(a) {
                k.push(e = []);
                h.forEach(a, function(a) {
                    e.push(d(a[0],
                        a[1], g))
                })
            });
            return b ? new a.constructor({
                paths: k,
                spatialReference: f
            }) : new a.constructor({
                rings: k,
                spatialReference: f
            })
        }
        if ("multipoint" === a.type) {
            var m = [];
            h.forEach(a.points, function(a) {
                m.push(d(a[0], a[1], g))
            });
            return new a.constructor({
                points: m,
                spatialReference: f
            })
        }
    }
    return {
        lngLatToXY: c.lngLatToXY,
        xyToLngLat: c.xyToLngLat,
        geographicToWebMercator: function(a) {
            return e(a, c.lngLatToXY, {
                wkid: 102100
            })
        },
        webMercatorToGeographic: function(a, d) {
            return e(a, c.xyToLngLat, {
                wkid: 4326
            }, d)
        }
    }
});