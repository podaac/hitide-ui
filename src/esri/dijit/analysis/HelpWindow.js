//>>built
define(["require", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/event", "dojo/_base/kernel", "dojo/aspect", "dojo/has", "dojo/dom-construct", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style", "dojo/query", "dijit/_Widget", "dijit/TooltipDialog", "dijit/popup", "../../kernel", "../../lang", "../../request", "../_EventedWidget", "dojo/i18n!../../nls/jsapi"], function(p, l, q, e, w, x, d, r, y, z, A, B, C, s, t, u, g, D, m, v, E, n) {
    return q([t], {
        declaredClass: "esri.dijit.analysis.HelpWindow",
        i18n: null,
        basePath: p.toUrl("."),
        onlineHelpMap: null,
        showLearnMore: !1,
        "class": "esriAnalyisHelpWindow",
        postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            e.mixin(this.i18n, n.common);
            e.mixin(this.i18n, n.analysisHelp)
        },
        postCreate: function() {
            this.inherited(arguments);
            var a = ["ar", "he"],
                b, c;
            this.onlineHelpMap = {};
            for (b = 0; b < a.length; b += 1) c = a[b], d.locale && -1 !== d.locale.indexOf(c) && (-1 !== d.locale.indexOf("-") ? -1 !== d.locale.indexOf(c + "-") && (this._isRightToLeft = !0) : this._isRightToLeft = !0);
            a = this._getAbsoluteUrl(this.basePath) +
                "/help/helpmap.json";
            console.log(a);
            v({
                url: a
            }).then(e.hitch(this, function(a) {
                this.onlineHelpMap = a.map
            }))
        },
        _getAbsoluteUrl: function(a) {
            if (/^https?\:/i.test(a)) return a;
            if (/^\/\//i.test(a)) return window.location.protocol + a;
            if (/^\//i.test(a)) return window.location.protocol + "//" + window.location.host + a
        },
        _computeSize: function(a) {
            var b = {
                w: 400,
                h: 200
            }; - 1 !== a.indexOf("Category") ? (b.w = 400, b.h = 320) : -1 !== a.indexOf("Tool") ? (b.w = 400, b.h = 320) : -1 !== a.indexOf("toolDescription") && (b.w = 400, b.h = 520);
            return b
        },
        _setHelpTopicAttr: function(a) {
            this.tooltipHelpDlg &&
                (g.close(this.tooltipHelpDlg), this.tooltipHelpDlg.destroy(), this.tooltipHelpDlg = null);
            var b, c, f, h, k;
            this.showLearnMore = !1;
            k = this._analysisGpServer && -1 !== this._analysisGpServer.indexOf("dev") ? "dev" : this._analysisGpServer && -1 !== this._analysisGpServer.indexOf("qa") ? "uat" : "";
            b = e.clone(d.locale);
            "nb" === b && (b = "no");
            c = d.baseUrl.substring(0, d.baseUrl.indexOf("/js/"));
            f = c + "/js/esri/dijit/analysis/help/" + this.helpFileName + ".html";
            m.isDefined(this.onlineHelpMap[this.helpFileName]) && m.isDefined(this.onlineHelpMap[this.helpFileName][a]) &&
                (this.showLearnMore = !0, h = "http://doc" + k + ".arcgis.com/en/arcgis-online/use-maps/" + this.onlineHelpMap[this.helpFileName][a]); - 1 !== l.indexOf("ar cs da de es et fi fr it ja ko lt lv ru nl no pl pt-br pt-pt ro sv th tr zh-cn".split(" "), b) && (-1 !== b.indexOf("-") && (f = b.split("-"), b = f[0] + "-" + f[1].toUpperCase()), f = c + "/js/esri/dijit/analysis/help/" + b + "/" + this.helpFileName + ".html"); - 1 !== l.indexOf("ar da de es fr it ja ko ru nl no pl pt-br pt-pt ro sv zh-cn".split(" "), b) && this.showLearnMore && (h = "http://doc" +
                k + ".arcgis.com/" + b + "/arcgis-online/use-maps/" + this.onlineHelpMap[this.helpFileName][a]);
            c = this._computeSize(a);
            this.tooltipHelpDlg = new u({
                preload: !0,
                content: "\x3cdiv class\x3d'' style\x3d'position\x3drelative'\x3cdiv class\x3d'sizer content'\x3e\x3cdiv class\x3d'contentPane'\x3e\x3cdiv class\x3d'esriFloatTrailing' style\x3d'padding:0;'\x3e\x3ca href\x3d'#' class\x3d'esriAnalysisCloseIcon' title\x3d'" + this.i18n.close + "'\x3e\x3c/a\x3e\x3c/div\x3e\x3ciframe frameborder\x3d'0'  id\x3d'" + a + "' src\x3d'" +
                    f + "#" + a + "' width\x3d'" + c.w + "' height\x3d'" + c.h + "' marginheight\x3d'0' marginwidth\x3d'0'\x3e\x3c/iframe\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'sizer'\x3e\x3cdiv class\x3d'actionsPane'\x3e\x3cdiv class\x3d'actionList" + (this.showLearnMore ? "'\x3e" : " hidden'\x3e") + "\x3ca class\x3d'action zoomTo' href\x3d'" + (this.showLearnMore ? h : "#") + "' target\x3d'_help'\x3e" + this.i18n.learnMore + "\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
                "class": "esriHelpPopup esriHelpPopupWrapper esriAnalyisHelpWindow"
            })
        },
        show: function(a, b) {
            this.helpFileName = b.helpFileName;
            this._analysisGpServer = b.analysisGpServer;
            this.set("helpTopic", b.helpId);
            r.after(g, "open", e.hitch(this, function() {
                s(".esriAnalysisCloseIcon", this.tooltipHelpDlg.domNode).on("click", e.hitch(this, this.close))
            }));
            g.open({
                popup: this.tooltipHelpDlg,
                x: !0 === this._isRightToLeft ? a.pageX - 40 : a.pageX + 40,
                y: a.screenY - a.pageY + 10,
                onExecute: function() {
                    g.close(this.tooltipHelpDlg)
                }
            })
        },
        close: function(a, b) {
            g.close(this.tooltipHelpDlg)
        }
    })
});