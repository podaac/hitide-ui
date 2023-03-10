//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/array", "dojo/_base/Color", "dojo/_base/lang", "../request", "../graphic", "./Field", "./FeatureLayer", "./StreamMode", "../geometry/jsonUtils", "../symbols/SimpleFillSymbol", "../symbols/SimpleLineSymbol", "../symbols/SimpleMarkerSymbol", "../renderers/SimpleRenderer", "./PurgeOptions"], function(u, v, l, g, n, w, x, y, m, z, p, q, e, r, A, s) {
    function t(a) {
        var b, c = null;
        a = a || {};
        if (void 0 !== a.geometry)
            if (c = c || {}, null === a.geometry) c.geometry = null;
            else {
                if ("string" === typeof a.geometry && -1 <
                    a.geometry.indexOf("minX")) c.geometry = a.geometry;
                else {
                    b = a.geometry.declaredClass ? a.geometry : p.fromJson(a.geometry);
                    b = b.getExtent();
                    if (!b || 0 === b.getHeight() && 0 === b.getWidth()) throw "Invalid filter geometry: Extent cannot have a height and width of 0";
                    c.geometry = b.toJson()
                }
                c.spatialRel = "esriSpatialRelIntersects";
                c.geometryType = "esriGeometryEnvelope"
            }
        void 0 !== a.where && (c = c || {}, c.where = a.where);
        void 0 !== a.outFields && (c = c || {}, c.outFields = "string" === typeof a.outFields ? "*" === a.outFields ? null : a.outFields.replace(/,\s+/g,
            ",") : null === a.outFields ? null : a.outFields.join(",").replace(/,\s+/g, ","));
        return c
    }
    return u([m], {
        constructor: function(a, b) {
            b = b || {};
            if (!b.mode || b.mode === m.MODE_STREAM) this._isStream = !0, this.mode = m.MODE_STREAM, this._mode = new z(this);
            this.purgeOptions = new s(this, b.purgeOptions || {});
            this._reconnectAttempts = 0;
            this.maxReconnectAttempts = 3;
            this.socket = null;
            this._attemptReconnect = n.hitch(this, this._attemptReconnect)
        },
        _initLayer: function(a, b) {
            this.inherited(arguments);
            if (a) {
                if (a.layerDefinition) this.purgeOptions =
                    new s(this, this._params.purgeOptions || {}), this.socketUrl = this._params.socketUrl || a.layerDefinition.socketUrl || void 0;
                else {
                    if (this._params.socketUrl) this.socketUrl = this._params.socketUrl;
                    else {
                        var c = this._getWebsocketConnectionInfo(a),
                            d = c.urls;
                        d && d.length ? (this._socketUrls = d, this.socketUrl = d[0], this.socketDirection = "broadcast" === this._params.socketDirection ? "broadcast" : "subscribe", this.socketUrl += "/" + this.socketDirection, this._websocketToken = c.token, d.length > this.maxReconnectAttempts && (this.maxReconnectAttempts =
                            d.length)) : this.socketUrl = void 0
                    } if (this._params.filter) {
                        var k;
                        try {
                            this._filter = k = t(this._params.filter)
                        } catch (f) {
                            this.emit("error", {
                                error: "Error trying to create filter object: " + f + ". Layer will not have filter applied"
                            }), this._filter = null
                        }
                    }
                }
                this.maximumTrackPoints = this._params.maximumTrackPoints && 0 < this._params.maximumTrackPoints ? this._params.maximumTrackPoints : 0;
                this.objectIdField || this._makeObjectIdField();
                this._map && (this.socketUrl && !this._connected) && this.connect()
            }
        },
        _setMap: function(a) {
            this.socketUrl &&
                !this._connected && this.connect();
            return this.inherited(arguments)
        },
        _unsetMap: function(a, b) {
            l.forEach(this._connects, v.disconnect);
            this._connected && this.disconnect();
            this._map = null
        },
        add: function(a) {
            this.inherited(arguments);
            this.refresh()
        },
        remove: function(a) {
            this.inherited(arguments)
        },
        refresh: function() {
            this._purge()
        },
        setDefinitionExpression: function(a) {
            this.setFilter({
                where: a
            })
        },
        getDefinitionExpression: function() {
            var a;
            this._filter && (a = this._filter.where);
            return a
        },
        destroy: function() {
            this.disconnect();
            this.inherited(arguments)
        },
        connect: function(a) {
            var b = this,
                c = [],
                d = this._filter,
                k, f, e = this.socketUrl,
                h;
            try {
                if (!this._connected) {
                    this._websocketToken && c.push("token\x3d" + this._websocketToken);
                    this._map && this._map.spatialReference && this.spatialReference && this._map.spatialReference.wkid !== this.spatialReference.wkid && c.push("outSR\x3d" + this._map.spatialReference.wkid);
                    if (d)
                        for (f in d) null !== d[f] && (k = "geometry" === f ? JSON.stringify(d[f]) : d[f], c.push(f + "\x3d" + k));
                    0 < c.length && (e += "?" + c.join("\x26"));
                    h = new WebSocket(e);
                    h.onopen = function() {
                        b.socket = h;
                        b._connected = !0;
                        b._reconnecting = !1;
                        b._reconnectAttempts = 0;
                        b._bind();
                        b.onConnect();
                        a && a(null, !0)
                    };
                    h.onclose = function(a) {
                        console.log("Socket closed: ", a);
                        if (b._connected) b.onDisconnect();
                        (b._connected || b._reconnecting || !b.socket) && b._attemptReconnect()
                    };
                    h.onerror = function(a) {
                        console.log("Socket error: ", a);
                        b.emit("error", {
                            error: a
                        })
                    }
                }
            } catch (g) {
                console.log("Error connecting to data stream: ", g), a && a(g, !1)
            }
        },
        disconnect: function(a) {
            this._reconnecting = this._connected = !1;
            this.socket.close();
            this.onDisconnect();
            a && a(null, !0)
        },
        setFilter: function(a) {
            var b;
            if (this._collection) return this.emit("error", {
                error: "Filter can only be set when the source of the layer is a Stream Service"
            }), !1;
            try {
                b = t(a)
            } catch (c) {
                return this.emit("error", {
                    error: c
                }), !1
            }
            this.socket.send(JSON.stringify({
                filter: b
            }));
            return !0
        },
        getFilter: function() {
            return this._filter
        },
        onUpdate: function() {},
        onMessage: function() {},
        onRemove: function() {},
        onConnect: function() {},
        onDisconnect: function() {},
        onFilterChange: function() {},
        onAttemptReconnect: function() {},
        _purge: function() {
            if (this.purgeOptions.displayCount && this.graphics.length > this.purgeOptions.displayCount)
                for (var a = 0; a < this.graphics.length - this.purgeOptions.displayCount; a++) {
                    var b = this.graphics[0];
                    this.remove(b);
                    this.onRemove({
                        graphic: b
                    })
                }
        },
        _bind: function() {
            var a = this;
            this.socket.onmessage = function(b) {
                a._onMessage(JSON.parse(b.data))
            }
        },
        _onMessage: function(a) {
            var b = this;
            this.onMessage(a);
            var c = {
                create: function(a) {
                    b._create(a)
                },
                update: function(a) {
                    b._update(a)
                },
                "delete": function(a) {
                    b._delete(a)
                }
            };
            if (a.type) c[a.type](a.feature);
            else a.hasOwnProperty("filter") ? b._handleFilterMessage(a) : this._create(a)
        },
        _create: function(a) {
            function b(a) {
                var b = new x(a);
                c._featureHasOID(a, d) || (a.attributes = a.attributes || {}, a.attributes[d] = c._nextId++);
                c._mode.drawFeature(b)
            }
            var c = this,
                d = c.objectIdField;
            a.length ? a.forEach(function(a) {
                a && a.geometry && b(a)
            }) : a && a.geometry && b(a)
        },
        _delete: function(a) {
            var b = this,
                c = a[b.objectIdField] || a.attributes[b.objectIdField],
                d = !1;
            this.graphics.forEach(function(a) {
                a.attributes[b.objectIdField] ==
                    c && (d = a)
            });
            d && this.remove(d)
        },
        _update: function(a) {
            var b = this,
                c = !1;
            this.graphics.forEach(function(d) {
                d.attributes[b.objectIdField] == a.attributes[b.objectIdField] && (c = d)
            });
            c && (a.attributes && c.setAttributes(a.attributes), a.geometry && c.setGeometry(p.fromJson(a.geometry)), b.onUpdate({
                graphic: c
            }))
        },
        _handleFilterMessage: function(a) {
            a.error ? this.emit("error", {
                error: "Could not set filter on stream service: " + a.error.toString()
            }) : (this._filter = a.filter, this.onFilterChange(a.filter))
        },
        _getWebsocketConnectionInfo: function(a) {
            var b = {
                    urls: []
                },
                c, d, e;
            a.webSocketUrls ? c = a.webSocketUrls : a.streamUrls && l.forEach(a.streamUrls, function(a) {
                "ws" === a.transport && (c = a.urls, b.token = a.token)
            });
            c = c || [];
            if (1 < c.length)
                for (a = 0; a < c.length - 1; a++) d = a + Math.floor(Math.random() * (c.length - a)), e = c[d], c[d] = c[a], c[a] = e;
            b.urls = c;
            return b
        },
        _attemptReconnect: function() {
            var a = this;
            a._connected = !1;
            if (!a._socketUrls) return !1;
            if (!a._collection && !a._reconnecting && a.socket && a.credential) return console.log("Getting new token"), a._reconnecting = !0, a._getServiceConnectionMetadata(a._attemptReconnect), !1;
            a._reconnecting = !0;
            a.socket = null;
            this._reconnectAttempts += 1;
            if (this._reconnectAttempts > this.maxReconnectAttempts) return this._reconnecting = !1, this.emit("error", {
                error: "Socket reconnection failed. Maximum reconnect attempts exceeded"
            }), !1;
            this.socketUrl = this._socketUrls[this._reconnectAttempts > this._socketUrls.length - 1 ? this._reconnectAttempts % this._socketUrls.length : this._reconnectAttempts];
            this.socketUrl += "/" + this.socketDirection;
            console.log("socketUrl: ", this.socketUrl);
            setTimeout(function() {
                a.onAttemptReconnect({
                    count: this._reconnectAttempts,
                    url: this.socketUrl
                });
                a.connect()
            }, 1E3)
        },
        _getServiceConnectionMetadata: function(a) {
            var b = this,
                c = b._url.path;
            a = "function" === typeof a ? a : null;
            w({
                url: c,
                content: n.mixin({
                    f: "json"
                }, this._url.query),
                callbackParamName: "callback"
            }).then(function(c) {
                c = b._getWebsocketConnectionInfo(c);
                b._websocketToken = c.token;
                a && a()
            }, function(a) {
                b.emit("error", a)
            })
        },
        _setDefaultRenderer: function() {
            var a = this.geometryType,
                b = new g([5, 112, 176, 0.8]),
                c = new g([255, 255, 255]),
                c = new e(e.STYLE_SOLID, c, 1),
                d;
            if ("esriGeometryPoint" === a ||
                "esriGeometryMultipoint" === a) d = new r(r.STYLE_CIRCLE, 10, c, b);
            else if ("esriGeometryPolyline" === a) d = new e(e.STYLE_SOLID, b, 2);
            else if ("esriGeometryPolygon" === a || "esriGeometryEnvelope" === a) b = new g([5, 112, 176, 0.2]), c = new g([5, 112, 176, 0.8]), c = new e(e.STYLE_SOLID, c, 1), d = new q(q.STYLE_SOLID, c, b);
            d && this.setRenderer(new A(d))
        },
        _makeObjectIdField: function() {
            var a = 1,
                b, c, d = [];
            if (!this.objectIdField) {
                b = this.fields.length;
                for (c = 0; c < b; c++) d.push(this.fields[c].name.toLowerCase());
                for (; - 1 !== l.indexOf(d, "objectid_" +
                    a);) a += 1;
                this.objectIdField = "objectid_" + a;
                this.fields.push(new y({
                    name: "objectid_" + a,
                    alias: "objectid_" + a,
                    type: "esriFieldTypeOID"
                }))
            }
        },
        _featureHasOID: function(a, b) {
            return a.attributes && (a.attributes[b] || 0 === a.attributes[b])
        }
    })
});