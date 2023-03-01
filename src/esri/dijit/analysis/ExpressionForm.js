//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/_base/event", "dojo/Evented", "dojo/fx/easing", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "dijit/Tooltip", "../../kernel", "../../lang", "./utils", "../SingleFilter", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/ExpressionForm.html"],
    function(p, q, d, f, k, C, l, D, E, r, b, s, t, F, G, m, u, n, v, w, x, y, z, H, I, J, K, L, M, N, O, P, Q, R, S, g, T, A, h, B) {
        return q([v, w, x, y, z, u], {
            declaredClass: "esri.dijit.analysis.ExpressionForm",
            templateString: B,
            basePath: p.toUrl("."),
            widgetsInTemplate: !0,
            firstOperands: null,
            defaultUnits: "english",
            showFirstRow: !0,
            constructor: function(a) {
                a.containerNode && (this.container = a.containerNode);
                this._setClasses(a)
            },
            _setClasses: function(a) {
                this._addBtnClass = a.primaryActionButttonClass || "esriAnalysisSubmitButton"
            },
            destroy: function() {
                this.inherited(arguments);
                f.forEach(this._pbConnects, k.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                this.i18n = {};
                d.mixin(this.i18n, h.common);
                d.mixin(this.i18n, h.expressionGrid);
                d.mixin(this.i18n, h.expressionForm)
            },
            postCreate: function() {
                this.inherited(arguments);
                this.attributeChangeHandler = k.subscribe("filter-expression-change", d.hitch(this, this._handleAttributeFilterChange));
                this._distanceInput.set("validator", d.hitch(this, this._validateDistance));
                this.set("action", "add");
                b.set(this._firstRow,
                    "display", this.showFirstRow ? "" : "none")
            },
            init: function() {
                if (this._firstOperandSelect && this.firstOperands && this.inputOperands) {
                    this._firstOperandSelect.getOptions() && this._firstOperandSelect.removeOption(this._firstOperandSelect.getOptions());
                    var a, c, b = this.inputOperands.length,
                        e = this.firstOperands.length,
                        d = [];
                    for (a = 0; a < b; a += 1)
                        for (c = 0; c < e; c += 1) g.isDefined(this.inputOperands[a].id) && g.isDefined(this.firstOperands[c].id) && this.inputOperands[a].id === this.firstOperands[c].id ? d[this.firstOperands[c].id] =
                            a.toString() : g.isDefined(this.inputOperands[a].name) && (g.isDefined(this.firstOperands[c].name) && this.inputOperands[a].name === this.firstOperands[c].name) && (d[this.firstOperands[c].name] = a.toString());
                    f.forEach(this.firstOperands, function(a, c) {
                        this._firstOperandSelect.addOption({
                            value: d[a.id || a.name],
                            label: a.name
                        })
                    }, this);
                    this.selectedFirstOperand && this._firstOperandSelect.set("value", d[this.selectedFirstOperand.id]);
                    1 === b && (this._operatorSelect && this._operatorSelect.getOptions()) && (this._operatorSelect.removeOption(this._operatorSelect.getOptions()),
                        this._operatorSelect.addOption({
                            value: "where",
                            label: this.i18n.where
                        }))
                }
                "add" === this.get("action") && (this._operatorSelect.set("value", "where"), this._handleOperatorChange("where"), this._distanceInput.set("value", ""), "metric" === this.defaultUnits ? this._distanceUnitsSelect.set("value", "Kilometers") : this._distanceUnitsSelect.set("value", "Miles"))
            },
            startup: function() {},
            clear: function() {
                this.init()
            },
            _validateDistance: function(a) {
                var c = this._operatorSelect.get("value");
                return -1 === f.indexOf(["withinDistance",
                    "notWithinDistance"
                ], c) ? !0 : a && 0 < parseFloat(a, 10) && Infinity > parseFloat(a, 10)
            },
            _handleAttributeFilterChange: function() {
                var a;
                this._attributeFilter && (a = this._attributeFilter.toJson(), a = this._attributeFilter.builtSingleFilterString(a), a.whereClause ? this._addBtn.set("disabled", !1) : this._addBtn.set("disabled", !0))
            },
            _handleDistanceInputChange: function(a) {
                this._addBtn.set("disabled", !this._distanceInput.validate())
            },
            _handleOperatorChange: function(a) {
                a = this._operatorSelect.get("value"); - 1 === f.indexOf(["where",
                    "withinDistance", "notWithinDistance"
                ], a) ? this._buildSpatialExpression(a) : "where" === a ? (parseInt(this._firstOperandSelect.get("value"), 10), this._buildAttributeExpression(a)) : -1 !== f.indexOf(["withinDistance", "notWithinDistance"], a) && this._buildDistanceExpression(a)
            },
            _isValidSecondOperand: function(a, c, b) {
                var e = !1;
                "contains" === a || "notContains" === a ? ("esriGeometryPoint" === c || "esriGeometryMultipoint" === c) && ("esriGeometryPoint" === b || "esriGeometryMultipoint" === b) ? e = !0 : "esriGeometryPolyline" === c && ("esriGeometryPoint" ===
                    b || "esriGeometryPolyline" === b || "esriGeometryMultipoint" === b) ? e = !0 : "esriGeometryPolygon" === c && (e = !0) : "within" === a || "notWithin" === a ? "esriGeometryPoint" === c || "esriGeometryMultipoint" === c ? e = !0 : "esriGeometryPolyline" === c && ("esriGeometryPolygon" === b || "esriGeometryPolyline" === b) ? e = !0 : "esriGeometryPolygon" === c && "esriGeometryPolygon" === b && (e = !0) : e = !0;
                return e
            },
            _isValidFirstOperand: function(a) {
                var c = !0;
                a.fields ? a.fields && (1 === a.fields.length && "esriFieldTypeOID" === a.fields[0].type) && (this._showMessages(r.substitute(this.i18n.inValidAttributeFilterMessage, {
                    layername: a.name
                })), c = !1) : c = !1;
                return c
            },
            _buildSpatialExpression: function(a) {
                var c, d;
                c = parseInt(this._firstOperandSelect.get("value"), 10);
                d = this.inputOperands[c].geometryType;
                this._addBtn.set("disabled", !1);
                this._distanceInput.set("required", !1);
                b.set(this._attrFilterDiv, "display", "none");
                b.set(this._secondOperandSelect.domNode, "display", "");
                this._secondOperandSelect && (this._secondOperandSelect.getOptions() && this._secondOperandSelect.removeOption(this._secondOperandSelect.getOptions()), f.forEach(this.inputOperands,
                    function(c, b) {
                        b.toString() !== this._firstOperandSelect.get("value") && this._isValidSecondOperand(a, d, c.geometryType) && this._secondOperandSelect.addOption({
                            value: b.toString(),
                            label: c.name
                        })
                    }, this), b.set(this._secondRow, "display", ""), b.set(this._secondExpressionDiv, "display", "none"), b.set(this._secondOperandTd, "display", ""), b.set(this._secondOperandSelect, {
                    display: "",
                    width: "75%"
                }))
            },
            _buildAttributeExpression: function(a) {
                this._distanceInput.set("required", !1);
                b.set(this._secondExpressionDiv, "display",
                    "none");
                this._secondOperandSelect && this._secondOperandSelect.getOptions() && this._secondOperandSelect.removeOption(this._secondOperandSelect.getOptions());
                b.set(this._secondOperandSelect.domNode, "display", "none");
                a = parseInt(this._firstOperandSelect.get("value"), 10);
                a = this.inputOperands[a];
                this._isValidFirstOperand(a) ? (this._addBtn.set("disabled", !0), b.set(this._secondRow, "display", ""), b.set(this._attrFilterDiv, "display", ""), this._attributeFilter && this._attributeFilter.init({
                    mapLayer: a,
                    version: a.version,
                    fields: a.fields,
                    allowAllDateTypes: !0,
                    part: "edit" === this.get("action") && this.expression && this.expression._attributeExprObj ? this.expression._attributeExprObj : null
                }), this._attributeFilter || (this._attributeFilter = new A({
                        "class": "filterSegment",
                        mapLayer: a,
                        version: a.version,
                        fields: a.fields,
                        part: "edit" === this.get("action") && this.expression && this.expression._attributeExprObj ? this.expression._attributeExprObj : null,
                        enableEvents: !0,
                        isEnableInteractiveFilter: !1,
                        allowAllDateTypes: !0
                    }, t.create("div", {}, this._attrFilterDiv)),
                    this._attributeFilter.fillFieldsList(this._attributeFilter.fieldsStore))) : (b.set(this._secondRow, "display", "none"), b.set(this._attrFilterDiv, "display", "none"), this._addBtn.set("disabled", !0))
            },
            _buildDistanceExpression: function(a) {
                this._addBtn.set("disabled", !this._distanceInput.validate());
                this._distanceInput.set("required", !0);
                b.set(this._secondRow, "display", "");
                b.set(this._secondOperandTd, "display", "");
                b.set(this._secondOperandSelect.domNode, "display", "");
                b.set(this._secondExpressionDiv, {
                    display: "",
                    width: "75%"
                });
                b.set(this._secondOperandSelect, {
                    display: "",
                    width: "75%"
                });
                b.set(this._attrFilterDiv, "display", "none");
                this._secondOperandSelect && this._secondOperandSelect.getOptions() && (this._secondOperandSelect.removeOption(this._secondOperandSelect.getOptions()), f.forEach(this.inputOperands, function(a, b) {
                    b.toString() !== this._firstOperandSelect.get("value") && this._secondOperandSelect.addOption({
                        value: b.toString(),
                        label: a.name
                    })
                }, this))
            },
            _handleAddButtonClick: function(a) {
                m.stop(a);
                this._expressionForm &&
                    !this._expressionForm.validate() ? this.emit("cancel-expression", {}) : (this.set("expression"), this.emit("add-expression", {
                        expression: this.get("expression"),
                        text: this.get("text"),
                        displayText: this.get("displayText"),
                        action: this.get("action")
                    }))
            },
            _handleCloseButtonClick: function(a) {
                m.stop(a);
                this.emit("cancel-expression", {})
            },
            _setInputOperandsAttr: function(a) {
                this.inputOperands = a
            },
            _getInputOperandsAttr: function() {
                return this.inputOperands
            },
            _setFirstOperandsAttr: function(a) {
                this.firstOperands = a
            },
            _getFirstOperandsAttr: function(a) {
                return this.firstOperands
            },
            _setSelectedFirstOperandAttr: function(a) {
                this.selectedFirstOperand = a
            },
            _getExpressionAttr: function(a) {
                return this.expression
            },
            _setExpressionAttr: function(a) {
                var c, b, d = !1;
                a ? this._operatorSelect && (this._firstOperandSelect.set("value", a.layer), this._operatorSelect.set("value", a.spatialRel ? a.spatialRel : "where"), "where" === this._operatorSelect.get("value") ? d = !0 : (-1 !== f.indexOf(["withinDistance", "notWithinDistance"], this._operatorSelect.get("value")) && (this._distanceInput.set("value", a.distance), this._distanceUnitsSelect.set("value",
                    a.units)), this._secondOperandSelect.set("value", a.selectingLayer))) : (a = {}, this._operatorSelect && (a.layer = parseInt(this._firstOperandSelect.get("value"), 10), "where" === this._operatorSelect.get("value") ? (c = this._attributeFilter.toJson(), b = this._attributeFilter.builtSingleFilterString(c), a._attributeFilter = b, a._attributeExprObj = c, a._attributeText = this._attributeFilter.buildFriendlyTextExpr(c), a.where = b.whereClause) : (a.selectingLayer = parseInt(this._secondOperandSelect.get("value"), 10), a.spatialRel = this._operatorSelect.get("value"), -1 !== f.indexOf(["withinDistance", "notWithinDistance"], this._operatorSelect.get("value")) && (a.distance = this._distanceInput.get("value"), a.units = this._distanceUnitsSelect.get("value")))));
                this.expression = a;
                d && this._handleOperatorChange("where")
            },
            _showMessages: function(a) {
                s.set(this._bodyNode, "innerHTML", a);
                l.fadeIn({
                    node: this._errorMessagePane,
                    easing: n.quadIn,
                    onEnd: d.hitch(this, function() {
                        b.set(this._errorMessagePane, {
                            display: ""
                        })
                    })
                }).play()
            },
            _handleCloseMsg: function(a) {
                a && a.preventDefault();
                l.fadeOut({
                    node: this._errorMessagePane,
                    easing: n.quadOut,
                    onEnd: d.hitch(this, function() {
                        b.set(this._errorMessagePane, {
                            display: "none"
                        })
                    })
                }).play()
            },
            _setActionAttr: function(a) {
                this.action = a
            },
            _getActionAttr: function() {
                return this.action
            },
            _setTextAttr: function(a) {
                this.text = a
            },
            _getTextAttr: function() {
                var a = "";
                this.expression && (a = this.inputOperands[this.expression.layer].name);
                this.expression.spatialRel ? (a += " " + this.i18n[this.expression.spatialRel], this.expression.distance && (a += " " + this.expression.distance + " " + this.expression.units + " " + this.i18n.from),
                    a += " " + this.inputOperands[this.expression.selectingLayer].name) : a += " " + this.i18n.whereLabel + " " + this.expression._attributeText;
                return a
            },
            _getDisplayTextAttr: function() {
                var a = "",
                    b;
                this.expression && (b = this.inputOperands[this.expression.layer].name, a += this.shortenString(b));
                this.expression.spatialRel ? (a += " \x3clabel style\x3d'font-style: italic;'\x3e" + this.i18n[this.expression.spatialRel], this.expression.distance && (a += " " + this.expression.distance + " " + this.expression.units + " " + this.i18n.from), b = this.inputOperands[this.expression.selectingLayer].name,
                    a = a + "\x3c/label\x3e" + (" " + this.shortenString(b))) : a += " \x3clabel style\x3d'font-style: italic;'\x3e" + this.i18n.whereLabel + " " + this.expression._attributeText + "\x3c/label";
                return a += "\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e"
            },
            shortenString: function(a) {
                return "\x3clabel style\x3d'overflow: hidden;text-overflow: ellipsis'\x3e" + a + "\x3c/label\x3e\x3c/td\x3e"
            },
            _setPrimaryActionButttonClassAttr: function(a) {
                this.primaryActionButttonClass = a
            },
            _getPrimaryActionButttonClassAttr: function() {
                return this.primaryActionButttonClass
            },
            _setShowFirstRowAttr: function(a) {
                this.showFirstRow = a
            },
            _getShowFirstRowAttr: function() {
                return this.showFirstRow
            }
        })
    });