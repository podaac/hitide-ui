//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../SpatialReference"], function(a, c, d, e, b) {
    return a(null, {
        declaredClass: "esri.geometry.Geometry",
        spatialReference: null,
        type: null,
        setSpatialReference: function(a) {
            this.spatialReference = a;
            return this
        },
        verifySR: function() {
            this.spatialReference || this.setSpatialReference(new b(4326))
        },
        getExtent: function() {
            return null
        }
    })
});