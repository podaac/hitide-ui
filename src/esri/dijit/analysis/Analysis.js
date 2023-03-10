//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/layout/AccordionContainer", "dijit/TitlePane", "dojox/widget/TitleGroup", "../../kernel", "./AnalysisToolItem", "./utils", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/Analysis.html"],
    function(n, p, d, f, k, y, z, A, B, g, q, c, l, C, r, s, t, u, v, m, D, E, F, G, e, w, h, x) {
        return p([r, s, t, u, v], {
            declaredClass: "esri.dijit.analysis.Analysis",
            templateString: x,
            basePath: n.toUrl("."),
            widgetsInTemplate: !0,
            i18n: null,
            helpFileName: "Analysis",
            constructor: function(b, a) {
                this._pbConnects = []
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                this.i18n = {};
                d.mixin(this.i18n, h.common);
                d.mixin(this.i18n, h.tocPanel);
                d.mixin(this.i18n, h.analysisTools)
            },
            startup: function() {
                this.inherited(arguments);
                this._titlePanes = [this._summarizeTools,
                    this._locationTools, this._geoenrichTools, this._analyzePatTools, this._proximityTools, this._managedataTools
                ];
                f.forEach(this._titlePanes, function(b) {
                    q.set(b.titleNode, "innerHTML", "\x3cspan class\x3d'esriFloatTrailing helpIcon' esriHelpTopic\x3d'" + (b.get("data-esrihelptopic") ? b.get("data-esrihelptopic") : b.get("data-esriHelpTopic")) + "' data-dojo-attach-point\x3d'_helpIconNode'\x3e\x3c/span\x3e" + b.titleNode.innerHTML)
                }, this);
                this.set("summarizeTools");
                this.set("locationTools");
                this.set("geoenrichTools");
                this.set("analyzePatterns");
                this.set("proximityTools");
                this.set("manageDataTools");
                this._leftAccordion.startup();
                f.forEach(this._titlePanes, function(b) {
                    b.startup()
                });
                w.initHelpLinks(this.domNode)
            },
            destroy: function() {
                this.inherited(arguments);
                f.forEach(this._pbConnects, k.disconnect);
                delete this._pbConnects
            },
            _connect: function(b, a, c) {
                this._pbConnects.push(k.connect(b, a, c))
            },
            _setSummarizeToolsAttr: function() {
                var b = c.create("div"),
                    a = new e({
                        name: this.i18n.aggregatePoints,
                        helpTopic: "AggregatePointsTool",
                        toolIcon: "aggregateIcon"
                    }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.summarizeNearby,
                    helpTopic: "SummarizeNearbyTool",
                    toolIcon: "sumNearbyIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.summarizeWithin,
                    helpTopic: "SummarizeWithinTool",
                    toolIcon: "sumWithinIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                this._summarizeTools.set("content", b)
            },
            _setLocationToolsAttr: function() {
                var b = c.create("div"),
                    a = new e({
                        name: this.i18n.findExistingLocations,
                        helpTopic: "FindExistingLocationsTool",
                        toolIcon: "findLocationsIcon"
                    }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                        name: this.i18n.deriveNewLocations,
                        helpTopic: "DeriveNewLocationsTool",
                        toolIcon: "findNewLocationsIcon"
                    },
                    c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.findSimilarLocations,
                    helpTopic: "FindSimilarLocationsTool",
                    toolIcon: "findSimilarLocationsIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                this._locationTools.set("content", b)
            },
            _setGeoenrichToolsAttr: function() {
                var b = c.create("div"),
                    a = new e({
                        name: this.i18n.enrichLayer,
                        helpTopic: "EnrichLayerTool",
                        toolIcon: "geoenrichLayerIcon"
                    }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                this._geoenrichTools.set("content", b)
            },
            _setProximityToolsAttr: function() {
                var b = c.create("div"),
                    a = new e({
                        name: this.i18n.createBuffers,
                        helpTopic: "CreateBuffersTool",
                        toolIcon: "buffersIcon"
                    }, c.create("div", null, b));
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a.set("showComingSoonLabel", !1);
                a = new e({
                    name: this.i18n.createDriveTimeAreas,
                    helpTopic: "CreateDriveTimeAreasTool",
                    toolIcon: "driveIcon"
                }, c.create("div", null, b));
                g.set(a.optionsDiv, "margin-top", "0");
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.findNearest,
                    helpTopic: "FindNearestTool",
                    toolIcon: "findClosestFacilityIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.planRoutes,
                    helpTopic: "PlanRoutesTool",
                    toolIcon: "planRoutesIcon"
                }, c.create("div", null,
                    b));
                g.set(a.optionsDiv, "margin-top", "0");
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                this._proximityTools.set("content", b)
            },
            _setAnalyzePatternsAttr: function() {
                var b, a;
                b = c.create("div");
                a = new e({
                    name: this.i18n.calculateDensity,
                    helpTopic: "CalculateDensityTool",
                    toolIcon: "createDensitySurfaceIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.findHotSpots,
                    helpTopic: "FindHotSpotsTool",
                    toolIcon: "findHotSpotsIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.interpolatePoints,
                    helpTopic: "InterpolatePointsTool",
                    toolIcon: "createInterpolatedSurfaceIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                this._analyzePatTools.set("content", b)
            },
            _setInterpolateToolsAttr: function() {
                var b;
                b = c.create("div");
                new e({
                    name: this.i18n.createInterpolatedSurface,
                    helpTopic: "SummarizeWithinTool",
                    toolIcon: "createInterpolatedSurfaceIcon"
                }, c.create("div", null, b));
                this._interpolateTools.set("content", b)
            },
            _setManageDataToolsAttr: function() {
                var b, a;
                b = c.create("div");
                a = new e({
                    name: this.i18n.dissolveBoundaries,
                    helpTopic: "DissolveBoundariesTool",
                    toolIcon: "dissolveBoundariesIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                        name: this.i18n.extractData,
                        helpTopic: "ExtractDataTool",
                        toolIcon: "extractDataIcon"
                    },
                    c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.mergeLayers,
                    helpTopic: "MergeLayersTool",
                    toolIcon: "mergeLayersIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect", d.hitch(this, "onToolSelect"));
                a = new e({
                    name: this.i18n.overlayLayers,
                    helpTopic: "OverlayLayersTool",
                    toolIcon: "overlayLayersIcon"
                }, c.create("div", null, b));
                a.set("showComingSoonLabel", !1);
                this._connect(a, "onToolSelect",
                    d.hitch(this, "onToolSelect"));
                this._managedataTools.set("content", b)
            },
            _getSelectedCategoryAttr: function() {
                return f.filter(this._titlePanes, function(b, a) {
                    return b.open
                })[0].get("data-esrihelptopic")
            },
            _getSelectedPaneAttr: function() {
                return f.filter(this._titlePanes, function(b, a) {
                    return b.open
                })[0]
            },
            _setSelectedCategoryAttr: function(b) {
                console.log("setting", b);
                var a;
                f.forEach(this._titlePanes, function(c) {
                    a = c.get("data-esrihelptopic");
                    a === b && c.set("open", !0)
                }, this)
            },
            hide: function(b) {
                var a = l("div[data-esrihelptopic \x3d'" +
                    b + "']");
                0 === a.length && (a = l("a[esrihelptopic \x3d'" + b + "']"));
                0 < a.length && a.forEach(function(a) {
                    a && m.getEnclosingWidget(a) && g.set(m.getEnclosingWidget(a).domNode, "display", "none")
                })
            },
            onToolSelect: function(b) {}
        })
    });