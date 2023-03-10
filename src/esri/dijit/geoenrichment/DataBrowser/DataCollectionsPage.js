//>>built
define(["../../../declare", "dojo/string", "dojo/_base/lang", "dojo/aspect", "dojo/dom-class", "dojo/dom-construct", "dojo/query", "dojo/i18n!../../../nls/jsapi", "dojo/text!./templates/DataCollectionsPage.html", "dojo/on", "../CheckList", "../_WizardPage", "../Pagination", "dojo/store/Memory", "dgrid/List", "dgrid/Selection", "dijit/_WidgetBase", "../AnimationHelper", "dijit/Tooltip", "dojo/_base/window", "dojo/has", "dijit/layout/ContentPane", "dijit/form/Select", "./SearchTextBox"], function(n, l, f, p, q, g, r, h, s, k, t, u, x, v, y, z, A, B, m, w, C) {
    h = h.geoenrichment.dijit.DataCollectionsPage;
    return n([u], {
        templateString: s,
        nls: h,
        baseClass: "DataCollectionsPage",
        _checkList: null,
        selectedCategory: null,
        selectedCollection: null,
        selectedVariables: [],
        shoppingCart: null,
        variableInfo: null,
        multiSelect: !0,
        flyAnim: null,
        icon: null,
        buildRendering: function() {
            this.inherited(arguments);
            this._checkList = new t({
                onSelect: f.hitch(this, this._onSelectVariable),
                onDeselect: f.hitch(this, this._onDeselectVariable),
                selectionMode: this.multiSelect ? "toggle" : "single"
            }, this.divVariables);
            this._checkList.renderRow = f.hitch(this,
                this._renderRow);
            this.pagination.createItemContainer = this._createItemContainer;
            this.pagination.updateItemContainer = this._updateItemContainer;
            p.after(this.layoutGrid, "resize", f.hitch(this.pagination, this.pagination.resize))
        },
        _createItemContainer: function() {
            return g.create("div", {
                "class": "DataCollectionButton DataBrowser_Clickable TrimWithEllipses"
            })
        },
        _updateItemContainer: function(a, b) {
            a.innerHTML = b.metadata.title;
            a.data = b
        },
        _renderRow: function(a, b) {
            var d = g.create("div", {
                    style: "width:100%"
                }),
                e = g.create("div", {
                    "class": "TrimWithEllipses"
                });
            "single" != this.selectionMode && g.create("div", {
                "class": "dijit dijitInline dijitCheckBox VarCheck"
            }, e);
            var c = g.create("div", {
                "class": "DataBrowserInfoIcon",
                innerHTML: "\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;"
            }, e);
            g.create("span", {
                "class": "VarLabel",
                innerHTML: a.description ? a.description : a.alias
            }, e);
            g.place(e, d);
            k(c, "click", f.hitch(this, this._toggleTooltip, c, a));
            k(c, "mouseenter", f.hitch(this, this._showTooltip, c, a));
            k(c, "mouseleave", f.hitch(this, this._hideTooltip, c, a));
            k(c, "mousedown,touchstart,MSPointerDown,dgrid-cellfocusin",
                function(a) {
                    a.stopPropagation && a.stopPropagation()
                });
            return d
        },
        _toggleTooltip: function(a, b, d) {
            d.stopPropagation && d.stopPropagation();
            this._icon ? this._hideTooltip() : this._showTooltip(a, b, d)
        },
        _showTooltip: function(a, b, d) {
            this._icon = a;
            this.variableInfo.set("variable", b);
            m.show(this.variableInfo.domNode.outerHTML, a, ["above", "below"]);
            d.stopPropagation && d.stopPropagation();
            k.once(w.doc, "click", f.hitch(this, this._hideTooltip))
        },
        _hideTooltip: function() {
            m.hide(this._icon);
            this._icon = null
        },
        _setSelectedCategoryAttr: function(a) {
            this._set("selectedCategory",
                a);
            if (a) {
                var b = {
                    categoryName: a.name
                };
                this.categoryName.innerHTML = l.substitute(h.categoryName, b);
                this._checkList.set("store", new v({
                    data: this.theMostPopularVars(a, 3)
                }));
                this.pagination.set("items", a.dataCollections);
                this.spnShowAll.innerHTML = l.substitute(h.showAll, b);
                this._started && this.resize();
                this._setState("done")
            }
        },
        theMostPopularVars: function(a, b) {
            var d = [];
            if (a) {
                for (var e = {}, c = 0; c < a.dataCollections.length; c++)
                    for (var f = 0; f < a.dataCollections[c].variables.length; f++) {
                        var g = a.dataCollections[c].variables[f];
                        e[g.idDesc] = g
                    }
                for (var h in e) d.push(e[h]);
                d = d.sort(function(a, b) {
                    return (b.popularity ? b.popularity : 0) - (a.popularity ? a.popularity : 0)
                }).slice(0, b)
            }
            return d
        },
        _gotoCategories: function() {
            this.gotoCategories()
        },
        _onSelectVariable: function(a) {
            var b = this._checkList.get("selectedItems");
            this.flyAnim && a.parentType && (a = this._checkList.row(a.rows[0]).element, this.flyAnim.fly(r(".VarLabel", a)[0], "DataBrowser_SelectVar", ["top", "right"]));
            this._set("selectedVariables", b);
            for (a = 0; a < b.length; a++) this.shoppingCart.addVariable(b[a])
        },
        _onDeselectVariable: function(a) {
            this.shoppingCart.removeVariable(a.rows[0].data.idDesc)
        },
        _onSelectCollection: function(a) {
            var b = a.data;
            this.flyAnim && (a = this.flyAnim.fly(a, "Breadcrumb_SelectDC", null, !0), q.remove(a, ["dgrid-row", "dgrid-selected", "TrimWithEllipses"]));
            this._set("selectedCollections", [b]);
            this.onSelect(this._get("selectedCategory"), b.metadata.title)
        },
        _showAll: function() {
            this._set("selectedCollections", this._get("selectedCategory").dataCollections);
            this.onSelect(this._get("selectedCategory"),
                this._get("selectedCategory").name)
        },
        _gotoCategories: function() {
            this.gotoCategories()
        },
        gotoCategories: function() {},
        syncWithShoppingCart: function() {
            var a = this._checkList.store.data,
                b = this.shoppingCart.content;
            for (i = 0; i < a.length; i++) this._checkList.select(a[i], null, !!b[a[i].idDesc])
        },
        onRemoveElementFromShoppingCart: function(a) {
            var b = this._checkList.store.data;
            for (i = 0; i < b.length; i++)
                if (a === b[i].idDesc) {
                    this._checkList.select(b[i], null, !1);
                    break
                }
        },
        _search: function() {
            if (this.txbSearch.get("value")) {
                for (var a =
                    this.txbSearch.get("value"), b = this._get("selectedCategory").dataCollections, d = [], e, c = 0; c < b.length; c++) {
                    e = {
                        id: b[c].id,
                        metadata: b[c].metadata,
                        keywords: b[c].keywords,
                        variables: []
                    };
                    for (j = 0; j < b[c].variables.length; j++) this._match(b[c].variables[j], a) && e.variables.push(b[c].variables[j]);
                    0 < e.variables.length && d.push(e)
                }
                0 < d.length ? (this._set("selectedCollections", d), this.onSelect(this._get("selectedCategory"), "'" + a + "' " + l.substitute(h.from, {
                    categoryName: this._get("selectedCategory").name
                }))) : this.txbSearch.showTooltip(l.substitute(h.noResults, {
                    seachKey: a
                }))
            }
        },
        _match: function(a, b) {
            return a.alias && -1 !== a.alias.toLowerCase().indexOf(b.toLowerCase()) || a.description && -1 !== a.description.toLowerCase().indexOf(b.toLowerCase()) || a.fieldCategory && -1 !== a.fieldCategory.toLowerCase().indexOf(b.toLowerCase())
        }
    })
});