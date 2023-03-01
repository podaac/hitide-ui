//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(c, a, d, e) {
    return c(null, {
        declaredClass: "esri.tasks.ClassificationDefinition",
        type: null,
        baseSymbol: null,
        colorRamp: null,
        toJson: function() {
            var b = {};
            this.baseSymbol && a.mixin(b, {
                baseSymbol: this.baseSymbol.toJson()
            });
            this.colorRamp && !a.isString(this.colorRamp) && a.mixin(b, {
                colorRamp: this.colorRamp.toJson()
            });
            return b
        }
    })
});