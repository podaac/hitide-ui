//>>built
define(["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "dojo/io-query", "../kernel", "../urlUtils", "../SpatialReference", "./TiledMapServiceLayer", "./ArcGISMapServiceLayer", "./TileInfo", "./TimeInfo", "./TileMap"
], function(m, n, e, h, p, w, f, x, k, q, r, s, t, u, v) {
        return n([r, s], {
                declaredClass: "esri.layers.ArcGISTiledMapServiceLayer",
                _agolAttrs: "canvas/world_light_gray_base",

            constructor: function(a, b) {
                b && (b.roundrobin && (m.deprecated(this.declaredClass + " : Constructor option 'roundrobin' deprecated. Use option 'tileServers'."), b.tileServers = b.roundrobin), this._setTileServers(b.tileServers), this._loadCallback = b.loadCallback);
                this._params = e.mixin({}, this._url.query);
                var c = h.some(["servicesdev.arcgisonline.com/arcgis/rest/services", "services.arcgisonline.com/arcgis/rest/services", "servicesqa.arcgisonline.com/arcgis/rest/services"], function(b) {
                    return -1 < a.toLowerCase().indexOf(b.toLowerCase())
                });
                if ((this.resampling = b && b.resampling || (!b || !1 !== b.resampling) && c) && c) this.tileMap = new v(this);
                this._initLayer = e.hitch(this, this._initLayer);
                (c = b && b.resourceInfo) ? this._initLayer(c) : (this._load = e.hitch(this, this._load), this._load())
            }, _TILE_FORMATS: {
                PNG: "png",
                PNG8: "png",
                PNG24: "png",
                PNG32: "png",
                JPG: "jpg",
                JPEG: "jpg",
                GIF: "gif"
            }, _setTileServers: function(a) {
                if (a && 0 < a.length) {
                    this.tileServers = a;
                    var b, c = a.length;
                    for (b = 0; b < c; b++) a[b] = k.urlToObject(a[b]).path
                }
            }, _initLayer: function(a, b) {
                this.inherited(arguments);
                this.resourceInfo = p.toJson(a);
                this.tileInfo = new t(a.tileInfo);
                !this.spatialReference && this.tileInfo.spatialReference && (this.spatialReference = new q(this.tileInfo.spatialReference.toJson()));
                this.isPNG32 = "PNG24" === this.tileInfo.format || "PNG32" === this.tileInfo.format;
                a.timeInfo && (this.timeInfo = new u(a.timeInfo));
                var c = this._url.path,
                    l = this._loadCallback,
                    g = "file:" === window.location.protocol ? "http:" : window.location.protocol,
                    d = c.match(/^https?\:\/\/(server|services)\.arcgisonline\.com\/arcgis\/rest\/services\/([^\/]+(\/[^\/]+)*)\/mapserver/i),
                    d = d && d[2];
                if (!this.tileServers)
                    if (a.tileServers) this._setTileServers(a.tileServers);
                    else {
                        var e = -1 !== c.search(/^https?\:\/\/server\.arcgisonline\.com/i),
                            f = -1 !== c.search(/^https?\:\/\/services\.arcgisonline\.com/i);
                        if (e || f) this._setTileServers([c, c.replace(e ? /server\.arcgisonline/i : /services\.arcgisonline/i, e ? "services.arcgisonline" : "server.arcgisonline")])
                    }
                d && -1 !== h.indexOf(this._agolAttrs, d.toLowerCase()) && (this.hasAttributionData = !0, this.attributionDataUrl = this.attributionDataUrl || g + "//static.arcgis.com/attribution/" +
                    d);
                this.loaded = !0;
                this.onLoad(this);
                l && (delete this._loadCallback, l(this))
            }, getTileUrl: function(a, b, c) {
                var e = this.tileServers,
                    g = this._getToken(),
                    d = this._url.query;
                a = (e ? e[b % e.length] : this._url.path) + "/tile/" + a + "/" + b + "/" + c;
                this.resampling && !this.tileMap && (a += "?blankTile\x3dfalse");
                d && (a = this.resampling && !this.tileMap ? a + ("\x26" + f.objectToQuery(d)) : a + ("?" + f.objectToQuery(d)));
                if (g && (!d || !d.token)) a += (-1 === a.indexOf("?") ? "?" : "\x26") + "token\x3d" + g;
                a = this.addTimestampToURL(a);

                return k.addProxy(a)
            }
        });
});