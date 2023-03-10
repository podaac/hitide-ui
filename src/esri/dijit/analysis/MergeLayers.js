//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/fx/easing", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/RadioButton", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "../../kernel", "../../lang", "./AnalysisBase", "./CreditEstimator", "./utils", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/MergeLayers.html"],
    function(v, w, f, l, m, h, r, I, J, n, g, s, k, x, y, t, z, A, B, C, D, u, K, L, M, N, q, O, E, P, Q, R, S, F, T, p, G, H) {
        return w([z, A, B, C, D, F], {
            declaredClass: "esri.dijit.analysis.MergeLayers",
            templateString: H,
            basePath: v.toUrl("."),
            widgetsInTemplate: !0,
            inputLayer: null,
            mergeLayers: null,
            mergingAttributes: null,
            returnFeatureCollection: !1,
            outputLayerName: null,
            showSelectFolder: !0,
            showChooseExtent: !0,
            showHelp: !0,
            showCredits: !0,
            i18n: null,
            toolName: "MergeLayers",
            helpFileName: "MergeLayers",
            resultParameter: "MergedLayer",
            constructor: function(a) {
                this._pbConnects = [];
                this._mergeFieldsRows = [];
                this._includedMergeFields = [];
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                l.forEach(this._pbConnects, m.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                f.mixin(this.i18n, G.mergeLayers)
            },
            postCreate: function() {
                this.inherited(arguments);
                y.add(this._form.domNode, "esriSimpleForm");
                this._outputLayerInput.set("validator", f.hitch(this, this.validateServiceName));
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
            _handleShowCreditsClick: function(a) {
                a.preventDefault();
                if (this._form.validate()) {
                    a = {};
                    var b;
                    b = this.mergeLayers[this._mergeLayersSelect.get("value")];
                    a.InputLayer = h.toJson(p.constructAnalysisInputLyrObj(this.inputLayer));
                    a.MergeLayer = h.toJson(p.constructAnalysisInputLyrObj(b));
                    a.MergingAttributes = h.toJson(this.get("mergingAttributes"));
                    this.returnFeatureCollection || (a.OutputName = h.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    }));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = h.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.getCreditsEstimate(this.toolName, a).then(f.hitch(this, function(a) {
                        this._usageForm.set("content", a);
                        this._usageDialog.show()
                    }))
                }
            },
            _handleSaveBtnClick: function() {
                if (this._form.validate()) {
                    this._saveBtn.set("disabled", !0);
                    var a = {},
                        b = {},
                        c;
                    c = this.mergeLayers[this._mergeLayersSelect.get("value")];
                    a.InputLayer = h.toJson(p.constructAnalysisInputLyrObj(this.inputLayer));
                    a.MergeLayer =
                        h.toJson(p.constructAnalysisInputLyrObj(c));
                    a.MergingAttributes = h.toJson(this.get("mergingAttributes"));
                    this.returnFeatureCollection || (a.OutputName = h.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    }));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = h.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.returnFeatureCollection && (c = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)), a.context = h.toJson(c));
                    b.jobParams =
                        a;
                    b.itemParams = {
                        description: this.i18n.itemDescription,
                        tags: n.substitute(this.i18n.itemTags, {
                            layername: this.inputLayer.name
                        }),
                        snippet: this.i18n.itemSnippet
                    };
                    this.showSelectFolder && (b.itemParams.folder = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
                    this.execute(b)
                }
            },
            _handleLayerChange: function(a) {
                this.outputLayerName = n.substitute(this.i18n.outputLayerName, {
                    layername: this.inputLayer.name,
                    mergelayername: this.mergeLayers[a].name
                });
                this._outputLayerInput.set("value",
                    this.outputLayerName);
                this._removeMergeFieldsRows();
                this._createMergeFieldsRow()
            },
            _handleAttrSelectChange: function(a, b) {
                var c, d;
                "0" !== b && (c = a.get("statisticSelect"), "0" !== c.get("value") && (!c.get("isnewRowAdded") && null !== this._includedMergeFields && "0" !== a.get("value")) && (this._includedMergeFields.push(a.get("value")), d = this.mergeLayers[this._mergeLayersSelect.get("value")].fields.length, this._includedMergeFields.length !== d - 1 && (d = c.get("removeTd"), g.set(d, "display", "block"), d = c.get("referenceWidget"),
                    f.hitch(d, d._createMergeFieldsRow()), c.set("isnewRowAdded", !0))))
            },
            _handleAttrMatchSelectChange: function(a, b) {
                if ("0" !== b && "0" !== a.get("value")) {
                    var c = this.mergeLayers[this._mergeLayersSelect.get("value")].fields,
                        d = this.inputLayer.fields,
                        e = "";
                    l.forEach(c, function(b) {
                        b.name === a.get("value") && (e = b.type)
                    });
                    var f = "";
                    l.forEach(d, function(a) {
                        a.name === b && (f = a.type)
                    });
                    e !== f ? -1 !== l.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], e) && -1 !== l.indexOf(["esriFieldTypeSmallInteger",
                        "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"
                    ], f) ? (this._handleCloseMsg(), this.set("disableRunAnalysis", !1)) : (this._showMessages(this.i18n.fieldTypeMatchValidationMsg), this.set("disableRunAnalysis", !0)) : (this._handleCloseMsg(), this.set("disableRunAnalysis", !1))
                }
            },
            _handleStatsValueUpdate: function(a, b, c, d) {
                var e;
                a && (b = a.get("statisticSelect"), c = a.get("attributeMatchSelect"), e = a.get("attributeRenameBox"), "Rename" === d ? (g.set(e.domNode.parentNode, {
                        display: "",
                        "padding-left": 0,
                        "padding-right": 0
                    }),
                    e.domNode.style.display = "block", e.set("required", !0), c.domNode.style.display = "none", g.set(b.domNode.parentNode, "width", "34%"), g.set(a.domNode.parentNode, "width", "35%")) : "Remove" === d || "0" === d ? (e.domNode.style.display = "none", e.set("required", !1), c.domNode.style.display = "none", g.set(b.domNode.parentNode, "width", "44%"), g.set(a.domNode.parentNode, "width", "55%"), g.set(e.domNode.parentNode, "display", "none")) : (g.set(c.domNode.parentNode, {
                        display: "",
                        "padding-left": 0,
                        "padding-right": 0
                    }), e.domNode.style.display =
                    "none", e.set("required", !1), c.domNode.style.display = "table", g.set(b.domNode.parentNode, "width", "34%"), g.set(a.domNode.parentNode, "width", "35%")), "0" !== a.get("value") && "0" !== d && (!b.get("isnewRowAdded") && null !== this._includedMergeFields && "0" !== a.get("value")) && (this._includedMergeFields.push(a.get("value")), a = this.mergeLayers[this._mergeLayersSelect.get("value")].fields.length, this._includedMergeFields.length !== a - 1 && (a = b.get("removeTd"), g.set(a, "display", "block"), a = b.get("referenceWidget"), f.hitch(a,
                    a._createMergeFieldsRow()), b.set("isnewRowAdded", !0))))
            },
            _save: function() {},
            _buildUI: function() {
                this._loadConnections();
                p.initHelpLinks(this.domNode, this.showHelp);
                this.inputLayer && s.set(this._mergeLayersDescription, "innerHTML", n.substitute(this.i18n.mergeLayersDefine, {
                    layername: this.inputLayer.name
                }));
                this.mergeLayers && l.forEach(this.mergeLayers, function(a, c) {
                    a !== this.inputLayer && a.geometryType === this.inputLayer.geometryType && this._mergeLayersSelect.addOption({
                        value: c,
                        label: a.name
                    })
                }, this);
                this._outputLayerInput.set("value",
                    n.substitute(this.i18n.outputLayerName, {
                        layername: this.inputLayer.name,
                        mergelayername: this.mergeLayers[this._mergeLayersSelect.get("value")].name
                    }));
                this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
                this._createMergeFieldsRow();
                var a = [];
                l.forEach(this.mergingAttributes, function(b) {
                    b = b.split(" "); - 1 === a.indexOf(b[0]) && (this._currentAttrSelect.set("value", b[0]), f.hitch(this._currentAttrSelect, this._handleAttrSelectChange, b[0])(), this._currentStatsSelect.set("value", b[1]),
                        f.hitch(this._currentStatsSelect, this._handleStatsValueUpdate, "value", "", b[1])(), "Rename" === b[1] ? this._currentAttrMatchSelect.set("value", b[2]) : "Match" === b[1] && this._currentAttrRenameBox.set("value", b[2]), a.push(b[0]))
                }, this);
                0 < a.length && (this._includedMergeFields = a);
                g.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(f.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value",
                        this.portalUser.username)
                }));
                g.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "block" : "none")
            },
            _loadConnections: function() {
                this.on("start", f.hitch(this, "_onClose", !0));
                this._connect(this._closeBtn, "onclick", f.hitch(this, "_onClose", !1))
            },
            _createMergeFieldsRow: function() {
                var a, b, c, d, e, g, h;
                a = k.create("tr", null, this._afterMergeFieldsRow, "before");
                b = k.create("table", {
                    "class": "esriFormTable"
                }, a);
                b = k.create("tbody", null, b);
                c = k.create("tr", null, b);
                b = k.create("td", {
                    style: {
                        width: "35%"
                    }
                }, c);
                d = k.create("td", {
                    style: {
                        width: "34%"
                    }
                }, c);
                e = k.create("td", {
                    style: {
                        width: "30%"
                    }
                }, c);
                b = new q({
                    maxHeight: 200,
                    "class": "esriLeadingMargin1 mediumInput esriTrailingMargin025 attrSelect",
                    style: {
                        overflowX: "hidden",
                        tableLayout: "fixed",
                        width: "100%"
                    }
                }, k.create("select", null, b));
                this.set("attributes", {
                    selectWidget: b,
                    layer: this.mergeLayers[this._mergeLayersSelect.get("value")]
                });
                d = new q({
                    "class": "mediumInput statsSelect",
                    style: {
                        overflowX: "hidden",
                        tableLayout: "fixed",
                        width: "100%"
                    }
                }, k.create("select", null, d));
                this.set("statistics", {
                    selectWidget: d
                });
                g = new E({
                    maxHeight: 200,
                    "class": "longTextInput",
                    style: {
                        overflowX: "hidden",
                        display: "none",
                        tableLayout: "fixed",
                        width: "100%"
                    }
                }, k.create("validationtextbox", null, e));
                e = new q({
                    maxHeight: 200,
                    "class": "mediumInput attrSelect",
                    style: {
                        overflowX: "hidden",
                        display: "none",
                        tableLayout: "fixed",
                        width: "100%"
                    }
                }, k.create("select", null, e));
                this.set("attributes", {
                    selectWidget: e,
                    layer: this.inputLayer
                });
                m.connect(e, "onChange", f.hitch(this, this._handleAttrMatchSelectChange, b));
                b.set("statisticSelect", d);
                b.set("attributeRenameBox", g);
                b.set("attributeMatchSelect", e);
                m.connect(b, "onChange", f.hitch(this, this._handleAttrSelectChange, b));
                h = k.create("td", {
                    "class": "esriFloatTrailing removeTd",
                    style: {
                        display: "none",
                        width: "1%",
                        maxWidth: "12px"
                    }
                }, c);
                c = k.create("a", {
                    title: this.i18n.removeAttrStats,
                    "class": "closeIcon statsRemove",
                    innerHTML: "\x3cimg src\x3d'" + this.basePath + "/images/close.gif' border\x3d'0''/\x3e"
                }, h);
                m.connect(c, "onclick", f.hitch(this, this._removeMergeFieldsRow, a));
                this._mergeFieldsRows.push(a);
                d.set("attributeSelect", b);
                d.set("removeTd", h);
                d.set("isnewRowAdded", !1);
                d.set("referenceWidget", this);
                d.watch("value", f.hitch(this, this._handleStatsValueUpdate, b));
                this._currentStatsSelect = d;
                this._currentAttrSelect = b;
                this._currentAttrMatchSelect = e;
                this._currentAttrRenameBox = g;
                return !0
            },
            _removeMergeFieldsRows: function() {
                l.forEach(this._mergeFieldsRows, this._removeMergeFieldsRow, this);
                this._mergeFieldsRows = [];
                this._includedMergeFields = []
            },
            _removeMergeFieldsRow: function(a) {
                l.forEach(u.findWidgets(a),
                    function(a, c) {
                        if (0 === c) {
                            var d = this._includedMergeFields.indexOf(a.get("value")); - 1 !== d && this._includedMergeFields.splice(d, 1)
                        }
                        a.destroyRecursive()
                    }, this);
                k.destroy(a)
            },
            _setAnalysisGpServerAttr: function(a) {
                a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
            },
            _setInputLayerAttr: function(a) {
                this.inputLayer = a
            },
            _setMergeLayersAttr: function(a) {
                this.mergeLayers = a
            },
            _setAttributesAttr: function(a) {
                if (a.layer) {
                    var b, c;
                    b = a.layer;
                    c = a.selectWidget;
                    a = b.fields;
                    c.addOption({
                        value: "0",
                        label: this.i18n.attribute
                    });
                    l.forEach(a, function(a) {
                        a.name !== b.objectIdField && -1 === this._includedMergeFields.indexOf(a.name) && c.addOption({
                            value: a.name,
                            label: a.name
                        })
                    }, this)
                }
            },
            _setStatisticsAttr: function(a) {
                a = a.selectWidget;
                a.addOption({
                    value: "0",
                    label: this.i18n.operation
                });
                a.addOption({
                    value: "Rename",
                    label: this.i18n.rename
                });
                a.addOption({
                    value: "Remove",
                    label: this.i18n.remove
                });
                a.addOption({
                    value: "Match",
                    label: this.i18n.match
                })
            },
            _setMergingAttributesAttr: function(a) {
                this.mergingAttributes = a
            },
            _getMergingAttributesAttr: function() {
                var a =
                    "",
                    b = [],
                    c, d, e, f;
                x(".statsSelect", this.domNode).forEach(function(g) {
                    c = u.byNode(g);
                    d = c.get("attributeSelect");
                    e = d.get("attributeMatchSelect");
                    f = d.get("attributeRenameBox");
                    "0" !== d.get("value") && "0" !== c.get("value") && ("Remove" === c.get("value") ? (a += d.get("value") + " " + c.get("value") + ";", b.push(d.get("value") + " " + c.get("value"))) : "Rename" === c.get("value") ? (a += d.get("value") + " " + c.get("value") + " " + f.get("value") + ";", b.push(d.get("value") + " " + c.get("value") + " " + f.get("value"))) : (a += d.get("value") + " " + c.get("value") +
                        " " + e.get("value") + ";", b.push(d.get("value") + " " + c.get("value") + " " + e.get("value"))))
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
            _setShowHelpAttr: function(a) {
                this.showHelp = a
            },
            _getShowHelpAttr: function() {
                return this.showHelp
            },
            _setShowCreditsAttr: function(a) {
                this.showCredits = a
            },
            _getShowCreditsAttr: function() {
                return this.showCredits
            },
            _setReturnFeatureCollectionAttr: function(a) {
                this.returnFeatureCollection = a
            },
            _getReturnFeatureCollectionAttr: function() {
                return this.returnFeatureCollection
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === n.trim(a).length ? (this._outputLayerInput.set("invalidMessage",
                    this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 128 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(m.connect(a, b, c))
            },
            _showMessages: function(a) {
                s.set(this._bodyNode, "innerHTML", a);
                r.fadeIn({
                    node: this._errorMessagePane,
                    easing: t.quadIn,
                    onEnd: f.hitch(this, function() {
                        g.set(this._errorMessagePane, {
                            display: ""
                        })
                    })
                }).play()
            },
            _handleCloseMsg: function(a) {
                a &&
                    a.preventDefault();
                r.fadeOut({
                    node: this._errorMessagePane,
                    easing: t.quadOut,
                    onEnd: f.hitch(this, function() {
                        g.set(this._errorMessagePane, {
                            display: "none"
                        })
                    })
                }).play()
            },
            onSave: function() {},
            onClose: function() {}
        })
    });