//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "dojo/_base/array", "dojo/query", "dojo/dom-class", "dijit/_Widget", "dijit/_TemplatedMixin", "dojo/text!./templates/FontAlignment.html"], function(f, g, m, n, p, d, e, c, h, k, l) {
    return g([h, k], {
        declaredClass: "esri.dijit.FontAlignment",
        widgetsInTemplate: !0,
        templateString: l,
        _imageUrl: f.toUrl("./images/positionSprite.png"),
        constructor: function(b, a) {},
        destroy: function() {
            this.inherited(arguments)
        },
        setValue: function(b) {
            this.value = b;
            var a = e("button",
                this.domNode);
            d.forEach(a, function(a) {
                a.value === b && c.add(a, "selectedFontAlignment")
            })
        },
        getValue: function() {
            return this.value
        },
        changeValue: function(b) {
            var a = e("button", this.domNode);
            d.forEach(a, function(a) {
                c.remove(a, "selectedFontAlignment")
            });
            c.add(b.currentTarget, "selectedFontAlignment");
            this.value = b.currentTarget.value;
            this.emit("change", {
                value: this.value
            })
        }
    })
});