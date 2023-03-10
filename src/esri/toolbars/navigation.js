//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/Color", "dojo/has", "../kernel", "./_toolbar", "../undoManager", "../OperationBase", "../geometry/Extent", "../geometry/Rect", "../symbols/SimpleLineSymbol", "../symbols/SimpleFillSymbol", "../graphic"], function(g, f, d, h, t, u, n, p, q, r, k, l, m, s) {
    var e = g(n, {
        declaredClass: "esri.toolbars.Navigation",
        _eventMap: {
            "extent-history-change": !0
        },
        constructor: function(a) {
            this.zoomSymbol = new m(m.STYLE_SOLID, new l(l.STYLE_SOLID, new h([255, 0, 0]), 2), new h([0, 0, 0, 0.25]));
            d.connect(a, "onUnload", this, "_cleanUp");
            this.map = a;
            this._undoManager = new p({
                maxOperations: -1
            });
            this._normalizeRect = f.hitch(this, this._normalizeRect);
            this._onMouseDownHandler = f.hitch(this, this._onMouseDownHandler);
            this._onMouseUpHandler = f.hitch(this, this._onMouseUpHandler);
            this._onMouseDragHandler = f.hitch(this, this._onMouseDragHandler);
            this._onExtentChangeHandler_connect = d.connect(a, "onExtentChange", this, "_extentChangeHandler");
            this._onMapLoad_connect = d.connect(a, "onLoad", this, "_mapLoadHandler");
            a.loaded &&
                a.extent && (this._currentExtent = a.extent)
        },
        _mapLoadHandler: function() {
            this._currentExtent = this.map.extent
        },
        _navType: null,
        _start: null,
        _graphic: null,
        _prevExtent: !1,
        _currentExtent: null,
        _preExtent: null,
        _cleanUp: function(a) {
            d.disconnect(this._onExtentChangeHandler_connect);
            d.disconnect(this._onMapLoad_connect)
        },
        activate: function(a) {
            var b = this.map;
            this._graphic || (this._deactivateMapTools(!0, !1, !1, !0), this._graphic = new s(null, this.zoomSymbol));
            switch (a) {
                case e.ZOOM_IN:
                case e.ZOOM_OUT:
                    this._deactivate();
                    this._onMouseDownHandler_connect =
                        d.connect(b, "onMouseDown", this, "_onMouseDownHandler");
                    this._onMouseDragHandler_connect = d.connect(b, "onMouseDrag", this, "_onMouseDragHandler");
                    this._onMouseUpHandler_connect = d.connect(b, "onMouseUp", this, "_onMouseUpHandler");
                    this._navType = a;
                    break;
                case e.PAN:
                    this._deactivate(), b.enablePan(), this._navType = a
            }
        },
        _extentChangeHandler: function(a) {
            this._prevExtent || this._nextExtent ? this._currentExtent = a : (this._preExtent = this._currentExtent, this._currentExtent = a, this._preExtent && this._currentExtent && (a = new e.MapExtent({
                map: this.map,
                preExtent: this._preExtent,
                currentExtent: this._currentExtent
            }), this._undoManager.add(a)));
            this._prevExtent = this._nextExtent = !1;
            this.onExtentHistoryChange()
        },
        _deactivate: function() {
            var a = this._navType;
            if (a === e.PAN) this.map.disablePan();
            else if (a === e.ZOOM_IN || a === e.ZOOM_OUT) d.disconnect(this._onMouseDownHandler_connect), d.disconnect(this._onMouseDragHandler_connect), d.disconnect(this._onMouseUpHandler_connect)
        },
        _normalizeRect: function(a, b, c) {
            var d = a.x;
            a = a.y;
            var e = b.x;
            b = b.y;
            var f = Math.abs(d - e),
                g = Math.abs(a -
                    b);
            return {
                x: Math.min(d, e),
                y: Math.max(a, b),
                width: f,
                height: g,
                spatialReference: c
            }
        },
        _onMouseDownHandler: function(a) {
            this._start = a.mapPoint
        },
        _onMouseDragHandler: function(a) {
            var b = this._graphic,
                c = this.map.graphics;
            c.remove(b, !0);
            b.setGeometry(new k(this._normalizeRect(this._start, a.mapPoint, this.map.spatialReference)));
            c.add(b, !0)
        },
        _onMouseUpHandler: function(a) {
            var b = this.map,
                c = this._normalizeRect(this._start, a.mapPoint, b.spatialReference);
            b.graphics.remove(this._graphic, !0);
            if (!(0 === c.width && 0 === c.height))
                if (this._navType ===
                    e.ZOOM_IN) b.setExtent((new k(c)).getExtent());
                else {
                    a = b.toScreen(c);
                    var c = b.toScreen({
                            x: c.x + c.width,
                            y: c.y,
                            spatialReference: b.spatialReference
                        }),
                        d = b.extent.getWidth();
                    a = (d * b.width / Math.abs(c.x - a.x) - d) / 2;
                    c = b.extent;
                    b.setExtent(new r(c.xmin - a, c.ymin - a, c.xmax + a, c.ymax + a, c.spatialReference))
                }
        },
        deactivate: function() {
            this._deactivate();
            this._graphic && this.map.graphics.remove(this._graphic, !0);
            this._navType = this._start = this._graphic = null;
            this._activateMapTools(!0, !1, !1, !0)
        },
        setZoomSymbol: function(a) {
            this.zoomSymbol =
                a
        },
        isFirstExtent: function() {
            return !this._undoManager.canUndo
        },
        isLastExtent: function() {
            return !this._undoManager.canRedo
        },
        zoomToFullExtent: function() {
            var a = this.map;
            a.setExtent(a.getLayer(a.layerIds[0]).initialExtent)
        },
        zoomToPrevExtent: function() {
            this._undoManager.canUndo && (this._prevExtent = !0, this._undoManager.undo())
        },
        zoomToNextExtent: function() {
            this._undoManager.canRedo && (this._nextExtent = !0, this._undoManager.redo())
        },
        onExtentHistoryChange: function() {}
    });
    f.mixin(e, {
        ZOOM_IN: "zoomin",
        ZOOM_OUT: "zoomout",
        PAN: "pan"
    });
    e.MapExtent = g(q, {
        declaredClass: "esri.toolbars.MapExtent",
        label: "extent changes",
        constructor: function(a) {
            this.map = a.map;
            this.preExtent = a.preExtent;
            this.currentExtent = a.currentExtent
        },
        performRedo: function() {
            this.map.setExtent(this.currentExtent)
        },
        performUndo: function() {
            this.map.setExtent(this.preExtent)
        }
    });
    return e
});