//>>built
define(["../../declare", "./taskHelper", "../FeatureSet", "./GeographyQueryBase", "./GeographyQuery", "./SubGeographyQuery"], function(c, b, d, e, f, g) {
    return c("esri.tasks.geoenrichment.StandardGeographyQuery", null, {
        constructor: function(a) {
            this.url = a || location.protocol + "//geoenrich.arcgis.com/arcgis/rest/services/World/GeoenrichmentServer"
        },
        execute: function(a) {
            return b.invokeMethod(this, "/StandardGeographyQuery/execute", function() {
                    a instanceof e || (a = a.returnSubGeographyLayer ? new g(a) : new f(a));
                    return b.jsonToRest(a.toJson())
                },
                function(a) {
                    (!a.results || 1 > a.results.length || !a.results[0].value) && b.throwEmptyResponse();
                    return {
                        featureSet: new d(a.results[0].value),
                        messages: a.messages
                    }
                }, "onExecuteComplete", "onError")
        },
        onExecuteComplete: function(a) {},
        onError: function(a) {}
    })
});