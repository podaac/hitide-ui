//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel"], function(a, c, b, d, e) {
    return a(null, {
        declaredClass: "esri.tasks.GenerateRendererParameters",
        classificationDefinition: null,
        where: null,
        precision: null,
        prefix: null,
        unitLabel: null,
        formatLabel: null,
        toJson: function() {
            return {
                classificationDef: b.toJson(this.classificationDefinition.toJson()),
                where: this.where
            }
        }
    })
});