//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "../../kernel", "../../lang", "./AnalysisBase", "./utils", "./CreditEstimator", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/CreateBuffers.html"],
    function(n, p, d, g, e, f, z, A, h, b, m, B, C, c, k, q, r, s, t, u, D, E, F, G, H, I, J, K, L, M, N, v, w, l, O, x, y) {
        return p([q, r, s, t, u, w], {
            declaredClass: "esri.dijit.analysis.CreateBuffers",
            templateString: y,
            basePath: n.toUrl("."),
            widgetsInTemplate: !0,
            inputLayer: null,
            inputType: null,
            outputLayerName: null,
            bufferDistance: null,
            units: null,
            showSelectFolder: !1,
            showChooseExtent: !0,
            showHelp: !0,
            showCredits: !0,
            returnFeatureCollection: !1,
            i18n: null,
            toolName: "CreateBuffers",
            helpFileName: "CreateBuffers",
            resultParameter: "BufferLayer",
            constructor: function(a,
                b) {
                this._pbConnects = [];
                a.containerNode && (this.container = a.containerNode)
            },
            destroy: function() {
                this.inherited(arguments);
                g.forEach(this._pbConnects, e.disconnect);
                delete this._pbConnects
            },
            postMixInProperties: function() {
                this.inherited(arguments);
                d.mixin(this.i18n, x.bufferTool)
            },
            postCreate: function() {
                this.inherited(arguments);
                c.add(this._form, "esriSimpleForm");
                this.outputLayerInput.set("validator", d.hitch(this, this.validateServiceName));
                this._buildUI()
            },
            startup: function() {},
            _onClose: function(a) {
                a && (this._save(),
                    this.emit("save", {
                        save: !0
                    }));
                this.emit("close", {
                    save: a
                })
            },
            _toUpperFirstLetter: function(a) {
                return a.slice(0, 1).toUpperCase() + a.slice(1)
            },
            _handleSaveBtnClick: function(a) {
                a = {};
                var b = {},
                    c;
                if (this._form.validate()) {
                    this._saveBtn.set("disabled", !0);
                    a.InputLayer = f.toJson(l.constructAnalysisInputLyrObj(this.inputLayer));
                    a.DissolveType = this._DissolveType && "dissolve" === this._DissolveType ? "Dissolve" : "None";
                    "attribute" === this.bufferDistType ? a.Field = this._bufferDistAttribute.get("value") : a.Distances = this.bufferDistance;
                    a.Units = this._bufferUnits.get("value");
                    this.bufferDistance.length && (this._RingType || (this._RingType = "rings"), a.RingType = "rings" === this._RingType ? "Rings" : "Disks");
                    if ("esriGeometryPolyline" === this.inputLayer.geometryType || "esriGeometryPolygon" === this.inputLayer.geometryType) a.SideType = "esriGeometryPolyline" === this.inputLayer.geometryType ? this._SideType && "left" === this._SideType ? "Left" : this._SideType && "right" === this._SideType ? "Right" : "Full" : this._SideType && "outside" === this._SideType ? "Outside" : "Full",
                        a.EndType = this._EndType && "flat" === this._EndType ? "Flat" : "Round";
                    this.returnFeatureCollection || (a.OutputName = f.toJson({
                        serviceProperties: {
                            name: this.outputLayerInput.get("value")
                        }
                    }));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = f.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.returnFeatureCollection && (c = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)), a.context = f.toJson(c));
                    b.jobParams = a;
                    b.itemParams = {
                        description: h.substitute(this.i18n.itemDescription, {
                            layername: this.inputLayer.name,
                            distance_field: a.Distances || a.Field,
                            units: a.Units
                        }),
                        tags: h.substitute(this.i18n.itemTags, {
                            layername: this.inputLayer.name
                        }),
                        snippet: this.i18n.itemSnippet
                    };
                    this.showSelectFolder && (b.itemParams.folder = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
                    this.execute(b)
                }
            },
            _handleLayerChange: function(a) {},
            _handleRadiusTypeChange: function(a) {
                this.bufferDistType = a;
                c.remove(this._Distance, "selected");
                c.remove(this._Attribute, "selected");
                var d = this._bufferDist.get("value").split(" ");
                "attribute" === a ? (b.set(this._bufferDistAttribute.domNode, "display", "block"), b.set(this._bufferDist.domNode, "display", "none"), b.set(this._sizeHelp, "visibility", "hidden"), b.set(this.ringTypes, "display", "none"), "polygon" === this.inputType ? (b.set(this.polygonTypes, "display", "block"), b.set(this.sideTypes, "display", "none"), b.set(this.endTypes, "display", "none")) : "line" === this.inputType && (b.set(this.sideTypes, "display", "block"), b.set(this.endTypes, "display", "block"),
                    b.set(this.polygonTypes, "display", "none")), c.add(this._Attribute, "selected")) : "distance" === a && (b.set(this._bufferDistAttribute.domNode, "display", "none"), b.set(this._bufferDist.domNode, "display", "block"), b.set(this._sizeHelp, "visibility", "visible"), c.add(this._Distance, "selected"), 1 < d.length ? (b.set(this.ringTypes, "display", "block"), b.set(this.sideTypes, "display", "none"), b.set(this.endTypes, "display", "none"), b.set(this.polygonTypes, "display", "none")) : "polygon" === this.inputType ? (b.set(this.ringTypes,
                    "display", "none"), b.set(this.sideTypes, "display", "none"), b.set(this.endTypes, "display", "none"), b.set(this.polygonTypes, "display", "block")) : "line" === this.inputType && (b.set(this.ringTypes, "display", "none"), b.set(this.sideTypes, "display", "block"), b.set(this.endTypes, "display", "block"), b.set(this.polygonTypes, "display", "none")))
            },
            _handleDissolveTypeChange: function(a) {
                this._DissolveType = a;
                c.remove(this._Overlap, "selected");
                c.remove(this._Dissolve, "selected");
                c.add("none" === a ? this._Overlap : this._Dissolve,
                    "selected")
            },
            _handleRingTypeChange: function(a) {
                this._RingType = a;
                c.remove(this._Rings, "selected");
                c.remove(this._Disks, "selected");
                c.add("rings" === a ? this._Rings : this._Disks, "selected")
            },
            _handlePolygonTypeChange: function(a) {
                this._SideType = a;
                c.remove(this._Include, "selected");
                c.remove(this._Exclude, "selected");
                c.add("full" === a ? this._Include : this._Exclude, "selected")
            },
            _handleSideTypeChange: function(a, b) {
                this._SideType = b;
                c.remove(this._Around, "selected");
                c.remove(this._Left, "selected");
                c.remove(this._Right,
                    "selected");
                c.add(a, "selected")
            },
            _handleEndTypeChange: function(a) {
                this._EndType = a;
                c.remove(this._Round, "selected");
                c.remove(this._Flat, "selected");
                c.add("round" === a ? this._Round : this._Flat, "selected")
            },
            _handleOptionsBtnClick: function() {
                c.contains(this._optionsDiv, "disabled") || (c.contains(this._optionsDiv, "optionsClose") ? (c.remove(this._optionsDiv, "optionsClose"), c.add(this._optionsDiv, "optionsOpen")) : c.contains(this._optionsDiv, "optionsOpen") && (c.remove(this._optionsDiv, "optionsOpen"), c.add(this._optionsDiv,
                    "optionsClose")))
            },
            _handleDistanceChange: function() {
                var a = d.trim(this._bufferDist.get("value")).split(" "),
                    c = [];
                1 < a.length ? (b.set(this.ringTypes, "display", "block"), b.set(this.sideTypes, "display", "none"), b.set(this.endTypes, "display", "none"), b.set(this.polygonTypes, "display", "none")) : ("line" === this.inputType ? (b.set(this.sideTypes, "display", "block"), b.set(this.endTypes, "display", "block")) : "polygon" === this.inputType && b.set(this.polygonTypes, "display", "block"), b.set(this.ringTypes, "display", "none"));
                g.forEach(a, function(a) {
                    c.push(k.parse(a))
                });
                this.bufferDistance = c
            },
            _handleShowCreditsClick: function(a) {
                a.preventDefault();
                a = {};
                if (this._form.validate()) {
                    a.InputLayer = f.toJson(l.constructAnalysisInputLyrObj(this.inputLayer));
                    a.DissolveType = this._DissolveType && "dissolve" === this._DissolveType ? "Dissolve" : "None";
                    "attribute" === this.bufferDistType ? a.Field = this._bufferDistAttribute.get("value") : a.Distances = f.toJson(this.bufferDistance);
                    a.Units = this._bufferUnits.get("value");
                    this.bufferDistance.length && (this._RingType ||
                        (this._RingType = "rings"), a.RingType = "rings" === this._RingType ? "Rings" : "Disks");
                    if ("esriGeometryPolyline" === this.inputLayer.geometryType || "esriGeometryPolygon" === this.inputLayer.geometryType) a.SideType = "esriGeometryPolyline" === this.inputLayer.geometryType ? this._SideType && "left" === this._SideType ? "Left" : this._SideType && "right" === this._SideType ? "Right" : "Full" : this._SideType && "outside" === this._SideType ? "Outside" : "Full", a.EndType = this._EndType && "flat" === this._EndType ? "Flat" : "Round";
                    this.returnFeatureCollection ||
                        (a.OutputName = f.toJson({
                        serviceProperties: {
                            name: this.outputLayerInput.get("value")
                        }
                    }));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = f.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    console.log(a);
                    this.getCreditsEstimate(this.toolName, a).then(d.hitch(this, function(a) {
                        this._usageForm.set("content", a);
                        this._usageDialog.show()
                    }))
                }
            },
            _save: function() {},
            _buildUI: function() {
                this._loadConnections();
                l.initHelpLinks(this.domNode, this.showHelp);
                this.inputLayer && (m.set(this._bufferToolDescription,
                    "innerHTML", h.substitute(this.i18n.bufferDefine, {
                        layername: this.inputLayer.name
                    })), this.outputLayerInput.set("value", h.substitute(this.i18n.outputLayerName, {
                    layername: this.inputLayer.name
                })), g.forEach(this.inputLayer.fields, function(a) {
                    if ("esriFieldTypeDouble" === a.type || "esriFieldTypeInteger" === a.type || "esriFieldTypeSmallInteger" === a.type || "esriFieldTypeSingle" === a.type) this._bufferDistAttribute.addOption({
                        value: a.name,
                        label: v.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                    })
                }, this), m.set(this._bufferOptionsHelpLink,
                    "esriHelpTopic", "polygon" === this.inputType ? "OptionPoly" : "line" === this.inputType ? "OptionLine" : "OptionPoint"));
                this._bufferDist.set("validator", d.hitch(this, this.validateDistance));
                this.bufferDistance ? this._bufferDist.set("value", this.bufferDistance.toString().replace(/,/g, " ")) : (this.bufferDistance = [], this.bufferDistance.push(this._bufferDist.get("value")));
                "line" === this.inputType ? (b.set(this.sideTypes, "display", "block"), b.set(this.endTypes, "display", "block")) : "polygon" === this.inputType && b.set(this.polygonTypes,
                    "display", "block");
                this.outputLayerName && this.outputLayerInput.set("value", this.outputLayerName);
                this.units && this._bufferUnits.set("value", this.units);
                b.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
                this.showSelectFolder && this.getFolderStore().then(d.hitch(this, function(a) {
                    this.folderStore = a;
                    this._webMapFolderSelect.set("store", a);
                    this._webMapFolderSelect.set("value", this.portalUser.username)
                }));
                b.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "block" :
                    "none");
                b.set(this._showCreditsLink, "display", !0 === this.showCredits ? "block" : "none")
            },
            validateDistance: function() {
                var a = this,
                    b, c = [];
                this._handleDistanceChange();
                b = d.trim(this._bufferDist.get("value")).split(" ");
                if (0 === b.length) return !1;
                g.forEach(b, function(b) {
                    b = k.parse(b);
                    if (isNaN(b)) return c.push(0), !1;
                    b = k.format(b, {
                        locale: "en-us"
                    });
                    (b = d.trim(b).match(/\D/g)) && g.forEach(b, function(b) {
                        "." === b || "," === b ? c.push(1) : "-" === b && "polygon" === a.inputType ? c.push(1) : c.push(0)
                    })
                });
                return -1 !== g.indexOf(c, 0) ? !1 :
                    !0
            },
            _loadConnections: function() {
                this.on("start", d.hitch(this, "_onClose", !0));
                this._connect(this._closeBtn, "onclick", d.hitch(this, "_onClose", !1));
                e.connect(this._Distance, "onclick", d.hitch(this, "_handleRadiusTypeChange", "distance"));
                e.connect(this._Attribute, "onclick", d.hitch(this, "_handleRadiusTypeChange", "attribute"));
                e.connect(this._Overlap, "onclick", d.hitch(this, "_handleDissolveTypeChange", "none"));
                e.connect(this._Dissolve, "onclick", d.hitch(this, "_handleDissolveTypeChange", "dissolve"));
                e.connect(this._Include,
                    "onclick", d.hitch(this, "_handlePolygonTypeChange", "full"));
                e.connect(this._Exclude, "onclick", d.hitch(this, "_handlePolygonTypeChange", "outside"));
                e.connect(this._Rings, "onclick", d.hitch(this, "_handleRingTypeChange", "rings"));
                e.connect(this._Disks, "onclick", d.hitch(this, "_handleRingTypeChange", "disks"));
                e.connect(this._Around, "onclick", d.hitch(this, "_handleSideTypeChange", this._Around, "full"));
                e.connect(this._Left, "onclick", d.hitch(this, "_handleSideTypeChange", this._Left, "left"));
                e.connect(this._Right,
                    "onclick", d.hitch(this, "_handleSideTypeChange", this._Right, "right"));
                e.connect(this._Round, "onclick", d.hitch(this, "_handleEndTypeChange", "round"));
                e.connect(this._Flat, "onclick", d.hitch(this, "_handleEndTypeChange", "flat"))
            },
            _setAnalysisGpServerAttr: function(a) {
                a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
            },
            _setInputLayerAttr: function(a) {
                "esriGeometryPolygon" === a.geometryType ? (this.inputLayer = a, this.inputType = "polygon") : "esriGeometryPolyline" === a.geometryType ?
                    (this.inputLayer = a, this.inputType = "line") : "esriGeometryPoint" === a.geometryType && (this.inputLayer = a, this.inputType = "point")
            },
            _setLayerAttr: function(a) {
                "esriGeometryPolygon" === a.geometryType ? this.inputType = "polygon" : "esriGeometryPolyline" === a.geometryType ? this.inputType = "line" : "esriGeometryPoint" === a.geometryType && (this.inputType = "point");
                this.inputLayer = a
            },
            _setLayersAttr: function(a) {
                this._setLayerAttr(a)
            },
            _setDisableRunAnalysisAttr: function(a) {
                this._saveBtn.set("disabled", a)
            },
            validateServiceName: function(a) {
                var b =
                    /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
                return 0 === a.length || 0 === h.trim(a).length ? (this.outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this.outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this.outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
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
            _setShowHelpAttr: function(a) {
                this.showHelp = a
            },
            _getShowHelpAttr: function() {
                return this.showHelp
            },
            _setShowChooseExtentAttr: function(a) {
                this.showChooseExtent = a
            },
            _getShowChooseExtentAttr: function() {
                return this.showChooseExtent
            },
            _setShowCreditsAttr: function(a) {
                this.showCredits = a
            },
            _getShowCreditsAttr: function() {
                return this.showCredits
            },
            _setUnitsAttr: function(a) {
                this.units = a
            },
            _getUnitsAttr: function() {
                return this.units = this._bufferUnits.get("value")
            },
            _setReturnFeatureCollectionAttr: function(a) {
                this.returnFeatureCollection =
                    a
            },
            _getReturnFeatureCollectionAttr: function() {
                return this.returnFeatureCollection
            },
            _connect: function(a, b, c) {
                this._pbConnects.push(e.connect(a, b, c))
            },
            onSave: function() {},
            onClose: function() {}
        })
    });