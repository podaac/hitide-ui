//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/event", "dojo/_base/kernel", "dojo/dom-attr", "dojo/string", "dojo/dom-style", "dojo/dom-class", "dojo/has", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/form/CheckBox", "dijit/form/RadioButton", "dijit/form/TimeTextBox", "dijit/form/Select", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "../../kernel", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/TrafficTime.html"],
    function(g, h, e, s, t, u, k, d, v, b, w, l, m, n, p, q, x, y, z, A, B, C, D, E, f, r) {
        return h([l, m, n, p, q], {
            declaredClass: "esri.dijit.analysis.TrafficTime",
            i18n: null,
            basePath: g.toUrl("."),
            templateString: r,
            widgetsInTemplate: !0,
            _liveOffset: 0,
            postMixInProperties: function() {
                this.i18n = {};
                e.mixin(this.i18n, f.common);
                e.mixin(this.i18n, f.driveTimes)
            },
            postCreate: function() {
                this.inherited(arguments);
                this._handleUseTrafficCheckChange(this._useTrafficCheck.get("value"))
            },
            _handleUseTrafficCheckChange: function(a) {
                this._typicalTrafficRadioBtn.set("disabled", !a);
                this._liveTrafficRadioBtn.set("disabled", !a);
                a ? this._handleLifeTrafficRadioChange(this._liveTrafficRadioBtn.get("value")) : (this._liveTimeSlider.set("disabled", !a), this._trafficTime.set("disabled", !a), this._trafficDay.set("disabled", !a));
                a ? (b.remove(this._liveTraficLabel, "esriAnalysisTextDisabled"), b.remove(this._typicalTraficLabel, "esriAnalysisTextDisabled"), b.remove(this._liveTimeRuleLabels, "esriAnalysisTextDisabled")) : (b.add(this._liveTraficLabel, "esriAnalysisTextDisabled"), b.add(this._typicalTraficLabel,
                    "esriAnalysisTextDisabled"), b.add(this._liveTimeRuleLabels, "esriAnalysisTextDisabled"))
            },
            _handleLifeTrafficRadioChange: function(a) {
                this._liveTimeSlider.set("disabled", !a);
                this._trafficTime.set("disabled", a);
                this._trafficDay.set("disabled", a)
            },
            _setDisabledAttr: function(a) {
                this._useTrafficCheck.set("disabled", a)
            },
            _setResetAttr: function(a) {
                a && this._useTrafficCheck.set("checked", !1)
            },
            _getCheckedAttr: function() {
                return this._useTrafficCheck.get("checked")
            },
            _setCheckedAttr: function(a) {
                this._useTrafficCheck.set("checked",
                    a)
            },
            _getTimeOfDayAttr: function() {
                var a;
                this._liveTrafficRadioBtn.get("value") ? a = (new Date).getTime() + 6E4 * this._liveOffset : (a = new Date(this._trafficDay.get("value")), a = a.getTime() - 6E4 * a.getTimezoneOffset() + this._trafficTime.get("value").getTime() - 6E4 * this._trafficTime.get("value").getTimezoneOffset());
                return a
            },
            _getTimeZoneForTimeOfDayAttr: function() {
                return this._liveTrafficRadioBtn.get("value") ? "UTC" : ""
            },
            _handleLiveTimeSliderChange: function(a) {
                var b, c;
                b = 60 * a;
                a = Math.floor(a);
                c = b - 60 * a;
                a = 0 === a && 0 ===
                    c ? this.i18n.liveTrafficLabel : 0 === a ? d.substitute(this.i18n.liveTimeMinutesLabel, {
                        minute: c
                    }) : 1 === a ? 0 === c ? this.i18n.liveSingularHourTimeLabel : d.substitute(this.i18n.liveSingularTimeLabel, {
                        minute: c
                    }) : 0 === c ? d.substitute(this.i18n.liveTimeHoursLabel, {
                        hour: a,
                        minute: c
                    }) : d.substitute(this.i18n.liveTimeLabel, {
                        hour: a,
                        minute: c
                    });
                this._liveOffset = b;
                k.set(this._liveTraficLabel, "innerHTML", a)
            }
        })
    });