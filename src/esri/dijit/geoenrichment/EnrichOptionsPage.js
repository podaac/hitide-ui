//>>built
define(["../../declare", "dojo/_base/lang", "dojo/dom-construct", "dojo/dom-class", "dojo/Stateful", "dojo/number", "dojo/string", "dojo/aspect", "./_WizardPage", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/EnrichOptionsPage.html", "../../tasks/geoenrichment/RingBuffer", "../../tasks/geoenrichment/DriveBuffer", "./BufferOptions", "dojox/html/entities", "./_Invoke", "dgrid/OnDemandGrid", "dgrid/extensions/DijitRegistry", "dojo/store/Memory", "dojo/data/ObjectStore", "dgrid/tree", "dijit/form/Select", "dijit/form/CheckBox", "dojox/mvc/sync", "./config", "../../request", "./lang", "dijit/layout/ContentPane", "dijit/form/NumberSpinner", "dijit/form/RadioButton"],
    function(l, f, n, w, m, x, p, y, z, e, A, B, C, D, t, E, F, G, H, I, J, K, L, u, q, M, N) {
        e = e.geoenrichment.dijit.EnrichOptionsPage;
        var O = l([I], {
            getChildren: function(a) {
                return a.getChildren()
            },
            mayHaveChildren: function(a) {
                return !!a.getChildren
            }
        });
        m = l([m], {
            checked: !0,
            getLabel: function() {},
            getClass: function() {
                return ""
            }
        });
        var Q = l([m], {
                _children: null,
                _updateChildren: !0,
                _label: null,
                constructor: function(a, b, c) {
                    this.set("id2", a);
                    this._label = a;
                    this._children = [];
                    a = f.hitch(this, this._onChildChecked);
                    for (var d = 0; d < b.length; d++) {
                        var e =
                            new P(b[d], c);
                        e.watch("checked", a);
                        this._children.push(e)
                    }
                },
                _checkedSetter: function(a) {
                    if (this.checked != a && (this.checked = a, this._updateChildren && this._children))
                        for (a = 0; a < this._children.length; a++) this._children[a].set("checked", this.checked)
                },
                _onChildChecked: function(a, b, c) {
                    if (b != c) {
                        a = !1;
                        for (b = 0; b < this._children.length; b++)
                            if (this._children[b].get("checked")) {
                                a = !0;
                                break
                            }
                        this._updateChildren = !1;
                        this.set("checked", a);
                        this._updateChildren = !0
                    }
                },
                getLabel: function() {
                    return this._label
                },
                getChildren: function() {
                    return this._children
                }
            }),
            P = l([m], {
                mapTo: null,
                _page: null,
                constructor: function(a, b) {
                    this._page = b;
                    this.id2 = a.id2;
                    this.mapTo = a.mapTo
                },
                _checkedSetter: function(a) {
                    this.checked != a && (this.checked = a, this._page.invoke("_updateTotalVars"))
                },
                _mapToSetter: function(a) {
                    this.mapTo != a && (this.mapTo = a, this._page.invoke("_updateTotalVars"))
                },
                getLabel: function() {
                    return this.alias
                },
                getClass: function() {
                    return "EnrichOptionsPage_VariableCheckbox"
                },
                getOptions: function() {
                    var a = [];
                    a.push({
                        value: "_",
                        label: t.encode(this._page.allowNewColumns ? e.newColumn :
                            e.noColumn)
                    });
                    if (this._page.fields)
                        for (var b = 0; b < this._page.fields.length; b++) {
                            var c = this._page.fields[b];
                            if (c.type && c.type != this.type) {
                                var d = !1;
                                "esriFieldTypeInteger" == c.type && "esriFieldTypeDouble" == this.type && 0 == this.precision ? d = !0 : "esriFieldTypeInteger" == this.type && "esriFieldTypeDouble" == c.type && (d = !0);
                                if (!d) continue
                            }
                            a.push({
                                value: c.id,
                                label: t.encode(c.label || c.id)
                            })
                        }
                    return a
                }
            }),
            R = l([F, G], {
                removeRow: function(a, b) {
                    var c = dijit.findWidgets(a);
                    if (c)
                        for (var d = 0; d < c.length; d++) c[d].destroy();
                    this.inherited(arguments)
                }
            });
        return l("esri.dijit.geoenrichment.EnrichOptionsPage", [z, E], {
            templateString: A,
            nls: e,
            geomType: null,
            buffer: null,
            fields: null,
            allowNewColumns: !0,
            dataCollections: null,
            studyAreaCount: null,
            title: null,
            _bufferOptions: null,
            _fieldSelects: null,
            _grid: null,
            _model: null,
            _eventMap: {
                back: !0,
                finish: !0
            },
            constructor: function() {
                this.buffer = new B
            },
            _setGeomTypeAttr: function(a) {
                this._set("geomType", a);
                switch (this.geomType) {
                    case "esriGeometryPolygon":
                        this.bufferEdit.style.display = "none";
                        this.bufferString.innerHTML = e.bufferPolygon;
                        break;
                    case "esriGeometryPoint":
                        this.bufferEdit.style.display = "";
                        this.bufferString.innerHTML = e.bufferRing;
                        break;
                    case "esriGeometryPolyline":
                        this.bufferEdit.style.display = "", this.bufferString.innerHTML = e.bufferRing
                }
            },
            _setFieldsMapAttr: function(a) {
                for (var b = [], c = {}, d = 0; d < this.dataCollections.length; d++)
                    for (var r = this.dataCollections[d], k = 0; k < r.variables.length; k++) {
                        var g = r.variables[k];
                        g.id2 = r.id + "." + g.id;
                        var h = a[g.id2];
                        if (f.isString(h)) {
                            g.mapTo = h;
                            var h = g.fieldCategory,
                                s = c[h];
                            s || (s = c[h] = []);
                            s.push(g);
                            b.push(g.description)
                        }
                    }
                this._model = [];
                for (var v in c) this._model.push(new Q(v, c[v], this));
                this.dataCollectionNames.innerHTML = b.join(", ");
                this.dataCollectionNames.title = b.join("\n");
                a = new H({
                    data: this._model,
                    idProperty: "id2"
                });
                a = new O(a);
                this._grid ? this._grid.set("store", a) : (b = [J({
                    label: " ",
                    field: "expander",
                    shouldExpand: f.hitch(this, this._shouldExpand)
                }), {
                    label: e.varName,
                    field: "varName",
                    sortable: !1,
                    renderCell: f.hitch(this, this._renderCheckBox)
                }], this.fields && b.push({
                    label: e.column,
                    field: "column",
                    sortable: !1,
                    renderCell: f.hitch(this, this._renderSelect)
                }), this._grid = new R({
                    store: a,
                    columns: b
                }, this.fieldsDiv), y.after(this._grid, "expand", f.hitch(this, this.invoke, "resize")), this._grid.startup());
                this.invoke("_updateTotalVars")
            },
            _shouldExpand: function(a, b, c) {
                return void 0 !== c ? c : 1 == this._model.length
            },
            _renderCheckBox: function(a, b, c, d) {
                b = new L;
                c = a.getLabel();
                u(a, "checked", b, "checked");
                d = n.create("label", {
                    "class": "EnrichOptionsPage_TrimWithEllipsis EnrichOptionsPage_CheckboxLabel",
                    title: c
                });
                w.add(d,
                    a.getClass());
                b.placeAt(d);
                n.create("span", {
                    innerHTML: c
                }, d);
                return d
            },
            _renderSelect: function(a, b, c, d) {
                if (a.getOptions) return b = new K({
                    options: a.getOptions(),
                    maxHeight: 151
                }), u(a, "mapTo", b, "value", {
                    converter: {
                        format: function(a) {
                            return a || "_"
                        },
                        parse: function(a) {
                            return "_" != a ? a : null
                        }
                    }
                }), b.domNode
            },
            _updateTotalVars: function() {
                function a(a, d) {
                    N.isNumber(a) && (a = p.substitute(e.credits, {
                        credits: x.format(a)
                    }));
                    var f = {
                        varCount: c,
                        rowCount: rowCount,
                        credits: a
                    };
                    b.totalVars.innerHTML = p.substitute(k, f);
                    void 0 === d &&
                        (d = p.substitute(g, f));
                    b.totalVars.title = d
                }
                var b = this,
                    c = 0,
                    d = !1;
                this._enumCheckedVars(function(a, b) {
                    c++;
                    b.mapTo && (d = !0)
                });
                this.overwriteExisting.style.visibility = d ? "visible" : "hidden";
                this.finishButton.disabled = 0 == c;
                var f = {
                    enrichVariableCount: c,
                    f: "json"
                };
                this.get("buffer") instanceof C && (f.serviceAreaCount = 1);
                var k, g;
                this.studyAreaCount ? (k = e.totalVars, g = e.totalVarsTooltip, rowCount = this.studyAreaCount) : (k = e.varsPerRow, g = e.varsPerRowTooltip, rowCount = 1);
                q.token && (f.token = q.token);
                var h = q.portalUrl;
                0 > h.indexOf("://") &&
                    (h = window.location.protocol + "//" + h);
                a(e.creditsCalc, "");
                M({
                    url: h + "/sharing/rest/portals/self/cost",
                    content: f
                }).then(function(b) {
                    a(b.transactionCreditCost * rowCount)
                }, function(b) {
                    a("error", b.toString())
                })
            },
            _getBufferAttr: function() {
                return this._bufferOptions ? this._bufferOptions.get("buffer") : this.buffer
            },
            _setBufferAttr: function(a) {
                this._set("buffer", a);
                this._bufferOptions && this._bufferOptions.set("buffer", a)
            },
            _editBuffer: function() {
                n.destroy(this.bufferDiv);
                this.bufferEditDiv.style.display = "";
                this._bufferOptions =
                    new D({
                        buffer: this.buffer,
                        onChange: f.hitch(this, this.invoke, "_updateTotalVars")
                    });
                this.buffer = void 0;
                this._bufferOptions.placeAt(this.bufferEditDiv);
                this.resize()
            },
            _getFieldsMapAttr: function() {
                var a = {};
                this._enumCheckedVars(function(b, c) {
                    a[c.id2] = c.mapTo || ""
                });
                return a
            },
            _enumCheckedVars: function(a) {
                for (var b = 0; b < this._model.length; b++)
                    for (var c = this._model[b].getChildren(), d = 0; d < c.length; d++) c[d].checked && (this.allowNewColumns || c[d].mapTo) && a(this._model[b], c[d])
            },
            _back: function() {
                this.onBack()
            },
            onBack: function() {},
            _finish: function() {
                this.onFinish()
            },
            onFinish: function() {}
        })
    });