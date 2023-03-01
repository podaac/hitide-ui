//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/sniff", "dojo/_base/kernel", "dojo/has", "dojo/dom-style", "dojo/dom-construct", "../kernel", "../lang", "../domUtils", "../layers/InheritedDomain", "../layers/FeatureLayer", "dojo/i18n!../nls/jsapi", "dojo/fx", "dojox/gfx", "dijit/_Widget", "dijit/_Templated", "dijit/Editor", "dijit/_editor/plugins/LinkDialog", "dijit/_editor/plugins/TextColor", "./_EventedWidget", "./editing/AttachmentEditor", "./editing/Util", "../tasks/query", "dijit/form/DateTextBox", "dijit/form/TextBox", "dijit/form/NumberTextBox", "dijit/form/FilteringSelect", "dijit/form/NumberSpinner", "dijit/form/Button", "dijit/form/SimpleTextarea", "dijit/form/ValidationTextBox", "dijit/form/TimeTextBox", "dijit/Tooltip", "dojo/data/ItemFileReadStore", "dojox/date/islamic", "dojox/date/islamic/Date", "dojox/date/islamic/locale", "dojo/text!./templates/AttributeInspector.html"],
    function(v, k, e, q, O, w, P, p, h, Q, n, r, s, x, y, R, S, z, A, B, T, U, C, D, E, V, F, G, t, u, H, W, I, J, K, L, M, X, Y, Z, N) {
        var m = v([C, z, A], {
            declaredClass: "esri.dijit.AttributeInspector",
            widgetsInTemplate: !0,
            templateString: N,
            _navMessage: "( ${idx} ${of} ${numFeatures} )",
            onUpdate: function() {},
            onDelete: function() {},
            onAttributeChange: function() {},
            onNext: function() {},
            onReset: function() {},
            onCancel: function() {},
            _eventMap: {
                update: !0,
                "delete": ["feature"],
                "attribute-change": ["feature", "fieldName", "fieldValue"],
                next: ["feature"],
                reset: !0,
                cancel: !0
            },
            constructor: function(a, b) {
                k.mixin(this, y.widgets.attributeInspector);
                a = a || {};
                !a.featureLayer && !a.layerInfos && console.error("esri.AttributeInspector: please provide correct parameter in the constructor");
                this._datePackage = this._getDatePackage(a);
                this._layerInfos = a.layerInfos || [{
                    featureLayer: a.featureLayer,
                    options: a.options || []
                }];
                this._layerInfos = e.filter(this._layerInfos, function(a) {
                    return !a.disableAttributeUpdate
                });
                this._aiConnects = [];
                this._selection = [];
                this._toolTips = [];
                this._featureIdx =
                    this._numFeatures = 0;
                this._currentFeature = this._currentLInfo = null;
                this._hideNavButtons = a.hideNavButtons || !1
            },
            postCreate: function() {
                if (e.every(this._layerInfos, function(a) {
                    return a.featureLayer.loaded
                })) this._initLayerInfos(), this._createAttachmentEditor(), this.onFirstFeature();
                else {
                    var a = this._layerInfos.length;
                    e.forEach(this._layerInfos, function(b) {
                        b = b.featureLayer;
                        if (b.loaded) a--;
                        else var c = q.connect(b, "onLoad", this, function(b) {
                            q.disconnect(c);
                            c = null;
                            a--;
                            a || (this._initLayerInfos(), this._createAttachmentEditor(),
                                this.onFirstFeature())
                        })
                    }, this)
                }
            },
            destroy: function() {
                this._destroyAttributeTable();
                e.forEach(this._aiConnects, q.disconnect);
                delete this._aiConnects;
                this._attachmentEditor && (this._attachmentEditor.destroy(), delete this._attachmentEditor);
                delete this._layerInfos;
                this._selection = this._currentFeature = this._currentLInfo = this._attributes = this._layerInfos = null;
                this.inherited(arguments)
            },
            refresh: function() {
                this._updateSelection()
            },
            first: function() {
                this.onFirstFeature()
            },
            last: function() {
                this.onLastFeature()
            },
            next: function() {
                this.onNextFeature()
            },
            previous: function() {
                this.onPreviousFeature()
            },
            showFeature: function(a, b) {
                b && (this._createOnlyFirstTime = !0);
                this._updateSelection([a], b);
                this._updateUI()
            },
            onLayerSelectionChange: function(a, b, c) {
                this._createOnlyFirstTime = !1;
                this._featureIdx = c === x.SELECTION_NEW ? 0 : this._featureIdx;
                this._updateSelection();
                this._updateUI()
            },
            onLayerSelectionClear: function() {
                this._selection && !(0 >= this._selection.length) && (this._featureIdx = this._numFeatures = 0, this._selection = [], this._currentLInfo =
                    this._currentFeature = null, this._updateUI())
            },
            onLayerEditsComplete: function(a, b, c, d) {
                d = d || [];
                if (d.length) {
                    var f = this._selection,
                        l = a.featureLayer.objectIdField;
                    e.forEach(d, k.hitch(this, function(a) {
                        e.some(f, k.hitch(this, function(b, c) {
                            if (b.attributes[l] !== a.objectId) return !1;
                            this._selection.splice(c, 1);
                            return !0
                        }))
                    }))
                }
                b = b || [];
                b.length && (this._selection = E.findFeatures(b, a.featureLayer), this._featureIdx = 0);
                a = this._numFeatures = this._selection ? this._selection.length : 0;
                if (b.length) {
                    if (b = a ? this._selection[this._featureIdx] :
                        null) a = b.getLayer().getEditCapabilities(), (!a.canCreate || a.canUpdate) && this._showFeature(b);
                    this._updateUI()
                }
            },
            onFieldValueChange: function(a, b) {
                b = "undefined" === typeof b ? null : b;
                var c = a.field;
                if ("esriFieldTypeDate" === c.type) {
                    if (a.dijit instanceof Array) {
                        var d = a.dijit[0].getValue(),
                            f = a.dijit[1].getValue();
                        b = d && f ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), f.getHours(), f.getMinutes(), f.getSeconds(), f.getMilliseconds()) : d || f || null
                    } else b = a.dijit.getValue();
                    b = b && b.getTime ? b.getTime() : b && b.toGregorian ?
                        b.toGregorian().getTime() : b
                }
                if (this._currentFeature.attributes[c.name] !== b) {
                    var l = this._currentLInfo,
                        g = this._currentFeature,
                        d = c.name;
                    if (d === l.typeIdField) {
                        var h = this._findFirst(l.types, "id", b);
                        e.forEach(l.fieldInfos, function(a) {
                            if ((c = a.field) && c.name !== l.typeIdField) a = a.dijit, this._setFieldDomain(a, h, c) && a && (this._setValue(a, g.attributes[c.name] + ""), !1 === a.isValid() && this._setValue(a, null))
                        }, this)
                    }
                    this.onAttributeChange(g, d, b)
                }
            },
            onDeleteBtn: function(a) {
                this._deleteFeature()
            },
            onNextFeature: function(a) {
                this._onNextFeature(1)
            },
            onPreviousFeature: function(a) {
                this._onNextFeature(-1)
            },
            onFirstFeature: function(a) {
                this._onNextFeature(-1 * this._featureIdx)
            },
            onLastFeature: function(a) {
                this._onNextFeature(this._numFeatures - 1 - this._featureIdx)
            },
            _initLayerInfos: function() {
                var a = this._layerInfos;
                this._editorTrackingInfos = {};
                e.forEach(a, this._initLayerInfo, this)
            },
            _initLayerInfo: function(a) {
                var b = a.featureLayer,
                    c, d;
                this._userIds = {};
                d = b.id;
                b.credential && (this._userIds[d] = b.credential.userId);
                a.userId && (this._userIds[d] = a.userId);
                this._connect(b,
                    "onSelectionComplete", k.hitch(this, "onLayerSelectionChange", a));
                this._connect(b, "onSelectionClear", k.hitch(this, "onLayerSelectionClear", a));
                this._connect(b, "onEditsComplete", k.hitch(this, "onLayerEditsComplete", a));
                a.showAttachments = b.hasAttachments ? n.isDefined(a.showAttachments) ? a.showAttachments : !0 : !1;
                a.hideFields = a.hideFields || [];
                a.htmlFields = a.htmlFields || [];
                a.isEditable = b.isEditable() ? n.isDefined(a.isEditable) ? a.isEditable : !0 : !1;
                a.typeIdField = b.typeIdField;
                a.layerId = b.id;
                a.types = b.types;
                b.globalIdField &&
                    (c = this._findFirst(a.fieldInfos, "fieldName", b.globalIdField), !c && !a.showGlobalID && a.hideFields.push(b.globalIdField));
                d = this._findFirst(a.fieldInfos, "fieldName", b.objectIdField);
                !d && !a.showObjectID && a.hideFields.push(b.objectIdField);
                var f = this._getFields(a.featureLayer);
                if (f) {
                    var l = a.fieldInfos || [],
                        l = e.map(l, function(a) {
                            return k.mixin({}, a)
                        });
                    l.length ? a.fieldInfos = e.filter(e.map(l, k.hitch(this, function(b) {
                        var c = b.stringFieldOption || (this._isInFields(b.fieldName, a.htmlFields) ? m.STRING_FIELD_OPTION_RICHTEXT :
                            m.STRING_FIELD_OPTION_TEXTBOX);
                        return k.mixin(b, {
                            field: this._findFirst(f, "name", b.fieldName),
                            stringFieldOption: c
                        })
                    })), "return item.field;") : (f = e.filter(f, k.hitch(this, function(b) {
                        return !this._isInFields(b.name, a.hideFields)
                    })), a.fieldInfos = e.map(f, k.hitch(this, function(b) {
                        var c = this._isInFields(b.name, a.htmlFields) ? m.STRING_FIELD_OPTION_RICHTEXT : m.STRING_FIELD_OPTION_TEXTBOX;
                        return {
                            fieldName: b.name,
                            field: b,
                            stringFieldOption: c
                        }
                    })));
                    a.showGlobalID && !c && l.push(this._findFirst(f, "name", b.globalIdField));
                    a.showObjectID && !d && l.push(this._findFirst(f, "name", b.objectIdField));
                    c = [];
                    b.editFieldsInfo && (b.editFieldsInfo.creatorField && c.push(b.editFieldsInfo.creatorField), b.editFieldsInfo.creationDateField && c.push(b.editFieldsInfo.creationDateField), b.editFieldsInfo.editorField && c.push(b.editFieldsInfo.editorField), b.editFieldsInfo.editDateField && c.push(b.editFieldsInfo.editDateField));
                    this._editorTrackingInfos[b.id] = c
                }
            },
            _createAttachmentEditor: function() {
                this._attachmentEditor = null;
                var a = e.filter(this._layerInfos,
                    function(a) {
                        return a.showAttachments
                    });
                a && a.length && (this._attachmentEditor = new D({
                    "class": "atiAttachmentEditor"
                }, this.attachmentEditor), this._attachmentEditor.startup())
            },
            _setCurrentLInfo: function(a) {
                var b = this._currentLInfo ? this._currentLInfo.featureLayer : null,
                    c = a.featureLayer;
                if (b && (b.id === c.id && !b.ownershipBasedAccessControlForFeatures) && (b = c.getEditCapabilities(), !b.canCreate || b.canUpdate)) return;
                this._currentLInfo = a;
                this._createTable()
            },
            _updateSelection: function(a, b) {
                this._selection = a || [];
                e.forEach(this._layerInfos,
                    this._getSelection, this);
                var c = this._selection.length;
                this._numFeatures = this._selection.length;
                this._showFeature(c ? this._selection[this._featureIdx] : null, b)
            },
            _getSelection: function(a) {
                a = a.featureLayer.getSelectedFeatures();
                this._selection = this._selection.concat(a)
            },
            _updateUI: function() {
                var a = this._numFeatures,
                    b = this._currentLInfo;
                this.layerName.innerHTML = !b || 0 === a ? this.NLS_noFeaturesSelected : b.featureLayer ? b.featureLayer.name : "";
                p.set(this.attributeTable, "display", a ? "" : "none");
                p.set(this.editButtons,
                    "display", a ? "" : "none");
                p.set(this.navButtons, "display", !this._hideNavButtons && 1 < a ? "" : "none");
                this.navMessage.innerHTML = n.substitute({
                    idx: this._featureIdx + 1,
                    of: this.NLS_of,
                    numFeatures: this._numFeatures
                }, this._navMessage);
                this._attachmentEditor && p.set(this._attachmentEditor.domNode, "display", b && b.showAttachments && a ? "" : "none");
                p.set(this.deleteBtn.domNode, "display", !(b && !1 === b.showDeleteButton) && this._canDelete ? "" : "none");
                this.domNode.parentNode && 0 < this.domNode.parentNode.scrollTop && (this.domNode.parentNode.scrollTop =
                    0)
            },
            _onNextFeature: function(a) {
                this._featureIdx += a;
                0 > this._featureIdx ? this._featureIdx = this._numFeatures - 1 : this._featureIdx >= this._numFeatures && (this._featureIdx = 0);
                a = this._selection.length ? this._selection[this._featureIdx] : null;
                this._showFeature(a);
                this._updateUI();
                this.onNext(a)
            },
            _deleteFeature: function() {
                this.onDelete(this._currentFeature)
            },
            _showFeature: function(a, b) {
                if (a) {
                    this._currentFeature = a;
                    var c = b ? b : a.getLayer(),
                        d = c.getEditCapabilities({
                            feature: a,
                            userId: this._userIds[c.id]
                        });
                    this._canUpdate =
                        d.canUpdate;
                    this._canDelete = d.canDelete;
                    if (d = this._getLInfoFromFeatureLayer(c)) {
                        this._setCurrentLInfo(d);
                        var f = a.attributes,
                            l = this._findFirst(d.types, "id", f[d.typeIdField]),
                            g = null;
                        e.forEach(d.fieldInfos, function(a) {
                            g = a.field;
                            var b = [];
                            a.dijit && 1 < a.dijit.length ? e.forEach(a.dijit, function(a) {
                                b.push(a)
                            }) : b.push(a.dijit);
                            e.forEach(b, k.hitch(this, function(a) {
                                if (a) {
                                    var b = this._setFieldDomain(a, l, g),
                                        c = f[g.name],
                                        c = c && b && b.codedValues && b.codedValues.length ? b.codedValues[c] ? b.codedValues[c].name : c : c;
                                    n.isDefined(c) ||
                                        (c = "");
                                    "dijit.form.DateTextBox" === a.declaredClass || "dijit.form.TimeTextBox" === a.declaredClass ? c = "" === c ? null : new Date(c) : "dijit.form.FilteringSelect" === a.declaredClass && (a._lastValueReported = null, c = f[g.name] + "");
                                    try {
                                        this._setValue(a, c), "dijit.form.FilteringSelect" === a.declaredClass && !1 === a.isValid() && this._setValue(a, null)
                                    } catch (d) {
                                        a.set("displayedValue", this.NLS_errorInvalid, !1)
                                    }
                                }
                            }))
                        }, this);
                        this._attachmentEditor && d.showAttachments && this._attachmentEditor.showAttachments(this._currentFeature);
                        (c =
                            c.getEditSummary(a)) ? (this.editorTrackingInfoDiv.innerHTML = c, r.show(this.editorTrackingInfoDiv)) : r.hide(this.editorTrackingInfoDiv)
                    }
                }
            },
            _setFieldDomain: function(a, b, c) {
                if (!a) return null;
                var d = c.domain;
                b && b.domains && b.domains[c.name] && !1 === b.domains[c.name] instanceof s && (d = b.domains[c.name]);
                if (!d) return null;
                d.codedValues && 0 < d.codedValues.length ? (a.set("store", this._toStore(e.map(d.codedValues, function(a) {
                    return {
                        id: a.code += "",
                        name: a.name
                    }
                }))), this._setValue(a, d.codedValues[0].code)) : (a.constraints = {
                    min: n.isDefined(d.minValue) ? d.minValue : Number.MIN_VALUE,
                    max: n.isDefined(d.maxValue) ? d.maxValue : Number.MAX_VALUE
                }, this._setValue(a, a.constraints.min));
                return d
            },
            _setValue: function(a, b) {
                a.set && (a._onChangeActive = !1, a.set("value", b, !0), a._onChangeActive = !0)
            },
            _getFields: function(a) {
                var b = a._getOutFields();
                if (!b) return null;
                a = a.fields;
                return "*" == b ? a : e.filter(e.map(b, k.hitch(this, "_findFirst", a, "name")), n.isDefined)
            },
            _isInFields: function(a, b) {
                return !a || !b && !b.length ? !1 : e.some(b, function(b) {
                    return b.toLowerCase() ===
                        a.toLowerCase()
                })
            },
            _findFirst: function(a, b, c) {
                return (a = e.filter(a, function(a) {
                    return a.hasOwnProperty(b) && a[b] === c
                })) && a.length ? a[0] : null
            },
            _getLInfoFromFeatureLayer: function(a) {
                return this._findFirst(this._layerInfos, "layerId", a ? a.id : null)
            },
            _createTable: function() {
                this._destroyAttributeTable();
                this.attributeTable.innerHTML = "";
                this._attributes = h.create("table", {
                    cellspacing: "0",
                    cellpadding: "0"
                }, this.attributeTable);
                var a = h.create("tbody", null, this._attributes),
                    b = this._currentLInfo,
                    c = this._findFirst(b.types,
                        "id", this._currentFeature.attributes[b.typeIdField]);
                e.forEach(b.fieldInfos, k.hitch(this, "_createField", c, a), this);
                this._createOnlyFirstTime = !1
            },
            _createField: function(a, b, c) {
                var d = this._currentLInfo,
                    f = c.field;
                if (!this._isInFields(f.name, d.hideFields) && !this._isInFields(f.name, this._editorTrackingInfos[d.featureLayer.id])) {
                    var e = h.create("tr", null, b);
                    b = h.create("td", {
                        innerHTML: c.label || f.alias || f.name,
                        "class": "atiLabel"
                    }, e);
                    b = h.create("td", null, e);
                    var g, e = null,
                        m = !1;
                    if (c.customField) h.place(c.customField.domNode ||
                        c.customField, h.create("div", null, b), "first"), g = c.customField;
                    else if (!1 === d.isEditable || !1 === f.editable || !1 === c.isEditable || "esriFieldTypeOID" === f.type || "esriFieldTypeGlobalID" === f.type || !this._canUpdate && !this._createOnlyFirstTime) m = !0;
                    !g && d.typeIdField && f.name.toLowerCase() == d.typeIdField.toLowerCase() ? g = this._createTypeField(f, c, b) : g || (g = this._createDomainField(f, c, a, b));
                    if (!g) switch (f.type) {
                        case "esriFieldTypeString":
                            g = this._createStringField(f, c, b);
                            break;
                        case "esriFieldTypeDate":
                            g = this._createDateField(f,
                                c, b);
                            c.format && c.format.time && (e = this._createTimeField(f, c, b));
                            break;
                        case "esriFieldTypeInteger":
                        case "esriFieldTypeSmallInteger":
                            g = this._createIntField(f, c, b);
                            break;
                        case "esriFieldTypeSingle":
                        case "esriFieldTypeDouble":
                            g = this._createFltField(f, c, b);
                            break;
                        default:
                            g = this._createStringField(f, c, b)
                    }
                    c.tooltip && c.tooltip.length && this._toolTips.push(new L({
                        connectId: [g.id],
                        label: c.tooltip
                    }));
                    g.onChange = k.hitch(this, "onFieldValueChange", c);
                    g.set("disabled", m);
                    e ? (c.dijit = [g, e], e.onChange = k.hitch(this, "onFieldValueChange",
                        c), e.set("disabled", m)) : c.dijit = g
                }
            },
            _createTypeField: function(a, b, c) {
                return new u({
                    "class": "atiField",
                    name: a.alias || a.name,
                    store: this._toStore(e.map(this._currentLInfo.types, function(a) {
                        return {
                            id: a.id,
                            name: a.name
                        }
                    })),
                    searchAttr: "name"
                }, h.create("div", null, c))
            },
            _createDomainField: function(a, b, c, d) {
                b = a.domain;
                c && c.domains && c.domains[a.name] && !1 === c.domains[a.name] instanceof s && (b = c.domains[a.name]);
                return !b ? null : b.codedValues ? new u({
                    "class": "atiField",
                    name: a.alias || a.name,
                    searchAttr: "name",
                    required: a.nullable ||
                        !1
                }, h.create("div", null, d)) : new H({
                    "class": "atiField"
                }, h.create("div", null, d))
            },
            _createStringField: function(a, b, c) {
                var d = {
                    "class": "atiField",
                    trim: !0,
                    maxLength: a.length
                };
                return b.stringFieldOption === m.STRING_FIELD_OPTION_TEXTAREA ? (d["class"] += " atiTextAreaField", new I(d, h.create("div", null, c))) : b.stringFieldOption === m.STRING_FIELD_OPTION_RICHTEXT ? (d["class"] += " atiRichTextField", d.height = "100%", d.width = "100%", d.plugins = b.richTextPlugins || "bold italic underline foreColor hiliteColor | justifyLeft justifyCenter justifyRight justifyFull | insertOrderedList insertUnorderedList indent outdent | createLink".split(" "),
                    a = new B(d, h.create("div", null, c)), a.startup(), a) : !a.nullable || !b.field || !b.field.nullable ? new J({
                    required: !0
                }, h.create("div", null, c)) : new G(d, h.create("div", null, c))
            },
            _createTimeField: function(a, b, c) {
                a = {
                    "class": "atiField",
                    trim: !0,
                    constraints: {
                        formatLength: "medium"
                    }
                };
                this._datePackage && (a.datePackage = this._datePackage);
                return new K(a, h.create("div", null, c))
            },
            _createDateField: function(a, b, c) {
                a = {
                    "class": "atiField",
                    trim: !0
                };
                this._datePackage && (a.datePackage = this._datePackage);
                return new F(a, h.create("div",
                    null, c))
            },
            _createIntField: function(a, b, c) {
                return new t({
                    "class": "atiField",
                    constraints: {
                        places: 0
                    },
                    invalidMessage: this.NLS_validationInt,
                    trim: !0
                }, h.create("div", null, c))
            },
            _createFltField: function(a, b, c) {
                return new t({
                    "class": "atiField",
                    trim: !0,
                    invalidMessage: this.NLS_validationFlt
                }, h.create("div", null, c))
            },
            _toStore: function(a) {
                return new M({
                    data: {
                        identifier: "id",
                        label: "name",
                        items: a
                    }
                })
            },
            _connect: function(a, b, c) {
                this._aiConnects.push(q.connect(a, b, c))
            },
            _getDatePackage: function(a) {
                return null === a.datePackage ?
                    null : a.datePackage ? a.datePackage : "ar" === w.locale ? "dojox.date.islamic" : null
            },
            _destroyAttributeTable: function() {
                e.forEach(this._layerInfos, function(a) {
                    e.forEach(a.fieldInfos, function(a) {
                        var c = a.dijit;
                        if (c) {
                            c._onChangeHandle = null;
                            if (a.customField) return;
                            c instanceof Array ? e.forEach(c, k.hitch(this, function(a) {
                                a.destroyRecursive ? a.destroyRecursive() : a.destroy && a.destroy();
                                a._onChangeHandle = null
                            })) : c.destroyRecursive ? c.destroyRecursive() : c.destroy && c.destroy()
                        }
                        a.dijit = null
                    }, this)
                }, this);
                e.forEach(this._toolTips,
                    function(a) {
                        a.destroy();
                        delete a
                    });
                this._toolTips = [];
                this._attributes && h.destroy(this._attributes)
            }
        });
        k.mixin(m, {
            STRING_FIELD_OPTION_RICHTEXT: "richtext",
            STRING_FIELD_OPTION_TEXTAREA: "textarea",
            STRING_FIELD_OPTION_TEXTBOX: "textbox"
        });
        return m
    });