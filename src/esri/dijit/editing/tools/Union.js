//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../../../graphicsUtils", "../../../graphic", "../../../toolbars/draw", "../Union", "./ButtonToolBase", "../../../kernel"], function(f, d, e, q, k, l, m, n, p, r) {
    return f([p], {
        declaredClass: "esri.dijit.editing.tools.Union",
        id: "btnFeatureUnion",
        _enabledIcon: "toolbarIcon unionIcon",
        _disabledIcon: "toolbarIcon unionIcon",
        _drawType: m.POLYLINE,
        _enabled: !0,
        _label: "NLS_unionLbl",
        _onClick: function(a) {
            this._settings.editor._activeTool = "UNION";
            a = e.filter(this._settings.layers,
                function(b) {
                    return "esriGeometryPolygon" === b.geometryType && b.visible && b._isMapAtVisibleScale()
                });
            var h = [],
                g = 0;
            e.forEach(a, function(b, a) {
                var c = b.getSelectedFeatures();
                if (2 <= c.length) {
                    g++;
                    var f = e.map(c, function(b) {
                        return new l(d.clone(b.toJson()))
                    });
                    this._settings.geometryService.union(k.getGeometries(c), d.hitch(this, function(a) {
                        a = [c.pop().setGeometry(a)];
                        h.push({
                            layer: b,
                            updates: a,
                            deletes: c,
                            preUpdates: f
                        });
                        g--;
                        if (0 >= g) this.onApplyEdits(h, d.hitch(this, function() {
                            if (this._settings.undoRedoManager) {
                                var b =
                                    this._settings.undoRedoManager;
                                e.forEach(this._edits, d.hitch(this, function(a) {
                                    b.add(new n({
                                        featureLayer: a.layer,
                                        addedGraphics: a.deletes,
                                        preUpdatedGraphics: a.preUpdates,
                                        postUpdatedGraphics: a.updates
                                    }))
                                }), this)
                            }
                            this._settings.editor._selectionHelper.clearSelection(!1);
                            this.onFinished()
                        }))
                    }))
                }
            }, this)
        }
    })
});