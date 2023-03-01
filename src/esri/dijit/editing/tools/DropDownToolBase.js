//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojo/dom-style", "dijit/registry", "dijit/Menu", "dijit/form/ComboButton", "./ToolBase", "../../../kernel", "../../../lang"], function(d, l, m, c, e, f, g, h, n, k) {
    return d([g, h], {
        declaredClass: "esri.dijit.editing.tools.DropDownToolBase",
        _enabled: !1,
        _checked: !1,
        postCreate: function() {
            this._tools = [];
            this._createTools();
            this.inherited(arguments);
            this._setShowLabelAttr && this._setShowLabelAttr(!1)
        },
        destroy: function() {
            var a, b = this._tools;
            for (a in b) b.hasOwnProperty(a) &&
                k.isDefined(b[a]) && b[a].destroy();
            this.inherited(arguments)
        },
        _createTools: function() {
            var a, b = new f;
            this.dropDown = b;
            for (a in this._tools) this._tools.hasOwnProperty(a) && b.addChild(this._tools[a]);
            this._activeTool = b.getChildren()[0];
            this._updateUI()
        },
        activate: function(a) {
            this.inherited(arguments);
            this._activeTool ? this._activeTool.activate() : this._activateDefaultTool()
        },
        deactivate: function() {
            this.inherited(arguments);
            this._activeTool && this._activeTool.deactivate()
        },
        enable: function(a) {
            for (var b in this._tools) this._tools.hasOwnProperty(b) &&
                this._tools[b].enable(a);
            this.setEnabled(!0);
            this.inherited(arguments)
        },
        setChecked: function(a) {
            this._checked = a;
            this._updateUI()
        },
        _onDrawEnd: function(a) {},
        onLayerChange: function(a, b, c) {
            this._activeTool = null;
            this._activeType = b;
            this._activeTemplate = c;
            this._activeLayer = a
        },
        onItemClicked: function(a, b) {
            this._activeTool && this._activeTool.deactivate();
            this._activeTool = e.byId(a);
            !1 === this._checked ? this._onClick() : (this._updateUI(), this._activeTool && (this._activeTool.activate(), this._activeTool.setChecked(!0)))
        },
        _onClick: function(a) {
            !1 !== this._enabled && (this._checked = !this._checked, this.inherited(arguments))
        },
        _updateUI: function() {
            this.attr("disabled", !this._enabled);
            c.set(this.focusNode, {
                outline: "none"
            });
            c.set(this.titleNode, {
                padding: "0px",
                border: "none"
            });
            this._checked ? c.set(this.titleNode, {
                backgroundColor: "#D4DFF2",
                border: "1px solid #316AC5"
            }) : c.set(this.titleNode, {
                backgroundColor: "",
                border: ""
            });
            this._activeTool && (this.attr("iconClass", this._checked ? this._activeTool._enabledIcon : this._activeTool._disabledIcon),
                this.attr("label", this._activeTool.label))
        }
    })
});