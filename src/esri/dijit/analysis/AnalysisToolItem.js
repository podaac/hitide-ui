//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/event", "dojo/has", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "../../kernel", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/AnalysisToolItem.html"], function(f, g, d, r, h, s, b, k, c, l, m, n, p, t, e, q) {
    return g([l, m, n, p], {
        declaredClass: "esri.dijit.analysis.AnalysisToolItem",
        templateString: q,
        basePath: f.toUrl("."),
        widgetsInTemplate: !0,
        i18n: null,
        _helpIconNode: null,
        _toolIcon: null,
        _toolIconClass: null,
        _toolNameLabel: null,
        toolName: null,
        helpTopic: null,
        helpFileName: "Analysis",
        constructor: function(a, b) {
            a.toolIcon && (this._toolIconClass = a.toolIcon);
            a.name && (this.toolName = a.name, this.helpTopic = a.helpTopic)
        },
        postCreate: function() {
            this.inherited(arguments);
            this._toolNameLabel.innerHTML = this.toolName;
            b.add(this._toolIcon, this._toolIconClass);
            k.set(this._helpIconNode, "esriHelpTopic", this.helpTopic);
            this.set("showComingSoonLabel", !0)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            d.mixin(this.i18n, e.common);
            d.mixin(this.i18n, e.analysisTools)
        },
        _handleToolNameClick: function() {
            this.onToolSelect(this)
        },
        _handleToolIconClick: function(a) {
            h.stop(a);
            this.onToolSelect(this)
        },
        _setShowComingSoonLabelAttr: function(a) {
            c.set(this.optionsDiv, "display", !0 === a ? "block" : "none");
            b.toggle(this._toolCtr, "esriToolContainerDisabled", a);
            b.toggle(this._toolNameLabel, "esriTransparentNode", a);
            b.toggle(this._toolIcon, "esriTransparentNode", a);
            c.set(this._toolNameLabel, "cursor", !0 === a ? "default" :
                "pointer");
            c.set(this._toolCtr, "cursor", !0 === a ? "default" : "pointer")
        },
        onToolSelect: function(a) {}
    })
});