//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/has", "dojo/dom-class", "dijit/form/ToggleButton", "../../kernel"], function(f, b, g, c, h, d, e, k) {
    return b([e], {
        groupName: "defaultGroup",
        declaredClass: "esri.dijit.analysis.GroupToggleButton",
        postMixInProperties: function() {
            this.inherited(arguments);
            this.unselectChannel = "/ButtonGroup/" + this.groupName;
            c.subscribe(this.unselectChannel, this, "doUnselect")
        },
        postCreate: function() {
            this.inherited(arguments);
            d.add(this.domNode, "esriGroupButton")
        },
        doUnselect: function(a) {
            a !== this && this.checked && this.set("checked", !1)
        },
        _setCheckedAttr: function(a, b) {
            this.inherited(arguments);
            a && c.publish(this.unselectChannel, [this]);
            d.toggle(this.focusNode, "esriGroupChecked", a);
            console.log("checked", this.id, a)
        }
    })
});