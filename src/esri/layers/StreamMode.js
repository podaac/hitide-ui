//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../SpatialReference", "../tasks/query", "./RenderMode"], function(h, g, k, m, n, p, q, l) {
    return h([l], {
        declaredClass: "esri.layers._StreamMode",
        constructor: function(a) {
            console.log("entering 'stream' mode...");
            this.featureLayer = a;
            this._featureMap = {};
            this._drawFeatures = g.hitch(this, this._drawFeatures);
            this._queryErrorHandler = g.hitch(this, this._queryErrorHandler)
        },
        startup: function() {
            this.featureLayer._collection ? console.log("Feature layer is a collection") :
                this._fetchArchive()
        },
        propertyChangeHandler: function(a) {
            this._init && (a ? console.debug("StreamLayer: Stream Layer only supports changing map time. Layer id \x3d " + this.featureLayer.id) : this._applyTimeFilter())
        },
        drawFeature: function(a) {
            a.visible = this._checkFeatureTimeIntersects(a);
            this._addTrackedFeature(a)
        },
        resume: function() {
            this.propertyChangeHandler(0)
        },
        refresh: function() {
            var a = this.featureLayer;
            a._collection ? (a._fireUpdateStart(), a._refresh(!0), a._fireUpdateEnd()) : this._fetchArchive()
        },
        _drawFeatures: function(a) {
            this._purgeRequests();
            a = a.features || [];
            var b = this.featureLayer.objectIdField,
                c, d = a.length,
                e, f;
            for (c = 0; c < d; c++) e = a[c], f = e.attributes[b], this._addFeatureIIf(f, e), this._incRefCount(f);
            this._applyTimeFilter(!0)
        },
        _applyTimeFilter: function(a) {
            var b = this.featureLayer._trackManager,
                c;
            this.inherited(arguments);
            if (b && (c = b.trimTracks()) && 0 < c.length) this._removeFeatures(c), b.refreshTracks()
        },
        _addTrackedFeature: function(a) {
            var b = this.featureLayer,
                c = b._trackManager,
                d, e = a.attributes[b.objectIdField],
                f;
            c && a.visible && (c.addFeatures([a]),
                d = a.attributes[b._trackIdField], f = c.trimTracks([d]));
            this._addFeatureIIf(e, a);
            this._incRefCount(e);
            d && (this._removeFeatures(f), c.refreshTracks([d]))
        },
        _removeFeatures: function(a) {
            var b = this.featureLayer,
                c = b.objectIdField;
            a && k.forEach(a, function(a) {
                a = a.attributes[c];
                b._unSelectFeatureIIf(a, this);
                this._decRefCount(a);
                this._removeFeatureIIf(a)
            }, this)
        },
        _checkFeatureTimeIntersects: function(a) {
            var b = this.featureLayer,
                c = b.getMap().timeExtent;
            return !c || !b.timeInfo || !b.timeInfo.startTimeField && !b.timeInfo.endTimeField ?
                !0 : 0 < b._filterByTime([a], c.startTime, c.endTime).match.length
        },
        _fetchArchive: function() {
            console.log("Stream layer archiving not supported")
        },
        _queryErrorHandler: function(a) {
            this._purgeRequests();
            var b = this.featureLayer;
            b._errorHandler(a);
            b._fireUpdateEnd(a)
        }
    })
});