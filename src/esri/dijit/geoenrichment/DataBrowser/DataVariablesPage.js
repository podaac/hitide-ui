//>>built
define(["../../../declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/Stateful", "dojo/query", "dojo/i18n!../../../nls/jsapi", "dojo/text!./templates/DataVariablesPage.html", "../_WizardPage", "../_Invoke", "../CheckList", "dojo/store/Memory", "dojo/data/ObjectStore", "dgrid/tree", "dgrid/OnDemandGrid", "dgrid/extensions/DijitRegistry", "dgrid/Selection", "dojo/aspect", "dijit/Tooltip", "dojo/on", "dojo/_base/window", "dijit/layout/ContentPane"], function(h, f, g, m, p, n, q, v, w, r, G, s, x, y, z, A, B, C, t, k, D) {
    q = q.geoenrichment.dijit.DataVariablesPage;
    p = h([p], {
        checked: !0,
        getLabel: function() {},
        getClass: function() {
            return ""
        }
    });
    var u = h([x], {
            getChildren: function(a) {
                return a.getChildren()
            },
            mayHaveChildren: function(a) {
                return !!a.getChildren
            }
        }),
        E = h([z, A, B, r], {
            selectionMode: "toggle",
            shoppingCart: null,
            variableInfo: null,
            useTouchScroll: !1,
            _lockAnimation: !1,
            removeRow: function(a, c) {
                var b = dijit.findWidgets(a);
                if (b)
                    for (var d = 0; d < b.length; d++) b[d].destroy();
                this.inherited(arguments)
            },
            buildRendering: function() {
                this.inherited(arguments);
                this.on("dgrid-select", f.hitch(this,
                    this._onSelect));
                this.on("dgrid-deselect", f.hitch(this, this._onDeselect))
            },
            allowSelect: function(a) {
                return a.data && a.data._children ? !1 : !0
            },
            select: function(a, c, b) {
                var d = this.row(a).element;
                if (null == b || void 0 == b) b = !g.contains(d, "dgrid-selected");
                var e = this.row(a).data;
                if (e && e._children) {
                    var e = e.getChildren(),
                        f;
                    0 < e.length && !this.row(e[0]).element && this.expand(this.row(a), !1, !0);
                    this._lockAnimation = !0;
                    for (var l = 0; l < e.length; l++) f = this.row(e[l]), this.select(f, c, b);
                    this._lockAnimation = !1;
                    d && (b ? (g.add(d,
                        "dgrid-selected"), this.flyAnim.fly(n(".VarLabel", d)[0], "DataBrowser_SelectVar", ["top", "right"])) : g.remove(d, "dgrid-selected"))
                }
                this.inherited(arguments);
                d && (e = n(".dijitCheckBox", d)[0]) && (g.contains(d, "dgrid-selected") ? g.add(e, "dijitCheckBoxChecked") : g.remove(e, "dijitCheckBoxChecked"))
            },
            syncOneBranchWithShoppingCart: function(a) {
                var c = this.shoppingCart.content;
                for (j = 0; j < a.length; j++) this.select(a[j], null, !!c[a[j].idDesc])
            },
            _setSelection: function(a) {
                this.selection = this.get("selection");
                this.selectedItems = [];
                if (this.selection && this.store.data) {
                    a = this.store.data;
                    for (var c, b = 0; b < a.length; b++) {
                        this.selection[a[b].id] && this.selectedItems.push(a[b]);
                        c = a[b].getChildren();
                        for (var d = 0; d < c.length; d++) this.selection[c[d].id] && this.selectedItems.push(c[d])
                    }
                }
            },
            _onSelect: function(a) {
                if (!this._lockAnimation && this.flyAnim && a.parentType) {
                    var c = this.row(a.rows[0]).element;
                    this.flyAnim.fly(n(".VarLabel", c)[0], "DataBrowser_SelectVar", ["top", "right"])
                }
                this._setSelection(a);
                this.onSelect(a)
            },
            _onDeselect: function(a) {
                this._setSelection(a);
                this.onDeselect(a)
            },
            onDeselect: function(a) {
                for (var c = 0; c < a.rows.length; c++) this.shoppingCart.removeVariable(a.rows[c].data.idDesc)
            },
            onSelect: function() {
                this.invoke("_addVariablesToCart")
            },
            _addVariablesToCart: function() {
                this.shoppingCart.addVariables(this.selectedItems)
            }
        }),
        F = h([p], {
            variables: null,
            _updateChildren: !0,
            _label: null,
            constructor: function(a, c) {
                this.set("id", "" + a);
                this._label = a;
                this._children = [];
                this.variables = [];
                for (var b in c) this.variables.push(c[b]), this._children.push(c[b]);
                f.hitch(this,
                    this._onChildChecked)
            },
            getLabel: function() {
                return this._label
            },
            getChildren: function() {
                return this._children
            }
        });
    return h([w, r], {
        templateString: v,
        nls: q,
        baseClass: "DataVariablesPage",
        varTree: null,
        varTitle: null,
        _grid: null,
        _model: null,
        selectedCollection: null,
        store: null,
        storeModel: null,
        multiSelect: !0,
        filtration: null,
        shoppingCart: null,
        _icon: null,
        flyAnim: null,
        _setSelectedCollectionsAttr: function(a) {
            this._set("selectedCollections", a);
            if (a) {
                var c = 0;
                this._model = [];
                for (var b = {}, d, e = 0; e < a.length; e++)
                    if (a[e].variables)
                        for (var g =
                            0; g < a[e].variables.length; g++) {
                            d = a[e].variables[g];
                            var l = d.fieldCategory,
                                k = d.idDesc;
                            b[l] || (b[l] = {});
                            b[l][k] = d
                        }
                    for (var h in b) {
                        for (k in b[h]) c++;
                        this._model.push(new F(h, b[h]))
                    }
                this.spnVarsQuant.innerHTML = c.toString();
                this.spnVarTitle.innerHTML = this.varTitle.toString();
                a = new s({
                    data: this._model
                });
                a = new u(a);
                if (this._grid) this._grid.set("store", a);
                else {
                    c = [y({
                        label: " ",
                        field: "expander",
                        shouldExpand: f.hitch(this, this._shouldExpand)
                    }), {
                        label: "Variables",
                        field: "alias",
                        sortable: !1,
                        renderCell: f.hitch(this,
                            this._renderCheckBox)
                    }];
                    this._grid = new E({
                        store: a,
                        columns: c,
                        showHeader: !1,
                        shoppingCart: this.shoppingCart,
                        selectionMode: this.multiSelect ? "toggle" : "single",
                        selectionDelegate: this.multiSelect ? ".TrimWithEllipses" : ".dgrid-row",
                        flyAnim: this.flyAnim
                    }, this.divTree);
                    var m = f.hitch(this._grid, this._grid.expand);
                    this._grid.expand = function(a, b, c) {
                        var d = a.element ? a : this.row(a),
                            d = this.row(d).data,
                            e = null,
                            f = !1;
                        d.getChildren && (e = d.getChildren(), f = !!this.row(e[0]).element);
                        a = m(a, b, c);
                        e && !1 !== b && 0 < e.length && !f && this.syncOneBranchWithShoppingCart(d.variables);
                        return a
                    };
                    C.after(this._grid, "expand", f.hitch(this, this.invoke, "resize"));
                    this._grid.startup()
                }
            }
        },
        _refreshGrid: function() {
            for (var a = 0, c = 0; c < this._model.length; c++) {
                this._model[c]._children = [];
                for (var b = 0; b < this._model[c].variables.length; b++) 0 == this._model[c].variables[b].hidden && this._model[c]._children.push(this._model[c].variables[b]);
                a += this._model[c]._children.length
            }
            this._grid.store = new u(new s({
                data: this._model
            }));
            this.spnVarsQuant.innerHTML = a.toString();
            this._grid.refresh();
            this._grid.resize()
        },
        _shouldExpand: function(a, c, b) {
            return void 0 !== b ? b : 1 == this._model.length
        },
        _renderCheckBox: function(a, c, b, d) {
            c = (d = !a.variables) ? a.description || a.alias : a.getLabel();
            b = m.create("div", {
                "class": "TrimWithEllipses VariableRowRoot"
            });
            this.multiSelect && m.create("div", {
                "class": "dijit dijitInline dijitCheckBox VarCheck"
            }, b);
            d && (g.add(b.children[0], "DataVariablesPage_VarCheck"), d = m.create("div", {
                "class": "DataBrowserInfoIcon",
                innerHTML: "\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;"
            }, b), k(d, "click", f.hitch(this, this._toggleTooltip,
                d, a)), k(d, "mouseenter", f.hitch(this, this._showTooltip, d, a)), k(d, "mouseover", f.hitch(this, this._showTooltip, d, a)), k(d, "mouseleave", f.hitch(this, this._hideTooltip, d, a)), k(d, "mousedown,touchstart,MSPointerDown,dgrid-cellfocusin", function(a) {
                a.stopPropagation && a.stopPropagation()
            }));
            m.create("span", {
                "class": "VarLabel",
                innerHTML: c
            }, b);
            return b
        },
        _toggleTooltip: function(a, c, b) {
            b.stopPropagation && b.stopPropagation();
            this._icon ? this._hideTooltip() : this._showTooltip(a, c, b)
        },
        _showTooltip: function(a, c, b) {
            this._icon =
                a;
            this.variableInfo.set("variable", c);
            t.show(this.variableInfo.domNode.outerHTML, a, ["above", "below"]);
            b.stopPropagation && b.stopPropagation();
            k.once(D.doc, "click", f.hitch(this, this._hideTooltip))
        },
        _hideTooltip: function() {
            t.hide(this._icon);
            this._icon = null
        },
        onRemoveElementFromShoppingCart: function(a) {
            var c;
            for (i = 0; i < this._grid.store.data.length; i++) {
                for (j = 0; j < this._grid.store.data[i].variables.length; j++)
                    if (a === this._grid.store.data[i].variables[j].idDesc) {
                        c = this._grid.store.data[i].variables[j];
                        break
                    }
                if (c) break
            }
            c &&
                this._grid.select(c, null, !1)
        },
        syncWithShoppingCart: function() {
            var a, c = this.shoppingCart.content,
                b = !1,
                d = !1;
            if (this._grid)
                for (i = 0; i < this._grid.store.data.length; i++) {
                    d = !0;
                    for (j = 0; j < this._grid.store.data[i].variables.length; j++) a = this._grid.store.data[i].variables[j], b = !!c[a.idDesc], this._grid.select(a, null, b), b || (d = !1);
                    if (d && (a = this._grid.row(this._grid.store.data[i]).element)) g.add(a, "dgrid-selected"), (a = n(".dijitCheckBox", a)[0]) && g.add(a, "dijitCheckBoxChecked")
                }
        },
        onSelect: function() {}
    })
});