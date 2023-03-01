//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "./MapImage"], function(a, d, e, f, b, c) {
    return a([c], {
        declaredClass: "esri.layers.KMLGroundOverlay",
        constructor: function(a) {
            b.isDefined(this.visibility) && (this.visible = !!this.visibility)
        }
    })
});