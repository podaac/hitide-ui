//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dijit/MenuItem", "./ToolBase", "../../../kernel"], function(c, d, e, a, b, f) {
    return c([a, b], {
        declaredClass: "esri.dijit.editing.tools.MenuItemBase",
        destroy: function() {
            a.prototype.destroy.apply(this, arguments);
            b.prototype.destroy.apply(this, arguments)
        }
    })
});