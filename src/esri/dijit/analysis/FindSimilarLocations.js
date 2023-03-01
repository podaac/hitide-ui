//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Color", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/fx/easing", "dojo/dom-class", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ToggleButton", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/form/NumberSpinner", "dijit/Dialog", "dojox/form/CheckedMultiSelect", "../../kernel", "../../lang", "../../layers/FeatureLayer", "./AnalysisBase", "./utils", "./CreditEstimator", "./ExpressionForm", "../../geometry/Extent", "../../geometry/ScreenPoint", "../../symbols/CartographicLineSymbol", "../../symbols/SimpleMarkerSymbol", "../../symbols/SimpleLineSymbol", "../../symbols/SimpleFillSymbol", "../../tasks/query", "../../renderers/jsonUtils", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/FindSimilarLocations.html"],
    function(A, B, e, f, l, s, d, t, M, N, g, h, m, O, P, u, C, D, E, F, G, H, Q, R, S, T, U, V, W, X, Y, Z, $, aa, ba, ca, v, k, I, n, da, ea, J, w, r, x, p, y, q, K, z, L) {
        return B([D, E, F, G, H, I], {
            declaredClass: "esri.dijit.analysis.FindSimilarLocations",
            templateString: L,
            basePath: A.toUrl("."),
            widgetsInTemplate: !0,
            showSelectFolder: !1,
            showChooseExtent: !0,
            showHelp: !0,
            showCredits: !0,
            returnFeatureCollection: !1,
            i18n: null,
            toolName: "FindSimilarLocations",
            helpFileName: "FindSimilarLocations",
            resultParameter: "similarResultLayer",
            inputLayer: null,
            searchLayer: null,
            inputQuery: null,
            searchLayers: [],
            analysisFields: [],
            numberOfResults: 0,
            enableInputSelection: !0,
            selectionLayer: null,
            _isAttrFlag: !1,
            constructor: function(a) {
                this._pbConnects = [];
                a.containerNode && (this.container = a.containerNode);
                this._expression = null
            },
            destroy: function() {
                this.inherited(arguments);
                f.forEach(this._pbConnects, s.disconnect);
                delete this._pbConnects;
                delete this._mapClickHandle
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                e.mixin(this.i18n, z.findSimilarLocations);
                e.mixin(this.i18n, z.expressionGrid)
            },
            postCreate: function() {
                this.inherited(arguments);
                C.add(this._form.domNode, "esriSimpleForm");
                h.set(this._attrSelect.selectNode, "width", "80%");
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
                });
                this.selectionLayer && (this.selectionLayer.clearSelection(), this.map.removeLayer(this.selectionLayer), this.selectionLayer = null);
                this._mapClickHandle &&
                    delete this._mapClickHandle
            },
            clear: function() {
                this.selectionLayer && (this.selectionLayer.clearSelection(), this.map.removeLayer(this.selectionLayer), this.selectionLayer = null);
                this._mapClickHandle && delete this._mapClickHandle
            },
            _handleSaveBtnClick: function() {
                if (this._form.validate()) {
                    this._saveBtn.set("disabled", !0);
                    var a = {},
                        b = {},
                        c;
                    a.inputLayer = d.toJson(n.constructAnalysisInputLyrObj(this.inputLayer));
                    this.get("InputQuery") && (a.inputQuery = this.inputQuery);
                    a.searchLayer = d.toJson(n.constructAnalysisInputLyrObj(this.get("searchLayer")));
                    a.analysisFields = this.get("analysisFields");
                    a.numberOfResults = this.get("numberOfResults");
                    this.returnFeatureCollection || (a.OutputName = d.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    }));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = d.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.returnFeatureCollection && (c = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)), a.context = d.toJson(c));
                    b.jobParams = a;
                    b.itemParams = {
                        description: void 0,
                        tags: g.substitute(this.i18n.itemTags, {
                            analysisLayerName: this.inputLayer.name
                        }),
                        snippet: this.i18n.itemSnippet
                    };
                    this.showSelectFolder && (b.itemParams.folder = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
                    this.execute(b)
                }
            },
            _handleShowCreditsClick: function(a) {
                a.preventDefault();
                a = {};
                var b;
                this._form.validate() && (a.inputLayer = d.toJson(n.constructAnalysisInputLyrObj(this.inputLayer)), this.get("InputQuery") && (a.inputQuery = this.inputQuery),
                    a.searchLayer = d.toJson(n.constructAnalysisInputLyrObj(this.get("searchLayer"))), a.analysisFields = this.get("analysisFields"), a.numberOfResults = this.get("numberOfResults"), this.returnFeatureCollection || (a.OutputName = d.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    })), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = d.toJson({
                        extent: this.map.extent._normalize(!0)
                    })), this.returnFeatureCollection && (b = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (b.extent =
                        this.map.extent._normalize(!0)), a.context = d.toJson(b)), this.getCreditsEstimate(this.toolName, a).then(e.hitch(this, function(a) {
                        this._usageForm.set("content", a);
                        this._usageDialog.show()
                    })))
            },
            _save: function() {},
            _buildUI: function() {
                this._loadConnections();
                this.signInPromise.then(e.hitch(this, n.initHelpLinks, this.domNode, this.showHelp, {
                    analysisGpServer: this.analysisGpServer
                }));
                m.set(this._toolDescription, "innerHTML", g.substitute(this.i18n.toolDefine, {
                    layername: this.inputLayer.name
                }));
                this.outputLayerName ?
                    this._outputLayerInput.set("value", this.outputLayerName) : this._outputLayerInput.set("value", g.substitute(this.i18n.outputLayerName, {
                        analysisLayerName: this.inputLayer.name
                    }));
                h.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(e.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                h.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ?
                    "block" : "none");
                h.set(this._showCreditsLink, "display", !0 === this.showCredits ? "block" : "none");
                this.searchLayers && f.forEach(this.searchLayers, function(a, b) {
                    this._candidateSelect.addOption({
                        value: b + 1,
                        label: a.name
                    })
                }, this);
                this._selectBtn.set("disabled", !this.enableInputSelection);
                this._queryBtn.set("disabled", !this.enableInputSelection);
                this.set("analysisFields");
                this._expressionForm.set("showFirstRow", !1);
                this._expressionForm.set("firstOperands", [this.inputLayer]);
                this._expressionForm.set("inputOperands", [this.inputLayer]);
                this._expressionForm.set("selectedFirstOperand", this.inputLayer);
                this._expressionForm.init();
                this._expressionForm.on("add-expression", e.hitch(this, this._handleExpressionFormAdd));
                this._expressionForm.on("cancel-expression", e.hitch(this, this._handleExpressionFormCancel))
            },
            _loadConnections: function() {
                this.on("start", e.hitch(this, "_onClose", !0));
                this._connect(this._closeBtn, "onclick", e.hitch(this, "_onClose", !1))
            },
            _setAnalysisGpServerAttr: function(a) {
                a && (this.analysisGpServer = a, this.set("toolServiceUrl",
                    this.analysisGpServer + "/" + this.toolName))
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
            _setSearchLayersAttr: function(a) {
                this.searchLayers = a
            },
            _getSearchLayersAttr: function() {
                return this.searchLayers
            },
            _setSearchLayerAttr: function(a) {
                this.searchLayers = a
            },
            _getSearchLayerAttr: function() {
                this._candidateSelect && "-1" !== this._candidateSelect.get("value") ?
                    this.searchLayer = this.searchLayers[this._candidateSelect.get("value") - 1] : "-1" === this._candidateSelect.get("value") && (this.searchLayer = null);
                return this.searchLayer
            },
            _setInputLayerAttr: function(a) {
                this.inputLayer = a;
                this.set("selectionLayer")
            },
            _getInputLayerAttr: function() {
                return this.inputLayer
            },
            _setShowChooseExtentAttr: function(a) {
                this.showChooseExtent = a
            },
            _getShowChooseExtentAttr: function() {
                return this.showChooseExtent
            },
            _setEnableInputSelectionAttr: function(a) {
                this.enableInputSelection = a
            },
            _getEnableInputSelectionAttr: function() {
                return this.enableInputSelection
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
            _setAnalysisFieldsAttr: function() {
                var a, b;
                if (this.get("inputLayer") &&
                    this.get("searchLayer") && !(0 === this.inputLayer.fields.length || 0 === this.searchLayer.fields.length)) b = this.inputLayer.fields, a = f.map(this.searchLayer.fields, function(a) {
                    return a.name
                }), b = f.filter(b, function(b) {
                    if (-1 !== f.indexOf(a, b.name) && -1 !== f.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], b.type) && (b.name !== this.inputLayer.objectIdField || b.name !== this.searchLayer.objectIdField)) return !0
                }, this), b = f.map(b, function(a) {
                    return {
                        value: a.name,
                        label: v.isDefined(a.alias) &&
                            "" !== a.alias ? a.alias : a.name
                    }
                }), this._attrSelect && (this._attrSelect.removeOption(this._attrSelect.get("options")), this._attrSelect.addOption(b)), this.analysisFields = b
            },
            _getAnalysisFieldsAttr: function() {
                this._attrSelect && (this.analysisFields = this._attrSelect.get("value"));
                return this.analysisFields
            },
            _setInputQueryAttr: function(a) {
                this.inputQuery = a
            },
            _getInputQueryAttr: function() {
                return this.inputQuery
            },
            _setNumberOfResultsAttr: function(a) {
                this.numberOfResults = a
            },
            _getNumberOfResultsAttr: function() {
                return this.numberOfResults
            },
            _getInputQueryObjAttr: function() {
                var a = null;
                this.get("InputQuery") && (a = {
                    operator: "",
                    layer: 0
                }, a.where = this.inputQuery);
                return this.inputQueryObj = a
            },
            _setSelectionLayerAttr: function() {
                this.selectionLayer = new k(this.inputLayer.url && !this.inputLayer._collection ? this.inputLayer.url : this.inputLayer.toJson(), {
                    outFields: ["*"],
                    mode: this.inputLayer.url && !this.inputLayer._collection ? k.MODE_SELECTION : k.MODE_SNAPSHOT
                });
                this.selectionLayer.setRenderer(null);
                this.selectionLayer.on("selection-complete", e.hitch(this,
                    this._handleInputLayerSelectionComplete));
                if (this.selectionLayer.loaded) this._onSelectionLayerLoad(this.inputLayer, this.selectionLayer);
                else this.selectionLayer.on("load", e.hitch(this, this._onSelectionLayerLoad, this.inputLayer, this.selectionLayer))
            },
            _onSelectionLayerLoad: function(a, b) {
                var c;
                a.renderer && (b.setRenderer(K.fromJson(a.renderer.toJson())), v.isDefined(a.renderer.isMaxInclusive) && (b.renderer.isMaxInclusive = a.renderer.isMaxInclusive));
                b.setScaleRange(a.minScale, a.maxScale);
                this._connect(a,
                    "onScaleRangeChange", e.hitch(this, function(a, b) {
                        a.setScaleRange(b.minScale, b.maxScale)
                    }, b, a));
                this.map.addLayer(b);
                "esriGeometryPoint" === b.geometryType || "esriGeometryMultPoint" === b.geometryType ? (c = new x, c.setStyle(x.STYLE_TARGET), c._setDim(16, 16, 7), c.setOutline(new r(p.STYLE_SOLID, new l([0, 255, 255]), 2, r.CAP_ROUND, r.JOIN_ROUND)), c.setColor(new l([0, 0, 0, 0])), b.setSelectionSymbol(c)) : "esriGeometryPolyline" === b.geometryType ? b.setSelectionSymbol(new p(p.STYLE_SOLID, new l([0, 255, 255]), 2)) : "esriGeometryPolygon" ===
                    b.geometryType && b.setSelectionSymbol(new y(y.STYLE_NULL, new p(p.STYLE_SOLID, new l([0, 255, 255]), 2), new l([0, 0, 0, 0])))
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === g.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            _setPrimaryActionButttonClassAttr: function(a) {
                this.primaryActionButttonClass =
                    a
            },
            _getPrimaryActionButttonClassAttr: function() {
                return this.primaryActionButttonClass
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(s.connect(a, b, c))
            },
            validate: function() {
                this.get("searchLayer") && this.get("inputLayer").id === this.get("searchLayer").id && !this.get("inputQuery") ? (this._showMessages(this.i18n.reqSelectionMsg), this.set("disableRunAnalysis", !0)) : this.get("searchLayer") && 0 === this._attrSelect.getOptions().length ? (this._showMessages(this.i18n.noFieldMatchMsg), this.set("disableRunAnalysis", !0)) : (this._handleCloseMsg(), this.set("disableRunAnalysis", !1))
            },
            _handleCandidateChange: function(a) {
                this.set("analysisFields");
                this.validate()
            },
            _handleQueryButtonClick: function() {
                this._expDialog.set("title", this.i18n.query);
                this._selectBtn.set("checked", !1);
                this._isAttrFlag = !0;
                this._expression ? (this._expressionForm.set("action", "edit"), this._expressionForm.set("expression", this._expression.expression)) : this._expressionForm.set("action", "add");
                this._expDialog.show()
            },
            _handleExpressionFormAdd: function(a) {
                this.selectionLayer &&
                    this.selectionLayer.clearSelection();
                if ("add" === a.action || "edit" === a.action) {
                    m.set(this._filterLabel, "innerHTML", g.trim(a.expression._attributeText));
                    this._expression = a;
                    var b;
                    b = new q;
                    b.returnGeometry = !0;
                    b.where = a.expression.where;
                    this.selectionLayer.selectFeatures(b, k.SELECTION_ADD)
                }
                this._expDialog.hide();
                this.set("inputQuery", a.expression.where);
                this.validate()
            },
            _handleExpressionFormCancel: function() {
                this._expDialog.hide()
            },
            _handleTopRankRadioChange: function(a) {
                this._ranksInput.set("disabled", !a);
                a && this.set("numberOfResults", this._ranksInput.get("value"))
            },
            _handleAllRankRadioChange: function(a) {
                a && this.set("numberOfResults", 0)
            },
            _handleTopRankInputChange: function(a) {
                this.set("numberOfResults", a)
            },
            _handleSelectionButtonClick: function(a) {
                a && !this._mapClickHandle ? (this._mapClickHandle = this.map.on("click", e.hitch(this, this._handleMapClick)), this.emit("selectool-activate", {}), this._isAttrFlag = !1) : (this._mapClickHandle.remove(), this._mapClickHandle = null, this.emit("selectool-deactivate", {}))
            },
            _handleMapClick: function(a) {
                var b,
                    c, d;
                !this._isAttrFlag && this._expression && this.selectionLayer.clearSelection();
                c = 6;
                (b = this.inputLayer.renderer) && "esri.renderer.SimpleRenderer" === b.declaredClass ? (d = b.symbol, d.xoffset && (c = Math.max(c, Math.abs(d.xoffset))), d.yoffset && (c = Math.max(c, Math.abs(d.yoffset)))) : b && ("esri.renderer.UniqueValueRenderer" === b.declaredClass || "esri.renderer.ClassBreaksRenderer" === b.declaredClass) && f.forEach(b.infos, function(a) {
                    d = a.symbol;
                    d.xoffset && (c = Math.max(c, Math.abs(d.xoffset)));
                    d.yoffset && (c = Math.max(c, Math.abs(d.yoffset)))
                });
                b = a.screenPoint;
                a = this.map.toMap(new w(b.x - c, b.y + c));
                b = this.map.toMap(new w(b.x + c, b.y - c));
                a = new J(a.x, a.y, b.x, b.y, this.map.spatialReference);
                b = new q;
                b.returnGeometry = !0;
                b.geometry = a;
                b.where = this.inputLayer.getDefinitionExpression();
                this.inputLayer.queryFeatures(b).then(e.hitch(this, function(a) {
                    if (a) {
                        var b, c, d;
                        d = [];
                        b = [];
                        0 < this.selectionLayer.getSelectedFeatures().length && (c = f.map(this.selectionLayer.getSelectedFeatures(), function(a) {
                            return a.attributes[this.selectionLayer.objectIdField]
                        }, this));
                        f.forEach(a.features,
                            function(a) {
                                c ? c && -1 === f.indexOf(c, a.attributes[this.selectionLayer.objectIdField]) ? b.push(a.attributes[this.selectionLayer.objectIdField]) : d.push(a.attributes[this.selectionLayer.objectIdField]) : b.push(a.attributes[this.selectionLayer.objectIdField])
                            }, this);
                        0 < b.length && (a = new q, a.returnGeometry = !0, a.objectIds = b, this.selectionLayer.selectFeatures(a, k.SELECTION_ADD));
                        0 < d.length && (a = new q, a.returnGeometry = !0, a.objectIds = d, this.selectionLayer.selectFeatures(a, k.SELECTION_SUBTRACT))
                    }
                }))
            },
            _showMessages: function(a) {
                m.set(this._bodyNode,
                    "innerHTML", a);
                t.fadeIn({
                    node: this._errorMessagePane,
                    easing: u.quadIn,
                    onEnd: e.hitch(this, function() {
                        h.set(this._errorMessagePane, {
                            display: ""
                        })
                    })
                }).play()
            },
            _handleCloseMsg: function(a) {
                a && a.preventDefault();
                t.fadeOut({
                    node: this._errorMessagePane,
                    easing: u.quadOut,
                    onEnd: e.hitch(this, function() {
                        h.set(this._errorMessagePane, {
                            display: "none"
                        })
                    })
                }).play()
            },
            _handleInputLayerSelectionComplete: function(a) {
                a = this.selectionLayer.getSelectedFeatures();
                var b;
                !this._isAttrFlag && 0 < a.length && (b = "", f.map(a, function(a) {
                    b +=
                        this.selectionLayer.objectIdField + " \x3d " + a.attributes[this.selectionLayer.objectIdField] + " OR ";
                    return a.attributes[this.selectionLayer.objectIdField]
                }, this), b = b.substring(0, b.lastIndexOf(" OR ")), m.set(this._filterLabel, "innerHTML", g.substitute(this.i18n.selectedFeaturesLabel, {
                    total: a.length
                })), this.set("inputQuery", b), this._expression = null, this.validate());
                !this._isAttrFlag && 0 === a.length && (m.set(this._filterLabel, "innerHTML", ""), this.set("inputQuery", null), this._expression = null, this.validate())
            }
        })
    });