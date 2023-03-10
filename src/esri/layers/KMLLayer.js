//>>built
define(["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/_base/sniff", "dojo/io-query", "dojo/dom-construct", "dojo/dom-style", "../kernel", "../config", "../lang", "../request", "../SpatialReference", "../geometry/webMercatorUtils", "../dijit/PopupTemplate", "./layer", "./KMLFolder", "./KMLGroundOverlay", "./MapImageLayer", "./FeatureLayer"], function(v, w, l, k, g, x, I, r, s, y, p, t, z, A, B, n, C, D, E, F, G, H) {
    var u = w([D], {
        declaredClass: "esri.layers.KMLLayer",
        serviceUrl: location.protocol +
            "//utility.arcgis.com/sharing/kml",
        constructor: function(a, b) {
            a || console.log("KMLLayer:constructor - please provide url for the KML file");
            this._outSR = b && b.outSR || new B({
                wkid: 4326
            });
            this._options = k.mixin({}, b);
            t.defaults.kmlService && (this.serviceUrl = t.defaults.kmlService);
            var c = this.linkInfo = b && b.linkInfo;
            c && (this.visible = !!c.visibility, this._waitingForMap = !!c.viewFormat);
            (!c || c && c.visibility && !this._waitingForMap) && this._parseKml();
            this.refresh = k.hitch(this, this.refresh);
            this.registerConnectEvents("esri.layers.KMLLayer", !0)
        },
        getFeature: function(a) {
            if (a) {
                var b = a.type,
                    c = a.id,
                    d;
                switch (b) {
                    case "esriGeometryPoint":
                    case "esriGeometryPolyline":
                    case "esriGeometryPolygon":
                        (a = this["_" + b]) && (d = k.getObject("_mode._featureMap." + c, !1, a));
                        break;
                    case "GroundOverlay":
                        if (a = this._groundLyr) {
                            var e = a.getImages(),
                                b = e.length;
                            for (a = 0; a < b; a++)
                                if (e[a].id === c) {
                                    d = e[a];
                                    break
                                }
                        }
                        break;
                    case "ScreenOverlay":
                        break;
                    case "NetworkLink":
                        g.some(this._links, function(a) {
                            return a.linkInfo && a.linkInfo.id === c ? (d = a, !0) : !1
                        });
                        break;
                    case "Folder":
                        b = (e = this.folders) ?
                            e.length : 0;
                        for (a = 0; a < b; a++)
                            if (e[a].id === c) {
                                d = e[a];
                                break
                            }
                        break;
                    default:
                        console.log("KMLLayer:getFeature - unknown feature type")
                }
                return d
            }
        },
        getLayers: function() {
            var a = [];
            this._groundLyr && a.push(this._groundLyr);
            this._fLayers && (a = a.concat(this._fLayers));
            this._links && g.forEach(this._links, function(b) {
                b.declaredClass && a.push(b)
            });
            return a
        },
        setFolderVisibility: function(a, b) {
            a && (this._fireUpdateStart(), (a.visible = b) && (b = this._areLocalAncestorsVisible(a)), this._setState(a, b), this._fireUpdateEnd())
        },
        onRefresh: function() {},
        onOpacityChange: function() {},
        _parseKml: function(a) {
            var b = this;
            this._fireUpdateStart();
            this._io = A({
                url: this.serviceUrl,
                content: {
                    url: this._url.path + this._getQueryParameters(a),
                    model: "simple",
                    folders: "",
                    refresh: this.loaded ? !0 : void 0,
                    outSR: x.toJson(this._outSR.toJson())
                },
                callbackParamName: "callback",
                load: function(a) {
                    b._io = null;
                    b._initLayer(a)
                },
                error: function(a) {
                    b._io = null;
                    a = k.mixin(Error(), a);
                    a.message = "Unable to load KML: " + b.url + " " + (a.message || "");
                    b._fireUpdateEnd(a);
                    b.onError(a)
                }
            })
        },
        _initLayer: function(a) {
            this.loaded &&
                this._removeInternalLayers();
            this.name = a.name;
            this.description = a.description;
            this.snippet = a.snippet;
            this.visibility = a.visibility;
            this.featureInfos = a.featureInfos;
            var b, c, d = this.folders = a.folders,
                e = [],
                h;
            if (d) {
                c = d.length;
                for (b = 0; b < c; b++) h = d[b] = new E(d[b]), -1 === h.parentFolderId && e.push(h)
            }
            var d = this._links = a.networkLinks,
                f;
            c = d ? d.length : 0;
            for (b = 0; b < c; b++) d[b].viewRefreshMode && -1 !== d[b].viewRefreshMode.toLowerCase().indexOf("onregion") || (f = k.mixin({}, this._options), f.linkInfo = d[b], f.id && (f.id = f.id + "_" +
                b), d[b] = new u(d[b].href, f), d[b]._parentLayer = this, d[b]._parentFolderId = this._getLinkParentId(d[b].linkInfo.id));
            if ((d = a.groundOverlays) && 0 < d.length) {
                f = k.mixin({}, this._options);
                f.id && (f.id += "_mapImage");
                h = this._groundLyr = new G(f);
                c = d.length;
                for (b = 0; b < c; b++) h.addImage(new F(d[b]))
            }
            if ((a = k.getObject("featureCollection.layers", !1, a)) && 0 < a.length) this._fLayers = [], g.forEach(a, function(a, b) {
                var c = k.getObject("featureSet.features", !1, a);
                c && 0 < c.length && (f = k.mixin({
                    outFields: ["*"],
                    infoTemplate: a.popupInfo ?
                        new C(a.popupInfo) : null,
                    editable: !1
                }, this._options), f.id && (f.id = f.id + "_" + b), a.layerDefinition.capabilities = "Query,Data", c = new H(a, f), c.geometryType && (this["_" + c.geometryType] = c), this._fLayers.push(c))
            }, this), 0 === this._fLayers.length && delete this._fLayers;
            c = e.length;
            for (b = 0; b < c; b++) h = e[b], this._setState(h, h.visible);
            this._fireUpdateEnd();
            this.loaded ? (this._addInternalLayers(), this.onRefresh()) : (this.loaded = !0, this.onLoad(this))
        },
        _addInternalLayers: function() {
            var a = this._map;
            this._fireUpdateStart();
            this._links && g.forEach(this._links, function(b) {
                b.declaredClass && (a.addLayer(b), b._waitingForMap && (b._waitingForMap = null, b.visible ? b._parseKml(a) : b._wMap = a))
            });
            var b = a.spatialReference,
                c = this._outSR,
                d;
            if (!b.equals(c))
                if (b.isWebMercator() && 4326 === c.wkid) d = n.geographicToWebMercator;
                else if (c.isWebMercator() && 4326 === b.wkid) d = n.webMercatorToGeographic;
            else {
                console.log("KMLLayer:_setMap - unsupported workflow. Spatial reference of the map and kml layer do not match, and the conversion cannot be done on the client.");
                return
            }
            this._groundLyr && (d && g.forEach(this._groundLyr.getImages(), function(a) {
                a.extent = d(a.extent)
            }), a.addLayer(this._groundLyr));
            (b = this._fLayers) && 0 < b.length && g.forEach(b, function(b) {
                if (d) {
                    var c = b.graphics,
                        f, g, k = c ? c.length : 0;
                    for (f = 0; f < k; f++)(g = c[f].geometry) && c[f].setGeometry(d(g))
                }
                a.addLayer(b)
            });
            this.onVisibilityChange(this.visible)
        },
        _removeInternalLayers: function() {
            var a = this._map;
            this._links && g.forEach(this._links, function(a) {
                a.declaredClass && a._io && a._io.cancel()
            });
            a && g.forEach(this.getLayers(),
                a.removeLayer, a)
        },
        _setState: function(a, b) {
            var c = a.featureInfos,
                d, e, h, f = c ? c.length : 0,
                g = b ? "show" : "hide";
            for (h = 0; h < f; h++)
                if (d = c[h], e = this.getFeature(d))
                    if ("Folder" === d.type) this._setState(e, b && e.visible);
                    else if ("NetworkLink" === d.type) this._setInternalVisibility(e, b);
            else e[g]()
        },
        _areLocalAncestorsVisible: function(a) {
            var b = a.parentFolderId;
            for (a = a.visible; a && -1 !== b;) b = this.getFeature({
                type: "Folder",
                id: b
            }), a = a && b.visible, b = b.parentFolderId;
            return a
        },
        _setInternalVisibility: function(a, b) {
            var c = a._parentLayer,
                d = a._parentFolderId;
            for (b = b && a.visible; b && c;) b = b && c.visible, -1 < d && (b = b && c._areLocalAncestorsVisible(c.getFeature({
                type: "Folder",
                id: d
            }))), d = c._parentFolderId, c = c._parentLayer;
            this._setIntState(a, b)
        },
        _setIntState: function(a, b) {
            a && g.forEach(a.getLayers(), function(c) {
                c.linkInfo ? a._setIntState(c, b && c.visible && a._areLocalAncestorsVisible(a.getFeature({
                    type: "Folder",
                    id: c._parentFolderId
                }))) : c.setVisibility(b)
            })
        },
        _getLinkParentId: function(a) {
            var b = -1;
            this.folders && g.some(this.folders, function(c) {
                return c.networkLinkIds &&
                    -1 !== g.indexOf(c.networkLinkIds, a) ? (b = c.id, !0) : !1
            });
            return b
        },
        _checkAutoRefresh: function() {
            var a = this.linkInfo;
            if (a)
                if (this.visible) {
                    if (this.loaded && this._map) {
                        var b = a.refreshMode,
                            c = a.refreshInterval,
                            d = a.viewRefreshMode,
                            a = a.viewRefreshTime;
                        b && (-1 !== b.toLowerCase().indexOf("oninterval") && 0 < c) && (this._stopAutoRefresh(), this._timeoutHandle = setTimeout(this.refresh, 1E3 * c));
                        d && (-1 !== d.toLowerCase().indexOf("onstop") && 0 < a) && !this._extChgHandle && (this._extChgHandle = l.connect(this._map, "onExtentChange", this,
                            this._extentChanged))
                    }
                } else this._stopAutoRefresh(), l.disconnect(this._extChgHandle), delete this._extChgHandle
        },
        _stopAutoRefresh: function() {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = null
        },
        _getQueryParameters: function(a) {
            a = a || this._map;
            var b = {},
                c = this.linkInfo,
                d = a && a.extent,
                e;
            this._url.query && (k.mixin(b, this._url.query), e = !!this._url.query.token);
            if (p.id && !e && (e = p.id.findCredential(this._url.path))) b.token = e.token;
            if (c) {
                e = c.viewFormat;
                var g = c.httpQuery,
                    c = c.viewBoundScale;
                if (d && e) {
                    var f =
                        d,
                        m = d,
                        l = d.spatialReference;
                    l && (l.isWebMercator() ? f = n.webMercatorToGeographic(d) : 4326 === l.wkid && (m = n.geographicToWebMercator(d)));
                    d = f.getCenter();
                    m = Math.max(m.getWidth(), m.getHeight());
                    c && (f = f.expand(c));
                    e = e.replace(/\[bboxWest\]/ig, f.xmin).replace(/\[bboxEast\]/ig, f.xmax).replace(/\[bboxSouth\]/ig, f.ymin).replace(/\[bboxNorth\]/ig, f.ymax).replace(/\[lookatLon\]/ig, d.x).replace(/\[lookatLat\]/ig, d.y).replace(/\[lookatRange\]/ig, m).replace(/\[lookatTilt\]/ig, 0).replace(/\[lookatHeading\]/ig, 0).replace(/\[lookatTerrainLon\]/ig,
                        d.x).replace(/\[lookatTerrainLat\]/ig, d.y).replace(/\[lookatTerrainAlt\]/ig, 0).replace(/\[cameraLon\]/ig, d.x).replace(/\[cameraLat\]/ig, d.y).replace(/\[cameraAlt\]/ig, m).replace(/\[horizFov\]/ig, 60).replace(/\[vertFov\]/ig, 60).replace(/\[horizPixels\]/ig, a.width).replace(/\[vertPixels\]/ig, a.height).replace(/\[terrainEnabled\]/ig, 0);
                    k.mixin(b, r.queryToObject(e))
                }
                g && (g = g.replace(/\[clientVersion\]/ig, p.version).replace(/\[kmlVersion\]/ig, 2.2).replace(/\[clientName\]/ig, "ArcGIS API for JavaScript").replace(/\[language\]/ig,
                    v.locale), k.mixin(b, r.queryToObject(g)))
            }
            a = [];
            for (var q in b) z.isDefined(b[q]) && a.push(q + "\x3d" + b[q]);
            return (a = a.join("\x26")) ? "?" + a : ""
        },
        setScaleRange: function(a, b) {
            this.inherited(arguments);
            g.forEach(this.getLayers(), function(c) {
                c.setScaleRange(a, b)
            });
            this._options.minScale = this.minScale;
            this._options.maxScale = this.maxScale
        },
        setOpacity: function(a) {
            this.opacity != a && (g.forEach(this.getLayers(), function(b) {
                b.setOpacity(a)
            }), this.opacity = this._options.opacity = a, this.onOpacityChange(a))
        },
        _setMap: function(a,
            b) {
            this.inherited(arguments);
            this._map = a;
            var c = this._div = s.create("div", null, b);
            y.set(c, "position", "absolute");
            this._addInternalLayers();
            this.evaluateSuspension();
            return c
        },
        _unsetMap: function(a, b) {
            this._io && this._io.cancel();
            this._stopAutoRefresh();
            l.disconnect(this._extChgHandle);
            delete this._extChgHandle;
            this._removeInternalLayers();
            var c = this._div;
            c && (b.removeChild(c), s.destroy(c));
            this._wMap = this._div = null;
            this.inherited(arguments)
        },
        onVisibilityChange: function(a) {
            this.loaded ? (this._fireUpdateStart(),
                this._setInternalVisibility(this, a), this._checkAutoRefresh(), this._fireUpdateEnd()) : this.linkInfo && a && (this._waitingForMap || this._parseKml(this._wMap))
        },
        refresh: function() {
            this.loaded && (this._map && !this._io && this.visible) && this._parseKml()
        },
        getFeatureCollection: function(a) {
            var b, c = [];
            if (a = this.getFeature({
                type: "Folder",
                id: a
            }))(b = g.map(a.featureInfos, function(a) {
                if ("esriGeometryPoint" === a.type || "esriGeometryPolyline" === a.type || "esriGeometryPolygon" === a.type) return a.id
            }, this)) && 0 < b.length && g.forEach(this._fLayers,
                function(a) {
                    var e, h;
                    e = a.toJson();
                    e.featureSet.features && 0 < e.featureSet.features.length && (h = g.filter(e.featureSet.features, function(c) {
                        if (-1 !== g.indexOf(b, c.attributes[a.objectIdField])) return c
                    }, this));
                    h && 0 < h.length && (e.featureSet.features = h, c.push(e))
                }, this);
            return c
        },
        getFeatureCount: function(a) {
            a = this.getFeature({
                type: "Folder",
                id: a
            });
            var b = {
                points: 0,
                polylines: 0,
                polygons: 0
            };
            a && g.forEach(a.featureInfos, function(a) {
                "esriGeometryPoint" === a.type && (b.points += 1);
                "esriGeometryPolyline" === a.type && (b.polylines +=
                    1);
                "esriGeometryPolygon" === a.type && (b.polygons += 1)
            });
            return b
        },
        _extentChanged: function() {
            this._stopAutoRefresh();
            this._timeoutHandle = setTimeout(this.refresh, 1E3 * this.linkInfo.viewRefreshTime)
        }
    });
    return u
});