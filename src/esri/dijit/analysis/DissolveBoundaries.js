//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojox/form/CheckedMultiSelect", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/RadioButton", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "../../kernel", "../../lang", "./AnalysisBase", "./CreditEstimator", "./utils", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/DissolveBoundaries.html"],
    function(s, t, e, f, k, d, F, G, l, h, u, g, v, w, H, x, y, z, A, B, p, I, J, K, L, q, M, N, O, P, Q, r, C, R, m, D, E) {
        return t([x, y, z, A, B, C], {
            declaredClass: "esri.dijit.analysis.DissolveBoundaries",
            templateString: E,
            basePath: s.toUrl("."),
            widgetsInTemplate: !0,
            inputLayer: null,
            dissolveFields: null,
            summaryFields: null,
            outputLayerName: null,
            showSelectFolder: !0,
            showChooseExtent: !0,
            showHelp: !0,
            showCredits: !0,
            returnFeatureCollection: !1,
            i18n: null,
            toolName: "DissolveBoundaries",
            helpFileName: "DissolveBoundaries",
            resultParameter: "DissolvedLayer",
            constructor: function(a) {
                this._pbConnects = [];
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                f.forEach(this._pbConnects, k.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                e.mixin(this.i18n, D.dissolveBoundaries)
            },
            postCreate: function() {
                this.inherited(arguments);
                w.add(this._form.domNode, "esriSimpleForm");
                h.set(this._dissolveFieldsSelect.selectNode, "width", "75%");
                this._outputLayerInput.set("validator", e.hitch(this, this.validateServiceName));
                this._buildUI()
            },
            startup: function() {},
            _onClose: function(a) {
                a && (this._save(), this.emit("save", {
                    save: !0
                }));
                this.emit("close", {
                    save: a
                })
            },
            _handleAreasChange: function() {
                this._dissolveFieldsSelect.set("disabled", !0 !== this._sameAttributeAreasCheck.get("checked"))
            },
            _handleShowCreditsClick: function(a) {
                a.preventDefault();
                this._form.validate() && (a = {}, a.InputLayer = d.toJson(m.constructAnalysisInputLyrObj(this.inputLayer)), a.SummaryFields = d.toJson(this.get("summaryFields")), this.returnFeatureCollection || (a.OutputName = d.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                })), !0 === this._sameAttributeAreasCheck.get("checked") && (a.DissolveFields = d.toJson(this.get("dissolveFields"))), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = d.toJson({
                    extent: this.map.extent._normalize(!0)
                })), this.getCreditsEstimate(this.toolName, a).then(e.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                })))
            },
            _handleSaveBtnClick: function() {
                if (this._form.validate()) {
                    this._saveBtn.set("disabled", !0);
                    var a = {},
                        b = {},
                        c;
                    a.InputLayer = d.toJson(m.constructAnalysisInputLyrObj(this.inputLayer));
                    a.SummaryFields = d.toJson(this.get("summaryFields"));
                    this.returnFeatureCollection || (a.OutputName = d.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    }));
                    !0 === this._sameAttributeAreasCheck.get("checked") && (a.DissolveFields = d.toJson(this.get("dissolveFields")));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = d.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.returnFeatureCollection && (c = {
                            outSR: this.map.spatialReference
                        }, this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)),
                        a.context = d.toJson(c));
                    b.jobParams = a;
                    b.itemParams = {
                        description: this.i18n.itemDescription,
                        tags: l.substitute(this.i18n.itemTags, {
                            layername: this.inputLayer.name
                        }),
                        snippet: this.i18n.itemSnippet
                    };
                    this.showSelectFolder && (b.itemParams.folder = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
                    this.execute(b)
                }
            },
            _handleAttrSelectChange: function(a) {
                var b;
                "0" !== a && (a = this.get("statisticSelect"), "0" !== a.get("value") && !a.get("isnewRowAdded") && (b = a.get("removeTd"), h.set(b,
                    "display", "block"), b = a.get("referenceWidget"), e.hitch(b, b._createStatsRow()), a.set("isnewRowAdded", !0)))
            },
            _handleStatsValueUpdate: function(a, b, c) {
                this.get("attributeSelect") && (a = this.get("attributeSelect"), "0" !== a.get("value") && "0" !== c && !this.get("isnewRowAdded") && (c = this.get("removeTd"), h.set(c, "display", "block"), c = this.get("referenceWidget"), e.hitch(c, c._createStatsRow()), this.set("isnewRowAdded", !0)))
            },
            _save: function() {},
            _buildUI: function() {
                this._loadConnections();
                m.initHelpLinks(this.domNode,
                    this.showHelp);
                if (this.inputLayer) {
                    u.set(this._dissolveBoundariesDescription, "innerHTML", l.substitute(this.i18n.dissolveBoundariesDefine, {
                        layername: this.inputLayer.name
                    }));
                    this.outputLayerName || (this.outputLayerName = l.substitute(this.i18n.outputLayerName, {
                        layername: this.inputLayer.name
                    }));
                    var a = [],
                        b = !1;
                    f.forEach(this.inputLayer.fields, function(c, n) {
                        -1 !== f.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble", "esriFieldTypeString"], c.type) && (null !==
                            this.dissolveFields && (b = -1 !== this.dissolveFields.indexOf(c.name)), a.push({
                                value: c.name,
                                label: r.isDefined(c.alias) && "" !== c.alias ? c.alias : c.name,
                                selected: b
                            }))
                    }, this);
                    this._dissolveFieldsSelect.addOption(a);
                    this._dissolveFieldsSelect.set("disabled", !0 !== this._sameAttributeAreasCheck.get("checked"))
                }
                this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
                this._createStatsRow();
                f.forEach(this.summaryFields, function(a) {
                    a = a.split(" ");
                    this._currentAttrSelect.set("value", a[0]);
                    e.hitch(this._currentAttrSelect,
                        this._handleAttrSelectChange, a[0])();
                    this._currentStatsSelect.set("value", a[1]);
                    e.hitch(this._currentStatsSelect, this._handleStatsValueUpdate, "value", "", a[1])()
                }, this);
                h.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(e.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                h.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ?
                    "block" : "none")
            },
            _loadConnections: function() {
                this.on("start", e.hitch(this, "_onClose", !0));
                this._connect(this._closeBtn, "onclick", e.hitch(this, "_onClose", !1))
            },
            _createStatsRow: function() {
                var a, b, c, n, d;
                a = g.create("tr", null, this._afterStatsRow, "before");
                c = g.create("td", {
                    style: {
                        width: "45%",
                        maxWidth: "100px"
                    }
                }, a);
                b = g.create("td", {
                    style: {
                        width: "55%",
                        maxWidth: "104px"
                    }
                }, a);
                c = new q({
                        maxHeight: 200,
                        "class": "esriLeadingMargin1 mediumInput esriTrailingMargin025 attrSelect",
                        style: {
                            tableLayout: "fixed",
                            overflowX: "hidden"
                        }
                    },
                    g.create("select", null, c));
                this.set("attributes", {
                    selectWidget: c,
                    inputLayer: this.inputLayer
                });
                b = new q({
                    "class": "mediumInput statsSelect",
                    style: {
                        tableLayout: "fixed",
                        overflowX: "hidden"
                    }
                }, g.create("select", null, b));
                this.set("statistics", {
                    selectWidget: b
                });
                c.set("statisticSelect", b);
                k.connect(c, "onChange", this._handleAttrSelectChange);
                d = g.create("td", {
                    "class": "shortTextInput removeTd",
                    style: {
                        display: "none",
                        maxWidth: "12px"
                    }
                }, a);
                n = g.create("a", {
                    title: this.i18n.removeAttrStats,
                    "class": "closeIcon statsRemove",
                    innerHTML: "\x3cimg src\x3d'" + this.basePath + "/images/close.gif' border\x3d'0''/\x3e"
                }, d);
                k.connect(n, "onclick", e.hitch(this, this._removeStatsRow, a));
                b.set("attributeSelect", c);
                b.set("removeTd", d);
                b.set("isnewRowAdded", !1);
                b.set("referenceWidget", this);
                b.watch("value", this._handleStatsValueUpdate);
                this._currentStatsSelect = b;
                this._currentAttrSelect = c;
                return !0
            },
            _removeStatsRow: function(a) {
                f.forEach(p.findWidgets(a), function(a) {
                    a.destroyRecursive()
                });
                g.destroy(a)
            },
            _setAnalysisGpServerAttr: function(a) {
                a &&
                    (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
            },
            _setInputLayerAttr: function(a) {
                "esriGeometryPolygon" === a.geometryType && (this.inputLayer = a)
            },
            _setLayersAttr: function(a) {
                f.forEach(a, function(a) {
                    "esriGeometryPolygon" === a.geometryType && (this.inputLayer = a)
                }, this)
            },
            _setAttributesAttr: function(a) {
                if (a.inputLayer) {
                    var b, c;
                    b = a.inputLayer;
                    c = a.selectWidget;
                    a = b.fields;
                    c.addOption({
                        value: "0",
                        label: this.i18n.attribute
                    });
                    f.forEach(a, function(a) {
                        -1 !== f.indexOf(["esriFieldTypeSmallInteger",
                            "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
                        ], a.type) && a.name !== b.objectIdField && c.addOption({
                            value: a.name,
                            label: r.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                        })
                    }, this)
                }
            },
            _setStatisticsAttr: function(a) {
                a = a.selectWidget;
                a.addOption({
                    value: "0",
                    label: this.i18n.statistic
                });
                a.addOption({
                    value: "SUM",
                    label: this.i18n.sum
                });
                a.addOption({
                    value: "MIN",
                    label: this.i18n.minimum
                });
                a.addOption({
                    value: "MAX",
                    label: this.i18n.maximum
                });
                a.addOption({
                    value: "MEAN",
                    label: this.i18n.average
                });
                a.addOption({
                    value: "STDDEV",
                    label: this.i18n.standardDev
                })
            },
            _setDissolveFieldsAttr: function(a) {
                this.dissolveFields = a
            },
            _getDissolveFieldsAttr: function() {
                var a = [];
                this._dissolveFieldsSelect.getOptions().forEach(function(b) {
                    !0 === b.selected && "0" !== b.value && a.push(b.value)
                });
                return a
            },
            _setSummaryFieldsAttr: function(a) {
                this.summaryFields = a
            },
            _getSummaryFieldsAttr: function() {
                var a = "",
                    b = [],
                    c, d;
                v(".statsSelect", this.domNode).forEach(function(e) {
                    c = p.byNode(e);
                    d = c.get("attributeSelect");
                    "0" !== d.get("value") && "0" !== c.get("value") && (a += d.get("value") +
                        " " + c.get("value") + ";", b.push(d.get("value") + " " + c.get("value")))
                });
                return b
            },
            _setDisableRunAnalysisAttr: function(a) {
                this._saveBtn.set("disabled", a)
            },
            _setShowSelectFolderAttr: function(a) {
                this.showSelectFolder = a
            },
            _getShowSelectFolderAttr: function() {
                return this.showSelectFolder
            },
            _setShowChooseExtentAttr: function(a) {
                this.showChooseExtent = a
            },
            _getShowChooseExtentAttr: function() {
                return this.showChooseExtent
            },
            _setMapAttr: function(a) {
                this.map = a
            },
            _getMapAttr: function() {
                return this.map
            },
            _setShowCreditsAttr: function(a) {
                this.showCredits =
                    a
            },
            _getShowCreditsAttr: function() {
                return this.showCredits
            },
            _setShowHelpAttr: function(a) {
                this.showHelp = a
            },
            _getShowHelpAttr: function() {
                return this.showHelp
            },
            _setReturnFeatureCollectionAttr: function(a) {
                this.returnFeatureCollection = a
            },
            _getReturnFeatureCollectionAttr: function() {
                return this.returnFeatureCollection
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === l.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) :
                    b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(k.connect(a, b, c))
            },
            onSave: function() {},
            onClose: function() {}
        })
    });