//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-construct", "dojo/dom-style", "dojo/has", "../kernel", "../SpatialReference", "../geometry/Extent", "../geometry/webMercatorUtils", "../renderers/SimpleRenderer", "./layer", "./FeatureLayer", "../dijit/PopupTemplate"], function(l, m, d, e, h, n, u, v, p, q, k, g, r, s, t) {
    return l([r], {
        declaredClass: "esri.layers._ServiceGeneratedFeatureCollection",
        constructor: function(a, b) {
            this.pointSymbol = b && b.pointSymbol;
            this.polylineSymbol = b && b.polylineSymbol;
            this.polygonSymbol = b && b.polygonSymbol;
            this._outSR = b && (b.outSpatialReference || b.outSR) || new p({
                wkid: 4326
            });
            this._options = d.mixin({}, b)
        },
        parse: function() {
            console.error("parse function has not been implemented")
        },
        getFeatureLayers: function() {
            var a = [];
            this._fLayers && (a = a.concat(this._fLayers));
            return a
        },
        onRefresh: function() {},
        onOpacityChange: function() {},
        refresh: function() {
            this.loaded && (this._map && !this._io && this.visible) && this._createLayer()
        },
        _createLayer: function(a) {
            var b = this;
            this._fireUpdateStart();
            a = this.parse(a);
            a.addCallback(function(a) {
                b._io = null;
                b._initLayer(a)
            });
            a.addErrback(function(a) {
                b._io = null;
                a = d.mixin(Error(), a);
                a.message = "Unable to load resource: " + b.url + " " + (a.message || "");
                b._fireUpdateEnd(a);
                b.onError(a)
            })
        },
        _initLayer: function(a) {
            this.loaded && this._removeInternalLayers();
            this.name = a.name;
            this.description = a.description;
            this.snippet = a.snippet;
            this.defaultVisibility = void 0 !== a.visibility ? this.visible = !!a.visibility : this.visible = !0;
            this.featureInfos = a.featureInfos;
            this.fullExtent =
                this.initialExtent = new q(a.lookAtExtent);
            this.copyright = a.author || a.copyright;
            var b;
            if ((a = d.getObject("featureCollection.layers", !1, a)) && 0 < a.length) this._fLayers = [], e.forEach(a, function(a, e) {
                    var f = d.getObject("featureSet.features", !1, a);
                    f && 0 < f.length && (b = d.mixin({
                        outFields: ["*"],
                        infoTemplate: a.popupInfo ? new t(a.popupInfo) : null,
                        editable: !1
                    }, this._options), b.id && (b.id = b.id + "_" + e), a.layerDefinition.capabilities = "Query,Data", f = new s(a, b), f.geometryType && (this["_" + f.geometryType] = f), this._fLayers.push(f))
                },
                this), 0 === this._fLayers.length && delete this._fLayers;
            this.items = [];
            this._esriGeometryPoint && (this.items = this.items.concat(this._esriGeometryPoint.graphics), this.pointSymbol && (a = new g(this.pointSymbol), this._esriGeometryPoint.setRenderer(a)));
            this._esriGeometryPolyline && (this.items = this.items.concat(this._esriGeometryPolyline.graphics), this.polylineSymbol && (a = new g(this.polylineSymbol), this._esriGeometryPolyline.setRenderer(a)));
            this._esriGeometryPolygon && (this.items = this.items.concat(this._esriGeometryPolygon.graphics),
                this.polygonSymbol && (a = new g(this.polygonSymbol), this._esriGeometryPolygon.setRenderer(a)));
            this._fireUpdateEnd();
            this.loaded && (this._addInternalLayers(), this.onRefresh())
        },
        _addInternalLayers: function() {
            var a = this._map;
            this._fireUpdateStart();
            var b = a.spatialReference,
                c = this._outSR,
                d;
            if (b.wkid) d = b._isWebMercator() && c._isWebMercator() || b.wkid === c.wkid;
            else if (b.wkt) d = b.wkt === c.wkt;
            else {
                console.log("_setMap - map has invalid spatial reference");
                return
            } if (!d)
                if (b._isWebMercator() && 4326 === c.wkid) this._converter =
                    k.geographicToWebMercator;
                else if (c._isWebMercator() && 4326 === b.wkid) this._converter = k.webMercatorToGeographic;
            else {
                console.log("_setMap - unsupported workflow. Spatial reference of the map and layer do not match, and the conversion cannot be done on the client.");
                return
            }(b = this._fLayers) && 0 < b.length && e.forEach(b, function(b) {
                if (this._converter) {
                    var c = b.graphics,
                        d, e, g = c ? c.length : 0;
                    for (d = 0; d < g; d++)(e = c[d].geometry) && c[d].setGeometry(this._converter(e))
                }
                a.addLayer(b)
            }, this);
            this.setVisibility(this.visible);
            this._fireUpdateEnd()
        },
        _removeInternalLayers: function() {
            var a = this._map;
            a && e.forEach(this.getFeatureLayers(), a.removeLayer, a)
        },
        setScaleRange: function(a, b) {
            this.inherited(arguments);
            e.forEach(this.getFeatureLayers(), function(c) {
                c.setScaleRange(a, b)
            });
            this._options.minScale = this.minScale;
            this._options.maxScale = this.maxScale
        },
        setOpacity: function(a) {
            this.opacity != a && (e.forEach(this.getFeatureLayers(), function(b) {
                b.setOpacity(a)
            }), this.opacity = this._options.opacity = a, this.onOpacityChange(a))
        },
        onVisibilityChange: function(a) {
            this._fireUpdateStart();
            e.forEach(this.getFeatureLayers(), function(b) {
                b.setVisibility(a)
            });
            this._fireUpdateEnd()
        },
        _setMap: function(a, b) {
            this.inherited(arguments);
            this._map = a;
            var c = this._div = h.create("div", null, b);
            n.set(c, "position", "absolute");
            this._addInternalLayers();
            this.evaluateSuspension();
            return c
        },
        _unsetMap: function(a, b) {
            this._io && this._io.cancel();
            m.disconnect(this._extChgHandle);
            delete this._extChgHandle;
            this._removeInternalLayers();
            var c = this._div;
            c && (b.removeChild(c), h.destroy(c));
            this._div = null;
            this.inherited(arguments)
        }
    })
});