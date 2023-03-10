//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/number", "dojo/dom", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/_base/event", "dojo/Evented", "dojo/data/ItemFileWriteStore", "dojo/date/locale", "dojo/parser", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/TextBox", "dijit/form/FilteringSelect", "dijit/form/RadioButton", "dijit/form/DateTextBox", "dijit/form/NumberTextBox", "../kernel", "../lang", "../tasks/GenerateRendererTask", "../tasks/UniqueValueDefinition", "../tasks/GenerateRendererParameters", "../layers/FeatureLayer", "../layers/GeoRSSLayer", "dojo/i18n!../nls/jsapi", "dojo/text!./templates/SingleFilter.html"],
    function(S, C, n, q, h, T, U, V, D, v, k, s, W, l, y, X, Y, E, t, u, F, G, H, I, J, K, f, L, w, Z, z, A, B, r, x, M, N, O, P, Q, R) {
        return C([G, H, I, J, K, E], {
            declaredClass: "esri.dijit.SingleFilter",
            widgetsInTemplate: !0,
            templateString: R,
            valueHandlers: [],
            onFieldChangeEnabled: !0,
            onOperatorChangeEnabled: !0,
            onPromptChangeHandler: null,
            onHintChangeHandler: null,
            fieldDomains: {},
            fieldsStore: null,
            fieldsInfo: {
                stringFieldsCount: 0,
                numberFieldsCount: 0,
                dateFieldsCount: 0
            },
            stringOperatorStore: null,
            dateOperatorStore: null,
            numberOperatorStore: null,
            uniqueValuesStore: null,
            isEnableInteractiveFilter: !0,
            uniqueValuesResults: {},
            partsObj: null,
            dayInMS: 86399E3,
            allowAllDateTypes: !1,
            postMixInProperties: function() {
                this.inherited(arguments);
                this.i18n = {};
                this.i18n = n.mixin(this.i18n, Q.filterDlg)
            },
            parseExpressionTemplate: function() {
                var a = function(a, g) {
                        k.byId(g).className = "attributeValueContainer";
                        "field_dropdown" === a ? k.byId(g).innerHTML = b : "operator_dropdown" === a ? k.byId(g).innerHTML = c : "values_input" === a ? k.byId(g).innerHTML = d + e : console.error("problem with expressionTemplate from localization file")
                    },
                    b = '\x3cselect id\x3d"' + this.id + '.fieldsList" class\x3d"attributeField" data-dojo-type\x3d"dijit/form/FilteringSelect" maxHeight\x3d"150" sortByLabel\x3d"true"\x3e\x3c/select\x3e',
                    c = '\x3cselect id\x3d"' + this.id + '.operatorList" class\x3d"operator" data-dojo-type\x3d"dijit/form/FilteringSelect" maxHeight\x3d"150" sortByLabel\x3d"false"\x3e\x3c/select\x3e',
                    d = '\x3cdiv id\x3d"' + this.id + '.attributeValueContainer"\x3e\x3c/div\x3e',
                    e = '\x3cdiv class\x3d"attributeValueOptions"\x3e\x3ctable cellpadding\x3d"0" cellspacing\x3d"0"\x3e  \x3ctbody\x3e    \x3ctr\x3e      \x3ctd nowrap\x3d"nowrap"\x3e        \x3cinput id\x3d"' +
                    this.id + '.radioValue" class\x3d"radioValue attributeValueRadio" checked\x3d"checked" name\x3d"' + this.id + '.inputOption" data-dojo-type\x3d"dijit/form/RadioButton" title\x3d"' + this.i18n.valueTooltip + '"/\x3e        \x3clabel class\x3d"labels" title\x3d"' + this.i18n.valueTooltip + '"\x3e' + this.i18n.value + '        \x3c/label\x3e      \x3c/td\x3e      \x3ctd nowrap\x3d"nowrap" class\x3d"esriLeadingPadding05"\x3e        \x3cinput id\x3d"' + this.id + '.radioFields" class\x3d"radioFields attributeValueRadio" name\x3d"' +
                    this.id + '.inputOption" data-dojo-type\x3d"dijit/form/RadioButton" title\x3d"' + this.i18n.fieldTooltip + '"/\x3e        \x3clabel class\x3d"labels" title\x3d"' + this.i18n.fieldTooltip + '"\x3e' + this.i18n.field + '        \x3c/label\x3e      \x3c/td\x3e      \x3ctd id\x3d"' + this.id + '.radioUniqueColumn" nowrap\x3d"nowrap" class\x3d"esriLeadingPadding05"\x3e        \x3cinput id\x3d"' + this.id + '.radioUnique" class\x3d"radioUnique attributeValueRadio" name\x3d"' + this.id + '.inputOption" data-dojo-type\x3d"dijit/form/RadioButton" title\x3d"' +
                    this.i18n.uniqueValueTooltip + '"/\x3e        \x3clabel class\x3d"labels" title\x3d"' + this.i18n.uniqueValueTooltip + '"\x3e' + this.i18n.uniqueValues + "        \x3c/label\x3e      \x3c/td\x3e    \x3c/tr\x3e  \x3c/tbody\x3e\x3c/table\x3e\x3c/div\x3e",
                    p = this.i18n.expressionTemplate,
                    g = p.indexOf("${"),
                    m = p.substring(0, g).trim();
                k.byId(this.id + ".column1").innerHTML = m.length ? "\x3cdiv class\x3d'attributeText'\x3e" + m + "\x3c/div\x3e" : "";
                var m = p.indexOf("}", g + 1),
                    f = p.substring(g + 2, m);
                a(f, this.id + ".column2");
                g = p.indexOf("${",
                    g + 1);
                m = p.substring(m + 1, g).trim();
                k.byId(this.id + ".column3").innerHTML = m.length ? "\x3cdiv class\x3d'attributeText'\x3e" + m + "\x3c/div\x3e" : "";
                m = p.indexOf("}", g + 1);
                f = p.substring(g + 2, m);
                a(f, this.id + ".column4");
                g = p.indexOf("${", g + 1);
                m = p.substring(m + 1, g).trim();
                k.byId(this.id + ".column5").innerHTML = m.length ? "\x3cdiv class\x3d'attributeText'\x3e" + m + "\x3c/div\x3e" : "";
                m = p.indexOf("}", g + 1);
                f = p.substring(g + 2, m);
                a(f, this.id + ".column6");
                m = p.substring(m + 1, p.length).trim();
                k.byId(this.id + ".column7").innerHTML = m.length ?
                    "\x3cdiv class\x3d'attributeText'\x3e" + m + "\x3c/div\x3e" : ""
            },
            postCreate: function() {
                this.inherited(arguments);
                this.parseExpressionTemplate();
                this.createOperatorStores();
                this.createFieldsStore(this.fields);
                this.readCodedValues();
                F.parse(k.byId(this.id + ".exprTable")).then(n.hitch(this, function(a) {
                    h.connect(this.getFieldsList(), "onChange", this, "onChangeField");
                    h.connect(this.getOperatorList(), "onChange", this, "onChangeOperator");
                    h.connect(f.byId(this.id + ".radioValue"), "onClick", this, "showValueInput");
                    h.connect(f.byId(this.id +
                        ".radioFields"), "onClick", this, "showFields");
                    h.connect(f.byId(this.id + ".radioUnique"), "onClick", this, "showUniqueList");
                    this.version && 10.1 > this.version && s.set(k.byId(this.id + ".radioUniqueColumn"), "display", "none");
                    h.connect(k.byId(this.id + ".deleteExpression"), "onclick", this, "onClickDeleteExpression");
                    h.connect(this.interactiveCheck, "onclick", this, "onInteractiveClick");
                    h.connect(this.interactiveArrow, "onclick", this, "onClickShowHideInteractive");
                    this.enableInteractiveHandlers();
                    this.isEnableInteractiveFilter ||
                        s.set(this._interactiveFilterRow, "display", "none")
                }))
            },
            constructor: function(a, b) {
                this.id = a.id || "";
                this.owner = a.owner;
                this.version = a.version;
                this.part = a.part;
                this.fields = a.fields;
                this.mapLayer = a.mapLayer;
                !1 === a.enableEvents && (this.onOperatorChangeEnabled = this.onFieldChangeEnabled = !1)
            },
            init: function(a) {
                a.part || (this.clearAttributeValueDijits(), this.mapLayer = a.mapLayer, this.version = a.version, this.fields = a.fields, this.createOperatorStores(), this.createFieldsStore(this.fields), this.readCodedValues(), this.fillFieldsList(this.fieldsStore),
                    this.onChangeField());
                a.part && (this.part = a.part, this.buildEditUIField(this.part, this))
            },
            destroy: function() {
                this.clearAttributeValueDijits();
                q.forEach(f.findWidgets(k.byId(this.id)), function(a) {
                    a.destroyRecursive()
                });
                this.inherited(arguments)
            },
            toJson: function() {
                var a = null;
                this.isInteractiveChecked() && (a = {
                    prompt: this.promptText.attr("value"),
                    hint: this.hintText.attr("value")
                });
                return {
                    fieldObj: this.getField(),
                    operator: this.getOperator(),
                    valueObj: this.getValue(),
                    interactiveObj: a
                }
            },
            buildFriendlyTextExpr: function(a) {
                var b =
                    this.i18n.expressionTemplate,
                    c = function(a, c, d) {
                        return D.substitute(b, {
                            field_dropdown: a,
                            operator_dropdown: c,
                            values_input: d
                        })
                    };
                if (!1 === a.valueObj.isValid) return "\x26lt;expression is missing value\x26gt;";
                var d = "";
                if ("string" === a.fieldObj.shortType) a.operator === this.i18n.stringOperatorIsBlank || a.operator === this.i18n.stringOperatorIsNotBlank ? d = c(a.fieldObj.label, a.operator, "") : "field" === a.valueObj.type ? d = c(a.fieldObj.label, a.operator, a.valueObj.label) : (d = this.getDecodedValue(a.interactiveObj ? a.interactiveObj.value :
                    a.valueObj.value, a.fieldObj.name), d = c(a.fieldObj.label, a.operator, "'" + d + "'"));
                else if ("number" === a.fieldObj.shortType)
                    if (a.operator === this.i18n.numberOperatorIsBetween || a.operator === this.i18n.numberOperatorIsNotBetween) d = a.interactiveObj ? a.interactiveObj.value2 : a.valueObj.value2, d = c(a.fieldObj.label, a.operator, v.format(a.interactiveObj ? a.interactiveObj.value1 : a.valueObj.value1, {
                        pattern: "#####0.##########"
                    }) + " " + this.i18n.andBetweenValues + " " + v.format(d, {
                        pattern: "#####0.##########"
                    }));
                    else if (a.operator ===
                    this.i18n.numberOperatorIsBlank || a.operator === this.i18n.numberOperatorIsNotBlank) d = c(a.fieldObj.label, a.operator, "");
                else if ("field" === a.valueObj.type) d = c(a.fieldObj.label, a.operator, a.valueObj.label);
                else var d = a.interactiveObj ? a.interactiveObj.value : a.valueObj.value,
                    e = this.getDecodedValue(d, a.fieldObj.name),
                    d = c(a.fieldObj.label, a.operator, d !== e ? "'" + e + "'" : v.format(d, {
                        pattern: "#####0.##########"
                    }));
                else r.isDefined(a.valueObj.value) && ("field" !== a.valueObj.type && "string" === typeof a.valueObj.value) &&
                    (a.valueObj.value = new Date(a.valueObj.value)), d = a.operator === this.i18n.dateOperatorIsBetween || a.operator === this.i18n.dateOperatorIsNotBetween ? c(a.fieldObj.label, a.operator, (a.interactiveObj ? this.formatFriendlyDate(a.interactiveObj.value1) : this.formatFriendlyDate(a.valueObj.value1)) + " " + this.i18n.andBetweenValues + " " + (a.interactiveObj ? this.formatFriendlyDate(a.interactiveObj.value2) : this.formatFriendlyDate(this.addDay(a.valueObj.value2)))) : a.operator === this.i18n.dateOperatorIsBlank || a.operator === this.i18n.dateOperatorIsNotBlank ?
                    c(a.fieldObj.label, a.operator, "") : "field" === a.valueObj.type ? c(a.fieldObj.label, a.operator, a.valueObj.label) : c(a.fieldObj.label, a.operator, a.interactiveObj ? this.formatFriendlyDate(a.interactiveObj.value) : this.formatFriendlyDate(a.valueObj.value));
                return d
            },
            builtSingleFilterString: function(a, b) {
                if (r.isDefined(a.valueObj.isValid) && !a.valueObj.isValid) return {
                    whereClause: null
                };
                var c = a.valueObj.value,
                    d = a.valueObj.value1,
                    e = a.valueObj.value2,
                    f = !1;
                if (a.interactiveObj) {
                    if (!a.interactiveObj.prompt || !a.interactiveObj.hint) return {
                        whereClause: null
                    };
                    r.isDefined(b) && (f = !0, r.isDefined(a.valueObj.value) && (c = "{" + b + "}"), r.isDefined(a.valueObj.value1) && (d = "{" + b + "}"), r.isDefined(a.valueObj.value2) && (e = "{" + (b + 1) + "}"))
                }
                var g = "";
                if ("string" === a.fieldObj.shortType) switch (d = "", c && "field" !== a.valueObj.type && this.isHostedService(this.mapLayer.url) && this.containsNonLatinCharacter(c) && (d = "N"), a.operator) {
                        case this.i18n.stringOperatorIs:
                            g = "field" === a.valueObj.type ? a.fieldObj.name + " \x3d " + c : a.fieldObj.name + " \x3d " + d + "'" + c.replace(/\'/g, "''") + "'";
                            break;
                        case this.i18n.stringOperatorIsNot:
                            g =
                                "field" === a.valueObj.type ? a.fieldObj.name + " \x3c\x3e " + c : a.fieldObj.name + " \x3c\x3e " + d + "'" + c.replace(/\'/g, "''") + "'";
                            break;
                        case this.i18n.stringOperatorStartsWith:
                            g = a.fieldObj.name + " LIKE " + d + "'" + c.replace(/\'/g, "''") + "%'";
                            break;
                        case this.i18n.stringOperatorEndsWith:
                            g = a.fieldObj.name + " LIKE " + d + "'%" + c.replace(/\'/g, "''") + "'";
                            break;
                        case this.i18n.stringOperatorContains:
                            g = a.fieldObj.name + " LIKE " + d + "'%" + c.replace(/\'/g, "''") + "%'";
                            break;
                        case this.i18n.stringOperatorDoesNotContain:
                            g = a.fieldObj.name +
                                " NOT LIKE " + d + "'%" + c.replace(/\'/g, "''") + "%'";
                            break;
                        case this.i18n.stringOperatorIsBlank:
                            g = a.fieldObj.name + " IS NULL";
                            break;
                        case this.i18n.stringOperatorIsNotBlank:
                            g = a.fieldObj.name + " IS NOT NULL"
                    } else if ("number" === a.fieldObj.shortType) switch (a.operator) {
                        case this.i18n.numberOperatorIs:
                            g = a.fieldObj.name + " \x3d " + c;
                            break;
                        case this.i18n.numberOperatorIsNot:
                            g = a.fieldObj.name + " \x3c\x3e " + c;
                            break;
                        case this.i18n.numberOperatorIsAtLeast:
                            g = a.fieldObj.name + " \x3e\x3d " + c;
                            break;
                        case this.i18n.numberOperatorIsLessThan:
                            g =
                                a.fieldObj.name + " \x3c " + c;
                            break;
                        case this.i18n.numberOperatorIsAtMost:
                            g = a.fieldObj.name + " \x3c\x3d " + c;
                            break;
                        case this.i18n.numberOperatorIsGreaterThan:
                            g = a.fieldObj.name + " \x3e " + c;
                            break;
                        case this.i18n.numberOperatorIsBetween:
                            g = a.fieldObj.name + " BETWEEN " + d + " AND " + e;
                            break;
                        case this.i18n.numberOperatorIsNotBetween:
                            g = a.fieldObj.name + " NOT BETWEEN " + d + " AND " + e;
                            break;
                        case this.i18n.numberOperatorIsBlank:
                            g = a.fieldObj.name + " IS NULL";
                            break;
                        case this.i18n.numberOperatorIsNotBlank:
                            g = a.fieldObj.name + " IS NOT NULL"
                    } else switch (r.isDefined(c) &&
                        ("field" !== a.valueObj.type && "string" === typeof c) && (c = new Date(c)), a.operator) {
                        case this.i18n.dateOperatorIsOn:
                            g = "field" === a.valueObj.type ? a.fieldObj.name + " \x3d " + c : f ? a.fieldObj.name + " BETWEEN '{" + b + "}' AND '{" + (b + 1) + "}'" : a.fieldObj.name + " BETWEEN '" + this.formatDate(c) + "' AND '" + this.formatDate(this.addDay(c)) + "'";
                            break;
                        case this.i18n.dateOperatorIsNotOn:
                            g = "field" === a.valueObj.type ? a.fieldObj.name + " \x3c\x3e " + c : f ? a.fieldObj.name + " NOT BETWEEN '{" + b + "}' AND '{" + (b + 1) + "}'" : a.fieldObj.name + " NOT BETWEEN '" +
                                this.formatDate(c) + "' AND '" + this.formatDate(this.addDay(c)) + "'";
                            break;
                        case this.i18n.dateOperatorIsBefore:
                            g = "field" === a.valueObj.type ? a.fieldObj.name + " \x3c " + c : a.fieldObj.name + " \x3c '" + this.formatDate(c) + "'";
                            break;
                        case this.i18n.dateOperatorIsAfter:
                            g = "field" === a.valueObj.type ? a.fieldObj.name + " \x3e " + c : a.fieldObj.name + " \x3e '" + this.formatDate(this.addDay(c)) + "'";
                            break;
                        case this.i18n.dateOperatorIsBetween:
                            g = f ? a.fieldObj.name + " BETWEEN '" + d + "' AND '" + e + "'" : a.fieldObj.name + " BETWEEN '" + this.formatDate(d) +
                                "' AND '" + this.formatDate(this.addDay(e)) + "'";
                            break;
                        case this.i18n.dateOperatorIsNotBetween:
                            g = f ? a.fieldObj.name + " NOT BETWEEN '" + d + "' AND '" + e + "'" : a.fieldObj.name + " NOT BETWEEN '" + this.formatDate(d) + "' AND '" + this.formatDate(this.addDay(e)) + "'";
                            break;
                        case this.i18n.dateOperatorIsBlank:
                            g = a.fieldObj.name + " IS NULL";
                            break;
                        case this.i18n.dateOperatorIsNotBlank:
                            g = a.fieldObj.name + " IS NOT NULL"
                    }
                    return {
                        whereClause: g
                    }
            },
            showDeleteIcon: function() {
                s.set(k.byId(this.id + ".deleteExpression"), "display", "block")
            },
            hideDeleteIcon: function() {
                s.set(k.byId(this.id + ".deleteExpression"), "display", "none")
            },
            createFieldsStore: function(a) {
                if (a && a.length) {
                    a = n.clone(a);
                    a = a.sort(function(a, b) {
                        a.label = a.alias || a.name;
                        b.label = b.alias || b.name;
                        return a.label < b.label ? -1 : a.label > b.label ? 1 : 0
                    });
                    var b = this.isHostedService(this.mapLayer.url),
                        c = 10.2 <= this.version;
                    a = q.filter(a, function(a, e) {
                        return "esriFieldTypeString" === a.type || "esriFieldTypeDouble" === a.type || "esriFieldTypeSingle" === a.type || "esriFieldTypeInteger" === a.type || "esriFieldTypeSmallInteger" ===
                            a.type || "esriFieldTypeDate" === a.type && (this.allowAllDateTypes || b || c) ? !0 : !1
                    }, this);
                    a = q.map(a, function(a, b) {
                        var c;
                        switch (a.type) {
                            case "esriFieldTypeString":
                                c = "string";
                                this.fieldsInfo.stringFieldsCount++;
                                break;
                            case "esriFieldTypeDate":
                                c = "date";
                                this.fieldsInfo.dateFieldsCount++;
                                break;
                            default:
                                c = "number", this.fieldsInfo.numberFieldsCount++
                        }
                        return {
                            id: b,
                            label: a.label,
                            shortType: c,
                            alias: a.alias,
                            editable: a.editable,
                            name: a.name,
                            nullable: a.nullable,
                            type: a.type
                        }
                    }, this);
                    a.length && (this.fieldsStore = new t({
                        data: {
                            identifier: "id",
                            label: "label",
                            items: a
                        }
                    }))
                }
            },
            createOperatorStores: function() {
                var a = [];
                a.push({
                    name: this.i18n.stringOperatorIs,
                    name_: this.i18n.stringOperatorIs,
                    id: 0
                });
                a.push({
                    name: this.i18n.stringOperatorIsNot,
                    name_: this.i18n.stringOperatorIsNot,
                    id: 1
                });
                a.push({
                    name: this.i18n.stringOperatorStartsWith,
                    name_: this.i18n.stringOperatorStartsWith,
                    id: 2
                });
                a.push({
                    name: this.i18n.stringOperatorEndsWith,
                    name_: this.i18n.stringOperatorEndsWith,
                    id: 3
                });
                a.push({
                    name: this.i18n.stringOperatorContains,
                    name_: this.i18n.stringOperatorContains,
                    id: 4
                });
                a.push({
                    name: this.i18n.stringOperatorDoesNotContain,
                    name_: this.i18n.stringOperatorDoesNotContain,
                    id: 5
                });
                a.push({
                    name: this.i18n.stringOperatorIsBlank,
                    name_: this.i18n.stringOperatorIsBlank,
                    id: 6
                });
                a.push({
                    name: this.i18n.stringOperatorIsNotBlank,
                    name_: this.i18n.stringOperatorIsNotBlank,
                    id: 7
                });
                this.stringOperatorStore = new t({
                    data: {
                        label: "name",
                        identifier: "id",
                        items: a
                    }
                });
                a = [];
                a.push({
                    name: this.i18n.dateOperatorIsOn,
                    id: 0
                });
                a.push({
                    name: this.i18n.dateOperatorIsNotOn,
                    id: 1
                });
                a.push({
                    name: this.i18n.dateOperatorIsBefore,
                    id: 2
                });
                a.push({
                    name: this.i18n.dateOperatorIsAfter,
                    id: 3
                });
                a.push({
                    name: this.i18n.dateOperatorIsBetween,
                    id: 6
                });
                a.push({
                    name: this.i18n.dateOperatorIsNotBetween,
                    id: 7
                });
                a.push({
                    name: this.i18n.dateOperatorIsBlank,
                    id: 8
                });
                a.push({
                    name: this.i18n.dateOperatorIsNotBlank,
                    id: 9
                });
                this.dateOperatorStore = new t({
                    data: {
                        label: "name",
                        identifier: "id",
                        items: a
                    }
                });
                a = [];
                a.push({
                    name: this.i18n.numberOperatorIs,
                    name_: this.i18n.numberOperatorIs,
                    id: 0
                });
                a.push({
                    name: this.i18n.numberOperatorIsNot,
                    name_: this.i18n.numberOperatorIsNot,
                    id: 1
                });
                a.push({
                    name: this.i18n.numberOperatorIsAtLeast,
                    name_: this.i18n.numberOperatorIsAtLeast,
                    id: 2
                });
                a.push({
                    name: this.i18n.numberOperatorIsLessThan,
                    name_: this.i18n.numberOperatorIsLessThan,
                    id: 3
                });
                a.push({
                    name: this.i18n.numberOperatorIsAtMost,
                    name_: this.i18n.numberOperatorIsAtMost,
                    id: 4
                });
                a.push({
                    name: this.i18n.numberOperatorIsGreaterThan,
                    name_: this.i18n.numberOperatorIsGreaterThan,
                    id: 5
                });
                a.push({
                    name: this.i18n.numberOperatorIsBetween,
                    name_: this.i18n.numberOperatorIsBetween,
                    id: 6
                });
                a.push({
                    name: this.i18n.numberOperatorIsNotBetween,
                    name_: this.i18n.numberOperatorIsNotBetween,
                    id: 7
                });
                a.push({
                    name: this.i18n.numberOperatorIsBlank,
                    name_: this.i18n.numberOperatorIsBlank,
                    id: 8
                });
                a.push({
                    name: this.i18n.numberOperatorIsNotBlank,
                    name_: this.i18n.numberOperatorIsNotBlank,
                    id: 9
                });
                this.numberOperatorStore = new t({
                    data: {
                        label: "name",
                        identifier: "id",
                        items: a
                    }
                })
            },
            readCodedValues: function() {
                q.forEach(this.mapLayer.fields, function(a) {
                    a.domain && a.domain.codedValues && (this.fieldDomains[a.name] = a.domain.codedValues)
                }, this)
            },
            getDecodedValue: function(a,
                b) {
                var c = this.getCodedValues(b),
                    d, e;
                if (c)
                    for (d = 0; d < c.length; d += 1)
                        if (e = c[d], e.code === a) return e.name;
                return a
            },
            getCodedValues: function(a) {
                return this.fieldDomains[a]
            },
            getFieldsList: function() {
                return f.byId(this.id + ".fieldsList")
            },
            getOperatorList: function() {
                return f.byId(this.id + ".operatorList")
            },
            getValueFieldsList: function() {
                return f.byId(this.id + ".valueFields")
            },
            getAttrValContNode: function() {
                return k.byId(this.id + ".attributeValueContainer")
            },
            getField: function() {
                var a = this.getFieldsList();
                return {
                    name: a.store.getValue(a.item,
                        "name"),
                    label: a.store.getValue(a.item, "label"),
                    shortType: a.store.getValue(a.item, "shortType"),
                    type: a.store.getValue(a.item, "type")
                }
            },
            getOperator: function() {
                var a = this.getOperatorList();
                return !a.item ? "" : a.store.getValue(a.item, "name")
            },
            getValue: function() {
                return {}
            },
            isInteractiveChecked: function() {
                return this.interactiveCheck.checked
            },
            setInteractiveSection: function(a, b, c) {
                this.disableInteractiveHandlers();
                this.interactiveCheck.checked = a;
                this.promptText.attr("value", b);
                this.hintText.attr("value", c);
                s.set(this.interactiveSpace, "display", "block");
                this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9650;";
                this.enableInteractiveHandlers()
            },
            enableInteractiveHandlers: function() {
                this.onPromptChangeHandler = h.connect(this.promptText, "onChange", this, "onChangeInteractive");
                this.onHintchangeHandler = h.connect(this.hintText, "onChange", this, "onChangeInteractive")
            },
            disableInteractiveHandlers: function() {
                h.disconnect(this.onPromptChangeHandler);
                h.disconnect(this.onHintChangeHandler)
            },
            fillFieldsList: function(a) {
                var b =
                    this.getFieldsList();
                b.set("labelAttr", "label");
                b.set("searchAttr", "label");
                b.set("store", a);
                b.set("value", 0)
            },
            fillOperatorList: function(a, b, c) {
                var d = this.getOperatorList();
                d.set("labelAttr", "name");
                d.set("searchAttr", "name");
                d.set("query", c ? c : {});
                d.set("store", a);
                if (b) {
                    var e = !1;
                    for (c = 0; 20 > c && !(a.fetchItemByIdentity({
                        identity: c,
                        onItem: n.hitch(this, function(a) {
                            a && a.name[0] === b && (d.set("value", a.id[0]), e = !0)
                        })
                    }), e); c++);
                } else d.set("value", 0)
            },
            createValueString: function(a) {
                var b = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(b);
                if (a) {
                    var b = new w({
                            id: this.id + ".value",
                            "class": "attributeValue",
                            maxHeight: 150,
                            sortByLabel: !0
                        }, l.create("div", {}, b)),
                        c = this.buildCodedValuesStore(a);
                    b.set("store", c);
                    b.set("value", 0)
                } else b = new L({
                    id: this.id + ".value",
                    "class": "attributeValue",
                    required: !0,
                    placeHolder: "",
                    intermediateChanges: !0
                }, l.create("div", {}, b));
                this.valueHandlers.push(h.connect(b, "onChange", this, "onValueChange"));
                this.checkDefaultOption();
                this.getValue = function() {
                    var b = f.byId(this.id + ".value"),
                        c = !0;
                    a ? b.item ? b = b.item.code[0] : (b = "", c = !1) : c = b = b.get("value");
                    return {
                        value: b,
                        isValid: c
                    }
                }
            },
            createValueDate: function() {
                var a = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(a);
                a = new z({
                    id: this.id + ".value",
                    "class": "attributeValue",
                    trim: !0,
                    required: !0,
                    placeHolder: "",
                    constraints: {
                        datePattern: this.i18n.friendlyDatePattern
                    }
                }, l.create("div", {}, a));
                this.checkDefaultOption();
                this.valueHandlers.push(h.connect(a, "onChange", this, "onValueChange"));
                this.getValue = function() {
                    var a = f.byId(this.id +
                        ".value").get("value");
                    return {
                        value: a,
                        isValid: r.isDefined(a)
                    }
                }
            },
            createValueNumber: function(a) {
                var b = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(b);
                if (a) {
                    var b = new w({
                            id: this.id + ".value",
                            "class": "attributeValue",
                            maxHeight: 150,
                            sortByLabel: !0
                        }, l.create("div", {}, b)),
                        c = this.buildCodedValuesStore(a);
                    b.set("store", c);
                    b.set("value", 0)
                } else b = new A({
                        id: this.id + ".value",
                        "class": "attributeValue",
                        required: !0,
                        placeHolder: "",
                        intermediateChanges: !0,
                        constraints: {
                            pattern: "#####0.##########"
                        }
                    },
                    l.create("div", {}, b));
                this.valueHandlers.push(h.connect(b, "onChange", this, "onValueChange"));
                this.checkDefaultOption();
                this.getValue = function() {
                    var b = f.byId(this.id + ".value"),
                        c = !0;
                    a ? b.item ? b = b.item.code[0] : (b = "", c = !1) : (b = b.get("value"), c = r.isDefined(b) && !isNaN(b));
                    return {
                        value: b,
                        isValid: c
                    }
                }
            },
            createValueBetweenDate: function() {
                var a = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(a);
                var b = new z({
                        id: this.id + ".value1",
                        "class": "attributeValue1",
                        trim: !0,
                        required: !0,
                        placeHolder: "",
                        constraints: {
                            datePattern: this.i18n.friendlyDatePattern
                        }
                    },
                    l.create("div", {}, a));
                l.create("span", {
                    innerHTML: this.i18n.andBetweenValues,
                    "class": "attributeBetweenValues"
                }, a);
                a = new z({
                    id: this.id + ".value2",
                    "class": "attributeValue2",
                    trim: !0,
                    required: !0,
                    placeHolder: "",
                    constraints: {
                        datePattern: this.i18n.friendlyDatePattern
                    }
                }, l.create("div", {}, a));
                this.checkDefaultOption();
                this.valueHandlers.push(h.connect(b, "onChange", this, "onValueChange"));
                this.valueHandlers.push(h.connect(a, "onChange", this, "onValueChange"));
                this.getValue = function() {
                    var a = f.byId(this.id + ".value1").get("value"),
                        b = f.byId(this.id + ".value2").get("value");
                    return {
                        value1: a,
                        value2: b,
                        isValid: r.isDefined(a) && r.isDefined(b)
                    }
                }
            },
            createValueBetweenNumber: function() {
                var a = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(a);
                var b = new A({
                    id: this.id + ".value1",
                    "class": "attributeValue1",
                    required: !0,
                    placeHolder: "",
                    intermediateChanges: !0,
                    constraints: {
                        pattern: "#####0.##########"
                    }
                }, l.create("div", {}, a));
                l.create("span", {
                    innerHTML: this.i18n.andBetweenValues,
                    "class": "attributeBetweenValues"
                }, a);
                a = new A({
                    id: this.id +
                        ".value2",
                    "class": "attributeValue2",
                    required: !0,
                    placeHolder: "",
                    intermediateChanges: !0,
                    constraints: {
                        pattern: "#####0.##########"
                    }
                }, l.create("div", {}, a));
                this.checkDefaultOption();
                this.valueHandlers.push(h.connect(b, "onChange", this, "onValueChange"));
                this.valueHandlers.push(h.connect(a, "onChange", this, "onValueChange"));
                this.getValue = function() {
                    var a = f.byId(this.id + ".value1").get("value"),
                        b = f.byId(this.id + ".value2").get("value");
                    return {
                        value1: a,
                        value2: b,
                        isValid: r.isDefined(a) && r.isDefined(b) && !isNaN(a) &&
                            !isNaN(b) && a <= b
                    }
                }
            },
            createValueInTheLastDate: function() {},
            createValueIsBlank: function() {
                var a = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(a);
                a.innerHTML = "\x3cinput id\x3d'" + this.id + ".value' class\x3d'attributeValue' type\x3d'text' disabled\x3d'true'/\x3e";
                this.checkDefaultOption();
                this.getValue = function() {
                    return {
                        value: null,
                        isValid: !0
                    }
                }
            },
            createValueFields: function(a, b, c) {
                var d = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(d);
                var e = new w({
                    id: this.id + ".valueFields",
                    "class": "attributeValue",
                    maxHeight: 150,
                    labelAttr: "label",
                    searchAttr: "label",
                    store: a,
                    query: b
                }, l.create("div", {}, d));
                if (c)
                    for (var p = !1, d = 0; 100 > d && !(a.fetchItemByIdentity({
                        identity: d,
                        onItem: n.hitch(this, function(a) {
                            a && (a.shortType[0] === b.shortType && a.name[0] !== c) && (e.set("value", a.id), p = !0)
                        })
                    }), p); d++);
                this.valueHandlers.push(h.connect(e, "onChange", this, "onValueChange"));
                this.getValue = function() {
                    var a = f.byId(this.id + ".valueFields");
                    return {
                        value: a.store.getValue(a.item, "name"),
                        label: a.store.getValue(a.item,
                            "label"),
                        type: "field",
                        isValid: !0
                    }
                }
            },
            createValueUnique: function(a) {
                var b = this.getAttrValContNode();
                this.clearAttributeValueDijits();
                l.empty(b);
                a = new w({
                    id: this.id + ".valueUnique",
                    "class": "attributeValue",
                    maxHeight: 150,
                    store: a
                }, l.create("div", {}, b));
                a.set("value", 0);
                this.valueHandlers.push(h.connect(a, "onChange", this, "onValueChange"));
                this.getValue = function() {
                    var a = f.byId(this.id + ".valueUnique");
                    return {
                        value: a.store.getValue(a.item, "value"),
                        isValid: !0
                    }
                }
            },
            setValue: function(a, b) {
                if (b)
                    for (var c = 0; c < b.length; c++) {
                        if (a ===
                            b[c].code) {
                            f.byId(this.id + ".value").set("value", c);
                            break
                        }
                    } else "date" === this.part.fieldObj.shortType ? f.byId(this.id + ".value").set("value", new Date(a)) : ("number" === this.part.fieldObj.shortType && (a = Number(a)), f.byId(this.id + ".value").set("value", a))
            },
            setValue1: function(a) {
                "date" === this.part.fieldObj.shortType ? a = new Date(a) : "number" === this.part.fieldObj.shortType && (a = Number(a));
                f.byId(this.id + ".value1").set("value", a)
            },
            setValue2: function(a) {
                "date" === this.part.fieldObj.shortType ? a = new Date(a) : "number" ===
                    this.part.fieldObj.shortType && (a = Number(a));
                f.byId(this.id + ".value2").set("value", a)
            },
            setValueFieldById: function(a) {
                this.getValueFieldsList().set("value", a)
            },
            enableOnFieldChange: function() {
                this.onFieldChangeEnabled = !0
            },
            enableOnOperatorChange: function() {
                this.onOperatorChangeEnabled = !0
            },
            onChangeField: function(a) {
                this.onFieldChangeEnabled && this._onChangeField(this.getFieldsList(), this)
            },
            onChangeOperator: function(a) {
                this.onOperatorChangeEnabled && this._onChangeOperator(this.getOperatorList(), this)
            },
            onClickDeleteExpression: function(a) {
                this._deleteExpression(this)
            },
            _onChangeField: function(a, b, c) {
                var d = b.getOperatorList();
                switch (this.fieldsStore.getValue(a.item, "type")) {
                    case "esriFieldTypeString":
                        var e = null;
                        a = this.fieldsStore.getValue(a.item, "name");
                        this.getCodedValues(a) && (e = this.i18n.stringOperatorStartsWith, e += "|" + this.i18n.stringOperatorEndsWith, e += "|" + this.i18n.stringOperatorContains, e += "|" + this.i18n.stringOperatorDoesNotContain, e = {
                            name_: RegExp("^(?!(" + e + ")$)")
                        });
                        d.attr("value") === this.i18n.stringOperatorIs ? (b.fillOperatorList(this.stringOperatorStore, this.i18n.stringOperatorIs,
                            e), this.onChangeOperator(d, b, c)) : b.fillOperatorList(this.stringOperatorStore, this.i18n.stringOperatorIs, e);
                        b.createValueString(this.getCodedValues(a));
                        break;
                    case "esriFieldTypeDate":
                        b.fillOperatorList(this.dateOperatorStore, this.i18n.dateOperatorIsOn);
                        b.createValueDate();
                        break;
                    default:
                        e = null, a = this.fieldsStore.getValue(a.item, "name"), this.getCodedValues(a) && (e = this.i18n.numberOperatorIsBetween, e += "|" + this.i18n.numberOperatorIsNotBetween, e += "|" + this.i18n.numberOperatorIsAtLeast, e += "|" + this.i18n.numberOperatorIsLessThan,
                            e += "|" + this.i18n.numberOperatorIsAtMost, e += "|" + this.i18n.numberOperatorIsGreaterThan, e = {
                                name_: RegExp("^(?!(" + e + ")$)")
                            }), d.attr("value") === this.i18n.numberOperatorIs ? (b.fillOperatorList(this.numberOperatorStore, this.i18n.numberOperatorIs, e), this.onChangeOperator(d, b, c)) : b.fillOperatorList(this.numberOperatorStore, this.i18n.numberOperatorIs, e), b.createValueNumber(this.getCodedValues(a))
                }
                "date" === this.fieldsStore.getValue(b.getFieldsList().item, "shortType") ? b.disableInteractiveCheck() : b.enableInteractiveCheck();
                h.publish("filter-expression-change", this)
            },
            _onChangeOperator: function(a, b, c) {
                a = a.item ? a.item.name[0] : a.value;
                c = this.fieldsStore.getValue(b.getFieldsList().item, "shortType");
                var d = this.fieldsStore.getValue(b.getFieldsList().item, "name");
                if (("date" === c || "number" === c) && (a === this.i18n.dateOperatorIsBetween || a === this.i18n.numberOperatorIsBetween || a === this.i18n.dateOperatorIsNotBetween || a === this.i18n.numberOperatorIsNotBetween)) "date" === c ? b.createValueBetweenDate() : b.createValueBetweenNumber();
                else if ("date" ===
                    c && (a === this.i18n.dateOperatorInTheLast || a === this.i18n.dateOperatorNotInTheLast)) b.createValueInTheLastDate();
                else if (a === this.i18n.stringOperatorIsBlank || a === this.i18n.dateOperatorIsBlank || a === this.i18n.numberOperatorIsBlank || a === this.i18n.stringOperatorIsNotBlank || a === this.i18n.dateOperatorIsNotBlank || a === this.i18n.numberOperatorIsNotBlank) b.createValueIsBlank();
                else switch (c) {
                    case "string":
                        b.createValueString(this.getCodedValues(d));
                        break;
                    case "date":
                        b.createValueDate();
                        break;
                    default:
                        b.createValueNumber(this.getCodedValues(d))
                }
                h.publish("filter-expression-change",
                    this)
            },
            onInteractiveClick: function(a) {
                this.isInteractiveChecked() ? (s.set(this.interactiveSpace, "display", "block"), this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9650;") : (s.set(this.interactiveSpace, "display", "none"), this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9660;");
                h.publish("filter-expression-change", this)
            },
            onClickShowHideInteractive: function(a) {
                this.interactiveCheck.disabled || ("none" === s.set(this.interactiveSpace, "display") ? (s.set(this.interactiveSpace, "display", "block"), this.interactiveArrow.innerHTML =
                    "\x26nbsp;\x26#9650;") : (s.set(this.interactiveSpace, "display", "none"), this.interactiveArrow.innerHTML = "\x26nbsp;\x26#9660;"))
            },
            onChangeInteractive: function() {
                h.publish("filter-expression-change", this)
            },
            showValueInput: function(a) {
                this._showValueInput(f.byNode(a.target), this)
            },
            showFields: function(a) {
                this._showFields(f.byNode(a.target), this)
            },
            showUniqueList: function(a) {
                this._showUniqueList(f.byNode(a.target), this)
            },
            onValueChange: function() {
                this.onValueChangeHandler && clearTimeout(this.onValueChangeHandler);
                this.onValueChangeHandler = setTimeout(n.hitch(this, function() {
                    this.onValueChangeHandler = null;
                    h.publish("filter-expression-change", this)
                }), 800)
            },
            _showValueInput: function(a, b, c) {
                b.onChangeOperator(a, b, c);
                b.enableInteractiveCheck()
            },
            _showFields: function(a, b, c) {
                c = b.getFieldsList().item;
                a = this.fieldsStore.getValue(c, "shortType");
                c = this.fieldsStore.getValue(c, "name");
                b.createValueFields(this.fieldsStore, {
                    shortType: a,
                    name: RegExp("^(?!" + c + "$)")
                }, c);
                b.disableInteractiveCheck()
            },
            _showUniqueList: function(a, b,
                c) {
                this.uniqueValuesStore && delete this.uniqueValuesStore;
                c = this.fieldsStore.getValue(b.getFieldsList().item, "name");
                if (10.1 <= this.version) {
                    var d = null;
                    this.mapLayer.queryServiceUrl ? d = this.mapLayer.queryServiceUrl : this.mapLayer.itemLayers && q.forEach(this.mapLayer.itemLayers, function(a) {
                        a.id === this.layerInfo.id && a.layerUrl && (d = a.layerUrl)
                    }, this);
                    d || (d = this.mapLayer.url);
                    if (this.uniqueValuesResults[this.mapLayer.id + "_" + c]) this.onGenerateRendererResults(b, a, this.uniqueValuesResults[this.mapLayer.id + "_" +
                        c]);
                    else this.generateRendererUniqueValues(c, d, n.hitch(this, "onGenerateRendererResults", b, a), n.hitch(this, function() {
                        this.showValueInput(a, b)
                    }))
                } else this.showValueInput(a, b)
            },
            onGenerateRendererResults: function(a, b, c) {
                var d = this.fieldsStore.getValue(a.getFieldsList().item, "name"),
                    e = this.fieldsStore.getValue(a.getFieldsList().item, "shortType"),
                    f = this.fieldsStore.getValue(a.getFieldsList().item, "type");
                this.uniqueValuesResults[this.mapLayer.id + "_" + d] = c;
                var g = null;
                q.forEach(this.mapLayer.fields, function(a) {
                    a.name ===
                        d && a.domain && (g = a.domain)
                });
                c = q.filter(c, function(a, b) {
                    return "string" === e ? "\x3cNull\x3e" !== a && "" !== a.trim() : "\x3cNull\x3e" !== a && "" !== a
                });
                c.length ? ("date" === e ? (c = q.map(c, function(a) {
                    return new Date(a)
                }), c = c.sort(function(a, b) {
                    var c = a.getTime(),
                        d = b.getTime();
                    return c < d ? -1 : c > d ? 1 : 0
                }), c = q.map(c, function(a) {
                    return this.formatFriendlyDate(a)
                }, this)) : "number" === e ? (c = q.map(c, function(a) {
                    return "esriFieldTypeDouble" === f || "esriFieldTypeSingle" === f ? parseFloat(a) : parseInt(a, 10)
                }), c = c.sort(function(a, b) {
                    return a <
                        b ? -1 : a > b ? 1 : 0
                })) : c = c.sort(function(a, b) {
                    return a < b ? -1 : a > b ? 1 : 0
                }), b = q.map(c, function(a, b) {
                    var c = a;
                    "string" === e && (c = "" === a ? "\x3c" + this.i18n.emptyString + "\x3e" : a);
                    if (g && g.codedValues) {
                        for (var d = 0; d < g.codedValues.length; d++) {
                            var h = g.codedValues[d];
                            if (a === h.code) return {
                                id: b,
                                name: h.name || c,
                                value: a
                            }
                        }
                        return {
                            id: b,
                            name: "" + c,
                            value: a
                        }
                    }
                    if ("esriFieldTypeDouble" === f || "esriFieldTypeSingle" === f) c = v.format(a, {
                        pattern: "#####0.##########"
                    });
                    return {
                        id: b,
                        name: "" + c,
                        value: a
                    }
                }, this), this.uniqueValuesStore = new t({
                    data: {
                        label: "name",
                        identifier: "id",
                        items: b
                    }
                }), a.createValueUnique(this.uniqueValuesStore)) : this.showValueInput(b, a)
            },
            generateRendererUniqueValues: function(a, b, c, d) {
                a instanceof Array && (a = a.toString());
                var e = new M;
                e.attributeField = a;
                a = new N;
                a.classificationDefinition = e;
                this.mapLayer instanceof P ? b = new x(this.mapLayer) : this.mapLayer instanceof O && !this.mapLayer.url ? b = new x(this.mapLayer) : this.hasDynamicLayers(this.mapLayer) ? (e = this.mapLayer.layerDefinitions && this.mapLayer.layerDefinitions[this.mapLayer.id] ? this.mapLayer.layerDefinitions[this.mapLayer.id] :
                    null, a.where = e ? e : null, b = new x(this.mapLayer.url + "/dynamicLayer", {
                        source: this.layerInfo.source
                    })) : (e = this.mapLayer.getDefinitionExpression(), a.where = e ? e : null, b = new x(b));
                B.config.defaults.io.timeout = 1E4;
                b.execute(a, function(a) {
                    B.config.defaults.io.timeout = 6E4;
                    a = q.map(a.infos, function(a) {
                        return a.value
                    });
                    c(a)
                }, n.hitch(this, function(a) {
                    B.config.defaults.io.timeout = 6E4;
                    d()
                }))
            },
            hasDynamicLayers: function(a) {
                return a && a.supportsDynamicLayers ? !0 : !1
            },
            formatDate: function(a) {
                return u.format(a, {
                    datePattern: "yyyy-MM-dd",
                    selector: "date"
                }) + " " + u.format(a, {
                    selector: "time",
                    timePattern: "HH:mm:ss"
                })
            },
            formatFriendlyDate: function(a) {
                return u.format(a, {
                    datePattern: this.i18n.friendlyDatePattern,
                    selector: "date"
                })
            },
            parseDate: function(a) {
                var b = u.parse(a, {
                    datePattern: "yyyy-MM-dd",
                    timePattern: "HH:mm:ss"
                });
                b || (b = u.parse(a.replace(" ", ", "), {
                    datePattern: "yyyy-MM-dd",
                    timePattern: "HH:mm:ss"
                })) || (b = u.parse(a.replace(" ", " - "), {
                    datePattern: "yyyy-MM-dd",
                    timePattern: "HH:mm:ss"
                }));
                return b
            },
            addDay: function(a) {
                return new Date(a.getTime() +
                    this.dayInMS)
            },
            subtractDay: function(a) {
                return new Date(a.getTime() - this.dayInMS)
            },
            containsNonLatinCharacter: function(a) {
                for (var b = 0; b < a.length; b++)
                    if (255 < a.charCodeAt(b)) return !0;
                return !1
            },
            buildCodedValuesStore: function(a) {
                a = q.map(a, function(a, c) {
                    return {
                        name: a.name,
                        code: a.code,
                        id: c
                    }
                });
                return new t({
                    data: {
                        label: "name",
                        identifier: "id",
                        items: a
                    }
                })
            },
            clearAttributeValueDijits: function() {
                this.valueHandlers && 0 !== this.valueHandlers.length && (q.forEach(this.valueHandlers, n.hitch(this, function(a) {
                        console.log("disconnecting",
                            a);
                        h.disconnect(a)
                    })), this.valueHandlers = [], f.byId(this.id + ".value") ? f.byId(this.id + ".value").destroy() : k.byId(this.id + ".value") && this.getAttrValContNode().removeChild(k.byId(this.id + ".value")), f.byId(this.id + ".value1") ? f.byId(this.id + ".value1").destroy() : k.byId(this.id + ".value1") && this.getAttrValContNode().removeChild(k.byId(this.id + ".value1")), f.byId(this.id + ".value2") ? f.byId(this.id + ".value2").destroy() : k.byId(this.id + ".value2") && this.getAttrValContNode().removeChild(k.byId(this.id + ".value2")),
                    f.byId(this.id + ".valueFields") && f.byId(this.id + ".valueFields").destroy(), f.byId(this.id + ".valueUnique") && f.byId(this.id + ".valueUnique").destroy())
            },
            checkDefaultOption: function() {
                y(".attributeValueOptions .attributeValueRadio", this.domNode).forEach(function(a) {
                    f.byNode(a).set("checked", -1 < a.className.indexOf("radioValue"))
                })
            },
            disableOptions: function() {
                y(".attributeValueOptions .attributeValueRadio", this.domNode).forEach(function(a) {
                    f.byNode(a).set("disabled", !0)
                })
            },
            enableOptions: function() {
                y(".attributeValueOptions .attributeValueRadio",
                    this.domNode).forEach(function(a) {
                    f.byNode(a).set("disabled", !1)
                })
            },
            checkFieldOption: function() {
                f.byId(this.id + ".radioFields").set("checked", !0)
            },
            disableFieldOption: function() {
                f.byId(this.id + ".radioFields").set("disabled", !0)
            },
            disableUniqueOption: function() {
                f.byId(this.id + ".radioUnique").set("disabled", !0)
            },
            enableInteractiveCheck: function() {
                this.interactiveCheck.disabled = !1
            },
            disableInteractiveCheck: function() {
                this.interactiveCheck.checked = !1;
                this.interactiveCheck.disabled = !0
            },
            isHostedService: function(a) {
                if (!a) return !1;
                var b = -1 !== a.indexOf(".arcgis.com/");
                a = -1 !== a.indexOf("//services") || -1 !== a.indexOf("//tiles") || -1 !== a.indexOf("//features");
                return b && a
            },
            buildEditUIField: function(a, b, c) {
                this.getFieldItemByName({
                    name: a.fieldObj.name
                }, n.hitch(this, function(d) {
                    b.getFieldsList().set("value", d.id[0]);
                    this.buildEditUIOperator(a, b, c)
                }), n.hitch(this, function() {
                    b.getFieldsList().set("value", 0);
                    this.buildEditUIOperator(a, b, c)
                }))
            },
            buildEditUIOperator: function(a, b, c) {
                switch (a.fieldObj.shortType) {
                    case "string":
                        b.fillOperatorList(this.stringOperatorStore,
                            a.operator);
                        break;
                    case "date":
                        b.fillOperatorList(this.dateOperatorStore, a.operator);
                        break;
                    default:
                        b.fillOperatorList(this.numberOperatorStore, a.operator)
                }
                this.getOperatorItemByName(b.getOperatorList().store, {
                    name: a.operator
                }, n.hitch(this, function(d) {
                    b.getOperatorList().set("value", d.id[0]);
                    this.buildEditUIValue(a, b, c)
                }), n.hitch(this, function() {
                    b.getOperatorList().set("value", 0);
                    this.buildEditUIValue(a, b, c)
                }))
            },
            buildEditUIValue: function(a, b, c) {
                c = a.operator;
                this.onChangeOperator(b.getOperatorList(),
                    b);
                c === this.i18n.stringOperatorIsBlank || c === this.i18n.dateOperatorIsBlank || c === this.i18n.numberOperatorIsBlank || c === this.i18n.stringOperatorIsNotBlank || c === this.i18n.dateOperatorIsNotBlank || c === this.i18n.numberOperatorIsNotBlank ? b.createValueIsBlank() : "field" === a.valueObj.type ? (b.createValueFields(this.fieldsStore, {
                    shortType: a.fieldObj.shortType,
                    name: RegExp("^(?!" + a.fieldObj.name + "$)")
                }), b.checkFieldOption(), this.getFieldItemByName({
                        name: a.valueObj.value
                    }, n.hitch(this, function(a) {
                        b.setValueFieldById(a.id[0])
                    }),
                    n.hitch(this, function() {
                        b.setValueFieldById(0)
                    }))) : r.isDefined(a.valueObj.value1) ? (b.setValue1(a.valueObj.value1), b.setValue2(a.valueObj.value2)) : b.setValue(a.valueObj.value, this.getCodedValues(a.fieldObj.name))
            },
            getFieldItemByName: function(a, b, c) {
                this.fieldsStore.fetch({
                    query: a,
                    onComplete: n.hitch(this, function(a) {
                        a && a.length ? b(a[0]) : c()
                    })
                })
            },
            getOperatorItemByName: function(a, b, c, d) {
                a.fetch({
                    query: b,
                    onComplete: n.hitch(this, function(a) {
                        a && a.length ? c(a[0]) : d()
                    })
                })
            }
        })
    });