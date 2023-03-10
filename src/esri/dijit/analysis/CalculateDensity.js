//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Color", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/NumberSpinner", "dijit/form/NumberTextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "../../kernel", "../../lang", "./AnalysisBase", "../../symbols/SimpleFillSymbol", "../../symbols/SimpleLineSymbol", "../../toolbars/draw", "../PopupTemplate", "../../layers/FeatureLayer", "../../map", "../../graphic", "./utils", "./CreditEstimator", "../../symbols/PictureMarkerSymbol", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/CalculateDensity.html"],
    function(t, u, f, g, l, v, h, H, I, m, d, w, J, K, e, n, x, y, z, A, B, L, M, N, O, P, Q, R, S, T, U, V, W, X, C, D, q, r, s, Y, E, Z, F, k, $, aa, ba, ca, da, p, G) {
        return u([x, y, z, A, B, D], {
            declaredClass: "esri.dijit.analysis.CalculateDensity",
            templateString: G,
            basePath: t.toUrl("."),
            widgetsInTemplate: !0,
            inputLayer: null,
            field: null,
            classificationType: "EqualInterval",
            numClasses: 10,
            boundingPolygonLayer: null,
            outputName: null,
            classBreaks: null,
            radius: null,
            radiusUnits: null,
            arealUnits: null,
            _NOVALUE_: "NOVALUE",
            showSelectFolder: !1,
            showChooseExtent: !0,
            showHelp: !0,
            returnFeatureCollection: !1,
            showCredits: !0,
            isProcessInfo: !1,
            i18n: null,
            map: null,
            toolName: "CalculateDensity",
            helpFileName: "CalculateDensity",
            resultParameter: "resultLayer",
            constructor: function(a, b) {
                this._pbConnects = [];
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                g.forEach(this._pbConnects, l.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                f.mixin(this.i18n, p.findHotSpotsTool);
                f.mixin(this.i18n, p.interpolatePointsTool);
                f.mixin(this.i18n, p.calculateDensityTool);
                this.set("drawLayerName", this.i18n.blayerName);
                this.set("drawPointLayerName", this.i18n.pointlayerName)
            },
            postCreate: function() {
                this.inherited(arguments);
                e.add(this._form.domNode, "esriSimpleForm");
                this._outputLayerInput.set("validator", f.hitch(this, this.validateServiceName));
                this._classBreaksInput.set("validator", f.hitch(this, this.validateClassBreaks));
                this._buildUI()
            },
            startup: function() {},
            _onClose: function(a) {
                a && this._featureLayer && (this.map.removeLayer(this._featureLayer),
                    g.forEach(this.boundingPolygonLayers, function(a, c) {
                        a === this._featureLayer && (this._boundingAreaSelect.removeOption({
                            value: c + 1,
                            label: this._featureLayer.name
                        }), this.boundingPolygonLayers.splice(c, 1))
                    }, this));
                this._handleBoundingBtnChange(!1);
                this.emit("close", {
                    save: !a
                })
            },
            clear: function() {
                this._featureLayer && (this.map.removeLayer(this._featureLayer), g.forEach(this.boundingPolygonLayers, function(a, b) {
                    a === this._featureLayer && (this._boundingAreaSelect.removeOption({
                            value: b + 1,
                            label: this._featureLayer.name
                        }),
                        this.boundingPolygonLayers.splice(b, 1))
                }, this));
                this._handleBoundingBtnChange(!1)
            },
            _handleShowCreditsClick: function(a) {
                a.preventDefault();
                a = {};
                this._form.validate() && (a.inputLayer = h.toJson(k.constructAnalysisInputLyrObj(this.get("inputLayer"))), this.get("field") && (a.field = this.get("field")), this.get("radius") && (a.radius = this.radius), this.radius && this.get("radiusUnits") && (a.radiusUnits = this.radiusUnits), this.get("areaUnits") && (a.areaUnits = this.areaUnits), this.get("classificationType") && (a.classificationType =
                    this.get("classificationType")), "Manual" !== this.classificationType ? a.numClasses = this.get("numClasses") : a.classBreaks = this.get("classBreaks"), this.get("boundingPolygonLayer") && (a.boundingPolygonLayer = h.toJson(k.constructAnalysisInputLyrObj(this.boundingPolygonLayer))), this.returnFeatureCollection || (a.OutputName = h.toJson({
                    serviceProperties: {
                        name: this.get("outputName")
                    }
                })), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = h.toJson({
                    extent: this.map.extent._normalize(!0)
                })), this.getCreditsEstimate(this.toolName,
                    a).then(f.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                })))
            },
            _handleSaveBtnClick: function(a) {
                if (this._form.validate()) {
                    this._saveBtn.set("disabled", !0);
                    a = {};
                    var b = {},
                        c;
                    a.inputLayer = h.toJson(k.constructAnalysisInputLyrObj(this.get("inputLayer")));
                    this.get("field") && (a.field = this.get("field"));
                    this.get("radius") && (a.radius = this.radius);
                    this.radius && this.get("radiusUnits") && (a.radiusUnits = this.radiusUnits);
                    this.get("areaUnits") && (a.areaUnits = this.areaUnits);
                    this.get("classificationType") &&
                        (a.classificationType = this.get("classificationType"));
                    "Manual" !== this.classificationType ? a.numClasses = this.get("numClasses") : a.classBreaks = this.get("classBreaks");
                    this.get("boundingPolygonLayer") && (a.boundingPolygonLayer = h.toJson(k.constructAnalysisInputLyrObj(this.boundingPolygonLayer)));
                    this.returnFeatureCollection || (a.OutputName = h.toJson({
                        serviceProperties: {
                            name: this.get("outputName")
                        }
                    }));
                    this.showChooseExtent && !this.get("DisableExtent") && this._useExtentCheck.get("checked") && (a.context = h.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.returnFeatureCollection && (c = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)), a.context = h.toJson(c));
                    a.returnFeatureCollection = this.returnFeatureCollection;
                    b.jobParams = a;
                    b.itemParams = {
                        description: this.i18n.itemDescription,
                        tags: m.substitute(this.i18n.itemTags, {
                            layername: this.inputLayer.name,
                            fieldname: !a.field ? "" : a.field
                        }),
                        snippet: this.i18n.itemSnippet
                    };
                    this.showSelectFolder && (b.itemParams.folder = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item,
                        "id") : "");
                    this.execute(b)
                }
            },
            _save: function() {},
            _buildUI: function() {
                this._loadConnections();
                this._radiusUnitsSelect.addOption([{
                    value: "Miles",
                    label: this.i18n.miles
                }, {
                    value: "Yards",
                    label: this.i18n.yards
                }, {
                    type: "separator"
                }, {
                    value: "Kilometers",
                    label: this.i18n.kilometers
                }, {
                    value: "Meters",
                    label: this.i18n.meters
                }]);
                this._areaUnitsSelect.addOption([{
                    value: "SquareMiles",
                    label: this.i18n.sqMiles
                }, {
                    value: "SquareKilometers",
                    label: this.i18n.sqKm
                }]);
                this.signInPromise.then(f.hitch(this, k.initHelpLinks, this.domNode,
                    this.showHelp, {
                        analysisGpServer: this.analysisGpServer
                    }));
                this.inputLayer && (w.set(this._interpolateToolDescription, "innerHTML", m.substitute(this.i18n.toolDefine, {
                    layername: this.inputLayer.name
                })), this._outputLayerInput.set("value", m.substitute(this.i18n.outputLayerName, {
                    layername: this.inputLayer.name
                })), this.set("fields", this.inputLayer));
                this.classificationType && this._classifySelect.set("value", this.classificationType);
                this.outputName && this._outputLayerInput.set("value", this.outputName);
                if (this.boundingPolygonLayers) {
                    this._boundingAreaSelect.addOption({
                        value: "-1",
                        label: this.i18n.defaultBoundingOption,
                        selected: !0
                    });
                    var a = !1;
                    g.forEach(this.boundingPolygonLayers, function(b, c) {
                        "esriGeometryPolygon" === b.geometryType && (a = this.get("boundingPolygonLayer") && this.get("boundingPolygonLayer").name === b.name, this._boundingAreaSelect.addOption({
                            value: c + 1,
                            label: b.name,
                            selected: a
                        }))
                    }, this)
                }
                this.classBreaks && this._classBreaksInput.set("value", this.classBreaks.join().replace(/,/g, " "));
                this.radius && this._searchDistanceInput.set("value", this.radius);
                this.radiusUnits && this._radiusUnitsSelect.set("value",
                    this.radiusUnits);
                this.areaUnits && this._areaUnitsSelect.set("value", this.areaUnits);
                d.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(f.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                d.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "block" : "none");
                d.set(this._showCreditsLink, "display", !0 === this.showCredits ?
                    "block" : "none")
            },
            _handleMethodChange: function(a) {
                "NN" === a ? (e.add(this._optionsDiv, "disabled"), e.contains(this._optionsDiv, "optionsOpen") && (e.remove(this._optionsDiv, "optionsOpen"), e.add(this._optionsDiv, "optionsClose"))) : (e.contains(this._optionsDiv, "disabled") && e.remove(this._optionsDiv, "disabled"), "KG" === a ? (d.set(this._barrierLabelRow, "display", "none"), d.set(this._barrierSelectRow, "display", "none"), d.set(this._speedLabelRow, "display", ""), d.set(this._speedSliderRow, "display", "")) : "LP" === a && (d.set(this._barrierLabelRow,
                    "display", ""), d.set(this._barrierSelectRow, "display", ""), d.set(this._speedLabelRow, "display", "none"), d.set(this._speedSliderRow, "display", "none")))
            },
            _handleOptimizeSliderChange: function(a) {
                console.log(a, this._optimizeSlider.get("value"));
                this.set("interpolateOption", this._optimizeSlider.get("value"))
            },
            _handleFieldChange: function(a) {},
            _handleOptionsBtnClick: function() {
                e.contains(this._optionsDiv, "disabled") || (e.contains(this._optionsDiv, "optionsClose") ? (e.remove(this._optionsDiv, "optionsClose"), e.add(this._optionsDiv,
                    "optionsOpen")) : e.contains(this._optionsDiv, "optionsOpen") && (e.remove(this._optionsDiv, "optionsOpen"), e.add(this._optionsDiv, "optionsClose")))
            },
            _handleBoundingSelectChange: function(a) {},
            _handleArealUnitsSelectChange: function(a) {},
            _handleBoundingBtnChange: function(a) {
                a ? (this.emit("drawtool-activate", {}), this._featureLayer || this._createBoundingPolyFeatColl(), this._toolbar.activate(s.POLYGON)) : (this._toolbar.deactivate(), this.emit("drawtool-deactivate", {}))
            },
            _handleDistValueChange: function(a) {},
            _handleDistUnitsChange: function(a) {},
            _handleClassifySelectChange: function(a) {
                d.set(this._classifyOtherOptionLabelRow, "display", "Manual" === a ? "none" : "block");
                d.set(this._classifyOtherOptionInputRow, "display", "Manual" === a ? "none" : "block");
                d.set(this._manualOptionInputRow, "display", "Manual" === a ? "block" : "none");
                d.set(this._manualOptionLabelRow, "display", "Manual" === a ? "block" : "none")
            },
            _loadConnections: function() {
                this.on("start", f.hitch(this, "_onClose", !1));
                this._connect(this._closeBtn, "onclick", f.hitch(this, "_onClose", !0))
            },
            _createBoundingPolyFeatColl: function() {
                var a =
                    k.createPolygonFeatureCollection(this.drawLayerName);
                this._featureLayer = new E(a, {
                    id: this.drawLayerName
                });
                this.map.addLayer(this._featureLayer);
                l.connect(this._featureLayer, "onClick", f.hitch(this, function(a) {
                    this.map.infoWindow.setFeatures([a.graphic])
                }))
            },
            _addFeatures: function(a) {
                var b = [],
                    c = {},
                    f = new q(q.STYLE_NULL, new r(r.STYLE_SOLID, new v([0, 0, 0]), 4));
                a = new F(a, f);
                this.map.graphics.add(a);
                c.description = "blayer desc";
                c.title = "blayer";
                a.setAttributes(c);
                b.push(a);
                this._featureLayer.applyEdits(b, null,
                    null);
                if (0 === this.boundingPolygonLayers.length || this.boundingPolygonLayers[this.boundingPolygonLayers.length - 1] !== this._featureLayer) b = this.boundingPolygonLayers.push(this._featureLayer), c = this._boundingAreaSelect.getOptions(), this._boundingAreaSelect.removeOption(c), c = g.map(c, function(a) {
                    a.selected = !1;
                    return a
                }), this._boundingAreaSelect.addOption({
                    value: b,
                    label: this._featureLayer.name,
                    selected: !0
                }), this._boundingAreaSelect.addOption(c)
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === m.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            validateClassBreaks: function() {
                var a, b = [],
                    c = [];
                a = f.trim(this._classBreaksInput.get("value")).split(" ");
                if ("Manual" !== this.get("classificationType")) return !0;
                if (!a && "Manual" === this.get("classificationType") ||
                    2 > a.length || 31 < a.length) return !1;
                g.some(a, function(d, e) {
                    d = n.parse(d);
                    if (isNaN(d)) return b.push(0), !1;
                    if (c[a[e]]) return c[a[e]] = !1, b.push(0), !1;
                    c[a[e]] = !0;
                    var g = n.format(d, {
                        locale: "en-us"
                    });
                    if ((g = f.trim(g).match(/\D/g)) && 0 < g.length) return b.push(0), !1
                });
                return -1 !== g.indexOf(b, 0) ? !1 : !0
            },
            _setAnalysisGpServerAttr: function(a) {
                a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
            },
            _setInputLayerAttr: function(a) {
                this.inputLayer = a
            },
            _getInputLayerAttr: function() {
                return this.inputLayer
            },
            _setFieldsAttr: function(a) {
                var b = a.fields,
                    c, d;
                this._fieldSelect.addOption({
                    value: this._NOVALUE_,
                    label: this.i18n.chooseCountField
                });
                g.forEach(b, function(b, e) {
                    b.name !== a.objectIdField && -1 !== g.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], b.type) && (c = {
                        value: b.name,
                        label: C.isDefined(b.alias) && "" !== b.alias ? b.alias : b.name
                    }, this.field && c.value === this.field && (c.selected = "selected", d = b.name), this._fieldSelect.addOption(c))
                }, this);
                d && this._fieldSelect.set("value",
                    d)
            },
            _setFieldAttr: function(a) {
                this.field = a
            },
            _getFieldAttr: function() {
                this._fieldSelect && (this.field = this._fieldSelect.get("value") !== this._NOVALUE_ ? this._fieldSelect.get("value") : null);
                return this.field
            },
            _setRadiusAttr: function(a) {
                this._set("radius", a)
            },
            _getRadiusAttr: function() {
                this._searchDistanceInput && this.set("radius", this._searchDistanceInput.get("value"));
                return this.radius
            },
            _setRadiusUnitsAttr: function(a) {
                this._set("radiusUnits", a)
            },
            _getRadiusUnitsAttr: function() {
                this._radiusUnitsSelect &&
                    this.set("radiusUnits", this._radiusUnitsSelect.get("value"));
                return this.radiusUnits
            },
            _setAreaUnitsAttr: function(a) {
                this._set("areaUnits", a)
            },
            _getAreaUnitsAttr: function() {
                this._areaUnitsSelect && this.set("areaUnits", this._areaUnitsSelect.get("value"));
                return this.areaUnits
            },
            _setClassificationTypeAttr: function(a) {
                this.classificationType = a
            },
            _getClassificationTypeAttr: function() {
                this._classifySelect && (this.classificationType = this._classifySelect.get("value"));
                return this.classificationType
            },
            _getNumClassesAttr: function() {
                this._numClassesInput &&
                    (this.numClasses = this._numClassesInput.get("value"));
                return this.numClasses
            },
            _setNumClassesAttr: function(a) {
                this.numClasses = a
            },
            _getClassBreaksAttr: function() {
                if (this._classBreaksInput) {
                    var a = f.trim(this._classBreaksInput.get("value")).split(" "),
                        b = [];
                    g.forEach(a, function(a) {
                        b.push(n.parse(a))
                    });
                    this.classBreaks = b
                }
                return this.classBreaks
            },
            _setClassBreaksAttr: function(a) {
                a && (this.classBreaks = a)
            },
            _getBoundingPolygonLayerAttr: function() {
                this._boundingAreaSelect && (this.boundingPolygonLayer = null, "-1" !==
                    this._boundingAreaSelect.get("value") && (this.boundingPolygonLayer = this.boundingPolygonLayers[this._boundingAreaSelect.get("value") - 1]));
                return this.boundingPolygonLayer
            },
            _setBoundingPolygonLayerAttr: function(a) {
                this.boundingPolygonLayer = a
            },
            _setBoundingPolygonLayersAttr: function(a) {
                this.boundingPolygonLayers = a
            },
            _getOutputNameAttr: function() {
                this._outputLayerInput && (this.outputName = this._outputLayerInput.get("value"));
                return this.outputName
            },
            _setOutputNameAttr: function(a) {
                this.outputName = a
            },
            _setMapAttr: function(a) {
                this.map =
                    a;
                this._toolbar = new s(this.map);
                l.connect(this._toolbar, "onDrawEnd", f.hitch(this, this._addFeatures))
            },
            _getMapAttr: function() {
                return this.map
            },
            _setDrawLayerNameAttr: function(a) {
                this.drawLayerName = a
            },
            _getDrawLayerNameAttr: function() {
                return this._featureLayer.name
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
                this.showChooseExtent =
                    a
            },
            _getShowChooseExtentAttr: function() {
                return this.showChooseExtent
            },
            _setShowHelpAttr: function(a) {
                this.showHelp = a
            },
            _getShowHelpAttr: function() {
                return this.showHelp
            },
            _getDrawLayerAttr: function() {
                var a = [];
                this._featureLayer && a.push(this._featureLayer);
                this._pointfeatureLayer && a.push(this._pointfeatureLayer);
                return a
            },
            _setReturnFeatureCollectionAttr: function(a) {
                this.returnFeatureCollection = a
            },
            _getReturnFeatureCollectionAttr: function() {
                return this.returnFeatureCollection
            },
            _setShowCreditsAttr: function(a) {
                this.showCredits =
                    a
            },
            _getShowCreditsAttr: function() {
                return this.showCredits
            },
            _setDisableExtentAttr: function(a) {
                this._useExtentCheck.set("checked", !a);
                this._useExtentCheck.set("disabled", a)
            },
            _getDisableExtentAttr: function() {
                this._useExtentCheck.get("disabled")
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(l.connect(a, b, c))
            },
            onDrawToolActivate: function() {},
            onDrawToolDeactivate: function() {},
            onSave: function() {},
            onClose: function() {}
        })
    });