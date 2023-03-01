//>>built
define(["require", "dojo/aspect", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/fx/easing", "dojo/number", "dojo/on", "dojo/Evented", "dojo/store/Observable", "dojo/dom-geometry", "dojo/store/Memory", "dojo/window", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/FilteringSelect", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "dgrid/List", "../../kernel", "./AnalysisBase", "./CreditEstimator", "./utils", "./TrafficTime", "../geoenrichment/config", "../geoenrichment/DataBrowser", "../../tasks/geoenrichment/GeoenrichmentTask", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/EnrichLayer.html"],
    function(w, x, y, c, k, h, g, s, K, L, l, f, m, n, t, b, u, v, z, M, N, O, P, A, B, C, D, E, F, Q, R, S, T, U, V, W, X, Y, Z, $, G, aa, H, ba, q, ca, p, da, I, r, J) {
        return y([B, C, D, E, F, H], {
            declaredClass: "esri.dijit.analysis.EnrichLayer",
            templateString: J,
            basePath: w.toUrl("."),
            widgetsInTemplate: !0,
            inputLayer: null,
            outputLayerName: null,
            distance: null,
            showSelectFolder: !1,
            showChooseExtent: !0,
            enableTravelModes: !0,
            showTrafficWidget: !1,
            _isBufferSelectionEnabled: !0,
            showHelp: !0,
            showCredits: !0,
            returnFeatureCollection: !1,
            analysisVariables: null,
            i18n: null,
            toolName: "EnrichLayer",
            helpFileName: "EnrichLayer",
            resultParameter: "enrichedLayer",
            constructor: function(a) {
                this._pbConnects = [];
                this._statsRows = [];
                this._isLineEnabled = !1;
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                k.forEach(this._pbConnects, h.disconnect);
                delete this._pbConnects;
                this._driveTimeClickHandle && (h.disconnect(this._driveTimeClickHandle), this._driveTimeClickHandle = null)
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                c.mixin(this.i18n, r.bufferTool);
                c.mixin(this.i18n,
                    r.driveTimes);
                c.mixin(this.i18n, r.enrichLayerTool)
            },
            postCreate: function() {
                this.inherited(arguments);
                b.add(this._form.domNode, "esriSimpleForm");
                this._distanceInput.set("validator", c.hitch(this, this.validateDistance));
                this._outputLayerInput.set("validator", c.hitch(this, this.validateServiceName));
                this._buildUI();
                this.watch("analysisVariables", c.hitch(this, this._refreshGrid))
            },
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
                if (this._form.validate() && this.validateSelectedGrid()) {
                    a = {};
                    var e, d, b;
                    e = this.get("analysisVariables");
                    b = [];
                    d = [];
                    k.forEach(e, function(a) {
                        -1 !== a.indexOf(".*") ? d.push(a.split(".*")[0]) : b.push(a)
                    });
                    a.inputLayer = g.toJson(q.constructAnalysisInputLyrObj(this.inputLayer));
                    if (this._isBufferSelectionEnabled || this._isLineEnabled) a.bufferType = this.get("bufferType"), a.distance = this.get("distance"), a.units = this._distanceUnitsSelect.get("value");
                    this.get("country") && (a.country = this.get("country"));
                    d && 0 < d.length &&
                        (a.dataCollections = g.toJson(d));
                    b && 0 < b.length && (a.analysisVariables = g.toJson(b));
                    this.get("showTrafficWidget") && this._trafficTimeWidget.get("checked") && (a.TimeOfDay = this._trafficTimeWidget.get("timeOfDay"));
                    this.returnFeatureCollection || (a.OutputName = g.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    }));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = g.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.getCreditsEstimate(this.toolName, a).then(c.hitch(this,
                        function(a) {
                            this._usageForm.set("content", a);
                            this._usageDialog.show()
                        }))
                }
            },
            _handleSaveBtnClick: function() {
                if (this._form.validate() && this.validateSelectedGrid()) {
                    var a = {},
                        e = {},
                        d, b, c;
                    this._saveBtn.set("disabled", !0);
                    d = this.get("analysisVariables");
                    c = [];
                    b = [];
                    k.forEach(d, function(a) {
                        -1 !== a.indexOf(".*") ? b.push(a.split(".*")[0]) : c.push(a)
                    });
                    a.inputLayer = g.toJson(q.constructAnalysisInputLyrObj(this.inputLayer));
                    if (this._isBufferSelectionEnabled || this._isLineEnabled) a.bufferType = this.get("bufferType"), a.distance =
                        this.get("distance"), a.units = this._distanceUnitsSelect.get("value");
                    this.get("country") && (a.country = this.get("country"));
                    b && 0 < b.length && (a.dataCollections = b);
                    c && 0 < c.length && (a.analysisVariables = c);
                    this.get("showTrafficWidget") && this._trafficTimeWidget.get("checked") && (a.TimeOfDay = this._trafficTimeWidget.get("timeOfDay"));
                    this.returnFeatureCollection || (a.OutputName = g.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    }));
                    this.showChooseExtent && this._useExtentCheck.get("checked") &&
                        (a.context = g.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.returnFeatureCollection && (d = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (d.extent = this.map.extent._normalize(!0)), a.context = g.toJson(d));
                    e.jobParams = a;
                    this._saveBtn.set("disabled", !1);
                    e.itemParams = {
                        description: l.substitute(this.i18n.itemDescription, {
                            inputLayerName: this.inputLayer.name
                        }),
                        tags: l.substitute(this.i18n.itemTags, {
                            inputLayerName: this.inputLayer.name
                        }),
                        snippet: this.i18n.itemSnippet
                    };
                    this.showSelectFolder && (e.itemParams.folder =
                        this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
                    this.execute(e)
                }
            },
            _handleDistUnitsChange: function(a) {
                this.set("outputLayerName")
            },
            _handleDistanceTypeChange: function(a) {
                this.set("bufferType", a);
                b.remove(this._straightLine, "selected");
                b.remove(this._drivingTime, "selected");
                a && (b.add("time" === a ? this._drivingTime : this._straightLine, "selected"), this.get("showTrafficWidget") && (f.set(this._useTrafficRow, "display", "time" === a ? "" : "none"), this._trafficTimeWidget.set("disabled",
                    "time" !== a), this._trafficTimeWidget.set("reset", "time" !== a)));
                "time" === a ? (this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()), this._distanceUnitsSelect.addOption([{
                    value: "Seconds",
                    label: this.i18n.seconds
                }, {
                    value: "Minutes",
                    label: this.i18n.minutes,
                    selected: "selected"
                }, {
                    value: "Hours",
                    label: this.i18n.hours
                }])) : (this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()), this._distanceUnitsSelect.addOption([{
                    value: "Miles",
                    label: this.i18n.miles
                }, {
                    value: "Yards",
                    label: this.i18n.yards
                }, {
                    value: "Feet",
                    label: this.i18n.feet
                }, {
                    type: "separator"
                }, {
                    value: "Kilometers",
                    label: this.i18n.kilometers
                }, {
                    value: "Meters",
                    label: this.i18n.meters
                }]));
                this.set("outputLayerName")
            },
            _save: function() {},
            _buildUI: function() {
                var a;
                this.signInPromise.then(c.hitch(this, q.initHelpLinks, this.domNode, this.showHelp, {
                    analysisGpServer: this.analysisGpServer
                }));
                this._addBtn.set("disabled", !0);
                f.set(this._dataDialog.titleNode, "display", "none");
                f.set(this._dataDialog.titleBar, "display", "none");
                f.set(this._dataDialog.containerNode,
                    "padding", "0");
                this.signInPromise.then(c.hitch(this, function(b) {
                    a = this.portalUrl && -1 !== this.portalUrl.indexOf("dev") ? "dev" : this.portalUrl && -1 !== this.portalUrl.indexOf("qa") ? "qa" : "";
                    p.portalUrl = this.portalUrl;
                    p.server = location.protocol + "//geoenrich" + a + ".arcgis.com/arcgis/rest/services/World/GeoenrichmentServer";
                    this._task = new I(p.server);
                    this._task.token = p.token;
                    this.inputLayer && 0 < this.inputLayer.graphics.length && this._task.getCountries(this.inputLayer.graphics[0].geometry).then(c.hitch(this, function(a) {
                        a instanceof
                        Array && (this.country ? this._databrowser.countryID = this.country : (this._databrowser.countryID = a[0], this.set("country", a[0])), this._addBtn.set("disabled", !1))
                    }), c.hitch(this, function(a) {
                        console.log(a);
                        this._showMessages(a.message);
                        this.set("disableRunAnalysis", !0)
                    }))
                }));
                this.get("enableTravelModes") || this._updateTravelModes(this.enableTravelModes);
                this.inputLayer && (m.set(this._aggregateToolDescription, "innerHTML", l.substitute(this.i18n.enrichDefine, {
                        inputLayerName: this.inputLayer.name
                    })), "esriGeometryPolygon" ===
                    this.inputLayer.geometryType && (this._isBufferSelectionEnabled = !1, b.add(this._straightLine, "disabled"), b.remove(this._straightLine, "selected"), b.add(this._straightLineLabel, "disabled"), b.add(this._distanceInput, "disabled"), this._distanceInput.set("disabled", !0), b.add(this._distanceUnitsSelect, "disabled"), this._distanceUnitsSelect.set("disabled", !0), b.remove(this._straighLineIcon, "esriStraightLineDistanceIcon"), b.add(this._straighLineIcon, "esriStraightLineDistanceDisabledIcon"), this._updateTravelModes(!1)),
                    "esriGeometryPolyline" === this.inputLayer.geometryType && (this._updateTravelModes(!1), this._isLineEnabled = !0, this._isBufferSelectionEnabled = !1), this._outputLayerInput.set("value", l.substitute(this.i18n.outputLayerName, {
                        layername: this.inputLayer.name
                    })));
                this._loadConnections();
                (this._isBufferSelectionEnabled || this._isLineEnabled) && this._handleDistanceTypeChange("line");
                f.set(this._useTrafficRow, "display", this.get("showTrafficWidget") ? "" : "none");
                this.outputLayerName && this._outputLayerInput.set("value",
                    this.outputLayerName);
                f.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(c.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
                f.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "block" : "none");
                this.list = new G({
                    renderRow: c.hitch(this,
                        this._renderVariableRow)
                }, this._selectedList)
            },
            startup: function() {
                this.list.startup();
                f.set(this._selectLabelDiv, "display", "block");
                f.set(this._selectedList, "display", "none")
            },
            _renderVariableRow: function(a) {
                var b = n.create("div", {
                        "class": "ShoppingCartRowOuter"
                    }),
                    d = n.create("div", {
                        "class": "ShoppingCartRow"
                    }, b);
                n.create("div", {
                    "class": "TrimWithEllipses ShoppingCartRowLabel",
                    innerHTML: a.alias
                }, d);
                d = n.create("div", {
                    "class": "ShoppingCartRowCloser"
                }, d);
                m.set(d, "idDesc", a.idDesc);
                z(d, "click", c.hitch(this,
                    this._handledRemoveVarClick));
                return b
            },
            _handledRemoveVarClick: function(a) {
                this._databrowser.shoppingCart.onClick(a);
                this._databrowser._onOK()
            },
            validateSelectedGrid: function() {
                var a;
                (a = this.get("analysisVariables") && 0 !== this.get("analysisVariables").length) ? f.set(this._analysisVariablesCtr, "borderColor", "#EFEEEF") : (A.scrollIntoView(this._analysisVariablesCtr), f.set(this._analysisVariablesCtr, "borderColor", "#f94"));
                return a
            },
            validateDistance: function() {
                var a = this,
                    e, d = [];
                b.contains(this._drivingTime,
                    "selected");
                this.set("distance");
                e = c.trim(this._distanceInput.get("value"));
                if (!e) return !1;
                e = v.parse(e);
                if (isNaN(e)) return d.push(0), !1;
                e = v.format(e, {
                    locale: "en-us"
                });
                (e = c.trim(e).match(/\D/g)) && k.forEach(e, function(b) {
                    "." === b || "," === b ? d.push(1) : "-" === b && "polygon" === a.inputType ? d.push(1) : d.push(0)
                });
                return -1 !== k.indexOf(d, 0) ? !1 : !0
            },
            _loadConnections: function() {
                this.on("start", c.hitch(this, "_onClose", !0));
                this._connect(this._closeBtn, "onclick", c.hitch(this, "_onClose", !1));
                this._isBufferSelectionEnabled &&
                    (this.get("enableTravelModes") && (this._driveTimeClickHandle = h.connect(this._drivingTime, "onclick", c.hitch(this, "_handleDistanceTypeChange", "time"))), h.connect(this._straightLine, "onclick", c.hitch(this, "_handleDistanceTypeChange", "line")));
                this._connect(this._databrowser, "onOK", c.hitch(this, this._handleDataBrowserOk));
                this._connect(this._databrowser, "onCancel", c.hitch(this, this._handleDataBrowserCancel));
                x.after(this._databrowser, "loadPage", c.hitch(this, this._setCalciteButtons));
                this.watch("enableTravelModes",
                    c.hitch(this, function(a, b, d) {
                        this._updateTravelModes(d);
                        d && this._isBufferSelectionEnabled && !this._driveTimeClickHandle ? this._driveTimeClickHandle = h.connect(this._drivingTime, "onclick", c.hitch(this, "_handleDistanceTypeChange", "time")) : !d && this._driveTimeClickHandle && (h.disconnect(this._driveTimeClickHandle), this._driveTimeClickHandle = null)
                    }))
            },
            _handleDataBrowserOk: function() {
                this.set("analysisVariables", this._databrowser.selection);
                this._dataDialog.hide()
            },
            _handleDataBrowserCancel: function() {
                this._dataDialog.hide()
            },
            _handleShowDataDialogClick: function(a) {
                this._dataDialog.show()
            },
            _setCalciteButtons: function() {
                t(".calcite .DataCollectionButton").forEach(function(a) {
                    b.add(a, "btn secondary")
                });
                t(".calcite .Wizard_Button").forEach(function(a, c) {
                    m.get(a, "innerHTML") === this._databrowser.okButton ? b.add(a, "btn secondary") : b.add(a, "btn transparent")
                }, this)
            },
            _refreshGrid: function(a, b, c) {
                a = [];
                for (var g in this._databrowser.shoppingCart.content) this._databrowser.shoppingCart.content.hasOwnProperty(g) && a.push(this._databrowser.shoppingCart.content[g]);
                f.set(this._selectLabelDiv, "display", 0 === a.length ? "block" : "none");
                f.set(this._selectedList, "display", 0 === a.length ? "none" : "block");
                m.set(this.varCounter, "innerHTML", a.length.toString());
                this.list.refresh();
                this.list.renderArray(a)
            },
            _showMessages: function(a) {
                m.set(this._bodyNode, "innerHTML", a);
                s.fadeIn({
                    node: this._errorMessagePane,
                    easing: u.quadIn,
                    onEnd: c.hitch(this, function() {
                        f.set(this._errorMessagePane, {
                            display: ""
                        })
                    })
                }).play()
            },
            _handleCloseMsg: function(a) {
                a && a.preventDefault();
                s.fadeOut({
                    node: this._errorMessagePane,
                    easing: u.quadOut,
                    onEnd: c.hitch(this, function() {
                        f.set(this._errorMessagePane, {
                            display: "none"
                        })
                    })
                }).play()
            },
            _setAnalysisGpServerAttr: function(a) {
                a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
            },
            _setInputLayerAttr: function(a) {
                this.inputLayer = a
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
            _setMapAttr: function(a) {
                this.map = a
            },
            _getMapAttr: function() {
                return this.map
            },
            _setAnalysisVariablesAttr: function(a) {
                this._set("analysisVariables", a)
            },
            _getAnalysisVariablesAttr: function() {
                return this.analysisVariables
            },
            _setShowHelpAttr: function(a) {
                this.showHelp = a
            },
            _getShowHelpAttr: function() {
                return this.showHelp
            },
            _setShowTrafficWidgetAttr: function(a) {
                this.showTrafficWidget = a
            },
            _getShowTrafficWidgetAttr: function() {
                return this.showTrafficWidget
            },
            _setBufferTypeAttr: function(a) {
                "line" === a ? this.bufferType = "StraightLine" : "time" === a && (this.bufferType = "DrivingTime")
            },
            _getBufferTypeAttr: function() {
                return this.bufferType
            },
            _setDistanceAttr: function(a) {
                a && (this.distance = a)
            },
            _setShowCreditsAttr: function(a) {
                this.showCredits = a
            },
            _getShowCreditsAttr: function() {
                return this.showCredits
            },
            _getDistanceAttr: function() {
                return this.distance = this._distanceInput.get("value")
            },
            _setCountryAttr: function(a) {
                this.country = a
            },
            _getCountryAttr: function() {
                this._databrowser &&
                    (this.country = this._databrowser.countryID);
                return this.country
            },
            _setReturnFeatureCollectionAttr: function(a) {
                this.returnFeatureCollection = a
            },
            _getReturnFeatureCollectionAttr: function() {
                return this.returnFeatureCollection
            },
            _setEnableTravelModesAttr: function(a) {
                this._set("enableTravelModes", a)
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === l.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage",
                    this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(h.connect(a, b, c))
            },
            _updateTravelModes: function(a) {
                a ? (b.remove(this._drivingTime, "disabled"), b.add(this._drivingTimeLabel, "esriSelectLabel"), b.add(this._drivingTimeIcon, "esriDrivingTimeIcon"), b.remove(this._drivingTimeIcon, "esriDrivingTimeDisabledIcon")) : (b.add(this._drivingTime, "disabled"), b.contains(this._drivingTime,
                    "selected") && b.remove(this._drivingTime, "selected"), b.remove(this._drivingTimeLabel, "esriSelectLabel"), b.remove(this._drivingTimeIcon, "esriDrivingTimeIcon"), b.add(this._drivingTimeIcon, "esriDrivingTimeDisabledIcon"))
            },
            onSave: function() {},
            onClose: function() {}
        })
    });