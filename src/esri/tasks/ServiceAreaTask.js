//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../request", "../geometry/normalizeUtils", "./Task", "./ServiceAreaSolveResult"], function(b, h, p, q, k, l, m, n) {
    b = b(m, {
        declaredClass: "esri.tasks.ServiceAreaTask",
        _eventMap: {
            "solve-complete": ["result"]
        },
        constructor: function(a) {
            this._url.path += "/solveServiceArea";
            this._handler = h.hitch(this, this._handler);
            this.registerConnectEvents()
        },
        __msigns: [{
            n: "solve",
            c: 3,
            a: [{
                i: 0,
                p: ["facilities.features", "pointBarriers.features", "polylineBarriers.features",
                    "polygonBarriers.features"
                ]
            }],
            e: 2
        }],
        _handler: function(a, b, e, d, c) {
            try {
                var f = new n(a);
                this._successHandler([f], "onSolveComplete", e, c)
            } catch (g) {
                this._errorHandler(g, d, c)
            }
        },
        solve: function(a, b, e, d) {
            var c = d.assembly;
            a = this._encode(h.mixin({}, this._url.query, {
                f: "json"
            }, a.toJson(c && c[0])));
            var f = this._handler,
                g = this._errorHandler;
            return k({
                url: this._url.path,
                content: a,
                callbackParamName: "callback",
                load: function(a, c) {
                    f(a, c, b, e, d.dfd)
                },
                error: function(a) {
                    g(a, e, d.dfd)
                }
            })
        },
        onSolveComplete: function() {}
    });
    l._createWrappers(b);
    return b
});