//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../geometry/Point", "../tasks/query", "./RenderMode", "./GridLayout"], function(t, l, v, r, z, A, w, u, x, y) {
    return t([x], {
        declaredClass: "esri.layers._OnDemandMode",
        constructor: function(b) {
            this.featureLayer = b;
            this._featureMap = {};
            this._queryErrorHandler = v.hitch(this, this._queryErrorHandler)
        },
        initialize: function(b) {
            this.inherited(arguments);
            var a = this.featureLayer,
                c = a._srInfo;
            this._gridLayer = new y(new w(c ? c.valid[0] :
                b.extent.xmin, b.extent.ymax, b.spatialReference), {
                width: a._tileWidth,
                height: a._tileHeight
            }, {
                width: b.width,
                height: b.height
            }, c);
            this._cellMap = {};
            this._gridLayer.setResolution(b.extent)
        },
        startup: function() {
            this._ioQueue = [];
            this.featureLayer.suspended || (this._zoomHandler(), this._enableConnectors())
        },
        propertyChangeHandler: function(b) {
            this._init && (2 > b ? this._zoomHandler() : console.log("FeatureLayer: layer in on-demand mode does not support time definitions. Layer id \x3d " + this.featureLayer.id + ", Layer URL \x3d " +
                this.featureLayer.url))
        },
        destroy: function() {
            this._disableConnectors();
            this.inherited(arguments)
        },
        drawFeature: function(b) {
            var a = this._gridLayer,
                c = b.geometry,
                e = [];
            if (c)
                for (var e = a.getCellsInExtent("point" === c.type ? {
                    xmin: c.x,
                    ymin: c.y,
                    xmax: c.x,
                    ymax: c.y
                } : c.getExtent(), !1).cells, a = this._cellMap, d, g = b.attributes[this.featureLayer.objectIdField], f, h, k, c = 0; c < e.length; c++) d = e[c], f = d.latticeID, h = d.row, k = d.col, f ? d = a[f] = a[f] || d : (a[h] = a[h] || {}, d = a[h][k] = a[h][k] || d), d.features = d.features || [], d.features.push(b),
                    this._addFeatureIIf(g, b), this._incRefCount(g)
        },
        suspend: function() {
            this._init && this._disableConnectors()
        },
        resume: function() {
            this._init && (this._enableConnectors(), this._zoomHandler())
        },
        refresh: function() {
            this._zoomHandler()
        },
        _enableConnectors: function() {
            var b = this.map;
            this._zoomConnect = l.connect(b, "onZoomEnd", this, this._zoomHandler);
            this._panConnect = l.connect(b, "onPanEnd", this, this._panHandler);
            this._resizeConnect = l.connect(b, "onResize", this, this._panHandler)
        },
        _disableConnectors: function() {
            l.disconnect(this._zoomConnect);
            l.disconnect(this._panConnect);
            l.disconnect(this._resizeConnect)
        },
        _zoomHandler: function() {
            this._processIOQueue(!0);
            var b = this.featureLayer,
                a = this.map;
            b.suspended || (b._fireUpdateStart(), this._clearIIf(), (b = b._trackManager) && b.clearTracks(), this._cellMap = {}, this._gridLayer.setResolution(a.extent), this._sendRequest())
        },
        _panHandler: function(b) {
            this.featureLayer._fireUpdateStart();
            this._sendRequest(this.featureLayer._resized && b)
        },
        _getRequestId: function(b, a) {
            return ("_" + b.name + b.layerId + b._ulid + "_" + a.resolution +
                "_" + (a.latticeID || a.row + "_" + a.col)).replace(/[^a-zA-Z0-9\_]+/g, "_")
        },
        _sendRequest: function(b) {
            this._exceeds = !1;
            var a = this.featureLayer,
                c = this.map;
            b = b || c.extent;
            c = this._gridLayer.getCellsInExtent(b, a.latticeTiling).cells;
            if (!a.isEditable()) var e = this._cellMap,
                c = r.filter(c, function(a) {
                    if (a.lattice) {
                        if (e[a.latticeID]) return !1
                    } else if (e[a.row] && e[a.row][a.col]) return !1;
                    return !0
                });
            var d = a.getOutFields(),
                g = a.getDefinitionExpression(),
                f = a._getOffsettedTE(a._mapTimeExtent),
                h = a.supportsAdvancedQueries ? a.getOrderByFields() :
                null,
                k = a._usePatch,
                p = this._ioQueue,
                m, l = this,
                t = this._drawFeatures,
                q, n, s;
            this._pending = this._pending || 0;
            for (m = 0; m < c.length; m++) {
                q = c[m];
                n = new u;
                n.geometry = q.extent || q.lattice;
                n.outFields = d;
                n.where = g;
                a.latticeTiling && q.extent && (n.spatialRelationship = u.SPATIAL_REL_CONTAINS);
                n.returnGeometry = !0;
                n.timeExtent = f;
                n.maxAllowableOffset = a._maxOffset;
                a._ts && (n._ts = (new Date).getTime());
                n.orderByFields = h;
                n.multipatchOption = a.multipatchOption;
                s = null;
                if (k && (s = this._getRequestId(a, q), this._isPending(s))) continue;
                this._pending++;
                p.push(a._task.execute(n, function() {
                    var a = q;
                    return function(b) {
                        t.apply(l, [b, a])
                    }
                }.call(this), this._queryErrorHandler, s))
            }
            this._removeOldCells(b);
            this._endCheck()
        },
        _drawFeatures: function(b, a) {
            this._exceeds = this._exceeds || b.exceededTransferLimit;
            this._finalizeIO();
            var c = this.map.extent,
                e = a.extent,
                d = a.row,
                g = a.col,
                f = this.featureLayer.objectIdField,
                h = b.features,
                k = this._gridLayer,
                p = this._cellMap,
                m = a.latticeID,
                l = m ? p[m] : p[d] && p[d][g];
            if (a.resolution != k._resolution || (m ? m !== k.getLatticeID(c) : !k.intersects(e,
                c))) l && this._removeCell(d, g, m);
            else if (l) this._updateCell(l, h);
            else {
                a.features = h;
                m ? p[m] = a : (p[d] = p[d] || {}, p[d][g] = a);
                e = h.length;
                for (c = 0; c < e; c++) d = h[c], g = d.attributes[f], this._addFeatureIIf(g, d), this._incRefCount(g)
            }
            this._endCheck()
        },
        _queryErrorHandler: function(b) {
            this._finalizeIO();
            this.featureLayer._errorHandler(b);
            this._endCheck(!0)
        },
        _finalizeIO: function() {
            this._purgeRequests();
            this._pending--
        },
        _endCheck: function(b) {
            if (0 === this._pending) {
                this._processIOQueue();
                var a = this.featureLayer,
                    c = a._trackManager;
                c && (c.clearTracks(), c.addFeatures(a.graphics), a._ager && r.forEach(a.graphics, function(b) {
                    b._shape && a._repaint(b)
                }), c.moveLatestToFront(), c.drawTracks());
                this.featureLayer._fireUpdateEnd(b && Error("FeatureLayer: an error occurred while updating the layer"), this._exceeds ? {
                    queryLimitExceeded: !0
                } : null);
                if (this._exceeds) a.onQueryLimitExceeded()
            }
        },
        _processIOQueue: function(b) {
            this._ioQueue = r.filter(this._ioQueue, function(a) {
                return -1 < a.fired ? !1 : !0
            });
            b && r.forEach(this._ioQueue, this._cancelPendingRequest)
        },
        _removeOldCells: function(b) {
            var a =
                this._cellMap,
                c = this._gridLayer,
                e, d;
            for (e in a)
                if (a[e]) {
                    var g = a[e],
                        f = g.latticeID,
                        h = 0,
                        k = 0;
                    if (f) h++, f !== c.getLatticeID(b) && (this._removeCell(null, null, f), k++);
                    else
                        for (d in g) g[d] && (h++, c.intersects(g[d].extent, b) || (this._removeCell(e, d), k++));
                    k === h && delete a[e]
                }
        },
        _updateCell: function(b, a) {
            var c = this.featureLayer,
                e = c.objectIdField,
                c = c._selectedFeatures,
                d, g = a.length;
            b.features = b.features || [];
            for (d = 0; d < g; d++) {
                var f = a[d],
                    h = f.attributes[e],
                    k = this._addFeatureIIf(h, f);
                k === f ? (this._incRefCount(h), b.features.push(k)) :
                    h in c || (k.setGeometry(f.geometry), k.setAttributes(f.attributes))
            }
        },
        _removeCell: function(b, a, c) {
            var e = this._cellMap,
                d = this.featureLayer,
                g = d.objectIdField,
                f = c ? e[c] : e[b] && e[b][a];
            if (f) {
                c ? delete e[c] : delete e[b][a];
                b = f.features;
                for (a = 0; a < b.length; a++) c = b[a].attributes[g], this._decRefCount(c), c in d._selectedFeatures || this._removeFeatureIIf(c)
            }
        }
    })
});