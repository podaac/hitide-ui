//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/_base/json", "dojo/has", "../kernel", "../request", "../deferredUtils", "./Task", "./AddressCandidate"], function(t, f, u, p, l, x, y, q, v, w, m) {
    return t(w, {
        declaredClass: "esri.tasks.Locator",
        _eventMap: {
            "address-to-locations-complete": ["addresses"],
            "addresses-to-locations-complete": ["addresses"],
            "location-to-address-complete": ["address"],
            "suggest-locations-complete": ["suggestions"]
        },
        constructor: function(a) {
            this._geocodeHandler = f.hitch(this,
                this._geocodeHandler);
            this._geocodeAddressesHandler = f.hitch(this, this._geocodeAddressesHandler);
            this._reverseGeocodeHandler = f.hitch(this, this._reverseGeocodeHandler);
            this.registerConnectEvents()
        },
        outSpatialReference: null,
        setOutSpatialReference: function(a) {
            this.outSpatialReference = a
        },
        _geocodeHandler: function(a, b, k, g, c) {
            try {
                var h = a.candidates,
                    e;
                b = [];
                var d, n = h.length,
                    r = a.spatialReference,
                    f;
                for (d = 0; d < n; d++) {
                    e = h[d];
                    if (f = e.location) f.spatialReference = r;
                    b[d] = new m(e)
                }
                this._successHandler([b], "onAddressToLocationsComplete",
                    k, c)
            } catch (l) {
                this._errorHandler(l, g, c)
            }
        },
        _geocodeAddressesHandler: function(a, b, k, g, c) {
            try {
                var h = a.locations;
                b = [];
                var e, d = h.length,
                    n = a.spatialReference,
                    f;
                for (e = 0; e < d; e++) {
                    if (f = h[e].location) f.spatialReference = n;
                    b[e] = new m(h[e])
                }
                this._successHandler([b], "onAddressesToLocationsComplete", k, c)
            } catch (l) {
                this._errorHandler(l, g, c)
            }
        },
        addressToLocations: function(a, b, k, g, c) {
            var h, e, d, n, r;
            a.address && (g = k, k = b, b = a.outFields, c = a.searchExtent, h = a.magicKey, e = a.distance, a.location && this.normalization && (d = a.location.normalize()),
                n = a.maxLocations, r = a.forStorage, a = a.address);
            c && (c = c._normalize(!0));
            var m = this.outSpatialReference;
            a = this._encode(f.mixin({}, this._url.query, a, {
                f: "json",
                outSR: m && l.toJson(m.toJson()),
                outFields: b && b.join(",") || null,
                searchExtent: c && l.toJson(c.toJson()),
                magicKey: h || null,
                distance: e || null,
                location: d || null,
                maxLocations: n || null,
                forStorage: r || null
            }));
            var t = this._geocodeHandler,
                u = this._errorHandler,
                s = new p(v._dfdCanceller);
            s._pendingDfd = q({
                url: this._url.path + "/findAddressCandidates",
                content: a,
                callbackParamName: "callback",
                load: function(a, b) {
                    t(a, b, k, g, s)
                },
                error: function(a) {
                    u(a, g, s)
                }
            });
            return s
        },
        suggestLocations: function(a) {
            var b;
            b = new p;
            a.hasOwnProperty("location") && this.normalization && (a.location = a.location.normalize());
            a = this._encode(f.mixin({}, this._url.query, a, {
                f: "json"
            }));
            q({
                url: this._url.path + "/suggest",
                content: a,
                callbackParamName: "callback"
            }).then(f.hitch(this, function(a) {
                a = a.suggestions || [];
                this.onSuggestLocationsComplete(a);
                b.resolve(a)
            }), f.hitch(this, function(a) {
                this._errorHandler(a);
                b.reject(a)
            }));
            return b
        },
        addressesToLocations: function(a, b, k) {
            var g = this.outSpatialReference,
                c = [];
            u.forEach(a.addresses, function(a, b) {
                c.push({
                    attributes: a
                })
            });
            a = this._encode(f.mixin({}, this._url.query, {
                addresses: l.toJson({
                    records: c
                })
            }, {
                f: "json",
                outSR: g && l.toJson(g.toJson())
            }));
            var h = this._geocodeAddressesHandler,
                e = this._errorHandler,
                d = new p(v._dfdCanceller);
            d._pendingDfd = q({
                url: this._url.path + "/geocodeAddresses",
                content: a,
                callbackParamName: "callback",
                load: function(a, c) {
                    h(a, c, b, k, d)
                },
                error: function(a) {
                    e(a, k, d)
                }
            });
            return d
        },
        _reverseGeocodeHandler: function(a, b, f, g, c) {
            try {
                var h = new m({
                    address: a.address,
                    location: a.location,
                    score: 100
                });
                this._successHandler([h], "onLocationToAddressComplete", f, c)
            } catch (e) {
                this._errorHandler(e, g, c)
            }
        },
        locationToAddress: function(a, b, k, g) {
            a && this.normalization && (a = a.normalize());
            var c = this.outSpatialReference;
            a = this._encode(f.mixin({}, this._url.query, {
                outSR: c && l.toJson(c.toJson()),
                location: a && l.toJson(a.toJson()),
                distance: b,
                f: "json"
            }));
            var h = this._reverseGeocodeHandler,
                e = this._errorHandler,
                d =
                new p(v._dfdCanceller);
            d._pendingDfd = q({
                url: this._url.path + "/reverseGeocode",
                content: a,
                callbackParamName: "callback",
                load: function(a, b) {
                    h(a, b, k, g, d)
                },
                error: function(a) {
                    e(a, g, d)
                }
            });
            return d
        },
        onSuggestLocationsComplete: function() {},
        onAddressToLocationsComplete: function() {},
        onAddressesToLocationsComplete: function() {},
        onLocationToAddressComplete: function() {}
    })
});