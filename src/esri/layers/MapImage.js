//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../domUtils", "../geometry/Extent"], function(e, f, h, k, d, g) {
    return e(null, {
        declaredClass: "esri.layers.MapImage",
        constructor: function(a) {
            f.mixin(this, a);
            this.extent = new g(this.extent)
        },
        visible: !0,
        getLayer: function() {
            return this._layer
        },
        getNode: function() {
            return this._node
        },
        show: function() {
            if (!this.visible) {
                this.visible = !0;
                var a = this._node,
                    b = this._layer,
                    c;
                if (a) {
                    if (c = b && b._div) b.suspended || b._setPos(a, c._left, c._top), (b._active || c).appendChild(a);
                    d.show(a)
                }
            }
        },
        hide: function() {
            if (this.visible) {
                this.visible = !1;
                var a = this._node;
                a && (d.hide(a), a.parentNode && a.parentNode.removeChild(a))
            }
        }
    })
});