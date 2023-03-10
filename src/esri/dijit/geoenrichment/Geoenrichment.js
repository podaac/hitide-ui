//>>built
define(["../../declare", "dojo/_base/lang", "dojo/on", "dojo/string", "dojo/promise/all", "./bufferTitle", "../../geometry/Polygon", "../../units", "./DataProvider", "../../tasks/geoenrichment/GeoenrichmentTask", "../../tasks/geoenrichment/EnrichParameters", "../../tasks/geoenrichment/RingBuffer", "../../tasks/geoenrichment/DriveBuffer", "../../tasks/geoenrichment/GeographyLevel", "../../tasks/geoenrichment/GeometryStudyArea", "../../tasks/geoenrichment/AddressStudyArea", "../../tasks/geoenrichment/studyAreaFromJson", "./config", "./lang", "./_Invoke", "dojo/Deferred", "../../tasks/locator", "../../tasks/FeatureSet", "../../graphic"],
    function(f, l, k, z, A, B, C, s, D, E, F, t, G, w, H, I, x, n, y, J, p, K, L, M) {
        var u = f(null, {
                _keys: null,
                _values: null,
                _capacity: 5,
                constructor: function(a) {
                    this._keys = [];
                    this._values = {};
                    a && (this._capacity = a)
                },
                getValue: function(a) {
                    return this._values[a]
                },
                setValue: function(a, b) {
                    this._keys.push(a);
                    this._values[a] = b;
                    this._removeOverflow()
                },
                hasValue: function(a) {
                    return this._values.hasOwnProperty(a)
                },
                _removeOverflow: function() {
                    if (this._keys.length > this._capacity)
                        for (var a = this._keys.splice(0, this._keys.length - this._capacity),
                            b = 0; b < a.length; b++) delete this._values[a[b]]
                },
                setCapacity: function(a) {
                    this._capacity = a;
                    this._removeOverflow()
                }
            }),
            v = f(null, {
                _values: null,
                constructor: function(a) {
                    this._values = new u(a)
                },
                getValue: function(a) {
                    var b = new p,
                        c = this.keyToString(a);
                    if (this._values.hasValue(c)) b.resolve(this._values.getValue(c));
                    else {
                        var g = this;
                        this.keyToValue(a).then(function(a) {
                            g._values.setValue(c, a);
                            b.resolve(a)
                        }, function(a) {
                            b.reject(a)
                        })
                    }
                    return b.promise
                },
                keyToString: function(a) {
                    return JSON.stringify(a)
                },
                keyToValue: function(a) {
                    throw "Not implemented";
                },
                setCapacity: function(a) {
                    this._values.setCapacity(a)
                }
            }),
            N = f([v], {
                keyToString: function(a) {
                    return JSON.stringify(a.toJson())
                },
                keyToValue: function(a) {
                    var b = new K(n.locatorUrl),
                        c = new p;
                    b.locationToAddress(a).then(function(a) {
                        c.resolve(z.substitute(n.addressFormat, a.address, function(a) {
                            return a || ""
                        }))
                    }, function(a) {
                        c.resolve("")
                    });
                    return c.promise
                }
            }),
            O = f([v], {
                _countryValues: null,
                _geometries: null,
                constructor: function() {
                    this._countryValues = new u;
                    this._geometries = new u(3)
                },
                keyToValue: function(a) {
                    var b = this,
                        c = x(a.studyArea),
                        g = c.returnGeometry,
                        d, e;
                    if (g && (e = c.toJson(), delete e.returnGeometry, delete e.comparisonLevels, delete e.attributes, e = JSON.stringify(e), d = this._geometries.hasValue(e), !d)) {
                        var m = this._buildPolygon(c);
                        m && (this._geometries.setValue(e, m), d = !0)
                    }
                    var f = g && !d,
                        q = new p;
                    if (f || a.returnData) {
                        m = new E(n.server);
                        m.token = n.token;
                        for (var k = null, h = c.comparisonGeographyLevels.length - 1; 0 <= h; h--) "Admin1" == c.comparisonGeographyLevels[h].layerID && (k = c.comparisonGeographyLevels.splice(h, 1)[0]);
                        var r, l;
                        k && (r =
                            JSON.stringify({
                                variables: a.variables,
                                country: a.country
                            }), (l = this._countryValues.hasValue(r)) || c.comparisonGeographyLevels.push(k));
                        h = new F;
                        h.forStorage = !1;
                        h.countryID = a.country;
                        h.variables = a.variables;
                        if (c.returnGeometry = f) h.outSR = c.geometry ? c.geometry.spatialReference : a.outSR;
                        h.studyAreas.push(c);
                        m.enrich(h).then(function(a) {
                            var c = a.featureSets[0].features;
                            k && (l ? c.push(b._countryValues.getValue(r)) : b._countryValues.setValue(r, c[c.length - 1]));
                            g && (d ? c[0].geometry = b._geometries.getValue(e) : b._geometries.setValue(e,
                                c[0].geometry));
                            q.resolve(a.featureSets[0])
                        }, function(a) {
                            q.reject(a)
                        })
                    } else a = new L, a.features.push(new M(m, null, {})), q.resolve(a);
                    return q.promise
                },
                setCapacity: function(a) {
                    this.inherited(arguments);
                    this._countryValues.setCapacity(a)
                },
                _buildPolygon: function(a) {
                    if (!a.geometry) return null;
                    switch (a.geometry.type) {
                        case "point":
                            if (!(a.options instanceof t)) return null;
                            break;
                        case "polyline":
                            return null;
                        case "polygon":
                            return a.geometry
                    }
                    var b = a.options,
                        c = new C(a.geometry.spatialReference),
                        g = [],
                        d = b.radii[0];
                    switch (b.units) {
                        case s.FEET:
                            d *= 0.3048;
                            break;
                        case s.MILES:
                            d *= 1609.344;
                            break;
                        case s.KILOMETERS:
                            d *= 1E3
                    }
                    for (b = 0; 80 > b; b++) {
                        var e = 2 * (b / 80) * Math.PI;
                        g.push([a.geometry.x + d * Math.cos(e), a.geometry.y + d * Math.sin(e)])
                    }
                    g.push(g[0]);
                    c.addRing(g);
                    return c
                }
            }),
            P = f([v], {
                metadata: null,
                _enrichCache: null,
                _addressCache: null,
                constructor: function(a) {
                    this._enrichCache = new O(a);
                    this._addressCache = new N(3)
                },
                keyToValue: function(a) {
                    var b = this,
                        c = [],
                        g = a.returnAddress;
                    delete a.returnAddress;
                    c.push(this._enrichCache.getValue(a));
                    var d = x(a.studyArea);
                    g && c.push(this._addressCache.getValue(d.geometry));
                    var e = new p;
                    A(c).then(function(a) {
                        var c = a[0],
                            f = c.features[0];
                        f.attributes[b.metadata.name] || (f.attributes[b.metadata.name] = B(d.getGeomType(), d.options), g ? f.attributes[b.metadata.address] = a[1] : d instanceof I && (f.attributes[b.metadata.address] = d.address.text));
                        e.resolve(c)
                    }, function(a) {
                        e.reject(a)
                    });
                    return e.promise
                },
                setCapacity: function(a) {
                    this.inherited(arguments);
                    this._enrichCache.setCapacity(a)
                }
            });
        return f("esri.dijit.geoenrichment.Geoenrichment", [D, J], {
            country: null,
            returnGeometry: !1,
            returnAddress: !1,
            returnData: !0,
            studyArea: null,
            outSR: null,
            buffer: null,
            variables: null,
            levels: null,
            highestLevel: null,
            data: null,
            restartOnDone: !1,
            requests: null,
            started: !1,
            cache: null,
            constructor: function() {
                this.buffer = new t;
                this.cache = new P;
                this.cache.metadata = this.metadata
            },
            handleResponse: function(a) {
                try {
                    this.data = a, this.onDone(null)
                } catch (b) {
                    this.onDone(b)
                }
            },
            handleError: function(a) {
                this.onDone(a)
            },
            onDone: function(a) {
                this.requests = null;
                a ? "CancelError" != a.name && (console.log(a),
                    k.emit(this, "error", a)) : k.emit(this, "data");
                this.restartOnDone ? (this.invalidate(), this.restartOnDone = !1) : (k.emit(this, "end"), this.started = !1)
            },
            requestData: function() {
                if (this.studyArea && this.variables && this.buffer) {
                    this.requests = [];
                    this.started || (k.emit(this, "start"), this.started = !0);
                    var a, b = this.buffer;
                    a = !1;
                    if (this.studyArea instanceof H) switch (this.studyArea.geometry.type) {
                        case "point":
                            a = this.returnAddress;
                            break;
                        case "polyline":
                            this.buffer instanceof G && (b = new t)
                    }
                    var c = l.clone(this.studyArea);
                    c.options ||
                        (c.options = b);
                    if (this.levels)
                        for (b = 0; b < this.levels.length; b++) c.comparisonGeographyLevels.push(new w({
                            layerID: this.levels[b]
                        }));
                    this.highestLevel && c.comparisonGeographyLevels.push(new w({
                        layerID: this.highestLevel
                    }));
                    c.returnGeometry = this.returnGeometry;
                    a = this.cache.getValue({
                        country: this.country,
                        variables: this.variables,
                        returnData: this.returnData,
                        studyArea: c.toJson(),
                        outSR: this.outSR,
                        returnAddress: a
                    });
                    this.requests.push(a);
                    a.then(l.hitch(this, this.handleResponse), l.hitch(this, this.handleError))
                }
            },
            invalidate: function() {
                this.pendingInvoke("requestData") || (this.requests ? this.restartOnDone = !0 : (this.geometry = null, this.invoke("requestData")))
            },
            setStudyArea: function(a) {
                this.studyArea = a;
                this.invalidate()
            },
            setBuffer: function(a) {
                this.buffer = a;
                this.invalidate()
            },
            getBuffer: function() {
                return this.buffer
            },
            invalidateData: function() {
                this.data = null;
                this.invalidate()
            },
            setVariables: function(a) {
                y.arraysEqual(this.variables, a) || (this.variables = a, this.invalidateData())
            },
            setGeoLevels: function(a, b) {
                y.arraysEqual(this.levels,
                    a) && this.highestLevel == b || (this.levels = a, this.highestLevel = b, this.invalidateData())
            },
            setCacheLimit: function(a) {
                this.cache.setCapacity(a)
            },
            getData: function() {
                return this.data
            },
            getGeometry: function() {
                return this.data.features[0].geometry
            },
            isBusy: function() {
                return this.pendingInvoke("requestData") || this.requests || this.restartOnDone
            },
            stop: function() {
                this.restartOnDone = !1;
                this.cancelInvoke("requestData");
                if (this.requests)
                    for (var a = this.requests.slice(0), b = 0; b < a.length; b++) a[b].cancel()
            },
            setReturnAddress: function(a) {
                this.returnAddress !=
                    a && (this.returnAddress = a) && this.invalidateData()
            }
        })
    });