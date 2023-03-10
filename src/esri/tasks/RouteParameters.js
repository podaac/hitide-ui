//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel", "../lang", "../graphicsUtils", "./NATypes"], function(f, k, c, l, m, g, e, h) {
    return f(null, {
        declaredClass: "esri.tasks.RouteParameters",
        accumulateAttributes: null,
        attributeParameterValues: null,
        barriers: null,
        directionsLanguage: null,
        directionsLengthUnits: null,
        directionsOutputType: null,
        directionsStyleName: null,
        directionsTimeAttribute: null,
        doNotLocateOnRestrictedElements: !0,
        findBestSequence: null,
        ignoreInvalidLocations: null,
        impedanceAttribute: null,
        outputLines: "esriNAOutputLineTrueShape",
        outputGeometryPrecision: null,
        outputGeometryPrecisionUnits: null,
        outSpatialReference: null,
        polygonBarriers: null,
        polylineBarriers: null,
        preserveFirstStop: null,
        preserveLastStop: null,
        restrictionAttributes: null,
        restrictUTurns: null,
        returnBarriers: !1,
        returnDirections: !1,
        returnPolygonBarriers: !1,
        returnPolylineBarriers: !1,
        returnRoutes: !0,
        returnStops: !1,
        startTime: null,
        startTimeIsUTC: null,
        stops: null,
        useHierarchy: null,
        useTimeWindows: null,
        travelMode: null,
        toJson: function(d) {
            var a = {
                    returnDirections: this.returnDirections,
                    returnRoutes: this.returnRoutes,
                    returnStops: this.returnStops,
                    returnBarriers: this.returnBarriers,
                    returnPolygonBarriers: this.returnPolygonBarriers,
                    returnPolylineBarriers: this.returnPolylineBarriers,
                    attributeParameterValues: this.attributeParameterValues && c.toJson(this.attributeParameterValues),
                    outSR: this.outSpatialReference ? this.outSpatialReference.wkid || c.toJson(this.outSpatialReference.toJson()) : null,
                    outputLines: this.outputLines,
                    findBestSequence: this.findBestSequence,
                    preserveFirstStop: this.preserveFirstStop,
                    preserveLastStop: this.preserveLastStop,
                    useTimeWindows: this.useTimeWindows,
                    startTime: this.startTime ? this.startTime.getTime() : null,
                    startTimeIsUTC: this.startTimeIsUTC,
                    accumulateAttributeNames: this.accumulateAttributes ? this.accumulateAttributes.join(",") : null,
                    ignoreInvalidLocations: this.ignoreInvalidLocations,
                    impedanceAttributeName: this.impedanceAttribute,
                    restrictionAttributeNames: this.restrictionAttributes ? this.restrictionAttributes.join(",") : null,
                    restrictUTurns: this.restrictUTurns,
                    useHierarchy: this.useHierarchy,
                    directionsLanguage: this.directionsLanguage,
                    outputGeometryPrecision: this.outputGeometryPrecision,
                    outputGeometryPrecisionUnits: this.outputGeometryPrecisionUnits,
                    directionsLengthUnits: h.LengthUnit[this.directionsLengthUnits],
                    directionsTimeAttributeName: this.directionsTimeAttribute,
                    directionsStyleName: this.directionsStyleName,
                    travelMode: this.travelMode
                },
                b = this.stops;
            "esri.tasks.FeatureSet" === b.declaredClass && 0 < b.features.length ? a.stops = c.toJson({
                type: "features",
                features: e._encodeGraphics(b.features,
                    d && d["stops.features"]),
                doNotLocateOnRestrictedElements: this.doNotLocateOnRestrictedElements
            }) : "esri.tasks.DataLayer" === b.declaredClass ? a.stops = b : "esri.tasks.DataFile" === b.declaredClass && (a.stops = c.toJson({
                type: "features",
                url: b.url,
                doNotLocateOnRestrictedElements: this.doNotLocateOnRestrictedElements
            }));
            if (this.directionsOutputType) switch (this.directionsOutputType.toLowerCase()) {
                case "complete":
                    a.directionsOutputType = "esriDOTComplete";
                    break;
                case "complete-no-events":
                    a.directionsOutputType = "esriDOTCompleteNoEvents";
                    break;
                case "instructions-only":
                    a.directionsOutputType = "esriDOTInstructionsOnly";
                    break;
                case "standard":
                    a.directionsOutputType = "esriDOTStandard";
                    break;
                case "summary-only":
                    a.directionsOutputType = "esriDOTSummaryOnly";
                    break;
                default:
                    a.directionsOutputType = this.directionsOutputType
            }
            b = function(a, b) {
                return !a ? null : "esri.tasks.FeatureSet" === a.declaredClass ? 0 < a.features.length ? c.toJson({
                    type: "features",
                    features: e._encodeGraphics(a.features, d && d[b])
                }) : null : "esri.tasks.DataLayer" === a.declaredClass ? a : "esri.tasks.DataFile" ===
                    a.declaredClass ? c.toJson({
                        type: "features",
                        url: a.url
                    }) : c.toJson(a)
            };
            this.barriers && (a.barriers = b(this.barriers, "barriers.features"));
            this.polygonBarriers && (a.polygonBarriers = b(this.polygonBarriers, "polygonBarriers.features"));
            this.polylineBarriers && (a.polylineBarriers = b(this.polylineBarriers, "polylineBarriers.features"));
            return g.filter(a, function(a) {
                if (null !== a) return !0
            })
        }
    })
});