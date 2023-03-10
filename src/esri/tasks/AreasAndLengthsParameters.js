//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel"], function(d, e, f, c, g, h) {
    return d(null, {
        declaredClass: "esri.tasks.AreasAndLengthsParameters",
        polygons: null,
        lengthUnit: null,
        areaUnit: null,
        calculationType: null,
        toJson: function() {
            var b = f.map(this.polygons, function(a) {
                    return a.toJson()
                }),
                a = {};
            a.polygons = c.toJson(b);
            b = this.polygons[0].spatialReference;
            a.sr = b.wkid ? b.wkid : c.toJson(b.toJson());
            this.lengthUnit && (a.lengthUnit = this.lengthUnit);
            this.areaUnit &&
                (e.isString(this.areaUnit) ? a.areaUnit = c.toJson({
                areaUnit: this.areaUnit
            }) : a.areaUnit = this.areaUnit);
            this.calculationType && (a.calculationType = this.calculationType);
            return a
        }
    })
});