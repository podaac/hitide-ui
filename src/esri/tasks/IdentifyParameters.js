//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel", "../layerUtils", "../geometry/jsonUtils", "../geometry/scaleUtils"], function(f, m, g, e, q, r, h, n, p) {
    var d = f(null, {
        declaredClass: "esri.tasks.IdentifyParameters",
        constructor: function() {
            this.layerOption = d.LAYER_OPTION_TOP
        },
        geometry: null,
        spatialReference: null,
        layerIds: null,
        tolerance: null,
        returnGeometry: !1,
        mapExtent: null,
        width: 400,
        height: 400,
        dpi: 96,
        layerDefinitions: null,
        timeExtent: null,
        layerTimeOptions: null,
        dynamicLayerInfos: null,
        toJson: function(a) {
            var c = a && a.geometry || this.geometry,
                b = this.mapExtent,
                d = this.spatialReference,
                k = this.layerIds;
            a = {
                geometry: c,
                tolerance: this.tolerance,
                returnGeometry: this.returnGeometry,
                mapExtent: b,
                imageDisplay: this.width + "," + this.height + "," + this.dpi,
                maxAllowableOffset: this.maxAllowableOffset
            };
            c && (a.geometryType = n.getJsonType(c));
            null !== d ? a.sr = d.wkid || e.toJson(d.toJson()) : c ? a.sr = c.spatialReference.wkid || e.toJson(c.spatialReference.toJson()) : b && (a.sr = b.spatialReference.wkid || e.toJson(b.spatialReference.toJson()));
            a.layers = this.layerOption;
            k && (a.layers += ":" + k.join(","));
            a.layerDefs = h._serializeLayerDefinitions(this.layerDefinitions);
            c = this.timeExtent;
            a.time = c ? c.toJson().join(",") : null;
            a.layerTimeOptions = h._serializeTimeOptions(this.layerTimeOptions);
            if (this.dynamicLayerInfos && 0 < this.dynamicLayerInfos.length) {
                var b = p.getScale({
                        extent: b,
                        width: this.width,
                        spatialReference: b.spatialReference
                    }),
                    f = h._getLayersForScale(b, this.dynamicLayerInfos),
                    l = [];
                g.forEach(this.dynamicLayerInfos, function(a) {
                    if (!a.subLayerIds) {
                        var b =
                            a.id;
                        if ((!this.layerIds || this.layerIds && -1 !== g.indexOf(this.layerIds, b)) && -1 !== g.indexOf(f, b)) {
                            var c = {
                                id: b
                            };
                            c.source = a.source && a.source.toJson();
                            var d;
                            this.layerDefinitions && this.layerDefinitions[b] && (d = this.layerDefinitions[b]);
                            d && (c.definitionExpression = d);
                            var e;
                            this.layerTimeOptions && this.layerTimeOptions[b] && (e = this.layerTimeOptions[b]);
                            e && (c.layerTimeOptions = e.toJson());
                            l.push(c)
                        }
                    }
                }, this);
                b = e.toJson(l);
                "[]" === b && (b = "[{}]");
                a.dynamicLayers = b
            }
            return a
        }
    });
    m.mixin(d, {
        LAYER_OPTION_TOP: "top",
        LAYER_OPTION_VISIBLE: "visible",
        LAYER_OPTION_ALL: "all"
    });
    return d
});