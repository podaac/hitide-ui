//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/fx/easing", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "../../kernel", "../../lang", "./AnalysisBase", "./CreditEstimator", "./utils", "./TrafficTime", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/ConnectOriginsToDestinations.html"],
    function(s, t, b, e, g, d, n, B, C, l, c, p, D, E, f, q, F, u, v, w, x, y, G, H, I, J, K, L, M, N, O, P, r, z, Q, h, R, m, A) {
        return t([u, v, w, x, y, z], {
            declaredClass: "esri.dijit.analysis.ConnectOriginsToDestinations",
            templateString: A,
            basePath: s.toUrl("."),
            widgetsInTemplate: !0,
            originLayer: null,
            destinationLayer: null,
            measurementType: "DrivingTime",
            outputLayerName: null,
            showSelectFolder: !1,
            showChooseExtent: !0,
            showHelp: !0,
            showCredits: !0,
            distanceDefaultUnits: "Miles",
            returnFeatureCollection: !1,
            originRouteIDField: null,
            destinationRouteIDField: null,
            i18n: null,
            toolName: "ConnectOriginsToDestinations",
            helpFileName: "ConnectOriginsToDestinations",
            resultParameter: "resultLayer",
            constructor: function(a, k) {
                this._pbConnects = [];
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                e.forEach(this._pbConnects, g.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                b.mixin(this.i18n, m.common);
                b.mixin(this.i18n, m.bufferTool);
                b.mixin(this.i18n, m.driveTimes);
                b.mixin(this.i18n, m.routeOriginDestinationPairsTool)
            },
            postCreate: function() {
                this.inherited(arguments);
                f.add(this._form.domNode, "esriSimpleForm");
                this.outputLayerInput.set("validator", b.hitch(this, this.validateServiceName));
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
                a = {};
                this._form.validate() && (a.originLayer = d.toJson(h.constructAnalysisInputLyrObj(this.originLayer)), a.destinationLayer = d.toJson(h.constructAnalysisInputLyrObj(this.get("destinationLayer"))),
                    a.measurementType = this.get("measurementType"), a.originRouteIDField = this.get("originRouteIDField"), a.destinationRouteIDField = this.get("destinationRouteIDField"), this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay"))), this.returnFeatureCollection || (a.OutputName = d.toJson({
                        serviceProperties: {
                            name: this.outputLayerInput.get("value")
                        }
                    })),
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = d.toJson({
                        extent: this.map.extent._normalize(!0)
                    })), console.log(a), this.getCreditsEstimate(this.toolName, a).then(b.hitch(this, function(a) {
                        this._usageForm.set("content", a);
                        this._usageDialog.show()
                    })))
            },
            _handleSaveBtnClick: function(a) {
                a = {};
                var k = {},
                    b;
                this._form.validate() && (this._saveBtn.set("disabled", !0), a.originLayer = d.toJson(h.constructAnalysisInputLyrObj(this.originLayer)), a.destinationLayer = d.toJson(h.constructAnalysisInputLyrObj(this.get("destinationLayer"))),
                    a.measurementType = this.get("measurementType"), this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay"))), this.returnFeatureCollection || (a.OutputName = d.toJson({
                        serviceProperties: {
                            name: this.outputLayerInput.get("value")
                        }
                    })), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = d.toJson({
                        extent: this.map.extent._normalize(!0)
                    })),
                    this.returnFeatureCollection && (b = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (b.extent = this.map.extent._normalize(!0)), a.context = d.toJson(b)), k.jobParams = a, k.itemParams = {
                        description: l.substitute(this.i18n.itemDescription, {
                            layername: this.originLayer.name,
                            distance_field: a.Distances || a.Field,
                            units: a.Units
                        }),
                        tags: l.substitute(this.i18n.itemTags, {
                            layername: this.originLayer.name
                        }),
                        snippet: this.i18n.itemSnippet
                    }, this.showSelectFolder && (k.itemParams.folder = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item,
                        "id") : ""), this.execute(k))
            },
            _save: function() {},
            _buildUI: function() {
                h.initHelpLinks(this.domNode, this.showHelp);
                p.set(this._tripCalToolDescription, "innerHTML", l.substitute(this.i18n.toolDefine, {
                    layername: this.originLayer.name
                }));
                c.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(b.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                c.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "block" : "none");
                this.measurmentType && this._handleMeasurmentTypeChange(this.measurementType);
                this.featureLayers && e.forEach(this.featureLayers, function(a, b) {
                    this._destPointLyrSelect.addOption({
                        value: b + 1,
                        label: a.name
                    });
                    this.destinationLayer && this.destinationLayer === a && this._destPointLyrSelect.set("value", this.destinationLayer)
                }, this);
                this.destinationLayer || (this._destPointLyrSelect.set("value", 1), this.set("destinationLayer", this.featureLayers[0]));
                this.originLayer && this.originLayer.graphics && 1 >= this.originLayer.graphics.length || this.destinationLayer && 1 >= this.destinationLayer.graphics.length ? c.set(this._routeIdRow, "display", "none") : c.set(this._routeIdRow, "display", "table");
                if (this.originLayer && this.originLayer.graphics && 1 < this.originLayer.graphics.length) {
                    var a = this.originLayer.fields;
                    this._originRouteIdSelect.removeOption(this._originRouteIdSelect.getOptions());
                    e.forEach(a, function(a, b) {
                        -1 !== e.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger",
                            "esriFieldTypeSingle", "esriFieldTypeString", "esriFieldTypeDate"
                        ], a.type) && this._originRouteIdSelect.addOption({
                            value: a.name,
                            label: r.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                        })
                    }, this);
                    this.originRouteIDField && this._orginRouteIdSelect.set("value", this.originRouteIDField)
                }
                this._loadConnections()
            },
            _setAnalysisGpServerAttr: function(a) {
                a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
            },
            _setOriginLayerAttr: function(a) {
                "esriGeometryPoint" === a.geometryType &&
                    (this.originLayer = a)
            },
            _getOriginLayerAttr: function() {
                return this.originLayer
            },
            _setFeatureLayersAttr: function(a) {
                this.featureLayers = e.filter(a, function(a) {
                    if (a !== this.originLayer && "esriGeometryPoint" === a.geometryType) return !0
                }, this)
            },
            _getFeatureLayersAttr: function(a) {
                return this.featureLayers
            },
            _setDisableRunAnalysisAttr: function(a) {
                this._saveBtn.set("disabled", a)
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === l.trim(a).length ? (this.outputLayerInput.set("invalidMessage",
                    this.i18n.requiredValue), !1) : b ? (this.outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this.outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            _setShowSelectFolderAttr: function(a) {
                this.showSelectFolder = a
            },
            _getShowSelectFolderAttr: function() {
                return this.showSelectFolder
            },
            _setMapAttr: function(a) {
                this.map = a
            },
            _getMapAttr: function() {
                return this.map
            },
            _setMeasurementTypeAttr: function(a) {
                console.log("type is", a);
                this.measurementType = a
            },
            _getMeasurementTypeAttr: function() {
                return this.measurementType
            },
            _setDistanceDefaultUnitsAttr: function(a) {
                this.distanceDefaultUnits = a
            },
            _getDistanceDefaultUnitsAttr: function() {
                return this.distanceDefaultUnits
            },
            _setShowCreditsAttr: function(a) {
                this.showCredits = a
            },
            _getShowCreditsAttr: function() {
                return this.showCredits
            },
            _setShowChooseExtentAttr: function(a) {
                this.showChooseExtent = a
            },
            _getShowChooseExtentAttr: function() {
                return this.showChooseExtent
            },
            _setReturnFeatureCollectionAttr: function(a) {
                this.returnFeatureCollection = a
            },
            _getReturnFeatureCollectionAttr: function() {
                return this.returnFeatureCollection
            },
            _setShowHelpAttr: function(a) {
                this.showHelp = a
            },
            _getShowHelpAttr: function() {
                return this.showHelp
            },
            _setDestinationLayerAttr: function(a) {
                this.destinationLayer = a
            },
            _getDestinationLayerAttr: function() {
                this._destPointLyrSelect && (this.destinationLayer = this.featureLayers[this._destPointLyrSelect.get("value") - 1]);
                return this.destinationLayer
            },
            _setOriginRouteIDFieldAttr: function(a) {
                this.originRouteIDField = a
            },
            _getOriginRouteIDFieldAttr: function() {
                this._originRouteIdSelect && this._isRouteIdAvailable() && (this.originRouteIDField =
                    this._originRouteIdSelect.get("value"));
                return this.originRouteIDField
            },
            _setDestinationRouteIDFieldAttr: function(a) {
                this.destinationRouteIDField = a
            },
            _getDestinationRouteIDFieldAttr: function() {
                this._destnRouteIdSelect && this._isRouteIdAvailable && (this.destinationRouteIDField = this._destnRouteIdSelect.get("value"));
                return this.destinationRouteIDField
            },
            _setOutputLayerNameAttr: function(a) {
                this.outputLayerName = a;
                this.outputLayerInput && this.outputLayerInput.set("value", this.outputLayerName)
            },
            _loadConnections: function() {
                this.on("start",
                    b.hitch(this, "_onClose", !0));
                this._connect(this._closeBtn, "onclick", b.hitch(this, "_onClose", !1));
                g.connect(this._drivingDistance, "onclick", b.hitch(this, "_handleMeasurmentTypeChange", "DrivingDistance"));
                g.connect(this._drivingTime, "onclick", b.hitch(this, "_handleMeasurmentTypeChange", "DrivingTime"));
                g.connect(this._straightLine, "onclick", b.hitch(this, "_handleMeasurmentTypeChange", "StraightLine"))
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(g.connect(a, b, c))
            },
            _handleDestPointsChange: function() {},
            _handleMeasurmentTypeChange: function(a) {
                this.set("measurementType", a);
                f.remove(this._drivingTime, "selected");
                f.remove(this._drivingDistance, "selected");
                f.remove(this._straightLine, "selected");
                a && (c.set(this._useTrafficLabelRow, "display", "DrivingTime" === a ? "" : "none"), this._trafficTimeWidget.set("disabled", "time" !== a), this._trafficTimeWidget.set("reset", "time" !== a));
                "DrivingTime" === a ? f.add(this._drivingTime, "selected") : f.add("StraightLine" === a ? this._straightLine : this._drivingDistance, "selected")
            },
            _handleDestinationLayerChange: function(a) {
                console.log("detLayer",
                    a);
                this._destnRouteIdSelect.removeOption(this._destnRouteIdSelect.getOptions());
                this.originLayer.graphics && 1 < this.originLayer.graphics.length && 1 < this.featureLayers[a - 1].graphics.length ? this.featureLayers[a - 1].graphics && this.featureLayers[a - 1].graphics.length !== this.originLayer.graphics.length ? (this._showMessages(this.i18n.inValidNumberRecordsMsg), this.set("disableRunAnalysis", !0), c.set(this._routeIdRow, "display", "none")) : (this._handleCloseMsg(), c.set(this._routeIdRow, "display", "table"), this.set("disableRunAnalysis", !1), console.log(this.featureLayers[a - 1].fields), a = this.featureLayers[a - 1].fields, e.forEach(a, function(a, b) {
                    -1 !== e.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeString", "esriFieldTypeDate"], a.type) && this._destnRouteIdSelect.addOption({
                        value: a.name,
                        label: r.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                    })
                }, this)) : (c.set(this._routeIdRow, "display", "none"), this.set("disableRunAnalysis", !1), this._handleCloseMsg())
            },
            _isRouteIdAvailable: function() {
                var a = !1;
                this.originLayer.graphics && 1 < this.originLayer.graphics.length && 1 < this.featureLayers[this._destPointLyrSelect.get("value") - 1].graphics.length && this.originLayer.graphics && this.originLayer.graphics.length === this.featureLayers[this._destPointLyrSelect.get("value") - 1].graphics.length && (a = !0);
                return a
            },
            _showMessages: function(a) {
                p.set(this._bodyNode, "innerHTML", a);
                n.fadeIn({
                    node: this._errorMessagePane,
                    easing: q.quadIn,
                    onEnd: b.hitch(this, function() {
                        c.set(this._errorMessagePane, {
                            display: ""
                        })
                    })
                }).play()
            },
            _handleCloseMsg: function(a) {
                a && a.preventDefault();
                n.fadeOut({
                    node: this._errorMessagePane,
                    easing: q.quadOut,
                    onEnd: b.hitch(this, function() {
                        c.set(this._errorMessagePane, {
                            display: "none"
                        })
                    })
                }).play()
            },
            onSave: function() {},
            onClose: function() {}
        })
    });