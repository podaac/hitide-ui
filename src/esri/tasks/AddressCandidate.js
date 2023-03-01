//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../geometry/Point"], function(a, b, d, e, c) {
    return a(null, {
        declaredClass: "esri.tasks.AddressCandidate",
        constructor: function(a) {
            b.mixin(this, a);
            this.location = new c(this.location)
        }
    })
});