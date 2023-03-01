//>>built
define(["dojo/_base/declare", "dojo/has", "./kernel"], function(b, c, d) {
    return b(null, {
        declaredClass: "esri.OperationBase",
        type: "not implemented",
        label: "not implemented",
        constructor: function(a) {
            a = a || {};
            a.label && (this.label = a.label)
        },
        performUndo: function() {
            console.log("performUndo has not been implemented")
        },
        performRedo: function() {
            console.log("performRedo has not been implemented")
        }
    })
});