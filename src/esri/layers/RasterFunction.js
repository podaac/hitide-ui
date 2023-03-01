//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang"], function(e, d, g, h, f) {
    var c = e(null, {
        declaredClass: "esri.layers.RasterFunction",
        functionName: null,
        arguments: null,
        functionArguments: null,
        variableName: null,
        outputPixelType: null,
        constructor: function(a) {
            if (d.isObject(a)) {
                var b = 0;
                this.functionName = a.rasterFunction;
                this.functionArguments = a.rasterFunctionArguments || a.arguments;
                delete a.rasterFunction;
                delete a.rasterFunctionArguments;
                delete a.arguments;
                d.mixin(this, a);
                if (a = this.functionArguments) {
                    a.Raster &&
                        a.Raster.rasterFunction && (a.Raster = new c(a.Raster));
                    a.Raster2 && a.Raster2.rasterFunction && (a.Raster2 = new c(a.Raster2));
                    if (a.Rasters && a.Rasters.length)
                        for (b = 0; b < a.Rasters.length; b++) a.Rasters[b].rasterFunction && (a.Rasters[b] = new c(a.Rasters[b]));
                    a.DEM && a.DEM.rasterFunction && (a.DEM = new c(a.DEM))
                }
            }
        },
        toJson: function() {
            var a = d.clone(this.functionArguments || this.arguments);
            if (a) {
                a.Raster && "esri.layers.RasterFunction" === a.Raster.declaredClass && (a.Raster = a.Raster.toJson());
                a.Raster2 && "esri.layers.RasterFunction" ===
                    a.Raster2.declaredClass && (a.Raster2 = a.Raster2.toJson());
                if (a.Rasters && a.Rasters.length) {
                    for (var b = 0, c = [], b = 0; b < a.Rasters.length; b++) "esri.layers.RasterFunction" === a.Rasters[b].declaredClass ? c.push(a.Rasters[b].toJson()) : c.push(a.Rasters[b]);
                    a.Rasters = c
                }
                a.DEM && "esri.layers.RasterFunction" === a.DEM.declaredClass && (a.DEM = a.DEM.toJson())
            }
            return f.filter({
                    rasterFunction: this.functionName,
                    rasterFunctionArguments: a,
                    variableName: this.variableName,
                    outputPixelType: this.outputPixelType ? this.outputPixelType : null
                },
                function(a) {
                    if (null !== a && void 0 !== a) return !0
                })
        }
    });
    return c
});