//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../SpatialReference", "../tasks/query", "./RenderMode"], function(l, e, q, r, m, n, p) {
    return l([p], {
        declaredClass: "esri.layers._SnapshotMode",
        constructor: function(a) {
            this.featureLayer = a;
            this.pagination = a.queryPagination;
            this._featureMap = {};
            this._drawFeatures = e.hitch(this, this._drawFeatures);
            this._queryErrorHandler = e.hitch(this, this._queryErrorHandler)
        },
        startup: function() {
            this.pagination = this.pagination && null != this.featureLayer.maxRecordCount;
            this.featureLayer._collection ? this._applyTimeFilter() : this._fetchAll()
        },
        propertyChangeHandler: function(a) {
            this._init && (a ? this.featureLayer._collection ? console.log("FeatureLayer: layer created by value (from a feature collection) does not support definition expressions and time definitions. Layer id \x3d " + this.featureLayer.id) : this._fetchAll() : this._applyTimeFilter())
        },
        drawFeature: function(a) {
            var d = a.attributes[this.featureLayer.objectIdField];
            this._addFeatureIIf(d, a);
            this._incRefCount(d)
        },
        resume: function() {
            this.propertyChangeHandler(0)
        },
        refresh: function() {
            var a = this.featureLayer;
            a._collection ? (a._fireUpdateStart(), a._refresh(!0), a._fireUpdateEnd()) : this._fetchAll()
        },
        _getRequestId: function(a) {
            return ("_" + a.name + a.layerId + a._ulid).replace(/[^a-zA-Z0-9\_]+/g, "_")
        },
        _fetchAll: function() {
            var a = this.featureLayer;
            !a._collection && !a.suspended && (a._fireUpdateStart(), this._clearIIf(), this._sendRequest())
        },
        _sendRequest: function(a) {
            var d = this.map,
                b = this.featureLayer,
                g = b.getDefinitionExpression(),
                c = new n;
            c.outFields = b.getOutFields();
            c.where = g ||
                "1\x3d1";
            c.returnGeometry = !0;
            c.outSpatialReference = new m(d.spatialReference.toJson());
            c.timeExtent = b.getTimeDefinition();
            c.maxAllowableOffset = b._maxOffset;
            b._ts && (c._ts = (new Date).getTime());
            c.orderByFields = b.supportsAdvancedQueries ? b.getOrderByFields() : null;
            c.multipatchOption = b.multipatchOption;
            this.pagination && (this._start = c.start = null == a ? 0 : a, c.num = b.maxRecordCount);
            var f;
            b._usePatch && (f = this._getRequestId(b), this._cancelPendingRequest(null, f));
            b._task.execute(c, this._drawFeatures, this._queryErrorHandler,
                f)
        },
        _drawFeatures: function(a) {
            this._purgeRequests();
            var d = a.features,
                b = this.featureLayer,
                g = b.objectIdField,
                c, f = d.length,
                e = a.exceededTransferLimit && !b._collection,
                h, k;
            for (c = 0; c < f; c++) h = d[c], k = h.attributes[g], this._addFeatureIIf(k, h), this._incRefCount(k);
            this._applyTimeFilter(!0);
            if (!this.pagination || !e) b._fireUpdateEnd(null, a.exceededTransferLimit ? {
                queryLimitExceeded: !0
            } : null);
            e && (this.pagination && this._sendRequest(this._start + b.maxRecordCount), b.onQueryLimitExceeded())
        },
        _queryErrorHandler: function(a) {
            this._purgeRequests();
            var d = this.featureLayer;
            d._errorHandler(a);
            d._fireUpdateEnd(a)
        }
    })
});