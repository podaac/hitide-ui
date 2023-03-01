//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dijit/form/ToggleButton", "./ToolBase", "../../../kernel"], function(c, d, e, a, b, f) {
    return c([a, b], {
        declaredClass: "esri.dijit.editing.tools.ToggleToolBase",
        postCreate: function() {
            this.inherited(arguments);
            this._setShowLabelAttr && this._setShowLabelAttr(!1)
        },
        destroy: function() {
            a.prototype.destroy.apply(this, arguments);
            b.prototype.destroy.apply(this, arguments)
        },
        setChecked: function(b) {
            a.prototype.setChecked.apply(this, arguments)
        }
    })
});