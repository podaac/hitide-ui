//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "../../kernel", "./AnalysisBase", "./CreditEstimator", "./utils", "./TrafficTime", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/CreateDriveTimeAreas.html"],
    function(q, r, c, g, h, e, A, B, f, l, s, C, D, k, m, t, u, v, w, x, E, F, G, H, I, J, K, L, M, N, y, O, n, P, p, z) {
        return r([t, u, v, w, x, y], {
            declaredClass: "esri.dijit.analysis.CreateDriveTimeAreas",
            templateString: z,
            basePath: q.toUrl("."),
            widgetsInTemplate: !0,
            inputLayer: null,
            inputType: null,
            outputLayerName: null,
            breakValues: null,
            showSelectFolder: !1,
            showChooseExtent: !0,
            overlapPolicy: "Overlap",
            showHelp: !0,
            showCredits: !0,
            distanceDefaultUnits: "Miles",
            returnFeatureCollection: !1,
            travelMode: "Driving",
            i18n: null,
            toolName: "CreateDriveTimeAreas",
            helpFileName: "CreateDriveTimeAreas",
            resultParameter: "DriveTimeAreasLayer",
            constructor: function(a, b) {
                this._pbConnects = [];
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                g.forEach(this._pbConnects, h.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                c.mixin(this.i18n, p.bufferTool);
                c.mixin(this.i18n, p.driveTimes)
            },
            postCreate: function() {
                this.inherited(arguments);
                k.add(this._form.domNode, "esriSimpleForm");
                this._breakValuesInput.set("validator",
                    c.hitch(this, this.validateDistance));
                this.outputLayerInput.set("validator", c.hitch(this, this.validateServiceName));
                this.breakValues = [];
                this.breakValues.push(this._breakValuesInput.get("value"));
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
            _toUpperFirstLetter: function(a) {
                return a.slice(0, 1).toUpperCase() + a.slice(1)
            },
            _handleShowCreditsClick: function(a) {
                a.preventDefault();
                a = {};
                this._form.validate() && (a.InputLayer =
                    e.toJson(n.constructAnalysisInputLyrObj(this.inputLayer)), a.BreakValues = e.toJson(this.get("breakValues")), a.Breakunits = this.get("breakUnits"), a.OverlapPolicy = this.get("overlapPolicy"), this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay"))), this.returnFeatureCollection || (a.OutputName = e.toJson({
                        serviceProperties: {
                            name: this.outputLayerInput.get("value")
                        }
                    })),
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = e.toJson({
                        extent: this.map.extent._normalize(!0)
                    })), this.getCreditsEstimate(this.toolName, a).then(c.hitch(this, function(a) {
                        this._usageForm.set("content", a);
                        this._usageDialog.show()
                    })))
            },
            _handleSaveBtnClick: function(a) {
                a = {};
                var b = {},
                    d;
                this._form.validate() && (this._saveBtn.set("disabled", !0), a.InputLayer = e.toJson(n.constructAnalysisInputLyrObj(this.inputLayer)), a.BreakValues = this.get("breakValues"), a.Breakunits = this.get("breakUnits"),
                    a.OverlapPolicy = this.get("overlapPolicy"), a.travelMode = this.get("travelMode"), this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay"))), this.returnFeatureCollection || (a.OutputName = e.toJson({
                        serviceProperties: {
                            name: this.outputLayerInput.get("value")
                        }
                    })), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = e.toJson({
                        extent: this.map.extent._normalize(!0)
                    })),
                    this.returnFeatureCollection && (d = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (d.extent = this.map.extent._normalize(!0)), a.context = e.toJson(d)), b.jobParams = a, b.itemParams = {
                        description: f.substitute(this.i18n.itemDescription, {
                            layername: this.inputLayer.name,
                            distance_field: a.Distances || a.Field,
                            units: a.Units
                        }),
                        tags: f.substitute(this.i18n.itemTags, {
                            layername: this.inputLayer.name
                        }),
                        snippet: this.i18n.itemSnippet
                    }, this.showSelectFolder && (b.itemParams.folder = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item,
                        "id") : ""), this.execute(b))
            },
            _handleResultLyrInputChange: function(a) {
                this.set("outputLayerName", a)
            },
            _handleDistValueChange: function() {
                this.set("outputLayerName")
            },
            _handleDistUnitsChange: function(a) {
                this.set("breakUnits", a);
                this.set("outputLayerName")
            },
            _handleDistanceTypeChange: function(a) {
                var b, d;
                d = a.split("-");
                a = d[0].toLowerCase();
                b = d[1].toLowerCase();
                this.set("travelMode", d[0]);
                b && (l.set(this._useTrafficLabelRow, "display", "time" === b && "driving" === a ? "" : "none"), this._trafficTimeWidget.set("disabled",
                    "time" !== b && "driving" !== a), this._trafficTimeWidget.set("reset", "time" !== b && "driving" !== a));
                "time" === b ? (this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()), this._distanceUnitsSelect.addOption([{
                    value: "Seconds",
                    label: this.i18n.seconds
                }, {
                    value: "Minutes",
                    label: this.i18n.minutes,
                    selected: "selected"
                }, {
                    value: "Hours",
                    label: this.i18n.hours
                }]), this.set("breakUnits", this._distanceUnitsSelect.get("value"))) : (this.get("distanceDefaultUnits") && this.set("breakUnits", this.get("distanceDefaultUnits")),
                    this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()), this._distanceUnitsSelect.addOption([{
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
                    }]), this._distanceUnitsSelect.set("value", this.breakUnits));
                this.set("outputLayerName")
            },
            _handleOverlapPolicyChange: function(a, b) {
                this.set("overlapPolicy", b);
                k.remove(this._Overlap,
                    "selected");
                k.remove(this._Dissolve, "selected");
                k.remove(this._Split, "selected");
                k.add(a, "selected")
            },
            _save: function() {},
            _buildUI: function() {
                n.initHelpLinks(this.domNode, this.showHelp);
                s.set(this._driveTimeDescription, "innerHTML", f.substitute(this.i18n.toolDefine, {
                    layername: this.inputLayer.name
                }));
                l.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(c.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store",
                        a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                this.distanceDefaultUnits && this._distanceUnitsSelect.set("value", this.distanceDefaultUnits);
                l.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "block" : "none");
                this._drivingModeSelect.set("value", "Driving-Time");
                this._handleDistanceTypeChange("Driving-Time");
                this._loadConnections()
            },
            validateTime: function() {},
            validateDistance: function() {
                var a = this,
                    b, d = [];
                this.set("breakValues");
                b = c.trim(this._breakValuesInput.get("value")).split(" ");
                if (0 === b.length) return !1;
                g.forEach(b, function(b) {
                    b = m.parse(b);
                    if (isNaN(b)) return d.push(0), !1;
                    b = m.format(b, {
                        locale: "en-us"
                    });
                    (b = c.trim(b).match(/\D/g)) && g.forEach(b, function(b) {
                        "." === b || "," === b ? d.push(1) : "-" === b && "polygon" === a.inputType ? d.push(1) : d.push(0)
                    })
                });
                return -1 !== g.indexOf(d, 0) ? !1 : !0
            },
            _loadConnections: function() {
                this.on("start", c.hitch(this, "_onClose", !0));
                this._connect(this._closeBtn, "onclick", c.hitch(this, "_onClose", !1));
                h.connect(this._drivingModeSelect, "onChange", c.hitch(this, "_handleDistanceTypeChange"));
                h.connect(this._Overlap, "onclick", c.hitch(this, "_handleOverlapPolicyChange", this._Overlap, "Overlap"));
                h.connect(this._Dissolve, "onclick", c.hitch(this, "_handleOverlapPolicyChange", this._Dissolve, "Dissolve"));
                h.connect(this._Split, "onclick", c.hitch(this, "_handleOverlapPolicyChange", this._Split, "Split"))
            },
            _setAnalysisGpServerAttr: function(a) {
                a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
            },
            _setInputLayerAttr: function(a) {
                "esriGeometryPoint" === a.geometryType &&
                    (this.inputLayer = a)
            },
            _getInputLayerAttr: function() {
                return this.inputLayer
            },
            _setOverlapPolicyAttr: function(a) {
                this.overlapPolicy = a
            },
            _getOverlapPolicyAttr: function() {
                return this.overlapPolicy
            },
            _setBreakValuesAttr: function(a) {
                a && (this.breakValues = a);
                a = c.trim(this._breakValuesInput.get("value")).split(" ");
                var b = [];
                g.forEach(a, function(a) {
                    b.push(m.parse(a))
                });
                this.breakValues = b
            },
            _getBreakValuesAttr: function() {
                return this.breakValues
            },
            _setDisableRunAnalysisAttr: function(a) {
                this._saveBtn.set("disabled",
                    a)
            },
            _getTravelModeAttr: function() {
                return this.travelMode
            },
            _setTravelModeAttr: function(a) {
                this._set("travelMode", a)
            },
            validateServiceName: function(a) {
                var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === f.trim(a).length ? (this.outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this.outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this.outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
            },
            _setShowSelectFolderAttr: function(a) {
                this.showSelectFolder =
                    a
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
            _setBreakUnitsAttr: function(a) {
                this.breakUnits = a
            },
            _getBreakUnitsAttr: function() {
                return this.breakUnits
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
            _setOutputLayerNameAttr: function(a) {
                var b, d, c;
                d = [this.i18n.seconds, this.i18n.minutes, this.i18n.hours, this.i18n.miles, this.i18n.meters,
                    this.i18n.kilometers, this.i18n.feet, this.i18n.yards
                ];
                c = this._distanceUnitsSelect.getOptions(this._distanceUnitsSelect.get("value")).label;
                a ? (this.outputLayerName = a, this.outputLayerInput.set("value", a)) : this._breakValuesInput && (this.outputLayerName ? (this.outputLayerName = this.outputLayerInput.get("value"), a = this.outputLayerName.substr(0, this.outputLayerName.indexOf(" ")), a !== this.i18n[this.travelMode.toLowerCase()] && (this.outputLayerName = this.outputLayerName.replace(a, this.i18n[this.travelMode.toLowerCase()])), -1 !== this.outputLayerName.lastIndexOf("(") && (a = this.outputLayerName.substring(0, this.outputLayerName.lastIndexOf("(")), b = f.trim(this.outputLayerName.substring(this.outputLayerName.lastIndexOf(" "), this.outputLayerName.lastIndexOf(")"))), -1 !== g.indexOf(d, b) && (this.outputLayerName = f.substitute(a + "(${breakValues} ${breakUnits})", {
                    breakValues: this._breakValuesInput.get("value"),
                    breakUnits: c
                })))) : this.outputLayerName = f.substitute(this.i18n.outputModeLayerName, {
                    mode: this.i18n[this.get("travelMode").toLowerCase()],
                    layername: this.inputLayer.name,
                    breakValues: this._breakValuesInput.get("value"),
                    breakUnits: c
                }), this.outputLayerInput.set("value", this.outputLayerName))
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(h.connect(a, b, c))
            },
            onSave: function() {},
            onClose: function() {}
        })
    });