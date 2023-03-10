//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel", "../geometry/jsonUtils", "./SpatialRelationship", "require", "require", "require"], function(p, q, r, c, u, v, s, t) {
    var d = p(null, {
        declaredClass: "esri.tasks.Query",
        constructor: function() {
            this.spatialRelationship = d.SPATIAL_REL_INTERSECTS
        },
        text: null,
        where: "",
        geometry: null,
        groupByFieldsForStatistics: null,
        objectIds: null,
        returnGeometry: !1,
        orderByFields: null,
        outSpatialReference: null,
        outFields: null,
        outStatistics: null,
        timeExtent: null,
        relationParam: null,
        pixelSize: null,
        distance: null,
        units: null,
        resultOffset: null,
        resultRecordCount: null,
        _units: {
            meters: "esriSRUnit_Meter",
            kilometers: "esriSRUnit_Kilometer",
            feet: "esriSRUnit_Foot",
            miles: "esriSRUnit_StatuteMile",
            "nautical-miles": "esriSRUnit_NauticalMile",
            "us-nautical-miles": "esriSRUnit_USNauticalMile"
        },
        toJson: function(e) {
            var a = {
                    text: this.text,
                    where: this.where,
                    returnGeometry: this.returnGeometry,
                    spatialRel: this.spatialRelationship,
                    maxAllowableOffset: this.maxAllowableOffset,
                    geometryPrecision: this.geometryPrecision
                },
                b = e && e.geometry || this.geometry,
                g = this.objectIds,
                h = this.outFields,
                f = this.outSpatialReference,
                k = this.groupByFieldsForStatistics,
                l = this.orderByFields,
                m = this.outStatistics;
            e = this.distance;
            b && (a.geometry = b, a.geometryType = s.getJsonType(b), a.inSR = b.spatialReference.wkid || c.toJson(b.spatialReference.toJson()));
            g && (a.objectIds = g.join(","));
            h && (a.outFields = h.join(","));
            k && (a.groupByFieldsForStatistics = k.join(","));
            l && (a.orderByFields = l.join(","));
            if (m) {
                var n = [];
                r.forEach(m, function(a, b) {
                    n.push(a.toJson())
                });
                a.outStatistics = c.toJson(n)
            }
            null !== f ? a.outSR = f.wkid || c.toJson(f.toJson()) : b && (a.outSR = b.spatialReference.wkid || c.toJson(b.spatialReference.toJson()));
            b = this.timeExtent;
            a.time = b ? b.toJson().join(",") : null;
            if ((b = this.relationParam) && this.spatialRelationship === d.SPATIAL_REL_RELATION) a.relationParam = b;
            e && (a.distance = this.distance, this.hasOwnProperty("units") ? a.units = this._units[this.units] || this._units.meters : (console.warn("esri/tasks/query::no distance unit provided, defaulting to meters"), a.units = this._units.meters));
            this.hasOwnProperty("start") && (a.resultOffset = this.start, a.resultRecordCount = 10, "" === a.where && (a.where = "1\x3d1"));
            this.hasOwnProperty("num") && (a.resultRecordCount = this.num);
            a.pixelSize = this.pixelSize ? c.toJson(this.pixelSize.toJson()) : null;
            a.multipatchOption = this.multipatchOption;
            a._ts = this._ts;
            return a
        }
    });
    q.mixin(d, t);
    return d
});