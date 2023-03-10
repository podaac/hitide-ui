//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Color", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/NumberSpinner", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "../../kernel", "../../lang", "./AnalysisBase", "../../symbols/SimpleFillSymbol", "../../symbols/SimpleLineSymbol", "../../toolbars/draw", "../PopupTemplate", "../../layers/FeatureLayer", "../../map", "../../graphic", "./utils", "./CreditEstimator", "../../symbols/PictureMarkerSymbol", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/InterpolatePoints.html"],
    function(w, x, f, g, m, y, h, J, K, n, e, z, L, M, d, q, A, B, C, D, E, N, O, P, Q, R, S, T, U, V, W, X, Y, F, G, r, s, p, Z, t, $, u, l, aa, H, ba, ca, da, v, I) {
        return x([A, B, C, D, E, G], {
            declaredClass: "esri.dijit.analysis.InterpolatePoints",
            templateString: I,
            basePath: w.toUrl("."),
            widgetsInTemplate: !0,
            inputLayer: null,
            field: null,
            interpolateOption: 1,
            classificationType: "GeometricalInterval",
            numClasses: 10,
            boundingPolygonLayer: null,
            predictAtPointLayer: null,
            outputPredictionError: !1,
            outputName: null,
            classBreaks: null,
            showSelectFolder: !1,
            showChooseExtent: !0,
            showHelp: !0,
            returnFeatureCollection: !1,
            showCredits: !0,
            isProcessInfo: !1,
            i18n: null,
            map: null,
            toolName: "InterpolatePoints",
            helpFileName: "InterpolatePoints",
            resultParameter: "resultLayer",
            constructor: function(a, b) {
                this._pbConnects = [];
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                g.forEach(this._pbConnects, m.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                f.mixin(this.i18n, v.findHotSpotsTool);
                f.mixin(this.i18n,
                    v.interpolatePointsTool);
                this.set("drawLayerName", this.i18n.blayerName);
                this.set("drawPointLayerName", this.i18n.pointlayerName)
            },
            postCreate: function() {
                this.inherited(arguments);
                d.add(this._form.domNode, "esriSimpleForm");
                this._outputLayerInput.set("validator", f.hitch(this, this.validateServiceName));
                this._classBreaksInput.set("validator", f.hitch(this, this.validateClassBreaks));
                this._buildUI()
            },
            startup: function() {},
            _onClose: function(a) {
                a && (this._featureLayer && (this.map.removeLayer(this._featureLayer),
                    g.forEach(this.boundingPolygonLayers, function(a, c) {
                        a === this._featureLayer && (this._boundingAreaSelect.removeOption({
                            value: c + 1,
                            label: this._featureLayer.name
                        }), this.boundingPolygonLayers.splice(c, 1))
                    }, this)), this._pointfeatureLayer && (this.map.removeLayer(this._pointfeatureLayer), g.forEach(this.predictAtPointLayers, function(a, c) {
                    a === this._pointfeatureLayer && (this._predictPointSelect.removeOption({
                        value: c + 1,
                        label: this._pointfeatureLayer.name
                    }), this.predictAtPointLayers.splice(c, 1))
                }, this)));
                this._handleBoundingBtnChange(!1);
                this._handlePredictPointChange(!1);
                this.emit("close", {
                    save: !a
                })
            },
            clear: function() {
                this._featureLayer && (this.map.removeLayer(this._featureLayer), g.forEach(this.boundingPolygonLayers, function(a, b) {
                    a === this._featureLayer && (this._boundingAreaSelect.removeOption({
                        value: b + 1,
                        label: this._featureLayer.name
                    }), this.boundingPolygonLayers.splice(b, 1))
                }, this));
                this._pointfeatureLayer && (this.map.removeLayer(this._pointfeatureLayer), g.forEach(this.predictAtPointLayers, function(a, b) {
                    a === this._pointfeatureLayer && (this._predictPointSelect.removeOption({
                        value: b +
                            1,
                        label: this._pointfeatureLayer.name
                    }), this.predictAtPointLayers.splice(b, 1))
                }, this));
                this._handleBoundingBtnChange(!1);
                this._handlePredictPointChange(!1)
            },
            _handleShowCreditsClick: function(a) {
                a.preventDefault();
                a = {};
                this._form.validate() && (a.inputLayer = h.toJson(l.constructAnalysisInputLyrObj(this.get("inputLayer"))), a.field = this.get("field"), a.interpolateOption = this.get("interpolateOption"), a.classificationType = this.get("classificationType"), "Manual" !== this.classificationType ? a.numClasses = this.get("numClasses") :
                    a.classBreaks = this.get("classBreaks"), this.get("boundingPolygonLayer") && (a.boundingPolygonLayer = h.toJson(l.constructAnalysisInputLyrObj(this.boundingPolygonLayer))), this.get("predictAtPointLayer") && (a.predictAtPointLayer = h.toJson(l.constructAnalysisInputLyrObj(this.predictAtPointLayer))), a.outputPredictionError = this.get("outputPredictionError"), this.returnFeatureCollection || (a.OutputName = h.toJson({
                        serviceProperties: {
                            name: this.get("outputName")
                        }
                    })), this.showChooseExtent && this._useExtentCheck.get("checked") &&
                    (a.context = h.toJson({
                        extent: this.map.extent._normalize(!0)
                    })), this.getCreditsEstimate(this.toolName, a).then(f.hitch(this, function(a) {
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
                    a.inputLayer = h.toJson(l.constructAnalysisInputLyrObj(this.get("inputLayer")));
                    a.field = this.get("field");
                    a.interpolateOption = this.get("interpolateOption");
                    a.classificationType = this.get("classificationType");
                    "Manual" !== this.classificationType ? a.numClasses = this.get("numClasses") : a.classBreaks = this.get("classBreaks");
                    this.get("boundingPolygonLayer") && (a.boundingPolygonLayer = h.toJson(l.constructAnalysisInputLyrObj(this.boundingPolygonLayer)));
                    this.get("predictAtPointLayer") && (a.predictAtPointLayer = h.toJson(l.constructAnalysisInputLyrObj(this.predictAtPointLayer)));
                    a.outputPredictionError = this.get("outputPredictionError");
                    this.predictAtPointLayer && this.get("outputPredictionError") ? this.resultParameter = ["predictedPointLayer",
                        "resultLayer", "predictionError"
                    ] : this.predictAtPointLayer && !this.get("outputPredictionError") ? this.resultParameter = ["predictedPointLayer", "resultLayer"] : !this.predictAtPointLayer && this.get("outputPredictionError") && (this.resultParameter = ["resultLayer", "predictionError"]);
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
                        tags: n.substitute(this.i18n.itemTags, {
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
                this.signInPromise.then(f.hitch(this, l.initHelpLinks, this.domNode, this.showHelp, {
                    analysisGpServer: this.analysisGpServer
                }));
                this.inputLayer && (z.set(this._interpolateToolDescription, "innerHTML", n.substitute(this.i18n.toolDefine, {
                    layername: this.inputLayer.name
                })), this._outputLayerInput.set("value", n.substitute(this.i18n.outputLayerName, {
                    layername: this.inputLayer.name
                })), this.set("fields", this.inputLayer));
                this.classificationType &&
                    this._classifySelect.set("value", this.classificationType);
                this.outputName && this._outputLayerInput.set("value", this.outputName);
                this.outputPredictionError && this._outoutPredictionsErrCheck.set("checked", this.outputPredictionError);
                if (this.boundingPolygonLayers) {
                    this._boundingAreaSelect.addOption({
                        value: "-1",
                        label: this.i18n.defaultBoundingOption,
                        selected: !0
                    });
                    var a = !1;
                    g.forEach(this.boundingPolygonLayers, function(b, c) {
                        "esriGeometryPolygon" === b.geometryType && (a = this.get("boundingPolygonLayer") && this.get("boundingPolygonLayer").name ===
                            b.name, this._boundingAreaSelect.addOption({
                                value: c + 1,
                                label: b.name,
                                selected: a
                            }))
                    }, this)
                }
                this.predictAtPointLayers && (this._predictPointSelect.addOption({
                    value: "-1",
                    label: this.i18n.choosePointLayer,
                    selected: !0
                }), g.forEach(this.predictAtPointLayers, function(a, c) {
                    if ("esriGeometryPoint" === a.geometryType && a !== this.inputLayer) {
                        var k = this.get("predictAtPointLayer") && this.get("predictAtPointLayer").name === a.name;
                        this._predictPointSelect.addOption({
                            value: c + 1,
                            label: a.name,
                            selected: k
                        })
                    }
                }, this));
                this.classBreaks &&
                    this._classBreaksInput.set("value", this.classBreaks.join().replace(/,/g, " "));
                e.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(f.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                e.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "block" : "none");
                e.set(this._showCreditsLink, "display", !0 === this.showCredits ? "block" :
                    "none")
            },
            _handleMethodChange: function(a) {
                "NN" === a ? (d.add(this._optionsDiv, "disabled"), d.contains(this._optionsDiv, "optionsOpen") && (d.remove(this._optionsDiv, "optionsOpen"), d.add(this._optionsDiv, "optionsClose"))) : (d.contains(this._optionsDiv, "disabled") && d.remove(this._optionsDiv, "disabled"), "KG" === a ? (e.set(this._barrierLabelRow, "display", "none"), e.set(this._barrierSelectRow, "display", "none"), e.set(this._speedLabelRow, "display", ""), e.set(this._speedSliderRow, "display", "")) : "LP" === a && (e.set(this._barrierLabelRow,
                    "display", ""), e.set(this._barrierSelectRow, "display", ""), e.set(this._speedLabelRow, "display", "none"), e.set(this._speedSliderRow, "display", "none")))
            },
            _handleOptimizeSliderChange: function(a) {
                console.log(a, this._optimizeSlider.get("value"));
                this.set("interpolateOption", this._optimizeSlider.get("value"))
            },
            _handleFieldChange: function(a) {},
            _handleOptionsBtnClick: function() {
                d.contains(this._optionsDiv, "disabled") || (d.contains(this._optionsDiv, "optionsClose") ? (d.remove(this._optionsDiv, "optionsClose"), d.add(this._optionsDiv,
                    "optionsOpen")) : d.contains(this._optionsDiv, "optionsOpen") && (d.remove(this._optionsDiv, "optionsOpen"), d.add(this._optionsDiv, "optionsClose")))
            },
            _handleBoundingSelectChange: function(a) {},
            _handleClick: function(a) {},
            _handlePredictPointSelectChange: function(a) {},
            _handleBoundingBtnChange: function(a) {
                a ? (this.emit("drawtool-activate", {}), this._featureLayer || this._createBoundingPolyFeatColl(), this._predictPointDrawBtn.set("checked", !1), this._toolbar.activate(p.POLYGON)) : (this._toolbar.deactivate(), this._predictPointDrawBtn.get("checked") ||
                    this.emit("drawtool-deactivate", {}))
            },
            _handlePredictPointChange: function(a) {
                a ? (this.emit("drawtool-activate", {}), this._pointfeatureLayer || this._createPointFeatColl(), this._pointtoolbar.activate(p.POINT), this._bndgPolyDrawBtn.set("checked", !1)) : (this._pointtoolbar.deactivate(), this._bndgPolyDrawBtn.get("checked") || this.emit("drawtool-deactivate", {}))
            },
            _handleClassifySelectChange: function(a) {
                e.set(this._classifyOtherOptionLabelRow, "display", "Manual" === a ? "none" : "block");
                e.set(this._classifyOtherOptionInputRow,
                    "display", "Manual" === a ? "none" : "block");
                e.set(this._manualOptionInputRow, "display", "Manual" === a ? "block" : "none");
                e.set(this._manualOptionLabelRow, "display", "Manual" === a ? "block" : "none")
            },
            _loadConnections: function() {
                this.on("start", f.hitch(this, "_onClose", !1));
                this._connect(this._closeBtn, "onclick", f.hitch(this, "_onClose", !0))
            },
            _createBoundingPolyFeatColl: function() {
                var a = l.createPolygonFeatureCollection(this.drawLayerName);
                this._featureLayer = new t(a, {
                    id: this.drawLayerName
                });
                this.map.addLayer(this._featureLayer);
                m.connect(this._featureLayer, "onClick", f.hitch(this, function(a) {
                    this.map.infoWindow.setFeatures([a.graphic])
                }))
            },
            _addFeatures: function(a) {
                var b = [],
                    c = {},
                    k = new r(r.STYLE_NULL, new s(s.STYLE_SOLID, new y([0, 0, 0]), 4));
                a = new u(a, k);
                this.map.graphics.add(a);
                c.description = "blayer desc";
                c.title = "blayer";
                a.setAttributes(c);
                b.push(a);
                this._featureLayer.applyEdits(b, null, null);
                if (0 === this.boundingPolygonLayers.length || this.boundingPolygonLayers[this.boundingPolygonLayers.length - 1] !== this._featureLayer) b = this.boundingPolygonLayers.push(this._featureLayer),
                    c = this._boundingAreaSelect.getOptions(), this._boundingAreaSelect.removeOption(c), c = g.map(c, function(a) {
                        a.selected = !1;
                        return a
                    }), this._boundingAreaSelect.addOption({
                        value: b,
                        label: this._featureLayer.name,
                        selected: !0
                    }), this._boundingAreaSelect.addOption(c)
            },
            _createPointFeatColl: function() {
                var a = l.createPointFeatureCollection(this.drawPointLayerName);
                this._pointfeatureLayer = new t(a, {
                    id: this.drawPointLayerName
                });
                this.map.addLayer(this._pointfeatureLayer);
                m.connect(this._pointfeatureLayer, "onClick", f.hitch(this,
                    function(a) {
                        this.map.infoWindow.setFeatures([a.graphic])
                    }))
            },
            _addPointFeatures: function(a) {
                var b = [],
                    c = {},
                    k = (new H({
                        height: 24,
                        width: 24,
                        contentType: "image/png",
                        type: "esriPMS",
                        url: "http://static.arcgis.com/images/Symbols/Basic/GreenStickpin.png"
                    })).setOffset(0, 12);
                a = new u(a, k);
                this.map.graphics.add(a);
                c.description = "blayer desc";
                c.title = "blayer";
                a.setAttributes(c);
                b.push(a);
                this._pointfeatureLayer.applyEdits(b, null, null);
                if (0 === this.predictAtPointLayers.length || this.predictAtPointLayers[this.predictAtPointLayers.length -
                    1] !== this._pointfeatureLayer) b = this.predictAtPointLayers.push(this._pointfeatureLayer), c = this._predictPointSelect.getOptions(), this._predictPointSelect.removeOption(c), c = g.map(c, function(a) {
                    a.selected = !1;
                    return a
                }), this._predictPointSelect.addOption({
                    value: b,
                    label: this._pointfeatureLayer.name,
                    selected: !0
                }), this._predictPointSelect.addOption(c)
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === n.trim(a).length ? (this._outputLayerInput.set("invalidMessage",
                    this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            validateClassBreaks: function() {
                var a, b = [],
                    c = [];
                a = f.trim(this._classBreaksInput.get("value")).split(" ");
                if ("Manual" !== this.get("classificationType")) return !0;
                if (!a && "Manual" === this.get("classificationType") || 2 > a.length || 32 < a.length) return !1;
                g.some(a, function(k, e) {
                    k = q.parse(k);
                    if (isNaN(k)) return b.push(0), !1;
                    if (c[a[e]]) return c[a[e]] = !1, b.push(0), !1;
                    c[a[e]] = !0;
                    var d = q.format(k, {
                        locale: "en-us"
                    });
                    (d = f.trim(d).match(/\D/g)) && 0 < d.length && d && g.forEach(d, function(a, c) {
                        "." === a || "," === a || "-" === a && 0 === c ? b.push(1) : b.push(0)
                    })
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
                var b,
                    c;
                g.forEach(a.fields, function(d, e) {
                    d.name !== a.objectIdField && -1 !== g.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], d.type) && (b = {
                        value: d.name,
                        label: F.isDefined(d.alias) && "" !== d.alias ? d.alias : d.name
                    }, this.field && b.value === this.field && (b.selected = "selected", c = d.name), this._fieldSelect.addOption(b))
                }, this);
                c && this._fieldSelect.set("value", c)
            },
            _setFieldAttr: function(a) {
                this.field = a
            },
            _getFieldAttr: function() {
                this._fieldSelect && (this.field = this._fieldSelect.get("value"));
                return this.field
            },
            _setInterpolateOptionAttr: function(a) {
                this.interpolateOption = a
            },
            _getInterpolateOptionAttr: function() {
                this._optimizeSlider && (this.interpolateOption = Math.floor(this._optimizeSlider.get("value")));
                return this.interpolateOption
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
                        b.push(q.parse(a))
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
            _getPredictAtPointLayerAttr: function() {
                this._predictPointSelect && (this.predictAtPointLayer = null, "-1" !== this._predictPointSelect.get("value") && (this.predictAtPointLayer = this.predictAtPointLayers[this._predictPointSelect.get("value") -
                    1]));
                return this.predictAtPointLayer
            },
            _setPredictAtPointLayerAttr: function(a) {
                this.predictAtPointLayer = a
            },
            _setPredictAtPointLayersAttr: function(a) {
                this.predictAtPointLayers = a
            },
            _getOutputPredictionErrorAttr: function() {
                this._outoutPredictionsErrCheck && (this.outputPredictionError = this._outoutPredictionsErrCheck.get("checked"));
                return this.outputPredictionError
            },
            _setOutputPredictionErrorAttr: function(a) {
                this.outputPredictionError = a
            },
            _getOutputNameAttr: function() {
                this._outputLayerInput && (this.outputName =
                    this._outputLayerInput.get("value"));
                return this.outputName
            },
            _setOutputNameAttr: function(a) {
                this.outputName = a
            },
            _setMapAttr: function(a) {
                this.map = a;
                this._toolbar = new p(this.map);
                m.connect(this._toolbar, "onDrawEnd", f.hitch(this, this._addFeatures));
                this._pointtoolbar = new p(this.map);
                m.connect(this._pointtoolbar, "onDrawEnd", f.hitch(this, this._addPointFeatures))
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
            _setDrawPointLayerNameAttr: function(a) {
                this.drawPointLayerName = a
            },
            _getDrawPointLayerNameAttr: function() {
                return this._pointfeatureLayer.name
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
            _setShowHelpAttr: function(a) {
                this.showHelp =
                    a
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
                this.showCredits = a
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
                this._pbConnects.push(m.connect(a, b, c))
            },
            onDrawToolActivate: function() {},
            onDrawToolDeactivate: function() {},
            onSave: function() {},
            onClose: function() {}
        })
    });