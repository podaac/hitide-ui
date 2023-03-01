//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../symbols/TextSymbol"], function(d, b, f, g, c, e) {
    return d(null, {
        declaredClass: "esri.layers.LabelClass",
        labelPlacement: null,
        labelExpression: null,
        useCodedValues: null,
        symbol: null,
        maxScale: 0,
        minScale: 0,
        where: null,
        _labelPlacementLookup: {
            "above-center": "esriServerPointLabelPlacementAboveCenter",
            "above-left": "esriServerPointLabelPlacementAboveLeft",
            "above-right": "esriServerPointLabelPlacementAboveRight",
            "below-center": "esriServerPointLabelPlacementBelowCenter",
            "below-left": "esriServerPointLabelPlacementBelowLeft",
            "below-right": "esriServerPointLabelPlacementBelowRight",
            "center-center": "esriServerPointLabelPlacementCenterCenter",
            "center-left": "esriServerPointLabelPlacementCenterLeft",
            "center-right": "esriServerPointLabelPlacementCenterRight",
            "above-after": "esriServerLinePlacementAboveAfter",
            "above-along": "esriServerLinePlacementAboveAlong",
            "above-before": "esriServerLinePlacementAboveBefore",
            "above-start": "esriServerLinePlacementAboveStart",
            "above-end": "esriServerLinePlacementAboveEnd",
            "below-after": "esriServerLinePlacementBelowAfter",
            "below-along": "esriServerLinePlacementBelowAlong",
            "below-before": "esriServerLinePlacementBelowBefore",
            "below-start": "esriServerLinePlacementBelowStart",
            "below-end": "esriServerLinePlacementBelowEnd",
            "center-after": "esriServerLinePlacementCenterAfter",
            "center-along": "esriServerLinePlacementCenterAlong",
            "center-before": "esriServerLinePlacementCenterBefore",
            "center-start": "esriServerLinePlacementCenterStart",
            "center-end": "esriServerLinePlacementCenterEnd",
            "always-horizontal": "esriServerPolygonPlacementAlwaysHorizontal"
        },
        constructor: function(a) {
            a && (b.mixin(this, a), this.labelPlacement = c.valueOf(this._labelPlacementLookup, a.labelPlacement), a.symbol && (this.symbol = new e(a.symbol)))
        },
        toJson: function() {
            var a = {
                labelExpression: this.labelExpression,
                labelExpressionInfo: this.labelExpressionInfo && b.clone(this.labelExpressionInfo),
                useCodedValues: this.useCodedValues,
                maxScale: this.maxScale,
                minScale: this.minScale,
                where: this.where,
                labelPlacement: this._labelPlacementLookup.hasOwnProperty(this.labelPlacement) ?
                    this._labelPlacementLookup[this.labelPlacement] : this.labelPlacement,
                symbol: this.symbol && this.symbol.toJson()
            };
            return c.fixJson(a)
        }
    })
});