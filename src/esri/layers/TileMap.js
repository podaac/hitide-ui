//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/Deferred", "dojo/io-query", "../request", "../urlUtils"], function(l, k, m, n, p, q, r) {
    return l(null, {
        declaredClass: "esri.layers.TileMap",
        constructor: function(a) {
            this.layer = a;
            this._tileMaps = {}
        },
        getTile: function(a, b, c, d, e) {
            a = {
                id: d,
                level: a,
                row: b,
                col: c
            };
            b = this._getResamplingBudget();
            0 < b ? this._process({
                tile: a,
                requestedTile: a,
                callback: e,
                resamplingBudget: b
            }) : (e || this.callback).call(this, a, a)
        },
        statusOf: function(a, b, c) {
            var d = this._getResamplingBudget();
            a = {
                level: a,
                row: b,
                col: c
            };
            if (0 === d) return 1;
            for (; 0 <= d;) {
                b = this._tileToTileMap(a);
                if (!this._tileMaps[b.uid]) return -1;
                b = this._tileMaps[b.uid];
                if (!b.promise.isFulfilled()) return -1;
                if (this._isTileAvailable(a, b)) return 1;
                a = this._parentTile(a);
                if (!a) break;
                d--
            }
            return 0
        },
        style: function(a, b) {
            if (!(a.level === b.level && a.row === b.row && a.col === b.col)) {
                for (var c = this.layer.tileInfo, d = c.lods, e = c.cols, c = c.rows, f, g, h = d.length - 1; !f || !g;)!f && d[h].level === a.level && (f = d[h]), !g && d[h].level === b.level && (g = d[h]), h--;
                d = Math.round(f.resolution /
                    g.resolution);
                return {
                    width: e * d + "px",
                    height: c * d + "px",
                    margin: "-" + b.row % d * c + "px 0 0 -" + b.col % d * e + "px"
                }
            }
        },
        _process: function(a) {
            var b = a.tile,
                c = this._tileToTileMap(b),
                d = this._parentTile(b);
            this._getTileMap(c).then(k.hitch(this, function(e) {
                c = e;
                this._isTileAvailable(b, c) ? (a.callback || this.callback).call(this, b, a.requestedTile) : 0 < a.resamplingBudget && d ? (a.resamplingBudget--, a.tile = d, this._process(a)) : (a.callback || this.callback).call(this, a.requestedTile, a.requestedTile)
            }), k.hitch(this, function() {
                (a.callback ||
                    this.callback).call(this, a.requestedTile, a.requestedTile)
            }))
        },
        _getTileMap: function(a) {
            var b, c, d, e, f = null;
            this._tileMaps[a.uid] ? (a = this._tileMaps[a.uid], b = a.promise) : (this._tileMaps[a.uid] = a, c = new n, q({
                url: this._getTileMapUrl(a.level, a.row, a.col),
                handleAs: "json",
                callbackParamName: "callback",
                timeout: 3E3,
                load: function(b) {
                    k.mixin(a, b);
                    if (a.data && 0 < a.data.length) {
                        e = a.data.length;
                        if (1 === e) f = a.data[0];
                        else {
                            f = a.data[0];
                            for (d = 1; d < e; d++)
                                if (a.data[d] !== f) {
                                    f = null;
                                    break
                                }
                        }
                        null !== f && (delete a.data, a.value = f)
                    }
                    c.resolve(a)
                },
                error: function(a) {
                    c.reject()
                }
            }), b = a.promise = c.promise);
            return b
        },
        _parentTile: function(a) {
            var b = this.layer.tileInfo.lods,
                c, d, e = null;
            m.some(b, function(b, e) {
                return a.level === b.level ? (c = b, d = e, !0) : !1
            });
            0 < d && (b = b[d - 1], e = {
                id: a.id,
                level: b.level,
                row: Math.floor(a.row * c.resolution / b.resolution + 0.01),
                col: Math.floor(a.col * c.resolution / b.resolution + 0.01)
            });
            return e
        },
        _tileToTileMap: function(a) {
            var b = 8 * Math.floor(a.row / 8),
                c = 8 * Math.floor(a.col / 8);
            return {
                uid: a.level + "_" + b + "_" + c,
                level: a.level,
                row: b,
                col: c
            }
        },
        _isTileAvailable: function(a,
            b) {
            var c, d;
            b.valid ? void 0 !== b.value ? c = b.value : (c = b.location.left, d = b.location.top, c = (a.row - d) * b.location.width + (a.col - c), c = c < b.data.length ? b.data[c] : 0) : c = 0;

            return c
        },
        _getTileMapUrl: function(a, b, c) {
            var d = this.layer,
                e = d.tileServers,
                f = d._getToken(),
                g = d._url.query;
            a = (e ? e[b % e.length] : d._url.path) + "/tilemap/" + a + "/" + b + "/" + c + "/8/8";
            g && (a += "?" + p.objectToQuery(g));
            if (f && (!g || !g.token)) a += (-1 === a.indexOf("?") ? "?" : "\x26") + "token\x3d" + f;
            a = d.addTimestampToURL(a);
            return r.addProxy(a)
        },
        _getResamplingBudget: function() {
            var a =
                this.layer,
                b = 0;
            if (a.resampling && (b = a._resamplingTolerance, null === b || void 0 === b)) b = a.tileInfo.lods.length;
            return b
        }
    })
});