//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "./Domain"], function(c, b, f, g, d, e) {
    return c([e], {
        declaredClass: "esri.layers.CodedValueDomain",
        constructor: function(a) {
            a && b.isObject(a) && (this.codedValues = a.codedValues)
        },
        toJson: function() {
            var a = this.inherited(arguments);
            a.codedValues = b.clone(this.codedValues);
            return d.fixJson(a)
        }
    })
});